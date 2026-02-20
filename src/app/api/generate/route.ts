import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { stripe } from "@/lib/server/stripe";
import { fal } from "@fal-ai/client";

// Initialize Llama 3.1 via an Inference API (like Groq, OpenAI, or Fireworks)
// For this example, we'll assume a standard fetch to your AI provider
async function enhancePromptWithLlama(userPrompt: string) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert prompt engineer. Expand the user's simple prompt into a cinematic, highly detailed masterpiece description for an AI image generator. Keep it under 75 words."
          },
          { role: "user", content: userPrompt }
        ],
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Llama expansion failed, falling back to original:", error);
    return userPrompt;
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, userId, userName } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json({ error: "Missing prompt or userId" }, { status: 400 });
    }

    // 1. Verify User & Credits (Server-side safety)
    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData?.isUnlimited && (userData?.credits || 0) <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // 2. Enhance the prompt using Llama 3.1
    const enhancedPrompt = await enhancePromptWithLlama(prompt);

    // 3. Generate Image with Fal.ai (Flux.1 Schnell)
    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: enhancedPrompt,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
      },
      logs: true,
    });

    const imageUrl = result.images[0].url;

    // 4. Save to Global Feed (Securely)
    // We do this BEFORE returning to the user to ensure it's logged
    const feedEntry = {
      userId,
      userName: userName || "Anonymous Creator",
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection("global_feed").add(feedEntry);

    // 5. Return data to Frontend
    return NextResponse.json({
      imageUrl,
      enhancedPrompt,
      success: true
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
