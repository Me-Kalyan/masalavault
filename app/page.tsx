'use client';

/**
 * HOME PAGE - Premium Redesign
 * Modern, minimal, mobile-first design with glassmorphism effects
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import SearchBar from '@/components/search/SearchBar';
import RecipeCardStack from '@/components/recipes/RecipeCardStack';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import FilterPills from '@/components/filters/FilterPills';
import FilterSidebar from '@/components/filters/FilterSidebar';
import ActiveFilters from '@/components/filters/ActiveFilters';
import { PaginationWrapper } from '@/components/ui/PaginationWrapper';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { COURSE_FILTERS, generateDatabase } from '@/lib/recipes';
import type { Recipe, RecipeWithMatch, Course, Difficulty } from '@/types/recipe';
import { calculateMatch, filterByCourse, filterByDifficulty, filterByTime, searchRecipes } from '@/lib/recipe-utils';
import { getSavedRecipes, saveRecipe, unsaveRecipe, getPantry, savePantry } from '@/lib/storage';

const PAGE_SIZE = 12;

export default function HomePage() {
  const isFirstRender = useIsFirstRender();
  const [recipes] = useState<Recipe[]>(() => generateDatabase());
  const [myPantry, setMyPantry] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<Course | 'All'>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'All'>('All');
  const [maxTime, setMaxTime] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Load saved recipes and pantry from localStorage
  useEffect(() => {
    setSavedIds(getSavedRecipes());
    setMyPantry(getPantry());
  }, []);

  // Calculate matches for recipes
  const recipesWithMatch = useMemo(() => {
    return recipes.map(recipe => calculateMatch(recipe, myPantry));
  }, [recipes, myPantry]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipesWithMatch;

    // Search
    if (searchQuery) {
      filtered = searchRecipes(filtered, searchQuery).map(r => 
        recipesWithMatch.find(rm => rm.id === r.id) || r
      ) as RecipeWithMatch[];
    }

    // Course filter - prioritize selectedCourses from FilterSidebar, otherwise use activeCourse from FilterPills
    if (selectedCourses.length > 0) {
      filtered = filtered.filter(r => selectedCourses.includes(r.course));
    } else if (activeCourse !== 'All') {
      filtered = filterByCourse(filtered, activeCourse) as RecipeWithMatch[];
    }

    // Difficulty filter
    if (activeDifficulty !== 'All') {
      filtered = filterByDifficulty(filtered, activeDifficulty) as RecipeWithMatch[];
    }

    // Time filter
    if (maxTime > 0) {
      filtered = filterByTime(filtered, maxTime) as RecipeWithMatch[];
    }

    return filtered;
  }, [recipesWithMatch, searchQuery, activeCourse, selectedCourses, activeDifficulty, maxTime]);

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecipes.slice(start, start + PAGE_SIZE);
  }, [filteredRecipes, currentPage]);

  // Featured recipes (top matches or trending)
  const featuredRecipes = useMemo(() => {
    return recipesWithMatch
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);
  }, [recipesWithMatch]);

  const handleSave = (recipeId: number) => {
    if (savedIds.includes(recipeId)) {
      unsaveRecipe(recipeId);
      setSavedIds(prev => prev.filter(id => id !== recipeId));
    } else {
      saveRecipe(recipeId);
      setSavedIds(prev => [...prev, recipeId]);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!ingredient.trim()) return;
    const trimmed = ingredient.trim().toLowerCase();
    if (!myPantry.includes(trimmed)) {
      const updated = [...myPantry, trimmed];
      setMyPantry(updated);
      savePantry(updated);
    }
    setInputValue('');
  };

  const clearAllFilters = () => {
    setActiveCourse('All');
    setActiveDifficulty('All');
    setMaxTime(0);
    setSelectedCourses([]);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8 md:space-y-12">
      {/* Hero Search Section */}
      <motion.section
        initial={isFirstRender ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.6,
        }}
        className="space-y-4 md:space-y-6"
      >
        <div className="text-center space-y-2 px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">Discover Your Next Meal</h1>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Find the perfect recipe from our collection of authentic Indian dishes
          </p>
        </div>
        <SearchBar
          onSearch={setSearchQuery}
          className="max-w-2xl mx-auto"
        />
        <FilterPills
          filters={COURSE_FILTERS.map(f => ({ value: f.value, label: f.label }))}
          activeFilter={activeCourse}
          onFilterChange={(value) => {
            setActiveCourse(value as Course | 'All');
            // Clear selectedCourses when using FilterPills to avoid conflicts
            setSelectedCourses([]);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          className="justify-center"
        />
      </motion.section>

      {/* Pantry Section (Mobile) */}
      <section className="lg:hidden">
        <div className="p-4 rounded-xl border bg-card">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <ShoppingBag size={18} className="text-primary" />
            Your Pantry
          </h2>
          <div className="flex gap-2 mb-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient(inputValue)}
              placeholder="Add ingredient..."
              className="flex-1"
            />
            <Button onClick={() => addIngredient(inputValue)} size="icon">
              <Plus size={18} />
            </Button>
          </div>
          {myPantry.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {myPantry.map(ing => (
                <span key={ing} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm">
                  {ing}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters Bar */}
      <section className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterSidebar
            open={showFilters}
            onOpenChange={setShowFilters}
            activeDifficulty={activeDifficulty}
            maxTime={maxTime}
            selectedCourses={selectedCourses}
            onDifficultyChange={(difficulty) => {
              setActiveDifficulty(difficulty);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            onTimeChange={(time) => {
              setMaxTime(time);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            onCourseToggle={(course) => {
              setSelectedCourses(prev => {
                const newSelection = prev.includes(course)
                  ? prev.filter(c => c !== course)
                  : [...prev, course];
                // Clear activeCourse when using FilterSidebar to avoid conflicts
                if (newSelection.length > 0) {
                  setActiveCourse('All');
                }
                setCurrentPage(1); // Reset to first page when filter changes
                return newSelection;
              });
            }}
            onClearAll={clearAllFilters}
          />
        </div>
        <ActiveFilters
          activeCourse={activeCourse}
          activeDifficulty={activeDifficulty}
          maxTime={maxTime}
          selectedCourses={selectedCourses}
          onClearCourse={() => {
            setActiveCourse('All');
            setSelectedCourses([]);
          }}
          onClearDifficulty={() => setActiveDifficulty('All')}
          onClearTime={() => setMaxTime(0)}
          onClearAll={clearAllFilters}
        />
      </section>

      {/* Featured Recipes */}
      {featuredRecipes.length > 0 && (
        <motion.section
          initial={isFirstRender ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.1 : 0,
          }}
        >
          <RecipeCardStack
            recipes={featuredRecipes}
            title="Smart Meal Picks"
            onSave={handleSave}
            isSaved={(id) => savedIds.includes(id)}
          />
        </motion.section>
      )}

      {/* All Recipes Grid */}
      <motion.section
        initial={isFirstRender ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.6,
          delay: isFirstRender ? 0.15 : 0,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            All Recipes
            {filteredRecipes.length > 0 && (
              <span className="text-muted-foreground text-lg font-normal ml-2">
                ({filteredRecipes.length})
              </span>
            )}
          </h2>
        </div>
        <RecipeGrid
          recipes={paginatedRecipes}
          onSave={handleSave}
          isSaved={(id) => savedIds.includes(id)}
        />
        {filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No recipes found. Try adjusting your filters.</p>
          </motion.div>
        )}
      </motion.section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
