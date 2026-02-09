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
