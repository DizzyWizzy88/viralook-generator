export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 prose prose-slate">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: January 2, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">1. Services</h2>
        <p>Viralook provides AI-powered image generation. Access is provided on a credit-based system or via a "Viral Legend" unlimited subscription.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">2. Refund Policy</h2>
        <p><strong>All sales are final.</strong> Due to the immediate costs associated with AI generation, we do not offer refunds once credits have been used or a subscription has been activated.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">3. Fair Use</h2>
        <p>Unlimited plans are subject to our Fair Use Policy. Automated "botting" or excessive use that disrupts the service for others may result in account suspension.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">4. Cancellations</h2>
        <p>You may cancel your subscription at any time through the <strong>Customer Portal</strong>. Your access will continue until the end of your current billing period.</p>
      </section>
    </div>
  );
}
