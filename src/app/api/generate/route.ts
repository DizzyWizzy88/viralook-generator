import { NextResponse } from "next/server";
import * as fal from "@fal-ai/serverless-client";
import { db } from "@/lib/firebase"; // Make sure this path is correct for your config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Configure Fal with your key
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
  console.log("--- API START: Received request ---");
  // Inside your POST function in the API route
  const { prompt, userId } = await req.json(); // Ensure you're destructuring userId

  try {
  // Only attempt to add to feed if userId exists to avoid the 500 error
    if (userId) {
      await addDoc(collection(db, "global_feed"), {
       userId: userId,
       prompt: prompt,
       imageUrl: generatedImageUrl,
       createdAt: new Date().toISOString(),
    });
  }
} catch (dbError) {
  console.error("Database write failed, but image was generated:", dbError);
  // Don't crash the whole response if the feed fails
}

  try {
    const { prompt, userId } = await req.json();
    console.log("Prompt received:", prompt);

    // 1. Call Fal.ai AI
    const result: any = await fal.subscribe("fal-ai/flux/dev", { input: {prompt } });
    const imageUrl = result.images[0].url;

    await addDoc(collection(db,"global_feed"), {
      imageUrl,
      prompt,
      userId,
      createdAt: serverTimestamp(),
    });

 // 2. Save to Firestore Global Feed
    console.log("Saving to Firestore...");
    const docRef = await addDoc(collection(db, "global_feed"), {
      imageUrl,
      prompt,
      userId,
      createdAt: serverTimestamp(),
    });
    console.log("Firestore success! Doc ID:", docRef.id);

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error("!!! API CRASH !!!", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
