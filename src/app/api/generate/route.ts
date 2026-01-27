import { NextRequest, NextResponse } from 'next/server';

// This allows the Android app to talk to Vercel
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    // Call fal.ai securely (The FAL_KEY is stored in Vercel Env Variables)
    const response = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, image_size: "square_hd" }),
    });

    const data = await response.json();
    
    return NextResponse.json(
      { imageUrl: data.images[0].url }, 
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
