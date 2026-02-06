import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseDb } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { prompt, userId } = await req.json();
    const db = getFirebaseDb();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Guard: Check credits
    if (!userData || (!userData.isUnlimited && userData.credits <= 0)) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 403 });
    }

    // --- REPLICATE / AI CALL START ---
    // (Replace the URL below with your actual Replicate logic)
    const generatedImageUrl = "https://placehold.co/600x800/png?text=AI+Visual+Generated"; 
    // --- REPLICATE / AI CALL END ---

    // 1. Subtract Credit
    if (!userData.isUnlimited) {
      await updateDoc(userRef, { credits: increment(-1) });
    }

    // 2. Save to Feed (The 'createdAt' is vital for sorting!)
    await addDoc(collection(db, "global_feed"), {
      userId,
      imageUrl: generatedImageUrl,
      prompt,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ imageUrl: generatedImageUrl });

  } catch (error: any) {
    console.error("API Crash:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
