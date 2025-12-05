export type Course = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Beverage';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Recipe {
  id: number;
  title: string;
  cuisine: string;
  course: Course;
  imageKeyword: string;
  time: string;
  difficulty: Difficulty;
  ingredients: string[];
  instructions: string[];
  defaultServings?: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  videoUrl?: string;
  substitutions?: Record<string, string[]>;
  difficultyReasons?: string[];
  seasonal?: string[];
  prepTime?: number;
  cookTime?: number;
  timerSteps?: Array<{ stepIndex: number; duration: number; label: string }>;
}

export interface RecipeWithMatch extends Recipe {
  have: string[];
  missing: string[];
  percentage: number;
}

