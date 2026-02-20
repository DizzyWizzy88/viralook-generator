import { useState, useCallback, useRef } from 'react';

export const useSummoningSequence = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("READY TO SUMMON");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSummoning = useCallback(() => {
    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setProgress(0);
    setCurrentMessage("INITIATING BRAINSCAN...");

    // Create a smooth, non-linear progress simulation
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev < 30) {
          setCurrentMessage("EXPANDING PROMPT ARCHITECTURE...");
          return prev + 1; // Slower start for Llama
        }
        if (prev < 70) {
          setCurrentMessage("SUMMONING PIXELS FROM THE VOID...");
          return prev + 0.5; // Medium speed for Flux
        }
        if (prev < 95) {
          setCurrentMessage("FINALIZING TEXTURES...");
          return prev + 0.2; // Slow down at the end so it doesn't hit 100 too fast
        }
        return prev;
      });
    }, 100);
  }, []);

  const completeSummoning = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentMessage("MANIFESTED SUCCESSFULLY");
    setProgress(100);
  }, []);

  const failSummoning = useCallback((reason: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentMessage(reason.toUpperCase());
    setProgress(0);
  }, []);

  return { progress, currentMessage, startSummoning, completeSummoning, failSummoning };
};
