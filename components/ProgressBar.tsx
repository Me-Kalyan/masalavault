'use client';

import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorClasses = {
  orange: 'bg-gradient-to-r from-orange-500 to-orange-400',
  blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
  green: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  red: 'bg-gradient-to-r from-red-500 to-red-400',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-400',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'orange',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-slate-300 font-medium">{label}</span>}
          {showValue && (
            <span className="text-sm text-slate-400 font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden bg-white/10 ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

