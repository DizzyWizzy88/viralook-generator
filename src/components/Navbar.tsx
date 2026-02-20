"use client";

import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function UserMenu({ user }: { user: any }) {
  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    window.location.reload(); // Refresh to lock the generator
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-full border border-white/5">
      <div className="flex items-center gap-2 px-3">
        {user.photoURL ? (
          <img src={user.photoURL} className="w-6 h-6 rounded-full border border-cyan-500/50" alt="avatar" />
        ) : (
          <UserIcon size={16} className="text-zinc-500" />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hidden md:block">
          {user.displayName?.split(' ')[0]}
        </span>
      </div>
      
      <button 
        onClick={handleLogout}
        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors text-zinc-500"
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
