import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseDb } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { plans } from '@/lib/server/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;

  try {
    if (!sig || !endpointSecret) throw new Error('Missing signature or secret');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const db = getFirebaseDb();

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('No userId found in session metadata');
      return NextResponse.json({ error: 'No userId' }, { status: 400 });
    }

    // Identify which plan was purchased
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    const userRef = doc(db, 'users', userId);

    try {
      if (priceId === plans.VIRAL_LEGEND.priceId) {
        // VIRAL LEGEND: UNLIMITED ACCESS
        await updateDoc(userRef, {
          plan: 'VIRAL_LEGEND',
          isUnlimited: true,
          lastPurchaseAt: new Date().toISOString(),
        });
        console.log(`User ${userId} upgraded to VIRAL LEGEND (Unlimited)`);
      } 
      else if (priceId === plans.PRO_MONTHLY.priceId) {
        // PRO MONTHLY: 100 CREDITS
        await updateDoc(userRef, {
          plan: 'PRO',
          isUnlimited: false, // Ensure they aren't marked unlimited if they downgrade
          credits: increment(plans.PRO_MONTHLY.credits),
          lastPurchaseAt: new Date().toISOString(),
        });
        console.log(`User ${userId} credited with 100 Pro credits`);
      }
    } catch (dbError) {
      // If the user doc doesn't exist yet, create it
      await setDoc(userRef, {
        userId,
        isUnlimited: priceId === plans.VIRAL_LEGEND.priceId,
        credits: priceId === plans.PRO_MONTHLY.priceId ? 100 : 0,
        plan: priceId === plans.VIRAL_LEGEND.priceId ? 'VIRAL_LEGEND' : 'PRO',
      }, { merge: true });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Ensure Vercel doesn't try to parse the body itself
export const config = {
  api: {
    bodyParser: false,
  },
};
