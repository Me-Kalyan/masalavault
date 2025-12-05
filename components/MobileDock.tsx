'use client';

import React from 'react';
import GlassIcons from './GlassIcons';

interface MobileDockItem {
  icon: React.ReactNode;
  color: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface MobileDockProps {
  items: MobileDockItem[];
  className?: string;
}

export default function MobileDock({ items, className = '' }: MobileDockProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl px-5 py-4 shadow-2xl">
        <GlassIcons items={items} />
      </div>
    </div>
  );
}

