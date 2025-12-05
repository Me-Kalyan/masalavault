/**
 * Recipe similarity calculation utilities
 */

import type { Recipe } from '@/types/recipe';
import { calculateSimilarity, getSimilarRecipes } from './recipe-utils';

export { calculateSimilarity, getSimilarRecipes };

/**
 * Get recipes similar to a given recipe based on multiple criteria
 */
export const findSimilarRecipes = (
  targetRecipe: Recipe,
  allRecipes: Recipe[],
  limit: number = 5
): Recipe[] => {
  return getSimilarRecipes(targetRecipe, allRecipes, limit);
};

