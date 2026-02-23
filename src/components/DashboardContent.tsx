"use client";
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DashboardContent({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const db = getFirestore();

  // 1. Listen to User Profile (Credits & Tier)
  useEffect(() => {
    if (!userId) return;
    const unsubUser = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });
    return () => unsubUser();
  }, [userId, db]);

  // 2. Listen to User's Generated Images Gallery
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "users", userId, "images"), 
      orderBy("createdAt", "desc")
    );
    const unsubImages = onSnapshot(q, (snapshot) => {
      const fetchedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(fetchedImages);
    });
    return () => unsubImages();
  }, [userId, db]);

  const hasCredits = (userData?.credits || 0) > 0;

  const handleGenerateClick = () => {
    if (!hasCredits) {
      router.push('/upgrade');
      return;
    }
    // This is where you'd trigger your actual AI API call
    console.log("Starting generation...");
    setIsGenerating(true);
    
    // Simulating an API call for now
    // setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen bg-white text-gray-900">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-gray-100 pb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">My Studio</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
              {userData?.tier || 'Starter'} Plan
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 min-w-[150px] text-center md:text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Available Credits</p>
          <p className="text-3xl font-black text-blue-600 leading-none">
            {userData?.credits ?? 0}
          </p>
        </div>
      </div>

      {/* ACTION SECTION (The Credit Guard) */}
      <div className="mb-16">
        {hasCredits ? (
          <div className="flex flex-col items-center md:items-start gap-4">
            <button 
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="group relative w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-14 rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI IS COOKING...
                </span>
              ) : (
                <>
                  <span>CREATE NEW LOOK</span>
                  <span className="bg-blue-500/50 text-[10px] px-2 py-1 rounded-lg">-1</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 italic font-medium ml-2">
              Transform your selfies into professional headshots instantly.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Out of Credits</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You've used all your credits. Upgrade now to keep generating high-quality AI headshots.
            </p>
            <button 
              onClick={() => router.push('/upgrade')}
              className="bg-gray-900 text-white font-bold py-4 px-12 rounded-2xl hover:bg-black transition-all shadow-lg animate-pulse"
            >
              REFULL CREDITS
            </button>
          </div>
        )}
      </div>

      {/* GALLERY SECTION */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Your Gallery
          <span className="text-sm font-medium text-gray-400">({images.length})</span>
        </h2>
        
        {images.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <p className="text-gray-400 font-medium italic">Your generated photos will appear here...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img 
                  src={img.url} 
                  alt="AI Generation" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Download
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
