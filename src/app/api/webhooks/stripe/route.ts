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
  const customerId = session.customer as string; // <--- 1. ADD THIS LINE
  const priceId = session.line_items?.data[0]?.price?.id || session.subscription;

  if (!userId) {
  console.error("No userId found in session metadata");
   return NextResponse.json({ error: "No userId" }, { status: 400 });
 }


// ... your tier mapping logic ...

// Update Firestore
await adminDb!.collection("users").doc(userId).set({
  tier: tier,
  credits: creditsToAdd,
  stripeCustomerId: customerId, // <--- 2. ADD THIS LINE
  updatedAt: new Date().toISOString(),
}, { merge: true });

// ... rest of your code

    // Tier mapping with Credit Allocation
    let tier = "starter";
    let creditsToAdd = 0;

    // Pro Monthly
    if (priceId === "price_1SlG310ZcMLctEm4DPIgTkyR") { // Note: I used your Pro ID from PricingTable
      tier = "pro";
      creditsToAdd = 500;
    } 
    // Viral Legend
    else if (priceId === "price_1SlG4r0ZcMLctEm4Nyh0rswZ") {
      tier = "legend";
      creditsToAdd = 999999; // Or however you handle "Unlimited"
    }

    // Update Firestore
    await adminDb!.collection("users").doc(userId).set({
      tier: tier,
      credits: creditsToAdd, // This is what was missing!
      stripeCustomerId: customerId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`✅ User ${userId} successfully upgraded to ${tier} with ${creditsToAdd} credits`);
  }  
 }
