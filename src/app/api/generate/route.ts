import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, image_url, strength, deviceId, type } = await req.json();

  try {
    // 1. CRYSTALIZE (4K UPSCALE) LOGIC
    if (type === "upscale") {
      const result: any = await fal.subscribe("fal-ai/fotor-upscaler", {
        input: {
          image_url: image_url,
          upscale_factor: 2, // 2x or 4x depending on your credit tier
        },
      });
      return NextResponse.json({ imageUrl: result.image.url });
    }

    // 2. STANDARD SUMMON / EVOLVE LOGIC
    const endpoint = image_url ? "fal-ai/flux-vision-upscaler" : "fal-ai/flux/schnell";
    const result: any = await fal.subscribe(endpoint, {
      input: {
        prompt: prompt,
        image_url: image_url || undefined,
        strength: strength || 0.35,
        image_size: "landscape_4_3",
      },
    });

    return NextResponse.json({ imageUrl: result.image.url });

  } catch (error) {
    return NextResponse.json({ error: "Neural link failed" }, { status: 500 });
  }
}
