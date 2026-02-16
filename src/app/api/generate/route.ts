import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// 1. Setup Fal configuration
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
  try {
    // Extract data from the request
    const { prompt, userId } = await req.json();

    // LOGGING: This helps us see if the prompt is actually "Banana eating a taco"
    console.log("--- SUMMONING REQUEST ---");
    console.log("User ID:", userId);
    console.log("Prompt received:", prompt);

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // 2. Generate Image using Flux Schnell on Fal.ai
    // We use the variable 'prompt' here so it isn't hardcoded to the ocean!
    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt, // Dynamic prompt from user
        image_size: "square_hd",
        num_inference_steps: 4,
        output_format: "jpeg",
      },
      logs: true,
    });

    const generatedImageUrl = result.images[0].url;
    console.log("Generation successful! URL:", generatedImageUrl);

    // 3. Save to Firestore Global Feed
    // We check if userId exists so the app doesn't crash if someone isn't logged in
    if (userId && userId !== "undefined") {
      try {
        await addDoc(collection(db, "global_feed"), {
          userId: userId,
          prompt: prompt,
          imageUrl: generatedImageUrl,
          createdAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error("Firestore Log Error:", dbError);
        // We don't 'throw' here because the image was still generated successfully
      }
    }

    return NextResponse.json({ 
      imageUrl: generatedImageUrl, 
      success: true 
    });

  } catch (error: any) {
    console.error("FAL.AI GENERATION ERROR:", error);
    return NextResponse.json(
      { error: error.message || "The AI spirits are busy. Try again." },
      { status: 500 }
    );
  }
}
