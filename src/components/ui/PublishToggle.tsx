// src/components/ui/PublishToggle.tsx
import React, { useState } from 'react';

interface PublishToggleProps {
  initialState: boolean;
  onToggle: (newState: boolean) => Promise<void>;
  disabled?: boolean;
}

export const PublishToggle: React.FC<PublishToggleProps> = ({
  initialState,
  onToggle,
  disabled = false,
}) => {
  const [isPublic, setIsPublic] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || loading) return;
    const nextState = !isPublic;
    setLoading(true);
    try {
      await onToggle(nextState);
      setIsPublic(nextState);
    } catch (err) {
      console.error('Failed to update publication status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
        isPublic
          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
      } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isPublic ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
        }`}
      />
      {loading ? 'Updating...' : isPublic ? 'Public in Feed' : 'Make Public'}
    </button>
  );
};

export default PublishToggle;