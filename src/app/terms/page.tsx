import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-8 border-b pb-4">
          Terms of Service
        </h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Subscription & Credits</h2>
            <p>Credits purchased provide access to AI generation services. Credits are non-transferable and expire based on your plan terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Refund Policy</h2>
            <p>Due to the high costs of AI GPU processing, we generally do not offer refunds once credits have been used. Please contact support for exceptional cases.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Content Ownership</h2>
            <p>You retain full ownership of the images you upload and the AI-generated headshots produced by the service.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
