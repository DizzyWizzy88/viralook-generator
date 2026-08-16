import { useState, useRef, useCallback } from 'react';

const MESSAGES = [
  "Consulting the digital ether...",
  "Aligning prompt geometry...",
  "Synthesizing latent features...",
  "Refining hyper-realistic vectors...",
  "Finalizing visual output..."
];

export function useSummoningSequence() {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSummoning = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let index = 0;
    setCurrentMessage(MESSAGES[0]);

    intervalRef.current = setInterval(() => {
      index = (index + 1) % MESSAGES.length;
      setCurrentMessage(MESSAGES[index]);
    }, 2200);
  }, []);

  const stopSequence = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentMessage('');
  }, []);

  const completeSummoning = useCallback(() => {
    stopSequence();
  }, [stopSequence]);

  const failSummoning = useCallback(() => {
    stopSequence();
  }, [stopSequence]);

  return {
    currentMessage,
    startSummoning,
    completeSummoning,
    failSummoning
  };
}