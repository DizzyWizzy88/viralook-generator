export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { fal } from "@fal-ai/client";
// Import the Transaction type specifically for TypeScript
import { Transaction } from "firebase-admin/firestore";

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
  const adminDb = getAdminDb();
  
  try {
    if (!adminDb) {
      console.error("Firebase Admin DB not initialized");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const { prompt, userId, userName, userEmail } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json({ error: "Missing prompt or userId" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(userId);

    // FIX: Explicitly type the transaction as 'Transaction'
    const transactionResult = await adminDb.runTransaction(async (transaction: Transaction) => {
      const userDoc = await transaction.get(userRef);

      // New User Logic: Give 2 credits, use 1 immediately
      if (!userDoc.exists) {
        const newUser = {
          email: userEmail || "No Email Provided",
          credits: 1, 
          createdAt: new Date().toISOString(),
        };
        transaction.set(userRef, newUser);
        return { canGenerate: true };
      }

      const userData = userDoc.data();
      const currentCredits = userData?.credits || 0;

      if (currentCredits < 1 && !userData?.isUnlimited) {
        return { canGenerate: false };
      }

      // Deduct 1 Credit unless unlimited
      if (!userData?.isUnlimited) {
        transaction.update(userRef, { credits: currentCredits - 1 });
      }
      
      return { canGenerate: true };
    });

    if (!transactionResult.canGenerate) {
      return NextResponse.json(
        { error: "Out of credits", shouldRedirect: true }, 
        { status: 403 }
      );
    }

    // AI Generation Workflow
    const enhancedPrompt = await enhancePromptWithLlama(prompt);

    const falResult: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: enhancedPrompt,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
      },
      logs: true,
    });

    const imageUrl = falResult.images[0].url;

    // Save to Feed
    await adminDb.collection("global_feed").add({
      userId,
      userName: userName || "Anonymous Creator",
      originalPrompt: prompt,
      enhancedPrompt,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      imageUrl,
      enhancedPrompt,
      success: true
    });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
