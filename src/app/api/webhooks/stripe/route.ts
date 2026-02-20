import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/server/stripe";
import { getAdminDb } from "@/lib/firebaseAdmin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  const adminDb = getAdminDb();

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

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    const priceId = session.line_items?.data[0]?.price?.id || session.subscription ? 
      (await stripe.subscriptions.retrieve(session.subscription as string)).items.data[0].price.id : null;

    if (!userId) return NextResponse.json({ error: "No userId in metadata" }, { status: 400 });

    // Define tier mapping based on your Stripe Price IDs
    let tier = "starter";
    if (priceId === "price_1SlG4r0ZcMLctEm4Nyh0rswZ") {
      tier = "pro";
    } else if (priceId === "price_LEGEND_39_RECURRING_ID") {
      tier = "legend";
    }

    // Update Firestore with the new tier and unlimited status
    await adminDb!.collection("users").doc(userId).set({
      tier: tier,
      isUnlimited: true, // Pro and Legend both get unlimited in our logic
      lastPaymentStatus: "paid",
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`User ${userId} upgraded to ${tier}`);
  }

  return NextResponse.json({ received: true });
}
