'use client';

import React from 'react';
import { History, X } from 'lucide-react';
import { getRecentSearches, clearRecentSearches } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  maxItems?: number;
}

export default function SearchHistory({ onSelect, maxItems = 10 }: SearchHistoryProps) {
  const recentSearches = getRecentSearches().slice(0, maxItems);

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <History size={12} />
          <span>Recent Searches</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRecentSearches}
          className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(search)}
            className={cn(
              'px-3 py-1.5 text-xs rounded-lg',
              'bg-accent hover:bg-accent/80',
              'border border-border',
              'transition-colors',
              'flex items-center gap-2'
            )}
          >
            <span>{search}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

