import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// Configure Fal with your environment variable
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Parse incoming data
    const { prompt, userId } = await req.json();

    console.log("--- NEW SUMMONING ---");
    console.log("Target Prompt:", prompt);
    console.log("User ID:", userId);

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // 2. Generate Image using Flux Schnell
    // Note: We destructure { data } because the modern SDK wraps the result
    const { data }: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt,
        image_size: "square_hd",
        num_inference_steps: 4,
        output_format: "jpeg", // Must be jpeg or png for this model
      },
      logs: true,
    });

    // 3. Safety Check: Verify the image array exists
    if (!data || !data.images || data.images.length === 0) {
      console.error("FAL.AI returned no images:", data);
      throw new Error("AI failed to return an image. It might have been flagged.");
    }

    const generatedImageUrl = data.images[0].url;
    console.log("Successfully generated:", generatedImageUrl);

    // 4. Record to Firestore Global Feed
    if (userId && userId !== "undefined") {
      try {
        await addDoc(collection(db, "global_feed"), {
          userId: userId,
          prompt: prompt,
          imageUrl: generatedImageUrl,
          createdAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error("Firestore logging failed (non-critical):", dbError);
      }
    }

    // 5. Return success to the frontend
    return NextResponse.json({ 
      imageUrl: generatedImageUrl, 
      success: true 
    });

  } catch (error: any) {
    console.error("CRITICAL GENERATION ERROR:", error);
    
    // Check for specific 401 Unauthorized errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid Fal.ai API Key. Check your environment variables." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "The AI spirits are busy. Try again." },
      { status: 500 }
    );
  }
}
