'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Course, Difficulty } from '@/types/recipe';

interface ActiveFiltersProps {
  activeCourse?: Course | 'All';
  activeDifficulty?: Difficulty | 'All';
  maxTime?: number;
  selectedCourses?: Course[];
  onClearCourse?: () => void;
  onClearDifficulty?: () => void;
  onClearTime?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export default function ActiveFilters({
  activeCourse,
  activeDifficulty,
  maxTime,
  selectedCourses = [],
  onClearCourse,
  onClearDifficulty,
  onClearTime,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  // Check if we have active filters
  const hasActiveCourse = activeCourse && activeCourse !== 'All';
  const hasActiveDifficulty = activeDifficulty && activeDifficulty !== 'All';
  const hasActiveTime = maxTime && maxTime > 0;
  const hasSelectedCourses = selectedCourses.length > 0;
  
  const hasActiveFilters = hasActiveCourse || hasActiveDifficulty || hasActiveTime || hasSelectedCourses;

  if (!hasActiveFilters) return null;

  const activeFilters: Array<{ key: string; label: string; onClear?: () => void }> = [];

  // Add selected courses from FilterSidebar (multi-select)
  if (hasSelectedCourses) {
    selectedCourses.forEach(course => {
      activeFilters.push({
        key: `course-${course}`,
        label: course,
        onClear: onClearCourse, // Will clear all selected courses
      });
    });
  } else if (hasActiveCourse && onClearCourse) {
    // Add active course from FilterPills (single select)
    activeFilters.push({
      key: 'course',
      label: activeCourse,
      onClear: onClearCourse,
    });
  }

  if (hasActiveDifficulty && onClearDifficulty) {
    activeFilters.push({
      key: 'difficulty',
      label: activeDifficulty,
      onClear: onClearDifficulty,
    });
  }

  if (hasActiveTime && onClearTime) {
    activeFilters.push({
      key: 'time',
      label: `< ${maxTime} min`,
      onClear: onClearTime,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Active Filters:
      </span>
      <AnimatePresence mode="popLayout">
        {activeFilters.map((filter) => (
          <motion.div
            key={filter.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 28,
              mass: 0.5,
            }}
          >
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
            >
              {filter.label}
              {filter.onClear && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    filter.onClear?.();
                  }}
                  className="ml-1 hover:text-foreground transition-colors rounded-full hover:bg-accent p-0.5"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X size={12} />
                </button>
              )}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
      {onClearAll && activeFilters.length > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClearAll();
          }}
          className="ml-auto text-xs text-primary hover:text-primary/80 font-medium h-auto py-1 px-2"
        >
          Clear all
        </Button>
      )}
    </motion.div>
  );
}
