//Force Redeploy Fix 1

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: "2024-11-20.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { userId, planType } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json({ error: "Missing userId or planType" }, { status: 400 });
    }

    // MAP PLAN TYPES TO STRIPE PRICE IDS
    let stripePriceId = "";
    
    if (planType === "pro") {
      stripePriceId = "price_1ShaoL0pfq0FZDdatWxNXifX"; // Replace with your Pro Studio Price ID
    } else if (planType === "unlimited") {
      stripePriceId = "price_1ShapQ0pfq0FZDdahuI4Te75"; // Replace with your Viral Legend Price ID
    }

    if (!stripePriceId) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
