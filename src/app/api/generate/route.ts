import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // --- 1. AI GENERATION START ---
    // Replace this placeholder with your actual AI call logic
    // Example: const prediction = await replicate.predictions.create({...})
    console.log(`Generating image for: ${prompt}`);
    
    // WE DEFINE IT HERE FIRST
    const generatedImageUrl = `https://picsum.photos/seed/${Math.random()}/800/800`;
    // --- AI GENERATION END ---

    // 2. DATABASE SYNC
    // Now 'generatedImageUrl' exists and can be used here
    if (userId && userId !== "undefined") {
      try {
        await addDoc(collection(db, "global_feed"), {
          userId: userId,
          prompt: prompt,
          imageUrl: generatedImageUrl, // No longer 'undefined'
          createdAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error("Feed Update Failed:", dbError);
      }
    }

    return NextResponse.json({ 
      imageUrl: generatedImageUrl,
      success: true 
    });

  } catch (error: any) {
    console.error("!!! API CRASH !!!", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
