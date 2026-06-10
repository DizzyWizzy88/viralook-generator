import { useState } from "react";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-[360px] flex flex-col items-stretch">
        
        {/* BRAND LOGO HEADER */}
        <div className="flex flex-col items-center mb-10">
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
            NEW USER SETUP
          </h1>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 px-4 py-3 rounded mb-6 text-red-400 text-[11px] tracking-wide text-center uppercase font-medium">
            {error}
          </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleSignUp} className="flex flex-col space-y-3">
          <div className="relative">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder-zinc-600 outline-none transition-colors tracking-widest font-medium"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="relative">
            <input 
              type="password" 
              placeholder="PASSWORD" 
              className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder-zinc-600 outline-none transition-colors tracking-widest font-medium"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold h-11 rounded text-[11px] tracking-[0.2em] uppercase transition-colors duration-150 flex items-center justify-center mt-4 disabled:opacity-50"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col items-center space-y-2">
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase text-center">
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