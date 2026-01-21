"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState("...");

  useEffect(() => {
    // Firebase logic only runs after the page loads in the app
    const initFirebase = async () => {
      const { db } = await import("@/lib/firebase");
      const { doc, onSnapshot } = await import("firebase/firestore");
      
      onSnapshot(doc(db, "users", "user_dev_01"), (doc) => {
        if (doc.exists()) setCredits(doc.data().credits);
      });
    };
    initFirebase();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-black">DASHBOARD</h1>
      <p className="mt-4">Credits: {credits}</p>
    </div>
  );
}
