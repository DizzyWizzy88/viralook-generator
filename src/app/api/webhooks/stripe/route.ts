import { NextResponse } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/firebaseAdmin"; // Ensure you have firebase-admin set up

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: null as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType;

    if (userId) {
      // Update Firestore with the new tier 
      await db.collection("users").doc(userId).update({
        tier: planType,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return new NextResponse("Success", { status: 200 });
}
