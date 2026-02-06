"use client";

import Link from "next/link";

export default function LegalPage() {
  return (
    <div style={{ backgroundColor: '#000000', color: '#d4d4d8', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid #27272a', paddingBottom: '2rem', marginBottom: '3rem' }}>
          <Link href="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Signup
          </Link>
          <h1 style={{ color: '#ffffff', fontSize: '2.25rem', fontWeight: 'bold', marginTop: '1rem' }}>
            Legal & Privacy Center
          </h1>
          <p style={{ color: '#71717a', marginTop: '0.5rem' }}>Last Updated: January 2026</p>
        </div>

        {/* 1. Account Deletion */}
        <section style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #27272a', marginBottom: '3rem' }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Account & Data Deletion
          </h2>
          <p style={{ lineHeight: '1.6' }}>
            Users may request full removal of their account and associated data via the email link below.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a 
              href="mailto:dr3930397@gmail.com?subject=Account%20Deletion%20Request"
              style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#000000', fontWeight: 'bold', padding: '0.6rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none' }}
            >
              Request Account Deletion
            </a>
          </div>
        </section>

        {/* 2. Privacy Policy */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Privacy Policy</h2>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong style={{ color: '#ffffff' }}>Email:</strong> Collected for account authentication.</li>
            <li><strong style={{ color: '#ffffff' }}>Photos:</strong> Processed solely for AI generation.</li>
          </ul>
        </section>

        <footer style={{ borderTop: '1px solid #27272a', paddingTop: '2rem', textAlign: 'center', color: '#52525b', fontSize: '0.875rem' }}>
          &copy; 2026 Viralook Generator • dr3930397@gmail.com
        </footer>
      </div>
    </div>
  );
}