'use client';

import React from 'react';

interface LoadingBarProps {
  progress?: number; // 0-100
  indeterminate?: boolean;
  className?: string;
}

export default function LoadingBar({ progress, indeterminate = false, className = '' }: LoadingBarProps) {
  return (
    <div className={`w-full h-1 bg-white/5 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 rounded-full transition-all duration-300 ${
          indeterminate ? 'animate-loading-indeterminate' : ''
        }`}
        style={
          !indeterminate && progress !== undefined
            ? { width: `${Math.min(100, Math.max(0, progress))}%` }
            : undefined
        }
      />
    </div>
  );
}

