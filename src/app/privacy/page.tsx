export default function PrivacyPolicy() {
  const containerStyle = {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
    lineHeight: '1.6'
  };

  const headerStyle = { color: '#ffffff', borderBottom: '1px solid #333', paddingBottom: '10px' };
  const textStyle = { color: '#ffffff' };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Privacy Policy</h1>
      <p style={textStyle}>Last updated: January 20, 2026</p>

      <h2 style={headerStyle}>1. Information We Collect</h2>
      <p style={textStyle}>We collect minimal information to provide our service, including device identifiers and data provided via Stripe for subscriptions.</p>

      <h2 style={headerStyle}>2. How We Use Data</h2>
      <p style={textStyle}>Data is used solely to provide image generation services through our AI partners (fal.ai) and to manage your paid subscriptions.</p>

      <h2 style={headerStyle}>3. Contact Us</h2>
      <p style={textStyle}>For questions regarding this policy, please contact us at your support email.</p>
    </div>
  );
}
