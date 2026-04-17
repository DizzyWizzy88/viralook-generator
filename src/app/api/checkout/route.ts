import { NextResponse } from "next/server";
import { stripe } from "@/lib/server/stripe";
import { headers } from "next/headers"; // Add this import

export async function POST(req: Request) {
  try {
    const { priceId, userId, userEmail, planId } = await req.json();
    
    // 1. Get the host dynamically from headers
    const headerList = await headers();
    const host = headerList.get("host");
    
    // Detect protocol (Vercel uses https, localhost uses http)
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      // 2. Use the dynamically generated origin here
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId || 'pro'}`,
      cancel_url: `${origin}/dashboard`,
      metadata: { userId },
      customer_email: userEmail || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

