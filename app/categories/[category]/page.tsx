'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import FilterSidebar from '@/components/filters/FilterSidebar';
import ActiveFilters from '@/components/filters/ActiveFilters';
import { PaginationWrapper } from '@/components/ui/PaginationWrapper';
import { generateDatabase } from '@/lib/recipes';
import { getSavedRecipes, saveRecipe, unsaveRecipe } from '@/lib/storage';
import { filterByCourse, filterByDifficulty, filterByTime, searchRecipes } from '@/lib/recipe-utils';
import type { Recipe, Course, Difficulty } from '@/types/recipe';

const PAGE_SIZE = 12;

const CATEGORY_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
  dessert: 'Desserts',
  beverage: 'Beverages',
};

export default function CategoryPage() {
  const isFirstRender = useIsFirstRender();
  const params = useParams();
  const router = useRouter();
  const categoryParam = params.category as string;
  const category = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) as Course;
  
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'All'>('All');
  const [maxTime, setMaxTime] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setAllRecipes(generateDatabase());
    setSavedIds(getSavedRecipes());
  }, []);

  const categoryRecipes = useMemo(() => {
    return filterByCourse(allRecipes, category);
  }, [allRecipes, category]);

  const filteredRecipes = useMemo(() => {
    let filtered = categoryRecipes;

    if (searchQuery) {
      filtered = searchRecipes(filtered, searchQuery);
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
  }, [categoryRecipes, searchQuery, selectedCourses, activeDifficulty, maxTime]);

  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecipes.slice(start, start + PAGE_SIZE);
  }, [filteredRecipes, currentPage]);

  const handleSave = (recipeId: number) => {
    if (savedIds.includes(recipeId)) {
      unsaveRecipe(recipeId);
      setSavedIds(prev => prev.filter(id => id !== recipeId));
    } else {
      saveRecipe(recipeId);
      setSavedIds(prev => [...prev, recipeId]);
    }
  };

  const clearAllFilters = () => {
    setActiveDifficulty('All');
    setMaxTime(0);
    setSelectedCourses([]);
  };

  const categoryLabel = CATEGORY_LABELS[categoryParam] || category;

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={useIsFirstRender() ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.6,
        }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{categoryLabel}</h1>
          <p className="text-muted-foreground mt-1">
            {categoryRecipes.length} {categoryRecipes.length === 1 ? 'recipe' : 'recipes'} in this category
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1" />
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
        activeDifficulty={activeDifficulty}
        maxTime={maxTime}
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
          <p className="text-muted-foreground">No recipes found in this category.</p>
        </div>
      )}
    </div>
  );
}
