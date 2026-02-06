import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseDb } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const db = getFirebaseDb();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      // Add credits based on your logic (Example: +100)
      if (userSnap.exists()) {
        await updateDoc(userRef, { credits: increment(100) });
      } else {
        await setDoc(userRef, { 
          credits: 100, 
          email: session.customer_details?.email,
          isUnlimited: false 
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
