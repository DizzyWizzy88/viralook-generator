export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last Updated: February 2026</p>
      <section className="space-y-4">
        <p>At Viralook, we respect your privacy. This policy outlines how we handle your data.</p>
        <h2 className="text-xl font-semibold">1. Data We Collect</h2>
        <p>We collect your email address via Firebase Authentication and your payment history via Stripe.</p>
        <h2 className="text-xl font-semibold">2. Third-Party Services</h2>
        <p>We use <strong>Google Firebase</strong> for data storage and <strong>Stripe</strong> for payment processing. We do not store your credit card information on our servers.</p>
        <h2 className="text-xl font-semibold">3. AI Data</h2>
        <p>Images generated are stored in your private gallery. We do not use your generated images to train our models without your explicit consent.</p>
      </section>
    </div>
  );
}
