import { useState, useEffect } from 'react';

const SUMMONING_MESSAGES = [
  "Summoning the AI Gods...",
  "Awakening the AI Core...",
  "Consulting the Digital Oracles...",
  "Synthesizing Viral Sigils...",
  "Channelling Neon Energy...",
  "Manifesting your Vision..."
];

export const useSummoningSequence = (isLoading: boolean) => {
  const [currentMessage, setCurrentMessage] = useState(SUMMONING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setCurrentMessage(SUMMONING_MESSAGES[0]);
      return;
    }

    // Cycle messages every 2.5 seconds
    const msgInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const index = SUMMONING_MESSAGES.indexOf(prev);
        return SUMMONING_MESSAGES[(index + 1) % SUMMONING_MESSAGES.length];
      });
    }, 2500);

    // Exponential progress (fast at first, slows down near 95%)
    const progInterval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + (95 - prev) * 0.1 : prev));
    }, 400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, [isLoading]);

  return { currentMessage, progress };
};
