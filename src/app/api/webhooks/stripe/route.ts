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
    const customerId = session.customer as string;
    // Extract priceId safely
    const priceId = session.line_items?.data?.[0]?.price?.id;

    if (!userId) {
      console.error("No userId found in session metadata");
      return NextResponse.json({ error: "No userId" }, { status: 400 });
    }

    // 1. Declare variables FIRST
    let tier = "starter";
    let creditsToAdd = 0;

    // 2. Assign values based on Price ID
    if (priceId === "price_1SlG310ZcMLctEm4DPIgTkyR") { 
      tier = "pro";
      creditsToAdd = 500;
    } else if (priceId === "price_1SlG4r0ZcMLctEm4Nyh0rswZ") {
      tier = "legend";
      creditsToAdd = 999999;
    }

    // 3. Save to Firestore (MUST be inside this IF block)
    try {
      await adminDb!.collection("users").doc(userId).set({
        tier: tier,
        credits: creditsToAdd,
        stripeCustomerId: customerId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log(`✅ User ${userId} upgraded to ${tier}`);

     } catch (dbError) {
       console.error("Firestore Update Error:", dbError);
       return NextResponse.json({ error: "Database update failed" }, { status: 500 });
     }
   } // <--- This closes the if (event.type === ...)

  return NextResponse.json({ received: true });

} // <--- ADD THIS BRACE! It closes the "export async function POST"
