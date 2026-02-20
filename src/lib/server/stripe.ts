// src/lib/server/stripe.ts (SERVER-SIDE ONLY)
import Stripe from 'stripe';

// Initialize Stripe with the Secret Key from Vercel environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia', // Use a recent stable API version
});

// Define the plans you offer for easy reference
export const plans = {
    PRO_MONTHLY: {
        priceId: 'price_1SlG310ZcMLctEm4DPIgTkyR', // REPLACE with your Stripe Price ID for Monthly Pro
        name: 'Pro Monthly',
        credits: 100,
        amount: 19.99,
    },
    // Add other plans here (e.g., Annual, One-time pack)
    VIRAL_LEGEND: {
          priceId: 'price_1SlG4r0ZcMLctEm4Nyh0rswZ',
	  name: 'Viral Legend',
          isUnlimited: true,
    },
};
