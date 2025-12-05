/**
 * localStorage utilities for MasalaVault
 * Handles saved recipes, history, search history, and other persistent data
 */

const STORAGE_KEYS = {
  SAVED_RECIPES: 'pc_saved_recipes',
  HISTORY: 'pc_history',
  RECENT_SEARCHES: 'pc_recent_searches',
  PANTRY: 'pc_pantry',
  COLLECTIONS: 'pc_collections',
  MEAL_PLAN: 'pc_meal_plan',
  RATINGS: 'pc_recipe_ratings',
  COOKIE_CONSENT: 'pc_cookie_consent',
} as const;

// Saved Recipes
export const getSavedRecipes = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveRecipe = (recipeId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedRecipes();
    if (!saved.includes(recipeId)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify([...saved, recipeId]));
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

export const unsaveRecipe = (recipeId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedRecipes();
    localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(saved.filter(id => id !== recipeId)));
  } catch (error) {
    console.error('Error unsaving recipe:', error);
  }
};

// History
export const getHistory = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

export const addToHistory = (recipeId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const updated = [recipeId, ...history.filter(id => id !== recipeId)].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};

// Recent Searches
export const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const searches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return searches ? JSON.parse(searches) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (query: string): void => {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const searches = getRecentSearches();
    const updated = [query.trim(), ...searches.filter(s => s !== query.trim())].slice(0, 10); // Keep last 10
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

export const clearRecentSearches = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
};

// Pantry
export const getPantry = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const pantry = localStorage.getItem(STORAGE_KEYS.PANTRY);
    return pantry ? JSON.parse(pantry) : [];
  } catch {
    return [];
  }
};

export const savePantry = (pantry: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantry));
  } catch (error) {
    console.error('Error saving pantry:', error);
  }
};

// Recipe Ratings
export const getRecipeRatings = (): Record<number, { rating: number; review?: string }> => {
  if (typeof window === 'undefined') return {};
  try {
    const ratings = localStorage.getItem(STORAGE_KEYS.RATINGS);
    return ratings ? JSON.parse(ratings) : {};
  } catch {
    return {};
  }
};

export const saveRecipeRating = (recipeId: number, rating: number, review?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const ratings = getRecipeRatings();
    ratings[recipeId] = { rating, review };
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  } catch (error) {
    console.error('Error saving recipe rating:', error);
  }
};

// Cookie Consent
export const getCookieConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const consent = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    return consent === 'true';
  } catch {
    return false;
  }
};

export const setCookieConsent = (consented: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, String(consented));
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
};

