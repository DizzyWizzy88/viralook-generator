import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // <--- Triple check this path!

export default function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("CreditBadge: Found user", user.uid);
        
        const userRef = doc(db, "users", user.uid);
        console.log("CreditBadge: Attempting to listen to path:", userRef.path);

        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            console.log("CreditBadge: Data received!", docSnap.data());
            setCredits(docSnap.data().credits);
          } else {
            console.log("CreditBadge: No document found for this UID!");
          }
        }, (error) => {
          console.error("CreditBadge: Firestore Error ->", error.code, error.message);
        });

        return () => unsubscribeSnapshot();
      } else {
        console.log("CreditBadge: No user logged in");
        setCredits(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
      <span className="text-sm font-medium text-zinc-100">
        {credits ?? "..."} Credits
      </span>
    </div>
  );
}
