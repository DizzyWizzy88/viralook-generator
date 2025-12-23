import { NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase/clientApp";

const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch User Data
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isUnlimited = userData.isUnlimited || false;
    const currentCredits = userData.credits || 0;

    // 2. CHECK CREDITS (This was the error location)
    if (!isUnlimited && currentCredits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // 3. TODO: Insert your AI Generation Logic (Replicate, OpenAI, etc.) here
    const generatedImageUrl = "https://placeholder-image-url.com"; // Replace with real API call

    // 4. Subtract Credit (only if not unlimited) and log to Global Feed
    if (!isUnlimited) {
      await updateDoc(userRef, {
        credits: increment(-1)
      });
    }

    // Add to Global Feed
    await addDoc(collection(db, "global_feed"), {
      url: generatedImageUrl,
      prompt: prompt,
      userName: userData.displayName || "Anonymous Creator",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ url: generatedImageUrl });

  } catch (error: any) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
