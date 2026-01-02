import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature")!;

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const deviceId = session.client_reference_id;

    if (deviceId) {
      // Upgrade user to Viral Legend status in Firestore
      await adminDb.collection("users").doc(deviceId).update({
        tier: "viral_legend",
        credits: Infinity,
      });
      console.log(`User ${deviceId} upgraded to Viral Legend!`);
    }
  }

  return NextResponse.json({ received: true });
}
