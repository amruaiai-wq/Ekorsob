// src/components/Timer.tsx
'use client';

import { useEffect } from 'react';

interface TimerProps {
  timeRemaining: number;
  setTimeRemaining: (time: number | ((prev: number) => number)) => void;
  onTimeUp: () => void;
}

export default function Timer({ timeRemaining, setTimeRemaining, onTimeUp }: TimerProps) {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp, setTimeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLowTime = timeRemaining < 300; // น้อยกว่า 5 นาที

  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-xl font-bold ${
      isLowTime 
        ? 'bg-red-100 text-red-700 animate-pulse' 
        : 'bg-blue-100 text-blue-700'
    }`}>
      <span className="text-2xl">⏱️</span>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
