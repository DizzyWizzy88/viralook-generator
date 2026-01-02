import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json(); // Pass the Stripe Price ID (e.g., for Pro or Viral Legend)
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("device_id")?.value;

    if (!deviceId) {
      return NextResponse.json({ error: "No device ID found" }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      // CRITICAL: We attach the deviceId so the Webhook can find the user later
      client_reference_id: deviceId, 
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
