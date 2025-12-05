'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Filter, X, Clock, Zap, ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Course, Difficulty } from '@/types/recipe';

interface FilterSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeDifficulty?: Difficulty | 'All';
  maxTime?: number;
  selectedCourses?: Course[];
  onDifficultyChange?: (difficulty: Difficulty | 'All') => void;
  onTimeChange?: (time: number) => void;
  onCourseToggle?: (course: Course) => void;
  onClearAll?: () => void;
}

const DIFFICULTY_OPTIONS: { value: Difficulty | 'All'; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'All', label: 'Any Level', icon: Filter, color: 'text-muted-foreground' },
  { value: 'Easy', label: 'Easy', icon: Zap, color: 'text-emerald-500' },
  { value: 'Medium', label: 'Medium', icon: Clock, color: 'text-amber-500' },
  { value: 'Hard', label: 'Hard', icon: ChefHat, color: 'text-red-500' },
];

const TIME_OPTIONS = [
  { value: 0, label: 'Any Time', icon: Clock },
  { value: 30, label: '< 30 min', icon: Clock },
  { value: 60, label: '< 1 hour', icon: Clock },
  { value: 90, label: '< 1.5 hours', icon: Clock },
];

const COURSE_OPTIONS: { value: Course; label: string; icon: string }[] = [
  { value: 'Breakfast', label: 'Breakfast', icon: '🍳' },
  { value: 'Lunch', label: 'Lunch', icon: '🍱' },
  { value: 'Dinner', label: 'Dinner', icon: '🍛' },
  { value: 'Snack', label: 'Snack', icon: '🥪' },
  { value: 'Dessert', label: 'Dessert', icon: '🍰' },
  { value: 'Beverage', label: 'Beverage', icon: '☕' },
];

export default function FilterSidebar({
  open,
  onOpenChange,
  activeDifficulty = 'All',
  maxTime = 0,
  selectedCourses = [],
  onDifficultyChange,
  onTimeChange,
  onCourseToggle,
  onClearAll,
}: FilterSidebarProps) {
  const activeFilterCount =
    (activeDifficulty !== 'All' ? 1 : 0) +
    (maxTime > 0 ? 1 : 0) +
    selectedCourses.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(true);
          }}
        >
          <Filter size={16} className="mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            Filters
          </DialogTitle>
          <DialogDescription>
            Refine your recipe search by difficulty, time, and course.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Difficulty Filter */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.5,
              delay: 0.1,
            }}
          >
            <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              Difficulty
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {DIFFICULTY_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = activeDifficulty === option.value;
                return (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                      mass: 0.5,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onDifficultyChange?.(option.value)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
                        'hover:border-primary/50 hover:bg-accent/50',
                        isActive
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border bg-background'
                      )}
                    >
                      <Icon size={18} className={cn(isActive ? option.color : 'text-muted-foreground')} />
                      <span className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {option.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <Separator />

          {/* Time Filter */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.5,
              delay: 0.15,
            }}
          >
            <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              Time
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {TIME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = maxTime === option.value;
                return (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                      mass: 0.5,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onTimeChange?.(option.value)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
                        'hover:border-primary/50 hover:bg-accent/50',
                        isActive
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border bg-background'
                      )}
                    >
                      <Icon size={18} className={cn(isActive ? 'text-primary' : 'text-muted-foreground')} />
                      <span className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {option.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <Separator />

          {/* Course Filter (Multi-select) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.5,
              delay: 0.2,
            }}
          >
            <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
              <ChefHat size={16} className="text-primary" />
              Course
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {COURSE_OPTIONS.map((option) => {
                const isActive = selectedCourses.includes(option.value);
                return (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                      mass: 0.5,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onCourseToggle?.(option.value)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
                        'hover:border-primary/50 hover:bg-accent/50',
                        isActive
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border bg-background'
                      )}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {option.label}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Clear All Button */}
          {activeFilterCount > 0 && onClearAll && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.5,
                delay: 0.25,
              }}
            >
              <Separator className="my-4" />
              <Button
                variant="outline"
                onClick={onClearAll}
                className="w-full"
              >
                <X size={16} className="mr-2" />
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
