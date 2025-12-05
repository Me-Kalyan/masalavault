'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "What are you craving today?",
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay to allow clicks on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch(''); // Clear the search query in parent
    }
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative w-full', className)} data-search-bar>
      <motion.div
        layout
        className={cn(
          'relative flex items-center gap-3 md:gap-4',
          'rounded-full border transition-all duration-300 ease-out',
          'bg-background/80 backdrop-blur-xl backdrop-saturate-150',
          'shadow-sm',
          isFocused
            ? 'border-primary/60 shadow-lg shadow-primary/10 ring-2 ring-primary/20 scale-[1.01]'
            : 'border-border/50 hover:border-primary/30 hover:shadow-md'
        )}
        style={{
          padding: isFocused ? '0.875rem 1.25rem' : '0.75rem 1rem',
        }}
        initial={false}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            scale: isFocused ? 1.1 : 1,
            rotate: isFocused ? 0 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Search 
            size={20} 
            className={cn(
              'transition-colors duration-200 shrink-0',
              isFocused ? 'text-primary' : 'text-muted-foreground'
            )} 
          />
        </motion.div>
        
        <Input
          ref={inputRef}
          type="text"
          variant="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'flex-1',
            isFocused && 'placeholder:opacity-50'
          )}
        />
        
        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence mode="wait">
            {query && (
              <motion.button
                key="clear-button"
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={handleClear}
                className="p-1.5 rounded-full hover:bg-accent/80 active:bg-accent transition-colors group"
                aria-label="Clear search"
              >
                <X 
                  size={16} 
                  className="text-muted-foreground group-hover:text-foreground transition-colors" 
                />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.div
            animate={{
              scale: isFocused ? [1, 1.2, 1] : 1,
              opacity: isFocused ? 1 : 0.6,
            }}
            transition={{
              scale: {
                duration: 0.6,
                repeat: isFocused ? Infinity : 0,
                repeatDelay: 2,
              },
              opacity: { duration: 0.2 },
            }}
          >
            <Sparkles 
              size={18} 
              className={cn(
                'transition-colors duration-200',
                isFocused ? 'text-primary' : 'text-muted-foreground/60'
              )} 
            />
          </motion.div>
        </div>
        
        {/* Focus indicator glow */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/5 -z-10 blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {showSuggestions && isFocused && (
          <SearchSuggestions
            query={query}
            onSelect={(selectedQuery) => {
              setQuery(selectedQuery);
              setShowSuggestions(false);
              if (onSearch) onSearch(selectedQuery);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
