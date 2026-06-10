import { useEffect, useState } from "react";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithCredential,
  getRedirectResult
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
// 1. Changed from next/navigation to react-router-dom
import { useNavigate, Link } from "react-router-dom"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 2. Swapped useRouter for useNavigate
  const navigate = useNavigate(); 

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  // Initialize GoogleAuth for web fallback if needed
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }, []);

  // Handle pending redirect results
  useEffect(() => {
    const handleRedirectResultTask = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await handleUserSetup(result.user);
        }
      } catch (err: any) {
        console.error("Redirect Login Error:", err);
      }
    };

    handleRedirectResultTask();
  }, [auth, db]);

  const handleUserSetup = async (user: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          credits: 2,
          createdAt: serverTimestamp(),
          isUnlimited: false
        });
      }
      // 3. Updated Next.js router.push() to navigate()
      navigate("/dashboard"); 
    } catch (err) {
      console.error("User Setup Error:", err);
      setError("Failed to set up user profile.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 4. Updated Next.js router.push() to navigate()
      navigate("/dashboard"); 
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      if (Capacitor.isNativePlatform()) {
        // Native Android Login
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(auth, credential);
        if (result.user) {
          await handleUserSetup(result.user);
        }
      } else {
        // Web Login
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await handleUserSetup(result.user);
        }
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message?.includes("popup_closed_by_user")
        ? "Sign-in was cancelled."
        : "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        
        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Viralook</h1>
          <p className="text-zinc-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="flex justify-between px-1 text-sm">
          {/* 5. Fixed broken attributes typo (removed stray px-1 text-zinc-400) */}
          <Link to="/forgot-password" className="text-zinc-400 hover:text-white transition-colors">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Create Account
          </Link>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-100 transition-all disabled:opacity-50"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            className="w-5 h-5" 
          />
          {loading ? "Authenticating..." : "Sign In with Google"}
        </button>
      </div>
    </div>
  );
}
