"use client";

import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="border-b border-zinc-800 pb-8">
          <Link href="/signup" className="text-blue-500 hover:text-blue-400 text-sm">
            ← Back to Signup
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4">Legal Information</h1>
          <p className="text-zinc-500 mt-2">Last Updated: January 2026</p>
        </div>

        {/* Privacy Policy Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Privacy Policy</h2>
          <p>
            Viralook values your privacy. This policy explains how we handle your information when you use our AI generation services:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Data Collection:</strong> We collect your email address for account authentication via Firebase.</li>
            <li><strong>Image Data:</strong> Images you upload are processed by AI APIs to generate results. We do not use your personal images for training our base models.</li>
            <li><strong>Storage:</strong> Your data is securely stored using Google Firebase infrastructure.</li>
            <li><strong>Third Parties:</strong> We do not sell your personal data to third parties.</li>
          </ul>
        </section>

        {/* Terms of Service Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Terms of Service</h2>
          <p>
            By creating an account, you agree to the following terms:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Acceptable Use:</strong> You agree not to generate content that is illegal, contains graphic violence, or infringes on the intellectual property of others.</li>
            <li><strong>AI Output:</strong> You acknowledge that AI-generated content may contain imperfections and results are not guaranteed.</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li><strong>Credits:</strong> Any generation credits provided are for use within the app and have no cash value.</li>
          </ul>
        </section>

        <footer className="pt-8 border-t border-zinc-800 text-center text-zinc-600 text-sm">
          &copy; 2026 Viralook. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
