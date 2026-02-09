import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the 2025 version to match your build requirements
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, userId } = body;

    // 1. Security check: Ensure we know who is buying
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    // 2. Use the environment variable for the URL, fallback to Vercel if not set locally
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://viralook-generator.vercel.app";

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Redirect with success/canceled flags for the Dashboard to detect
      success_url: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard?canceled=true`,
      
      // CRITICAL: This metadata is what your Webhook reads to update the correct user
      metadata: {
        userId: userId,
      },
    });

    // 4. Return the session URL so the frontend can redirect the user to Stripe
    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
