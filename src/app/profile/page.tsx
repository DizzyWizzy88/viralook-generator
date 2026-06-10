import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Calendar, ArrowLeft, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string; createdAt?: string } | null>(null);
  const navigate = useNavigate();

  // Simple placeholder logic or hook setup depending on your custom state tracking
  useEffect(() => {
    // Component initialization logic goes here
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-900 rounded-lg transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black uppercase italic">Profile Settings</h1>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-4 border-b border-white/5 pb-4">
            <User className="text-zinc-500" size={24} />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Account Type</p>
              <p className="font-bold text-sm uppercase text-blue-400">Standard Studio Member</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="text-zinc-500" size={24} />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Email Address</p>
              <p className="text-sm font-medium">{user?.email || "Loading..."}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate("/login")}
          className="w-full bg-zinc-900 border border-red-500/30 text-red-500 font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center space-x-2 text-sm"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
