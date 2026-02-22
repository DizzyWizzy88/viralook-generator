import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/server/stripe";
import { getAdminDb } from "@/lib/firebaseAdmin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  
  // Await the headers and get the signature in one clean step
  const signature = (await headers()).get("Stripe-Signature") as string;
  
  const adminDb = getAdminDb();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    // Get Price ID from the session or the subscription
    const priceId = session.line_items?.data[0]?.price?.id || session.subscription;

    if (!userId) {
      console.error("No userId found in session metadata");
      return NextResponse.json({ error: "No userId" }, { status: 400 });
    }

    // Tier mapping
    let tier = "starter";
    if (priceId === "price_1SlG4r0ZcMLctEm4Nyh0rswZ") {
      tier = "pro";
    } else if (priceId === "price_LEGEND_39_RECURRING_ID") {
      tier = "legend";
    }

    // Update Firestore
    await adminDb!.collection("users").doc(userId).set({
      tier: tier,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`✅ User ${userId} successfully upgraded to ${tier}`);
  }

  return NextResponse.json({ received: true });
}
