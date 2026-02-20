import { NextResponse } from "next/server";
import { stripe } from "@/lib/server/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://viralook-generator.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription", 
      // Fallback to localhost if NEXT_PUBLIC_BASE_URL isn't set in Vercel yet
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { 
        userId: userId || "anonymous", 
        email: userEmail || "no-email" 
      },
      customer_email: userEmail || undefined, 
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
