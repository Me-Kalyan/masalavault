'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-[1.75rem] bg-gradient-to-b from-white/[0.07] to-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden animate-fade-in">
      {/* Image skeleton */}
      <div className="h-52 relative overflow-hidden bg-slate-900/50">
        <div className="absolute inset-0 shimmer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-white/5 animate-shimmer" />
          <div className="h-6 w-16 rounded-full bg-white/5 animate-shimmer" />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded-lg bg-white/5 animate-shimmer" />
          <div className="h-5 w-1/2 rounded-lg bg-white/5 animate-shimmer" />
        </div>
        
        {/* Stats */}
        <div className="flex gap-3 flex-wrap">
          <div className="h-7 w-16 rounded-lg bg-white/5 animate-shimmer" />
          <div className="h-7 w-20 rounded-lg bg-white/5 animate-shimmer" />
          <div className="h-7 w-14 rounded-lg bg-white/5 animate-shimmer" />
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-shimmer" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-24 rounded-full bg-white/5 animate-shimmer" />
            <div className="h-3 w-16 rounded-full bg-white/5 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 pb-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

