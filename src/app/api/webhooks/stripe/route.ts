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
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const deviceId = session.client_reference_id;
    const planType = session.metadata?.planType;

    if (deviceId) {
      const isLegend = planType === "viral_legend";
      const creditsToAdd = isLegend ? 999999 : 50;

      const userRef = adminDb.collection("users").doc(deviceId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Initial setup for a brand new user
        await userRef.set({
          tier: planType || "free",
          credits: 5 + creditsToAdd, // 5 free + purchased credits
          stripeCustomerId: session.customer,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Update existing user
        await userRef.update({
          tier: planType,
          credits: (userDoc.data()?.credits || 0) + creditsToAdd,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
