import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // 1. Fetch User Data from Firestore
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();

    const isUnlimited = userData?.isUnlimited === true;
    const credits = userData?.credits || 0;

    // 2. Check Permissions (The Strategic "Gate")
    if (!isUnlimited && credits <= 0) {
      return new NextResponse(
        JSON.stringify({ error: "No credits remaining. Please upgrade." }), 
        { status: 402 } // Payment Required
      );
    }

    // 3. Call fal.ai (Logic already in your file)
    // const response = await fal.subscribe(...)

    // 4. If NOT Unlimited, decrement 1 credit
    if (!isUnlimited) {
      await adminDb.collection("users").doc(userId).update({
        credits: credits - 1
      });
    }

    return NextResponse.json({ success: true, /* your image url */ });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
