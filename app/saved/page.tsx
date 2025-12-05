'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { Heart, Filter, Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import FilterPills from '@/components/filters/FilterPills';
import FilterSidebar from '@/components/filters/FilterSidebar';
import ActiveFilters from '@/components/filters/ActiveFilters';
import { PaginationWrapper } from '@/components/ui/PaginationWrapper';
import { COURSE_FILTERS, generateDatabase } from '@/lib/recipes';
import { getSavedRecipes, unsaveRecipe } from '@/lib/storage';
import { filterByCourse, filterByDifficulty, filterByTime, searchRecipes } from '@/lib/recipe-utils';
import type { Recipe, Course, Difficulty } from '@/types/recipe';

const PAGE_SIZE = 12;

export default function SavedPage() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<Course | 'All'>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'All'>('All');
  const [maxTime, setMaxTime] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSavedIds(getSavedRecipes());
    setAllRecipes(generateDatabase());
  }, []);

  const savedRecipes = useMemo(() => {
    return allRecipes.filter(r => savedIds.includes(r.id));
  }, [allRecipes, savedIds]);

  const filteredRecipes = useMemo(() => {
    let filtered = savedRecipes;

    if (searchQuery) {
      filtered = searchRecipes(filtered, searchQuery);
    }

    if (activeCourse !== 'All') {
      filtered = filterByCourse(filtered, activeCourse);
    }

    if (selectedCourses.length > 0) {
      filtered = filtered.filter(r => selectedCourses.includes(r.course));
    }

    if (activeDifficulty !== 'All') {
      filtered = filterByDifficulty(filtered, activeDifficulty);
    }

    if (maxTime > 0) {
      filtered = filterByTime(filtered, maxTime);
    }

    return filtered;
  }, [savedRecipes, searchQuery, activeCourse, selectedCourses, activeDifficulty, maxTime]);

  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecipes.slice(start, start + PAGE_SIZE);
  }, [filteredRecipes, currentPage]);

  const handleSave = (recipeId: number) => {
    unsaveRecipe(recipeId);
    setSavedIds(prev => prev.filter(id => id !== recipeId));
  };

  const handleBulkDelete = () => {
    selectedRecipes.forEach(id => {
      unsaveRecipe(id);
    });
    setSavedIds(prev => prev.filter(id => !selectedRecipes.has(id)));
    setSelectedRecipes(new Set());
    setMultiSelectMode(false);
  };

  const toggleSelect = (recipeId: number) => {
    setSelectedRecipes(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setActiveCourse('All');
    setActiveDifficulty('All');
    setMaxTime(0);
    setSelectedCourses([]);
  };

  if (savedRecipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Heart size={48} className="text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">No Saved Recipes Yet</h1>
            <p className="text-muted-foreground mb-6">
              Start exploring recipes and save your favorites to access them quickly later.
            </p>
            <Button onClick={() => router.push('/')}>
              Browse Recipes
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={isFirstRender ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.6,
        }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Saved Recipes</h1>
          <p className="text-muted-foreground mt-1">
            {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>
        <div className="flex items-center gap-2">
          {multiSelectMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setMultiSelectMode(false);
                  setSelectedRecipes(new Set());
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={selectedRecipes.size === 0}
              >
                <Trash2 size={16} className="mr-2" />
                Delete ({selectedRecipes.size})
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setMultiSelectMode(true)}
            >
              <CheckSquare size={16} className="mr-2" />
              Select
            </Button>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterPills
          filters={COURSE_FILTERS}
          activeFilter={activeCourse}
          onFilterChange={setActiveCourse}
        />
        <FilterSidebar
          open={showFilters}
          onOpenChange={setShowFilters}
          activeDifficulty={activeDifficulty}
          maxTime={maxTime}
          selectedCourses={selectedCourses}
          onDifficultyChange={setActiveDifficulty}
          onTimeChange={setMaxTime}
          onCourseToggle={(course) => {
            setSelectedCourses(prev =>
              prev.includes(course)
                ? prev.filter(c => c !== course)
                : [...prev, course]
            );
          }}
          onClearAll={clearAllFilters}
        />
      </div>

      <ActiveFilters
        activeCourse={activeCourse}
        activeDifficulty={activeDifficulty}
        maxTime={maxTime}
        onClearCourse={() => setActiveCourse('All')}
        onClearDifficulty={() => setActiveDifficulty('All')}
        onClearTime={() => setMaxTime(0)}
        onClearAll={clearAllFilters}
      />

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <>
          <RecipeGrid
            recipes={paginatedRecipes}
            isSaved={(id) => savedIds.includes(id)}
            onSave={handleSave}
          />
          {totalPages > 1 && (
            <div className="flex justify-center">
              <PaginationWrapper
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recipes match your filters.</p>
        </div>
      )}
    </div>
  );
}
