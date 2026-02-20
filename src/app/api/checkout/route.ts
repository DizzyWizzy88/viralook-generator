import { NextResponse } from "next/server";
import { stripe } from "@/lib/server/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    // If there is a priceId, it's one of the two recurring plans
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription", // Both 19.99 and 39.99 are now subscriptions
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: { userId, email: userEmail },
      customer_email: userEmail, 
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
