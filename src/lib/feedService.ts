// src/lib/feedService.ts
import { doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface CreationItem {
  id: string;
  userId: string;
  userEmail: string;
  prompt: string;
  enhancedPrompt?: string;
  imageUrl: string;
  isPublic: boolean;
  createdAt?: any;
}

/**
 * Toggle the public visibility of a creation.
 * Syncs the document to the 'global_feed' collection.
 */
export const togglePublicStatus = async (
  creation: CreationItem,
  newPublicState: boolean
): Promise<void> => {
  const globalFeedRef = doc(db, 'global_feed', creation.id);
  const userCreationRef = doc(db, `users/${creation.userId}/creations`, creation.id);

  if (newPublicState) {
    // Add or update entry in global_feed
    await setDoc(globalFeedRef, {
      ...creation,
      isPublic: true,
      createdAt: creation.createdAt || serverTimestamp(),
    }, { merge: true });

    // Update user's personal creations record if tracked separately
    await updateDoc(userCreationRef, { isPublic: true }).catch(() => {});
  } else {
    // Remove from global_feed
    await deleteDoc(globalFeedRef);

    // Update user's personal creations record
    await updateDoc(userCreationRef, { isPublic: false }).catch(() => {});
  }
};