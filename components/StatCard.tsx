'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
  className?: string;
}

const colorClasses = {
  orange: 'from-orange-500/20 to-orange-500/10 text-orange-400 border-orange-500/20',
  blue: 'from-blue-500/20 to-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'from-green-500/20 to-green-500/10 text-green-400 border-green-500/20',
  red: 'from-red-500/20 to-red-500/10 text-red-400 border-red-500/20',
  purple: 'from-purple-500/20 to-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  color = 'orange',
  className = '',
}: StatCardProps) {
  return (
    <div className={`p-6 rounded-2xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20 transition-all group ${className}`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="text-3xl md:text-4xl font-black mb-1 text-slate-200">{value}</div>
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      {trend && (
        <div className={`text-xs font-medium flex items-center gap-1 ${
          trend.isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
}

