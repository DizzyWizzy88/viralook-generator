export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 prose prose-slate">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: January 2, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>We collect minimal information to provide our service:</p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Device Identifier:</strong> An anonymous ID stored in your browser cookies to track credit usage.</li>
          <li><strong>Stripe Data:</strong> We store your Stripe Customer ID to manage your subscription. We do not store credit card details.</li>
          <li><strong>Prompts:</strong> The text you enter to generate images is processed by our AI partners (fal.ai).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">2. How We Use Data</h2>
        <p>Your data is used solely to provide image generation services, prevent fraud, and manage your paid subscriptions.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">3. Third Parties</h2>
        <p>We share data with <strong>Stripe</strong> (payments) and <strong>fal.ai</strong> (image generation) as necessary to fulfill your requests.</p>
      </section>
    </div>
  );
}
