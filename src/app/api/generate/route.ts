import { NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase/clientApp";
import { fal } from "@fal-ai/client";

const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const { prompt, userId, category } = await req.json();

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
    const isPro = userData.currentTier === "pro";
    const currentCredits = userData.credits || 0;

    // 2. Strict Credit Gate
    if (!isUnlimited && currentCredits < 1) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        message: "Please upgrade to Pro or Unlimited." 
      }, { status: 402 });
    }

    // 3. AI Generation (fal.ai Flux Dev)
    // We combine the category and prompt for better results
    const result: any = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: `A professional ${category.toLowerCase()} style image of: ${prompt}. High resolution, 4k, cinematic lighting.`,
        image_size: "square_hd",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        enable_safety_checker: true
      },
      logs: true,
    });

    const generatedImageUrl = result.images[0].url;

    // 4. Update Database (Only on success)
    if (!isUnlimited) {
      await updateDoc(userRef, {
        credits: increment(-1),
        lastGeneratedAt: serverTimestamp()
      });
    }

    // 5. Log to Global Feed
    await addDoc(collection(db, "global_feed"), {
      url: generatedImageUrl,
      prompt: prompt,
      category: category || "CINEMATIC",
      userId: userId,
      userName: userData.displayName || "Studio Member",
      userTier: isUnlimited ? "Unlimited" : (isPro ? "Pro" : "Starter"),
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ url: generatedImageUrl });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "AI Engine Timeout" }, { status: 500 });
  }
}
