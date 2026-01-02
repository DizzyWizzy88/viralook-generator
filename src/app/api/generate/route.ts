import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    
    // Get or create an anonymous Device ID to track credits without Clerk
    let deviceId = cookieStore.get("device_id")?.value;
    if (!deviceId) {
      deviceId = uuidv4();
      cookieStore.set("device_id", deviceId, { 
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/' 
      });
    }

    const userRef = adminDb.collection("users").doc(deviceId);
    const userDoc = await userRef.get();

    let userData = userDoc.exists ? userDoc.data() : null;

    // Initialize new users with 5 Free Credits
    if (!userDoc.exists) {
      userData = {
        credits: 5,
        tier: "free",
        createdAt: new Date().toISOString(),
      };
      await userRef.set(userData);
    }

    // Credit Enforcement Logic
    if (userData?.tier !== "viral_legend" && (userData?.credits || 0) <= 0) {
      return NextResponse.json(
        { error: "Out of credits! 5/5 used." },
        { status: 402 }
      );
    }

    // Deduct credit (unless they are a Viral Legend)
    if (userData?.tier !== "viral_legend") {
      await userRef.update({
        credits: (userData?.credits || 0) - 1
      });
    }

    return NextResponse.json({ success: true, remaining: userData?.credits - 1 });

  } catch (error) {
    console.error("Bouncer Error:", error);
    return NextResponse.json({ error: "Security check failed" }, { status: 500 });
  }
}
