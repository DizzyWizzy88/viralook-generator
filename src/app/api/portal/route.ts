import { NextResponse } from "next/server";
import { stripe } from "@/lib/server/stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { stripeCustomerId } = await req.json();
    
    if (!stripeCustomerId) {
      return NextResponse.json({ error: "No customer ID found" }, { status: 400 });
    }

    const headerList = await headers();
    const host = headerList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";

    // This creates a temporary, secure link to Stripe's own billing page
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${protocol}://${host}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Portal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
