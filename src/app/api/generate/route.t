export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { fal } from "@fal-ai/client";
import { Transaction } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  try {
    const { prompt, userId, userName, userEmail } = await req.json();
    const userRef = adminDb!.collection("users").doc(userId);

    const transactionResult = await adminDb!.runTransaction(async (transaction: Transaction) => {
      const userDoc = (await transaction.get(userRef)) as any;

      if (!userDoc.exists) {
        transaction.set(userRef, { email: userEmail, credits: 1, tier: "starter", createdAt: new Date().toISOString() });
        return { canGenerate: true, tier: "starter" };
      }

      const userData = userDoc.data();
      const userTier = userData?.tier || "starter";
      
      // Starter logic: must have credits. Pro/Legend: unlimited.
      if (userTier === "starter" && (userData?.credits || 0) < 1) return { canGenerate: false };

      if (userTier === "starter") {
        transaction.update(userRef, { credits: (userData.credits || 1) - 1 });
      }
      return { canGenerate: true, tier: userTier };
    });

    if (!transactionResult.canGenerate) return NextResponse.json({ error: "Out of credits" }, { status: 403 });

    // AI Generation
    const falResult: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: { prompt, image_size: "landscape_4_3" },
    });
    const imageUrl = falResult.images[0].url;

    // PRIVACY LOGIC: Only add to feed if NOT Viral Legend
    if (transactionResult.tier !== "legend") {
      await adminDb!.collection("global_feed").add({
        userId, userName, imageUrl, createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ imageUrl, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
