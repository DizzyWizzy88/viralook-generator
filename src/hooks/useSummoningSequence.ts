import { useState, useCallback } from 'react';

export const useSummoningSequence = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("INITIALIZING...");

  const messages = [
    "ANALYZING VIBE...",
    "SYNTHESIZING STYLE...",
    "SUMMONING THE AI GODS...",
    "FINALIZING PIXELS..."
  ];

  const startSummoning = useCallback(async () => {
    setProgress(0);
    for (let i = 0; i < messages.length; i++) {
      setCurrentMessage(messages[i]);
      // Simulate progress steps
      for (let p = 0; p < 25; p++) {
        setProgress(prev => prev + 1);
        await new Promise(r => setTimeout(r, 40)); 
      }
    }
    setCurrentMessage("COMPLETE");
    setProgress(100);
  }, []);

  const resetSummoning = useCallback(() => {
    setProgress(0);
    setCurrentMessage("READY TO SUMMON");
  }, []);

  return { progress, currentMessage, startSummoning, resetSummoning };
};
