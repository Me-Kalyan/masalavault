'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/recipe';

interface FilterPill {
  value: Course | 'All';
  label: string;
  icon?: React.ReactNode;
}

interface FilterPillsProps {
  filters: FilterPill[];
  activeFilter: Course | 'All';
  onFilterChange: (filter: Course | 'All') => void;
  className?: string;
}

const COURSE_ICONS: Record<string, string> = {
  'All': '🍽️',
  'Breakfast': '🍳',
  'Lunch': '🍱',
  'Dinner': '🍛',
  'Snack': '🥪',
  'Dessert': '🍰',
  'Beverage': '☕',
};

export default function FilterPills({ filters, activeFilter, onFilterChange, className }: FilterPillsProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin', className)}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const icon = filter.icon || COURSE_ICONS[filter.value] || '🍽️';

        return (
          <motion.div
            key={filter.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              mass: 0.5,
            }}
            className="snap-start"
          >
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFilterChange) {
                  onFilterChange(filter.value);
                }
              }}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'rounded-full px-4 py-2 h-auto text-sm font-medium whitespace-nowrap',
                'transition-all duration-200 cursor-pointer',
                'flex items-center gap-2',
                'relative overflow-hidden',
                'pointer-events-auto z-10',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
                  : 'bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:border-primary/30'
              )}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{filter.label}</span>
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
