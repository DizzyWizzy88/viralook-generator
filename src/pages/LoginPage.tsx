// File: src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { syncUserData } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const auth = getFirebaseAuth();
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            console.error("🔥 LOGIN FAILED:", err);
            if (err instanceof FirebaseError) {
                if (
                    err.code === 'auth/user-not-found' ||
                    err.code === 'auth/wrong-password' ||
                    err.code === 'auth/invalid-credential'
                ) {
                    setError("Invalid email or password.");
                } else {
                    setError("Login failed. Please try again.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const auth = getFirebaseAuth();
            const provider = new GoogleAuthProvider();
            // Prompt user to select account every time
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);

            if (result.user) {
                await syncUserData(result.user);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('🔥 GOOGLE SIGN-IN ERROR:', err);
            if (err instanceof FirebaseError) {
                if (err.code === 'auth/popup-closed-by-user') {
                    setError("Sign-in popup was closed before completing.");
                } else if (err.code === 'auth/cancelled-popup-request') {
                    // Ignored: User opened multiple popups sequentially
                } else {
                    setError("Google sign-in failed. Please try again.");
                }
            } else {
                setError("An error occurred during Google authentication.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">

                {/* BRAND LOGO HEADER */}
                <div className="text-center flex flex-col items-center">
                    <Link to="/" className="transition-opacity hover:opacity-90 block mb-2">
                        <div className="w-48 max-w-[200px] aspect-square flex items-center justify-center overflow-hidden">
                            <img
                                src="/Viralook.png"
                                alt="Viralook Generator Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </Link>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Enter the studio</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                {/* EMAIL & PASSWORD FORM */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 outline-none transition-colors tracking-widest font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="PASSWORD"
                        className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 outline-none transition-colors tracking-widest font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "AUTHENTICATING..." : "LOGIN"}
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                    <div className="relative flex justify-center text-[8px] font-black uppercase"><span className="bg-black px-2 text-zinc-600 tracking-[0.3em]">OR</span></div>
                </div>

                {/* GOOGLE AUTHENTICATION */}
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-white/5 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 group cursor-pointer disabled:opacity-50"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google Logo"
                        style={{ width: '14px', height: '14px', minWidth: '14px', minHeight: '14px' }}
                        className="flex-shrink-0"
                    />
                    <span>Continue with Google</span>
                </button>

                {/* SIGNUP NAVIGATION */}
                <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
                    New here? <Link to="/signup" className="text-white font-bold hover:text-zinc-200 transition-colors ml-1">Create Account</Link>
                </p>
            </div>
        </div>
    );
}