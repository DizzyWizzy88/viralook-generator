import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const googleProvider = new GoogleAuthProvider();
// Force account selection screen on sign-up
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process redirect auth result if popup falls back to redirect
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        console.error('Google Redirect Error:', err);
        setError('Failed to complete Google Sign-Up.');
      });
  }, [navigate]);

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);

    try {
      // Must be called synchronously inside click event to avoid auth/popup-blocked
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Google Sign-Up Error:', err);

      if (err.code === 'auth/popup-blocked') {
        try {
          // Fall back to redirect if popup is blocked
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          setError('Pop-up was blocked. Please enable pop-ups for this site.');
        }
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'An error occurred during Google Sign-Up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Create an Account</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Get started with your free account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Creating account...' : 'Sign up with Google'}</span>
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;