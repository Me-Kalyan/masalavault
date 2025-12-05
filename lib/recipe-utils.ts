/**
 * Recipe utility functions for filtering, searching, and matching
 */

import type { Recipe, RecipeWithMatch, Course, Difficulty } from '@/types/recipe';

/**
 * Calculate recipe match percentage based on pantry ingredients
 */
export const calculateMatch = (recipe: Recipe, pantry: string[]): RecipeWithMatch => {
  const pantryLower = pantry.map(i => i.toLowerCase().trim());
  const have: string[] = [];
  const missing: string[] = [];

  recipe.ingredients.forEach(ing => {
    const ingLower = ing.toLowerCase().trim();
    const found = pantryLower.some(p => 
      ingLower.includes(p) || p.includes(ingLower) ||
      ingLower.split(/\s+/).some(word => pantryLower.includes(word))
    );
    if (found) {
      have.push(ing);
    } else {
      missing.push(ing);
    }
  });

  const percentage = recipe.ingredients.length > 0
    ? Math.round((have.length / recipe.ingredients.length) * 100)
    : 0;

  return {
    ...recipe,
    have,
    missing,
    percentage,
  };
};

/**
 * Filter recipes by course
 */
export const filterByCourse = (recipes: Recipe[], course: Course | 'All'): Recipe[] => {
  if (course === 'All') return recipes;
  return recipes.filter(r => r.course === course);
};

/**
 * Filter recipes by difficulty
 */
export const filterByDifficulty = (recipes: Recipe[], difficulty: Difficulty | 'All'): Recipe[] => {
  if (difficulty === 'All') return recipes;
  return recipes.filter(r => r.difficulty === difficulty);
};

/**
 * Filter recipes by max time
 */
export const filterByTime = (recipes: Recipe[], maxTime: number): Recipe[] => {
  if (maxTime === 0) return recipes;
  return recipes.filter(r => {
    const time = parseTime(r.time);
    return time > 0 && time <= maxTime;
  });
};

/**
 * Parse time string to minutes
 */
export const parseTime = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)\s*(min|mins|hour|hours|hr|hrs)/i);
  if (match) {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    if (unit.includes('hour') || unit.includes('hr')) return num * 60;
    return num;
  }
  return 0;
};

/**
 * Search recipes by query
 */
export const searchRecipes = (recipes: Recipe[], query: string): Recipe[] => {
  if (!query.trim()) return recipes;
  const q = query.toLowerCase().trim();
  return recipes.filter(r => 
    r.title.toLowerCase().includes(q) ||
    r.cuisine.toLowerCase().includes(q) ||
    r.ingredients.some(i => i.toLowerCase().includes(q)) ||
    r.instructions.some(i => i.toLowerCase().includes(q))
  );
};

/**
 * Calculate recipe similarity based on ingredients, cuisine, and course
 */
export const calculateSimilarity = (recipe1: Recipe, recipe2: Recipe): number => {
  let score = 0;
  
  // Cuisine match (40% weight)
  if (recipe1.cuisine === recipe2.cuisine) score += 40;
  
  // Course match (20% weight)
  if (recipe1.course === recipe2.course) score += 20;
  
  // Ingredient overlap (40% weight)
  const ing1 = new Set(recipe1.ingredients.map(i => i.toLowerCase()));
  const ing2 = new Set(recipe2.ingredients.map(i => i.toLowerCase()));
  const intersection = new Set([...ing1].filter(i => ing2.has(i)));
  const union = new Set([...ing1, ...ing2]);
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;
  score += jaccard * 40;
  
  return Math.round(score);
};

/**
 * Get similar recipes
 */
export const getSimilarRecipes = (recipe: Recipe, allRecipes: Recipe[], limit: number = 5): Recipe[] => {
  return allRecipes
    .filter(r => r.id !== recipe.id)
    .map(r => ({ recipe: r, similarity: calculateSimilarity(recipe, r) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.recipe);
};

/**
 * Generate recipe slug from title
 */
export const getRecipeSlug = (recipe: Recipe): string => {
  return recipe.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get recipe by slug
 */
export const getRecipeBySlug = (slug: string, allRecipes: Recipe[]): Recipe | null => {
  return allRecipes.find(recipe => getRecipeSlug(recipe) === slug) || null;
};

