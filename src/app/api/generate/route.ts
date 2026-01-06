import { NextResponse } from "next/server";
import * as fal from "@fal-ai/serverless-client";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!process.env.FAL_KEY) {
      console.error("Missing FAL_KEY");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // Initialize inside the handler
    fal.config({ credentials: process.env.FAL_KEY });

    console.log("Generating for:", prompt);

    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: { prompt, image_size: "landscape_16_9" },
    });

    if (!result?.images?.[0]?.url) {
      throw new Error("AI provider returned empty result");
    }

    return NextResponse.json({ image_url: result.images[0].url });
  } catch (error: any) {
    console.error("FAL_API_ERROR:", error.message);
    return NextResponse.json({ error: error.message || "Generation Failed" }, { status: 500 });
  }
}
