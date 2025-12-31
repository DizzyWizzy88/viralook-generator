import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/clientApp";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18",
});

const db = getFirestore(app);

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
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType;

    if (userId) {
      const userRef = doc(db, "users", userId);

      if (planType === "unlimited") {
        // Requirement: $39.99 Tier
        await updateDoc(userRef, {
          isUnlimited: true,
          currentTier: "unlimited",
        });
      } else if (planType === "pro") {
        // Requirement: $19.99 Tier (e.g., set 50 monthly credits)
        await updateDoc(userRef, {
          credits: 50, 
          isUnlimited: false,
          currentTier: "pro",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
