import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin"; // CHANGED: Using getAdminDb

async function enhancePromptWithLlama(userPrompt: string) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a prompt engineer. Expand the user's simple image prompt into a highly detailed, cinematic description for an AI image generator. Keep it under 75 words.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || userPrompt;
  } catch (error) {
    console.error("Llama expansion failed, falling back to original:", error);
    return userPrompt;
  }
}

export async function POST(req: Request) {
  try {
    const { prompt: userPrompt, userId, userEmail } = await req.json();

    if (!userPrompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // 1. Expand Prompt with Llama
    const enhancedPrompt = await enhancePromptWithLlama(userPrompt);

    // 2. Generate Image with Fal.ai
    const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
        enable_safety_checker: true,
      }),
    });

    const falResult = await falResponse.json();
    const imageUrl = falResult.images?.[0]?.url;

    if (!imageUrl) {
      console.error("Fal.ai failed:", falResult);
      return NextResponse.json({ error: "AI service failed to generate image" }, { status: 500 });
    }

    // 3. Record in Global Feed
    const adminDb = getAdminDb(); // CHANGED: Get the DB instance
    
    await adminDb.collection("global_feed").add({
      prompt: userPrompt,
      enhancedPrompt,
      imageUrl,
      userId: userId || "anonymous", // FIX: Prevent "undefined" crash
      userEmail: userEmail || "no-email@provided.com", // FIX: Prevent "undefined" crash
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ imageUrl, enhancedPrompt });
  } catch (error: any) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
