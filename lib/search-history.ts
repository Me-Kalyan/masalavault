/**
 * Search history management utilities
 */

import { getRecentSearches, addRecentSearch, clearRecentSearches } from './storage';

export { getRecentSearches, addRecentSearch, clearRecentSearches };

/**
 * Get search suggestions based on query
 */
export const getSearchSuggestions = (query: string, recipes: Array<{ title: string; cuisine: string }>): string[] => {
  if (!query.trim()) {
    return getRecentSearches().slice(0, 5);
  }

  const q = query.toLowerCase().trim();
  const suggestions: string[] = [];

  // Add matching recipe titles
  recipes.forEach(recipe => {
    if (recipe.title.toLowerCase().includes(q) && !suggestions.includes(recipe.title)) {
      suggestions.push(recipe.title);
    }
  });

  // Add matching cuisines
  recipes.forEach(recipe => {
    if (recipe.cuisine.toLowerCase().includes(q) && !suggestions.includes(recipe.cuisine)) {
      suggestions.push(recipe.cuisine);
    }
  });

  // Add recent searches that match
  getRecentSearches().forEach(search => {
    if (search.toLowerCase().includes(q) && !suggestions.includes(search)) {
      suggestions.push(search);
    }
  });

  return suggestions.slice(0, 10);
};

