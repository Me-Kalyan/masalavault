'use client';

import React from 'react';
import { motion } from 'motion/react';
import { History, TrendingUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRecentSearches, clearRecentSearches, addRecentSearch } from '@/lib/storage';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (query: string) => void;
}

const POPULAR_SEARCHES = ['Biryani', 'Butter Masala', 'Paneer', 'Chicken Curry', 'Dal', 'Naan'];

export default function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const recentSearches = getRecentSearches();

  const handleSelect = (selectedQuery: string) => {
    addRecentSearch(selectedQuery);
    onSelect(selectedQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'absolute top-full left-0 right-0 mt-2',
        'bg-popover border border-border rounded-2xl',
        'shadow-xl backdrop-blur-xl',
        'max-h-96 overflow-y-auto',
        'z-50'
      )}
    >
      {query.length === 0 ? (
        <div className="p-4 space-y-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <History size={12} />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={() => {
                    clearRecentSearches();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(search)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <History size={14} className="text-muted-foreground" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <TrendingUp size={12} />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelect(term)}
                  className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 rounded-lg border border-border transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Search size={12} />
            <span>Search Results</span>
          </div>
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Searching for "{query}"...
          </div>
        </div>
      )}
    </motion.div>
  );
}

