import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: null as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the specific event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // DEFINE userId HERE inside the logic block
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType;

    if (userId) {
      const userRef = adminDb.collection("users").doc(userId);

      if (planType === "unlimited") {
        await userRef.update({
          isUnlimited: true,
          currentTier: "unlimited",
          updatedAt: new Date().toISOString(),
        });
      } else if (planType === "pro") {
        await userRef.update({
          credits: 500, // Matching your "Pro Studio" strategy
          isUnlimited: false,
          currentTier: "pro",
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
