import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: null as any, // Prevents version mismatch errors
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { planType } = await req.json();

    // Mapping plan types from your Business Plan
    let stripePriceId = "";
    if (planType === "pro") {
      stripePriceId = process.env.STRIPE_PRO_PRICE_ID!; // $19.99 Tier
    } else if (planType === "unlimited") {
      stripePriceId = process.env.STRIPE_LEGEND_PRICE_ID!; // $39.99 Tier
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      // Metadata allows the Webhook to identify the user later
      metadata: {
        userId: userId,
        planType: planType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
