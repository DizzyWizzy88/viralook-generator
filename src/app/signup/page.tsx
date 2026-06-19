import { useState } from "react";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Google Authentication Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Initialize workspace credits if this is a first-time profile
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          credits: 2,
          isUnlimited: false,
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Google Authentication Failed:", err);
      setError("GOOGLE SIGN-IN FAILED. PLEASE TRY AGAIN.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Standard Email/Password Form Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        credits: 2,
        isUnlimited: false,
        createdAt: new Date().toISOString(),
      });

      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("THIS EMAIL IS ALREADY REGISTERED.");
      } else if (err.code === 'auth/weak-password') {
        setError("PASSWORD MUST BE AT LEAST 6 CHARACTERS.");
      } else if (err.code === 'auth/invalid-email') {
        setError("THE PROVIDED EMAIL ADDRESS IS INVALID.");
      } else {
        setError(err.message || "SIGNUP FAILED. PLEASE TRY AGAIN.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-[360px] flex flex-col items-stretch">

        {/* BRAND LOGO HEADER */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="transition-opacity hover:opacity-80 block">
            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
              <img
                src="/Viralook.png"
                alt="Viralook Generator"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <h1 className="text-[11px] font-medium tracking-[0.4em] text-zinc-400 uppercase mt-4 text-center">
            ENTER THE STUDIO
          </h1>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 px-4 py-3 rounded mb-6 text-red-400 text-[11px] tracking-wide text-center uppercase font-medium">
            {error}
          </div>
        )}

        {/* 🔐 GOOGLE SIGN-IN BUTTON LINKED WITH SVG LOGO */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-800/80 font-bold h-11 rounded text-[11px] tracking-[0.15em] uppercase transition-colors duration-150 flex items-center justify-center gap-3 mb-4 disabled:opacity-50 group"
        >
          <svg className="w-3.5 h-3.5 fill-current text-zinc-400 group-hover:text-white" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.183 15.465 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.079-1.32-.174-1.885H12.24z" />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        {/* VISUAL SEPARATOR DIVIDER */}
        <div className="relative flex py-4 items-center mb-2">
          <div className="flex-grow border-t border-zinc-900"></div>
          <span className="flex-shrink mx-4 text-zinc-700 text-[9px] font-bold tracking-widest">OR</span>
          <div className="flex-grow border-t border-zinc-900"></div>
        </div>

        {/* STANDARD INPUT FORM */}
        <form onSubmit={handleSignUp} className="flex flex-col space-y-3">

          {/* EMAIL INPUT CONTAINER */}
          <div className="relative">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 placeholder:normal-case normal-case outline-none transition-colors tracking-widest font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD INPUT CONTAINER */}
          <div className="relative">
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 placeholder:normal-case normal-case outline-none transition-colors tracking-widest font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold h-11 rounded text-[11px] tracking-[0.2em] uppercase transition-colors duration-150 flex items-center justify-center mt-4 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "LOGIN / CREATE WITH EMAIL"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col items-center space-y-2">
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase text-center">
            New accounts receive 2 complimentary credits
          </p>
          <p className="text-[11px] tracking-wide text-zinc-400">
            Already registered?{" "}
            <Link to="/login" className="text-white hover:underline underline-offset-4 transition-all font-medium">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}