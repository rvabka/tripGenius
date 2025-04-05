'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Progress } from './ui/progress';

const Loader = () => {
  const [progress, setProgress] = useState<number>(0);

  const statusUpdates = [
    'We are analyzing your preferences',
    'We are searching for the best attraction',
    'We are optimizing the route',
    'We are preparing recommendations',
    'We are finalizing the travel plan',
    'Almost ready'
  ];

  const currentStatus = useRef(statusUpdates[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 30) {
          currentStatus.current = statusUpdates[0];
          return prev + 3;
        }
        if (prev <= 50) {
          currentStatus.current = statusUpdates[1];
          return prev + 2;
        }
        if (prev <= 60) {
          currentStatus.current = statusUpdates[2];
          return prev + 1.25;
        }
        if (prev <= 75) {
          currentStatus.current = statusUpdates[3];
          return prev + 1;
        }
        if (prev <= 90) {
          currentStatus.current = statusUpdates[4];
          return prev + 1;
        }
        if (prev <= 100) {
          currentStatus.current = statusUpdates[5];
          return prev + 0.5;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col w-full flex-1 h-screen justify-center items-center fixed inset-0 bg-black/50 z-50">
      <div className="relative">
        <div className="animate-spin rounded-full border-t-transparent border-4 border-[#ffffff] size-8" />
        <div className="absolute top-0 left-0 animate-ping opacity-75 rounded-full border-2 border-[#d4d4d4] size-8" />
        <div className="absolute top-0 left-0 animate-pulse opacity-50 size-8 rounded-full border border-[#868686]" />
      </div>
      <Progress value={progress} className="w-1/2 mt-3 mb-1" />

      <p className="text-2xl font-light text-white text-center">
        {currentStatus.current}{' '}
        <span className="animate-pulse font-medium text-4xl">...</span>
      </p>
    </div>
  );
};

export default Loader;
