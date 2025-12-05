'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 px-4 flex flex-col items-center animate-fade-in ${className}`}>
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center animate-bounce-in">
        <Icon size={48} className="text-orange-400/70" />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-200">{title}</h3>
      <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="magnetic-button px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg shadow-orange-500/30 font-medium text-sm hover:from-orange-600 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

