import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Simulate a short delay so you can see your loading spinner
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. FOR TESTING ONLY: Comment out the real fetch and return a placeholder image
    const isTesting = true; // Toggle this to 'false' when you want to use real credits

    if (isTesting) {
      console.log("🛠️ MOCK MODE: Returning placeholder image.");
      return NextResponse.json({ 
        url: "https://placehold.co/1024x768?text=Viralook+Mock+Image" 
      });
    }

    // --- REAL FETCH CODE STARTS HERE ---
    // (Keep your existing fetch logic below this)
