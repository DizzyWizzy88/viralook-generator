import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt: userPrompt, userId } = await req.json();

    if (!userPrompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    // STEP 1: ENHANCE THE PROMPT WITH LLAMA 3.1
    // We use 'prompt' instead of 'messages' to fix the Type Error
    const llmResponse: any = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "meta-llama/llama-3.1-8b-instruct",
        prompt: `System: You are a professional prompt engineer for FLUX AI. 
        Your task: Convert simple user ideas into high-quality, vivid, and highly detailed image prompts.
        Rules: Use natural language, describe subjects, actions, lighting, and camera settings. 
        Output ONLY the rewritten prompt.
        
        User Idea: ${userPrompt}
        
        Detailed Prompt:`,
      },
    });

    // Handle the response based on Fal's returned object structure
    const enhancedPrompt = llmResponse.data?.choices?.[0]?.message?.content?.trim() || 
                           llmResponse.data?.output?.trim() || 
                           userPrompt;

    console.log("Original:", userPrompt);
    console.log("Enhanced:", enhancedPrompt);

    // STEP 2: GENERATE THE IMAGE USING THE SMART PROMPT
    const { data }: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: enhancedPrompt,
        image_size: "square_hd",
        num_inference_steps: 4,
        output_format: "jpeg",
      },
      logs: true,
    });

    const generatedImageUrl = data.images[0].url;

    // STEP 3: LOG TO FIRESTORE
    if (userId && userId !== "undefined") {
      try {
        await addDoc(collection(db, "global_feed"), {
          userId,
          originalPrompt: userPrompt,
          enhancedPrompt: enhancedPrompt,
          imageUrl: generatedImageUrl,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Firestore logging error:", e);
      }
    }

    return NextResponse.json({ 
      imageUrl: generatedImageUrl, 
      enhancedPrompt,
      success: true 
    });

  } catch (error: any) {
    console.error("Workflow Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
