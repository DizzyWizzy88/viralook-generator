// src/components/modules/GlobalFeed.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { togglePublicStatus } from '../../lib/feedService';
import { PublishToggle } from '../ui/PublishToggle';


export interface FeedItem {
  id: string;
  createdAt?: string;
  enhancedPrompt?: string;
  imageUrl?: string;
  prompt?: string;
  userEmail?: string;
  userId?: string;
  likes?: number;
  isPublic?: boolean;
}

export const GlobalFeed: React.FC = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setError('Please sign in to view the global feed.');
        setLoading(false);
        return;
      }

      setError(null);
      const feedRef = collection(db, 'global_feed');
      const feedQuery = query(feedRef, orderBy('createdAt', 'desc'));

      const unsubscribeSnapshot = onSnapshot(
        feedQuery,
        (snapshot) => {
          const feedData: FeedItem[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setItems(feedData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching global feed:', err);
          setError('Failed to load global feed items.');
          setLoading(false);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleUnpublish = async (item: FeedItem, newState: boolean) => {
    if (!item.userId || !item.imageUrl) return;
    await togglePublicStatus(
      {
        id: item.id,
        userId: item.userId,
        userEmail: item.userEmail || '',
        prompt: item.prompt || '',
        imageUrl: item.imageUrl,
        isPublic: true,
      },
      newState
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-950 border border-red-900/50 rounded-2xl p-6 text-center text-red-400 text-xs font-bold uppercase tracking-widest">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
        No public assets generated yet. Be the first!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => {
        const isOwner = currentUser?.uid === item.userId;

        return (
          <div
            key={item.id}
            className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="aspect-square overflow-hidden bg-zinc-900 relative">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.prompt || 'Community creation'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-zinc-300 font-medium line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-3">
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pt-2 border-t border-zinc-900">
                <span>
                  {item.userEmail && item.userEmail !== 'no-email@provided.com'
                    ? item.userEmail.split('@')[0]
                    : 'Anonymous'}
                </span>
                {item.likes !== undefined && <span>❤️ {item.likes}</span>}
              </div>

              {isOwner && (
                <div className="flex justify-end pt-1">
                  <PublishToggle
                    initialState={true}
                    onToggle={(newState) => handleUnpublish(item, newState)}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalFeed;