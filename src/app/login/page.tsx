"use client";

import React, { useState } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, // Added GitHub
  sendSignInLinkToEmail 
} from 'firebase/auth';
import { app } from '@/lib/firebase/clientApp';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2, Github } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  const auth = getAuth(app);
  const router = useRouter();

  const handleSocialLogin = async (providerType: 'google' | 'github') => {
    setSocialLoading(providerType);
    const provider = providerType === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) { 
      console.error(error); 
      setSocialLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  const actionCodeSettings = {
      // Change '/dashboard' to '/login/success'
      url: `${window.location.origin}/login/success`, 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      
      {/* BRANDING */}
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-center shadow-2xl mb-2">
          <img src="/Viralook.png" alt="Logo" className="w-7 h-7 object-cover opacity-90" />
        </div>
        <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Viralook</h1>
        <p className="text-[7px] font-bold text-blue-500 tracking-[0.6em] uppercase">AI Studio</p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-[320px] bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl flex flex-col items-center">
        {!emailSent ? (
          <div className="w-full space-y-3">
            
            {/* GOOGLE OPTION */}
            <button 
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin('google')}
              className="w-full h-[46px] flex items-center justify-center gap-3 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all text-[9px] tracking-widest disabled:opacity-70"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="G" 
                  style={{ width: '16px', height: '16px' }}
                />
              )}
              {socialLoading === 'google' ? "WAITING..." : "CONTINUE WITH GOOGLE"}
            </button>

            {/* GITHUB OPTION */}
            <button 
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin('github')}
              className="w-full h-[46px] flex items-center justify-center gap-3 bg-zinc-800 text-white font-black rounded-full hover:bg-zinc-700 transition-all text-[9px] tracking-widest disabled:opacity-70"
            >
              {socialLoading === 'github' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Github size={16} />
              )}
              {socialLoading === 'github' ? "WAITING..." : "CONTINUE WITH GITHUB"}
            </button>

            {/* SEPARATOR */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">OR</span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            {/* EMAIL FORM */}
            <form onSubmit={handleEmailLogin} className="w-full space-y-3">
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                <input 
                  type="email" 
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[46px] bg-black/40 border border-white/10 pl-12 pr-4 rounded-full text-[10px] text-white placeholder:text-zinc-700 focus:border-blue-500/50 transition-all outline-none"
                  required
                />
              </div>
              <button 
                disabled={loading}
                className="w-full h-[46px] bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full transition-all uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "SEND MAGIC LINK"}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <Mail size={24} className="text-blue-500 mx-auto mb-4 opacity-50 animate-bounce" />
            <h2 className="text-sm font-bold mb-1">Check your inbox</h2>
            <p className="text-zinc-500 text-[10px] italic mb-6 leading-relaxed">Access link sent to {email}</p>
            <button onClick={() => setEmailSent(false)} className="text-blue-500 text-[8px] font-black uppercase tracking-widest hover:underline">Try another email</button>
          </div>
        )}
      </div>

      <p className="mt-10 text-[7px] font-bold text-zinc-800 uppercase tracking-[0.4em] text-center max-w-[240px]">
        Protected by Viralook AI Security
      </p>
    </div>
  );
}
