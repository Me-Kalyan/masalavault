'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useDeferredValue,
  useCallback,
} from 'react';
import dynamic from 'next/dynamic';
import Dock from '@/components/Dock';
import Aurora from '@/components/Aurora';
import { ToastContainer, useToast } from '@/components/Toast';
import EmptyState from '@/components/EmptyState';
import StructuredData from '@/components/StructuredData';
import ProgressBar from '@/components/ProgressBar';
import StatCard from '@/components/StatCard';
import CookieConsent from '@/components/CookieConsent';

// Code splitting: Lazy load heavy components
const CookModeOverlay = dynamic(() => import('@/components/CookModeOverlay'), {
  loading: () => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>,
  ssr: false,
});
import { 
  ChefHat, Plus, X, Search, ShoppingBag, 
  CheckCircle2, Clock, Flame, 
  Menu, Heart, History, Info, 
  Home, Utensils, Settings,
  Sparkles, Compass, Lightbulb,
  Share2, ClipboardList, Filter,
  Zap, ChevronDown, Printer, Download,
  Timer, Play, Calendar, MapPin,
  TrendingUp, Users, Video, Copy,
  Minus, Plus as PlusIcon, ChefHat as ChefIcon,
  BookOpen, Leaf, Apple, Scale
} from 'lucide-react';

// --- Constants ---
const PAGE_SIZE = 6;

// --- Types ---
type Course = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Beverage';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type View = 'home' | 'saved' | 'history' | 'about' | 'settings' | 'shopping' | 'collections' | 'mealplan' | 'compare' | 'cuisine';
type Collection = { id: string; name: string; description: string; recipeIds: number[] };
type MealPlanDay = { breakfast?: number; lunch?: number; dinner?: number; snack?: number };
type MealPlan = Record<string, MealPlanDay>;
type ActiveTimer = { id: string; label: string; duration: number; remaining: number; stepIndex: number };

const COURSE_FILTERS: { value: Course | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Snack', label: 'Snack' },
  { value: 'Beverage', label: 'Drinks' },
];

const DIFFICULTY_FILTERS: { value: Difficulty | 'All'; label: string; color: string }[] = [
  { value: 'All', label: 'Any Level', color: 'text-slate-300' },
  { value: 'Easy', label: 'Easy', color: 'text-emerald-400' },
  { value: 'Medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'Hard', label: 'Hard', color: 'text-red-400' },
];

const TIME_FILTERS = [
  { value: 0, label: 'Any Time' },
  { value: 30, label: '< 30 min' },
  { value: 60, label: '< 1 hour' },
  { value: 90, label: '< 1.5 hours' },
];

const TOP_NAV_ITEMS = [
  { id: 'home' as View, label: 'Home', icon: Home },
  { id: 'saved' as View, label: 'Saved', icon: Heart },
  { id: 'history' as View, label: 'History', icon: History },
];

interface Recipe {
  id: number;
  title: string;
  cuisine: string;
  course: Course;
  imageKeyword: string; // Used to fetch relevant real images
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  // New fields for enhanced features
  defaultServings?: number; // Default servings (usually 4)
  nutrition?: {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber?: number; // grams
  };
  videoUrl?: string; // YouTube video URL
  substitutions?: Record<string, string[]>; // ingredient -> alternatives
  difficultyReasons?: string[]; // Why it's hard/easy
  seasonal?: string[]; // Seasonal months
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  timerSteps?: Array<{ stepIndex: number; duration: number; label: string }>; // Steps with timers
}

// --- ENHANCED IMAGE SYSTEM ---
const RECIPE_IMAGE_MAP: Record<string, string> = {
  // Specific recipe titles
  'Hyderabadi Chicken Biryani': '1563379091339-03b21ab4a4f8',
  'Masala Dosa': '1668236346578-638519005a5a',
  'Butter Chicken': '1610057099494-830eb10f4405',
  'Palak Paneer': '1567188040757-95ebba479d2f',
  'Chole Bhature': '1601050690597-df0568f70950',
  'Litti Chokha': '1626082927389-e1714550fc87',
  'Pesarattu': '1668236346578-638519005a5a',
  'Vada Pav': '1601050690597-df0568f70950',
  'Rogan Josh': '1610057099494-830eb10f4405',
  'Pav Bhaji': '1601050690597-df0568f70950',
  'South Indian Filter Coffee': '1517705008128-361805f42e86',
  'Iced Cold Coffee': '1517705008128-361805f42e86',
  'Badam Milk': '1509440159596-0249088772ff',
  'Mango Lassi': '1514933651103-005eec06c04b',
  'Masala Chaas (Buttermilk)': '1514933651103-005eec06c04b',
  
  // Cuisine + Course combinations
  'Punjabi-Dinner': '1610057099494-830eb10f4405',
  'Punjabi-Lunch': '1601050690597-df0568f70950',
  'South Indian-Breakfast': '1668236346578-638519005a5a',
  'South Indian-Dinner': '1565557623262-b51c2513a641',
  'Hyderabadi-Dinner': '1563379091339-03b21ab4a4f8',
  'North Indian-Dinner': '1567188040757-95ebba479d2f',
  'Maharashtrian-Snack': '1601050690597-df0568f70950',
  'Bihari-Lunch': '1626082927389-e1714550fc87',
  'Kashmiri-Dinner': '1610057099494-830eb10f4405',
  'Andhra-Breakfast': '1668236346578-638519005a5a',
  'Street Food-Snack': '1601050690597-df0568f70950',
  'Street Food-Dinner': '1601050690597-df0568f70950',
  'Indian-Beverage': '1514933651103-005eec06c04b',
  'North Indian-Beverage': '1514933651103-005eec06c04b',
};

const KEYWORD_IMAGE_MAP: Record<string, string> = {
  biryani: '1563379091339-03b21ab4a4f8',
  rice: '1512058564366-18510be2db19',
  dosa: '1668236346578-638519005a5a',
  idli: '1589301760574-d922667686aa',
  paratha: '1626082927389-e1714550fc87',
  roti: '1626082927389-e1714550fc87',
  curry: '1565557623262-b51c2513a641',
  chicken: '1610057099494-830eb10f4405',
  mutton: '1610057099494-830eb10f4405',
  fish: '1690983428989-1375371e7d23',
  paneer: '1567188040757-95ebba479d2f',
  samosa: '1601050690597-df0568f70950',
  chaat: '1601050690597-df0568f70950',
  dessert: '1551024506-0bccd828d307',
  sweet: '1551024506-0bccd828d307',
  tea: '1576092762791-d2386a241e03',
  soup: '1547592166-23ac45744acd',
  salad: '1512621776951-a57141f2eefd',
  coffee: '1511920170033-f8396924c348',
  latte: '1514933651103-005eec06c04b',
  filtercoffee: '1517705008128-361805f42e86',
  coldcoffee: '1517705008128-361805f42e86',
  milkshake: '1509440159596-0249088772ff',
  lassi: '1514933651103-005eec06c04b',
  chaas: '1514933651103-005eec06c04b',
  juice: '1510627498534-cf7e9002facc',
  smoothie: '1510627498534-cf7e9002facc',
  pav: '1601050690597-df0568f70950',
  puri: '1601050690597-df0568f70950',
  dhokla: '1551024506-0bccd828d307',
  halwa: '1551024506-0bccd828d307',
  pulao: '1512058564366-18510be2db19',
  manchurian: '1547592166-23ac45744acd',
  pesarattu: '1668236346578-638519005a5a',
  vada: '1601050690597-df0568f70950',
  pani: '1601050690597-df0568f70950',
};

const FALLBACK_IMAGE = '1606491956689-2ea286b80be8';

const getImageUrl = (recipe: Recipe): string => {
  const width = 520;
  const quality = 80;
  
  // Try exact title match first
  if (RECIPE_IMAGE_MAP[recipe.title]) {
    return `https://images.unsplash.com/photo-${RECIPE_IMAGE_MAP[recipe.title]}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  
  // Try cuisine + course combination
  const cuisineCourse = `${recipe.cuisine}-${recipe.course}`;
  if (RECIPE_IMAGE_MAP[cuisineCourse]) {
    return `https://images.unsplash.com/photo-${RECIPE_IMAGE_MAP[cuisineCourse]}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  
  // Fallback to keyword-based matching
  const keyword = recipe.imageKeyword.toLowerCase();
  const key = Object.keys(KEYWORD_IMAGE_MAP).find(k => keyword.includes(k)) || 'default';
  const imageId = KEYWORD_IMAGE_MAP[key] || FALLBACK_IMAGE;
  
  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=${width}&q=${quality}`;
};

// Recipe Image Component with error handling and performance optimization
const RecipeImage = React.memo(({ recipe, className, onLoad }: { recipe: Recipe; className?: string; onLoad?: () => void }) => {
  const [imgSrc, setImgSrc] = useState(() => getImageUrl(recipe));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use WebP format and responsive sizes for better performance
  const getOptimizedUrl = (url: string, width: number = 520) => {
    if (url.includes('unsplash.com')) {
      // Add WebP format and responsive sizing
      return url.replace(/(\?|&)w=\d+/, `$1w=${width}`).replace(/(\?|&)q=\d+/, '$1q=80') + '&fm=webp';
    }
    return url;
  };
  
  const fallbackUrl = `https://images.unsplash.com/photo-${FALLBACK_IMAGE}?auto=format&fit=crop&w=520&q=80&fm=webp`;
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackUrl);
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };
  
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50" />
      )}
      <img
        src={getOptimizedUrl(imgSrc)}
        alt={recipe.title}
        className={className}
        loading="lazy"
        decoding="async"
        onError={handleError}
        onLoad={handleLoad}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.4s ease-out' }}
        fetchPriority="low"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </>
  );
});

RecipeImage.displayName = 'RecipeImage';

// --- HELPER: Visual Step Logic ---
const getStepEmoji = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("boil") || t.includes("steam") || t.includes("pressure")) return "🥣";
  if (t.includes("fry") || t.includes("sauté") || t.includes("oil") || t.includes("ghee")) return "🍳";
  if (t.includes("chop") || t.includes("cut") || t.includes("grate") || t.includes("paste")) return "🔪";
  if (t.includes("mix") || t.includes("grind") || t.includes("batter") || t.includes("whisk")) return "🌀";
  if (t.includes("bake") || t.includes("roast") || t.includes("tandoor")) return "🔥";
  if (t.includes("knead") || t.includes("dough")) return "🥯";
  if (t.includes("serve") || t.includes("garnish")) return "🍽️";
  return "👨‍🍳";
};

// --- HELPER: Scale Ingredient Quantity ---
const scaleIngredient = (ingredient: string, scale: number): string => {
  if (scale === 1) return ingredient;
  const parts = ingredient.split(/(\d+(?:\.\d+)?(?:\/\d+)?)\s*(cup|tbsp|tsp|kg|g|lb|oz|piece|pieces|clove|cloves|inch|inches|cm|ml|l|liter|liters)/i);
  if (parts.length >= 3) {
    const quantity = parts[1];
    const unit = parts[2];
    const numMatch = quantity.match(/(\d+(?:\.\d+)?)(?:\/(\d+))?/);
    if (numMatch) {
      const whole = parseFloat(numMatch[1]);
      const denom = numMatch[2] ? parseFloat(numMatch[2]) : 1;
      const value = (whole / denom) * scale;
      if (value < 1 && denom === 1) {
        const newDenom = Math.round(1 / value);
        return `${1}/${newDenom} ${unit} ${ingredient.replace(parts[0], '').trim()}`;
      }
      return `${value.toFixed(value % 1 === 0 ? 0 : 1)} ${unit} ${ingredient.replace(parts[0], '').trim()}`;
    }
  }
  return ingredient;
};

// --- HELPER: Parse Time from String ---
const parseTime = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)\s*(min|mins|hour|hours|hr|hrs)/i);
  if (match) {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    if (unit.includes('hour') || unit.includes('hr')) return num * 60;
    return num;
  }
  return 0;
};

// --- HELPER: Format Time ---
const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  return `${hours}h ${mins}m`;
};

// --- HELPER: Get Difficulty Reasons ---
const getDifficultyReasons = (recipe: Recipe): string[] => {
  const reasons: string[] = [];
  const time = parseTime(recipe.time);
  const steps = recipe.instructions.length;
  
  if (time > 90) reasons.push(`Long cooking time (${formatTime(time)})`);
  if (steps > 8) reasons.push(`Many steps (${steps} steps)`);
  if (recipe.ingredients.length > 15) reasons.push(`Many ingredients (${recipe.ingredients.length} items)`);
  if (recipe.instructions.some(s => s.toLowerCase().includes('ferment') || s.toLowerCase().includes('overnight'))) {
    reasons.push('Requires advance preparation');
  }
  if (recipe.instructions.some(s => s.toLowerCase().includes('dum') || s.toLowerCase().includes('seal'))) {
    reasons.push('Special cooking technique required');
  }
  if (recipe.difficulty === 'Easy' && reasons.length === 0) {
    reasons.push('Simple ingredients and steps');
    reasons.push('Quick preparation time');
  }
  return reasons;
};

// --- HELPER: Get Seasonal Status ---
const isSeasonal = (ingredient: string): boolean => {
  const now = new Date().getMonth() + 1; // 1-12
  const seasonal = SEASONAL_INGREDIENTS[ingredient];
  return seasonal ? seasonal.includes(now) : false;
};

// --- HELPER: Get Substitutions ---
const getSubstitutions = (ingredient: string): string[] => {
  return INGREDIENT_SUBSTITUTIONS[ingredient] || [];
};

// --- CORE RECIPES ---
const CORE_RECIPES: Recipe[] = [
  { 
    id: 1, 
    title: "Hyderabadi Chicken Biryani", 
    cuisine: "Hyderabadi", 
    course: "Dinner", 
    imageKeyword: "biryani", 
    time: "90 mins", 
    difficulty: "Hard", 
    ingredients: ["Chicken", "Basmati Rice", "Yogurt", "Fried Onion", "Saffron", "Mint", "Biryani Masala"], 
    defaultServings: 4,
    prepTime: 30,
    cookTime: 60,
    instructions: [
      "MARINATE THE CHICKEN: In a large bowl, combine 500g chicken pieces with 1 cup yogurt, 1 tbsp ginger-garlic paste, 1 tsp red chili powder, 1/2 tsp turmeric, 1 tbsp biryani masala, juice of 1 lemon, and salt. Mix well, cover, and refrigerate for at least 2 hours (overnight is best).",
      "PREPARE THE RICE: Wash 2 cups basmati rice 3-4 times until water runs clear. Soak in water for 30 minutes. Bring a large pot of water to boil with 2 bay leaves, 4 cloves, 4 cardamom pods, 1 cinnamon stick, and 1 tsp salt. Drain rice and add to boiling water. Cook until 70% done (rice should still have a bite) - about 5-6 minutes. Drain and set aside.",
      "MAKE SAFFRON MILK: Soak a generous pinch of saffron strands in 1/4 cup warm milk for 10 minutes. This will give your biryani its signature golden color and aroma.",
      "FRY THE ONIONS: Thinly slice 3 large onions. Heat 1/2 cup oil in a pan over medium-high heat. Fry onions in batches until deep golden brown and crispy (about 8-10 minutes per batch). Drain on paper towels. Reserve the flavored oil.",
      "COOK THE CHICKEN: In a heavy-bottomed pot or Dutch oven, heat 3 tbsp of the reserved onion oil. Add the marinated chicken and cook on medium-high heat for 8-10 minutes, stirring occasionally, until chicken is 80% cooked and the oil starts to separate.",
      "LAYER THE BIRYANI: Spread the cooked chicken evenly in the pot. Layer the par-boiled rice on top. Drizzle the saffron milk in lines across the rice. Scatter half the fried onions, 2 tbsp chopped mint, and 2 tbsp chopped coriander. Dot with 2 tbsp ghee.",
      "DUM COOKING: Seal the pot with aluminum foil, then place a tight-fitting lid on top. Cook on high heat for 3 minutes, then reduce to the lowest heat and cook for 25-30 minutes. The steam trapped inside will finish cooking the rice and infuse all the flavors together.",
      "REST AND SERVE: Turn off the heat and let the biryani rest undisturbed for 5 minutes. Gently mix the layers from bottom to top using a flat spatula. Garnish with remaining fried onions, fresh mint, and serve hot with raita."
    ] 
  },
  { 
    id: 2, 
    title: "Masala Dosa", 
    cuisine: "South Indian", 
    course: "Breakfast", 
    imageKeyword: "dosa", 
    time: "45 mins", 
    difficulty: "Medium", 
    ingredients: ["Rice Flour", "Urad Dal", "Potato", "Onion", "Mustard Seeds", "Turmeric"], 
    instructions: [
      "PREPARE DOSA BATTER (do this a day ahead): Soak 3 cups rice and 1 cup urad dal separately for 6 hours. Grind urad dal first with minimal water to a smooth, fluffy batter. Then grind rice to a slightly grainy consistency. Mix both batters with 1 tsp salt. The batter should be thick but pourable. Cover and ferment in a warm place for 8-12 hours until doubled and slightly sour-smelling.",
      "MAKE POTATO FILLING: Boil 4 medium potatoes until fork-tender, about 15-20 minutes. Peel and roughly mash them (keep some chunks for texture). Heat 3 tbsp oil in a pan, add 1 tsp mustard seeds and let them splutter. Add 1 tsp cumin seeds, 2 dried red chilies, and a sprig of curry leaves.",
      "SEASON THE POTATOES: Add 1 finely chopped onion to the tempering and sauté until translucent (3-4 minutes). Add 2 slit green chilies, 1/2 inch grated ginger, and sauté for 1 minute. Add 1/2 tsp turmeric powder and mix well.",
      "FINISH THE FILLING: Add the mashed potatoes to the pan along with salt to taste. Add 2 tbsp water and mix everything well. Cook for 3-4 minutes until the flavors meld. Garnish with 2 tbsp chopped coriander. Keep warm.",
      "PREPARE THE TAWA: Heat a cast iron or non-stick dosa tawa over medium-high heat. Test if it's ready by sprinkling a few drops of water - they should sizzle and evaporate immediately. Wipe the tawa with an onion half dipped in oil - this creates a non-stick surface.",
      "SPREAD THE DOSA: Stir the fermented batter well. Pour a ladleful (about 1/3 cup) of batter onto the center of the hot tawa. Using the back of the ladle, quickly spread the batter in circular motions from the center outward to form a thin, even circle about 8-9 inches in diameter.",
      "COOK THE DOSA: Drizzle 1 tsp oil around the edges and a little on top. Cook on medium-high heat until the bottom turns golden brown and the edges start to lift (2-3 minutes). The top should look set and have small holes.",
      "ADD FILLING AND SERVE: Place 2-3 tablespoons of potato filling in the center of the dosa. Fold the dosa in half or roll it into a cylinder. Serve immediately with coconut chutney and sambar while crispy."
    ] 
  },
  { 
    id: 3, 
    title: "Butter Chicken", 
    cuisine: "Punjabi", 
    course: "Dinner", 
    imageKeyword: "chicken", 
    time: "60 mins", 
    difficulty: "Medium", 
    ingredients: ["Chicken", "Butter", "Tomato Puree", "Cream", "Kasuri Methi"], 
    instructions: [
      "MARINATE THE CHICKEN: Cut 500g boneless chicken into 2-inch pieces. In a bowl, combine chicken with 1/2 cup yogurt, 1 tbsp lemon juice, 1 tsp red chili powder, 1 tsp garam masala, 1 tbsp ginger-garlic paste, and 1/2 tsp salt. Mix well, cover, and marinate for at least 1 hour (4 hours or overnight is ideal).",
      "COOK THE CHICKEN: You can grill, pan-fry, or bake the marinated chicken. For best results, thread onto skewers and grill/broil for 12-15 minutes, turning once, until charred spots appear. Alternatively, pan-fry in 2 tbsp oil over high heat for 8-10 minutes until cooked through with some char. Set aside.",
      "PREPARE THE TOMATO BASE: In a heavy-bottomed pan, heat 3 tbsp butter over medium heat. Add 1 roughly chopped onion, 6-8 whole cashews, and sauté for 5-6 minutes until onions are soft and light golden.",
      "BUILD THE GRAVY: Add 1 tbsp ginger-garlic paste and sauté for 1 minute until fragrant. Add 400g tomato puree (or 6 medium tomatoes, blanched and pureed) and cook for 15-20 minutes on medium-low heat, stirring occasionally, until the oil separates and the raw tomato smell disappears.",
      "BLEND AND STRAIN: Let the mixture cool slightly, then blend to a smooth paste. Strain through a fine mesh sieve to get a silky smooth gravy - this step is crucial for restaurant-style butter chicken.",
      "FINISH THE GRAVY: Return the strained gravy to the pan. Add 1 tsp red chili powder, 1/2 tsp garam masala, 1 tsp sugar (balances acidity), and salt to taste. Simmer for 5 minutes. Add 2 tbsp butter and stir until melted.",
      "COMBINE CHICKEN AND GRAVY: Add the cooked chicken pieces to the gravy. Pour in 1/2 cup heavy cream and stir gently. Crush 2 tbsp kasuri methi (dried fenugreek leaves) between your palms and add to the curry - this is the secret ingredient for authentic flavor.",
      "FINAL TOUCHES: Simmer everything together for 5-7 minutes on low heat so the chicken absorbs the flavors. Adjust salt and add more cream if desired. Finish with a swirl of fresh cream and a pat of butter on top. Serve hot with naan or rice."
    ] 
  },
  { 
    id: 4, 
    title: "Palak Paneer", 
    cuisine: "North Indian", 
    course: "Dinner", 
    imageKeyword: "paneer", 
    time: "40 mins", 
    difficulty: "Medium", 
    ingredients: ["Spinach", "Paneer", "Garlic", "Cream", "Garam Masala"], 
    instructions: [
      "BLANCH THE SPINACH: Bring a large pot of water to boil. Add 500g fresh spinach leaves and blanch for exactly 2 minutes - no more, or the spinach will lose its bright green color. Immediately transfer to a bowl of ice water to stop cooking. This process preserves the vibrant color.",
      "MAKE SPINACH PUREE: Drain the blanched spinach well and squeeze out excess water. Blend to a smooth puree with 2-3 tbsp water. The puree should be thick, not watery. Set aside.",
      "PREPARE THE PANEER: Cut 250g paneer into 1-inch cubes. Heat 2 tbsp oil in a non-stick pan over medium heat. Lightly fry the paneer cubes until golden on all sides (2-3 minutes). Don't overcook or paneer becomes rubbery. Remove and soak in warm water to keep soft.",
      "MAKE THE BASE: In the same pan, add 1 tbsp oil and 1 tbsp butter. Add 1 tsp cumin seeds and let them splutter. Add 1 medium onion (finely chopped) and sauté until light golden, about 5-6 minutes.",
      "ADD AROMATICS: Add 1 tbsp ginger-garlic paste (or 6-7 minced garlic cloves and 1-inch ginger) and sauté for 2 minutes until the raw smell disappears. Add 2 finely chopped green chilies.",
      "ADD TOMATOES AND SPICES: Add 1 medium tomato (finely chopped) and cook until soft and mushy, about 4-5 minutes. Add 1/2 tsp turmeric, 1 tsp coriander powder, 1/2 tsp red chili powder, and salt to taste. Cook for 2 minutes.",
      "ADD SPINACH PUREE: Pour in the spinach puree and mix well. Cook on medium heat for 6-8 minutes, stirring occasionally. The gravy should thicken slightly and you'll see oil separating at the edges.",
      "FINISH AND SERVE: Drain the paneer from water and gently fold into the spinach gravy. Add 1/4 cup cream and 1/2 tsp garam masala. Simmer for 3-4 minutes. Serve hot with a drizzle of cream, accompanied by roti or naan."
    ] 
  },
  { 
    id: 5, 
    title: "Chole Bhature", 
    cuisine: "Punjabi", 
    course: "Lunch", 
    imageKeyword: "curry", 
    time: "90 mins", 
    difficulty: "Hard", 
    ingredients: ["Chickpeas", "Maida", "Yogurt", "Onion", "Chole Masala"], 
    instructions: [
      "SOAK THE CHICKPEAS: Wash 1.5 cups dried chickpeas thoroughly. Soak overnight (at least 8 hours) in plenty of water with 1/2 tsp baking soda. The chickpeas should triple in size.",
      "COOK THE CHICKPEAS: Drain and rinse the soaked chickpeas. Add to a pressure cooker with 4 cups water, 1 tea bag (for color), 1 tsp salt, and 1 bay leaf. Pressure cook for 4-5 whistles on high, then simmer for 15 minutes. Chickpeas should be completely soft but not mushy. Reserve the cooking liquid.",
      "MAKE BHATURE DOUGH: In a large bowl, combine 2 cups maida, 1/2 tsp salt, 1/2 tsp baking soda, and 1/4 tsp baking powder. Add 2 tbsp yogurt, 1 tbsp oil, and 1/2 tsp sugar. Gradually add warm water (about 1/2 cup) to form a soft, smooth dough. Knead for 8-10 minutes until elastic. Cover with a damp cloth and rest for 2 hours.",
      "PREPARE THE CHOLE MASALA: Dry roast 2 tbsp coriander seeds, 1 tsp cumin seeds, 4-5 dried red chilies, 1 tsp black peppercorns, 2-3 cloves, and 1 black cardamom. Cool and grind to a fine powder. This is your chole masala.",
      "MAKE THE GRAVY BASE: Heat 4 tbsp oil in a heavy pan. Add 2 large onions (finely chopped) and fry until deep golden brown, about 12-15 minutes. This caramelization is key to the flavor. Add 1 tbsp ginger-garlic paste and sauté for 2 minutes.",
      "BUILD THE CHOLE: Add 3 medium tomatoes (pureed) and cook until oil separates, about 10 minutes. Add the homemade chole masala, 1 tsp red chili powder, 1/2 tsp turmeric, 1 tsp amchur (dry mango powder), and salt. Cook for 3-4 minutes.",
      "SIMMER THE CHOLE: Add the cooked chickpeas along with 1.5 cups of the reserved cooking liquid. Add 1 tbsp tamarind paste for tanginess. Simmer uncovered on low heat for 20-25 minutes, mashing some chickpeas against the side of the pan to thicken the gravy.",
      "FRY THE BHATURE: Divide dough into 8 balls. Roll each into an oval about 6 inches long. Heat oil for deep frying to 180°C. Slide in one bhatura and immediately press gently with a slotted spoon - it should puff up. Fry until golden on both sides (about 30 seconds per side). Drain on paper towels.",
      "SERVE: Plate the hot chole garnished with sliced onions, green chilies, lemon wedges, and fresh coriander. Serve with piping hot bhature, pickled onions, and a side of green chutney."
    ] 
  },
  { 
    id: 6, 
    title: "Litti Chokha", 
    cuisine: "Bihari", 
    course: "Lunch", 
    imageKeyword: "paratha", 
    time: "70 mins", 
    difficulty: "Hard", 
    ingredients: ["Wheat Flour", "Sattu", "Brinjal", "Potato", "Mustard Oil"], 
    instructions: [
      "PREPARE SATTU FILLING: In a bowl, take 1 cup sattu (roasted gram flour). Add 1 finely chopped onion, 3-4 chopped green chilies, 2 tbsp chopped coriander, 1 tsp ajwain (carom seeds), 1 tsp roasted cumin powder, 1/2 tsp kala namak (black salt), regular salt to taste, 2 tbsp mustard oil, and juice of 1 lemon. Mix well and gradually add water to make a crumbly mixture that holds together when pressed - not too wet.",
      "MAKE THE DOUGH: In a large bowl, combine 2 cups whole wheat flour with 1/2 tsp salt, 1/2 tsp ajwain, and 1 tbsp ghee. Gradually add water to knead a slightly stiff dough (stiffer than roti dough). Cover and rest for 20 minutes.",
      "SHAPE THE LITTIS: Divide dough into 12 equal balls. Take one ball, flatten it in your palm, and make a cup shape. Place 1.5-2 tbsp of sattu filling in the center. Gather the edges and seal properly, ensuring no cracks. Roll gently between palms to make a smooth ball. Repeat with remaining dough and filling.",
      "ROAST ON FLAME: For authentic taste, roast littis directly over a gas flame or charcoal. Place 3-4 littis on a wire rack over medium flame. Keep rotating them every 30 seconds for even cooking. They're done when the surface is charred in spots and the litti sounds hollow when tapped - about 10-12 minutes total.",
      "ALTERNATIVE BAKING METHOD: Preheat oven to 200°C. Place littis on a baking tray and bake for 20-25 minutes, turning once, until golden brown and crisp on the outside.",
      "MAKE BAINGAN CHOKHA: Roast 2 medium brinjals directly over flame, turning frequently, until the skin is completely charred and the inside is soft (15-20 minutes). Let cool, then peel off the charred skin. Mash the flesh. Add 2 tbsp mustard oil, 1 chopped onion, 2 chopped green chilies, 2 tbsp chopped coriander, 1 minced garlic clove, salt, and a squeeze of lemon. Mix well.",
      "MAKE ALOO CHOKHA: Boil 3 medium potatoes until soft. Peel and mash roughly. Add 2 tbsp mustard oil, 1 chopped onion, 2 chopped green chilies, salt, and chopped coriander. Mix well, keeping it chunky.",
      "SERVE: Dip each hot litti generously in ghee or mustard oil. Serve with baingan chokha, aloo chokha, and green chutney. The authentic way is to break open the litti and dip it in the chokha with each bite."
    ] 
  },
  { 
    id: 7, 
    title: "Pesarattu", 
    cuisine: "Andhra", 
    course: "Breakfast", 
    imageKeyword: "dosa", 
    time: "30 mins", 
    difficulty: "Medium", 
    ingredients: ["Green Moong Dal", "Ginger", "Chili", "Onion"], 
    instructions: [
      "SOAK THE MOONG DAL: Wash 1 cup whole green moong dal (with skin) thoroughly. Soak in plenty of water for 4-6 hours or overnight. The dal should soften but not sprout.",
      "GRIND THE BATTER: Drain the soaked moong dal. Add to a blender with 2-3 green chilies, 1-inch piece of ginger, and 1/2 tsp cumin seeds. Grind to a smooth batter, adding water gradually (about 1/2 cup). The batter should be thinner than dosa batter but not watery. Add salt to taste. Unlike regular dosa, this batter doesn't need fermentation.",
      "PREPARE UPMA (OPTIONAL FILLING): Heat 2 tbsp oil in a pan. Add 1/2 tsp mustard seeds, 1/2 tsp cumin seeds, and let them splutter. Add 1 chopped onion, curry leaves, and sauté until translucent. Add 1/2 cup rava (semolina) and roast for 2-3 minutes. Add 1 cup water, salt, and cook until thick. This upma is traditionally served inside the pesarattu.",
      "HEAT THE TAWA: Heat a cast iron or non-stick tawa over medium-high heat. The tawa should be well-seasoned. Sprinkle a few drops of water - if they sizzle and evaporate, the tawa is ready. Wipe with an oiled cloth.",
      "SPREAD THE PESARATTU: Give the batter a good stir. Pour a ladleful onto the center of the hot tawa. Unlike dosa, spread pesarattu by pressing and spreading with the back of the ladle in quick circular motions. Make it slightly thicker than a dosa, about 7-8 inches in diameter.",
      "ADD TOPPINGS: While the top is still wet, sprinkle finely chopped onions, minced ginger, and more green chilies if desired. Press them gently into the batter.",
      "COOK UNTIL CRISPY: Drizzle 1 tsp oil around the edges and on top. Cook on medium heat until the bottom is golden and crispy and the edges start lifting (3-4 minutes). You can flip it briefly if you want both sides cooked, but traditionally only one side is cooked.",
      "SERVE: Place a spoonful of upma in the center and fold the pesarattu in half. Serve immediately with ginger chutney (allam pachadi) and coconut chutney. The combination of the protein-rich green moong with the upma makes it a complete meal."
    ] 
  },
  { 
    id: 8, 
    title: "Vada Pav", 
    cuisine: "Maharashtrian", 
    course: "Snack", 
    imageKeyword: "samosa", 
    time: "40 mins", 
    difficulty: "Medium", 
    ingredients: ["Potato", "Besan", "Garlic", "Pav", "Mustard Seeds"], 
    instructions: [
      "PREPARE THE FILLING: Boil 500g potatoes until completely soft. Peel and mash while still warm, ensuring no lumps. Keep aside.",
      "MAKE THE TEMPERING: Heat 3 tbsp oil in a pan. Add 1 tsp mustard seeds and let them splutter. Add a generous pinch of hing (asafoetida), 8-10 curry leaves, 4-5 minced garlic cloves, 1 inch grated ginger, and 3-4 chopped green chilies. Sauté for 1 minute.",
      "SEASON THE POTATOES: Add 1/2 tsp turmeric powder to the tempering and immediately add the mashed potatoes. Mix well. Add salt to taste, 2 tbsp chopped coriander, and a squeeze of lemon juice. The mixture should be flavorful and slightly tangy. Let it cool.",
      "SHAPE THE VADAS: Divide the potato mixture into 8 equal portions. Shape each into a smooth round ball, slightly flattened - about 2 inches in diameter. Place on a plate and refrigerate for 15 minutes to firm up.",
      "PREPARE THE BATTER: In a bowl, mix 1 cup besan with 1/4 tsp turmeric, 1/2 tsp red chili powder, a pinch of hing, and salt. Gradually add water to make a thick, smooth batter that coats the back of a spoon. Add 1/4 tsp baking soda just before frying for extra crispiness.",
      "MAKE DRY GARLIC CHUTNEY: Grind together 8-10 dried red chilies, 4-5 garlic cloves, 2 tbsp desiccated coconut, 1 tbsp roasted peanuts, and salt. This should be a dry, coarse powder.",
      "FRY THE VADAS: Heat oil for deep frying to 175°C. Dip each potato ball in the besan batter, ensuring complete coating. Gently slide into hot oil. Fry 2-3 at a time until golden brown and crispy on all sides (3-4 minutes). Drain on paper towels.",
      "ASSEMBLE VAV PAV: Slice pav horizontally without cutting through completely. Spread dry garlic chutney on both cut sides. Add a green chutney layer if desired. Place a hot vada in the center. Add a fried green chili on the side. Press gently and serve immediately with extra chutneys."
    ] 
  },
  { 
    id: 9, 
    title: "Rogan Josh", 
    cuisine: "Kashmiri", 
    course: "Dinner", 
    imageKeyword: "curry", 
    time: "80 mins", 
    difficulty: "Hard", 
    ingredients: ["Mutton", "Yogurt", "Fennel", "Kashmiri Chili"], 
    instructions: [
      "PREPARE THE MEAT: Wash 750g mutton (preferably with bone) and pat dry. Cut into 2-inch pieces. Bring meat to room temperature before cooking.",
      "MAKE KASHMIRI SPICE MIX: Dry roast and grind together 2 black cardamom pods, 4 green cardamom pods, 6 cloves, 1-inch cinnamon stick, 1 tsp fennel seeds, and 1/2 tsp black peppercorns to a fine powder.",
      "PREPARE KASHMIRI CHILI PASTE: Soak 8-10 whole Kashmiri red chilies in warm water for 20 minutes. Grind to a smooth paste with a little water. This gives the dish its signature red color without excessive heat.",
      "BLOOM THE SPICES: Heat 1/4 cup mustard oil in a heavy-bottomed pot until smoking, then let it cool slightly. Add 2 bay leaves, 2 black cardamom pods, and 4-5 cloves. Let them sizzle for 30 seconds.",
      "BROWN THE MEAT: Add the mutton pieces in a single layer and sear on high heat without stirring for 3-4 minutes until browned. Flip and brown the other side. Do this in batches if needed. Remove and set aside.",
      "BUILD THE BASE: In the same pot, add 1/2 cup whisked yogurt (at room temperature to prevent curdling). Stir continuously on medium heat for 5-6 minutes until the yogurt reduces and oil starts to separate.",
      "ADD SPICES AND MEAT: Add the Kashmiri chili paste and sauté for 2 minutes. Add 2 tsp fennel powder, 1 tsp dry ginger powder, and the ground spice mix. Sauté for 1 minute. Return the browned meat to the pot and coat well with the spices.",
      "SLOW COOK: Add 2 cups hot water, salt to taste, and bring to a boil. Reduce heat to low, cover with a tight lid, and simmer for 60-75 minutes until the meat is fall-off-the-bone tender. Stir occasionally and add more water if needed.",
      "FINISH AND SERVE: The gravy should be thick and coating the meat, with a layer of red oil on top. Sprinkle 1/2 tsp garam masala and 1 tsp fennel powder. Serve hot with steamed rice or naan, garnished with fresh coriander."
    ] 
  },
  { 
    id: 10, 
    title: "Dhokla", 
    cuisine: "Gujarati", 
    course: "Snack", 
    imageKeyword: "dessert", 
    time: "30 mins", 
    difficulty: "Medium", 
    ingredients: ["Besan", "Yogurt", "Eno", "Mustard Seeds"], 
    instructions: [
      "PREPARE THE BATTER: In a large bowl, combine 1.5 cups besan (gram flour) with 1/2 cup yogurt and 1/2 cup water. Whisk until smooth with no lumps. Add 1 tsp sugar, 1/2 tsp turmeric, 1 tbsp ginger-green chili paste, 2 tbsp oil, and salt to taste. Mix well.",
      "CHECK BATTER CONSISTENCY: The batter should be of pouring consistency - not too thick, not too thin. If too thick, add a little more water. Let the batter rest for 10-15 minutes.",
      "PREPARE THE STEAMER: Set up a steamer or use a large pot with a stand. Grease a 7-inch round or square cake tin with oil. Bring the water in the steamer to a rolling boil.",
      "ADD RISING AGENT: Just before steaming, add 1 heaped tsp Eno fruit salt (or 1/2 tsp baking soda mixed with 1 tsp lemon juice) to the batter. Stir quickly in one direction only - the batter will become frothy and increase in volume. Work quickly as the reaction starts immediately.",
      "STEAM THE DHOKLA: Immediately pour the frothy batter into the greased tin. Place in the steamer and cover with a lid. Steam on high heat for 15-18 minutes. Check doneness by inserting a toothpick - it should come out clean. The dhokla should feel spongy when pressed.",
      "PREPARE THE TEMPERING: While dhokla steams, heat 3 tbsp oil in a small pan. Add 1 tsp mustard seeds and let them splutter. Add 1 tbsp sesame seeds, 2-3 slit green chilies, 8-10 curry leaves, and a pinch of hing. Sauté for 30 seconds.",
      "MAKE THE TEMPERING WATER: Add 1/4 cup water, 1 tsp sugar, and salt to the tempering. Bring to a boil and remove from heat.",
      "TEMPER THE DHOKLA: Once steamed, let dhokla cool for 5 minutes in the tin. Cut into squares or diamonds while still in the tin. Pour the tempering mixture evenly over the dhokla pieces, allowing them to absorb the liquid.",
      "GARNISH AND SERVE: Transfer to a serving plate. Garnish generously with fresh coriander and freshly grated coconut. Serve with green chutney and tamarind chutney. Can be enjoyed warm or at room temperature."
    ] 
  },
  { 
    id: 11, 
    title: "Fish Curry", 
    cuisine: "Goan", 
    course: "Dinner", 
    imageKeyword: "fish", 
    time: "40 mins", 
    difficulty: "Medium", 
    ingredients: ["Fish", "Coconut", "Tamarind", "Chili"], 
    instructions: [
      "PREPARE THE FISH: Take 500g firm fish (pomfret, kingfish, or surmai), clean and cut into 2-inch pieces. Apply 1/2 tsp turmeric and 1/2 tsp salt. Keep aside for 15 minutes.",
      "SOAK TAMARIND: Soak a small lemon-sized ball of tamarind in 1/2 cup warm water for 15 minutes. Squeeze and extract the pulp, discarding the fibers.",
      "MAKE THE COCONUT PASTE: In a blender, combine 1 cup freshly grated coconut (or 3/4 cup desiccated coconut soaked in warm water), 8-10 dried Kashmiri red chilies (soaked in warm water), 1 tsp cumin seeds, 8-10 black peppercorns, 6-8 garlic cloves, and 1/2 tsp turmeric. Grind to a smooth paste adding water as needed.",
      "COOK THE MASALA: Heat 2 tbsp coconut oil in a clay pot or heavy pan. Add 1 medium onion (finely sliced) and sauté until soft and light golden, about 5-6 minutes. You can skip this step for a more authentic taste.",
      "ADD COCONUT PASTE: Add the ground coconut paste to the pan and sauté for 4-5 minutes on medium heat, stirring constantly. The raw smell should go away and the paste will start releasing oil.",
      "ADD LIQUID: Pour in 1.5 cups water and the tamarind pulp. Add salt to taste and bring to a gentle boil. The gravy should be of coating consistency - not too thick, not too thin.",
      "COOK THE FISH: Once the gravy is simmering, gently slide in the fish pieces in a single layer. Spoon some gravy over the fish. DO NOT STIR - this will break the fish. Just shake the pan gently occasionally.",
      "SIMMER: Cover and cook on low heat for 10-12 minutes until the fish is cooked through. The flesh should be opaque and flake easily. Adjust seasoning - the curry should be tangy, spicy, and slightly sweet from the coconut.",
      "REST AND SERVE: Turn off the heat and let the curry rest for 5-10 minutes - this allows the fish to absorb flavors. Serve hot with steamed rice. The curry tastes even better the next day!"
    ] 
  },
  { 
    id: 12, 
    title: "Pani Puri", 
    cuisine: "Street Food", 
    course: "Snack", 
    imageKeyword: "samosa", 
    time: "60 mins", 
    difficulty: "Hard", 
    ingredients: ["Suji", "Mint", "Tamarind", "Potato"], 
    instructions: [
      "MAKE PURI DOUGH: Combine 1 cup fine semolina (sooji/rava) with 2 tbsp maida, 1/4 tsp baking soda, and a pinch of salt. Add water gradually (about 1/4 cup) to form a very stiff dough. Knead vigorously for 10-15 minutes until smooth and elastic. Cover with a damp cloth and rest for 30 minutes.",
      "MAKE GREEN PANI (PUDINA PANI): Blend together 2 cups fresh mint leaves, 1 cup coriander leaves, 4-5 green chilies, 1-inch ginger, 6-8 garlic cloves, 1 tsp cumin powder, 1 tsp chaat masala, 1 tsp black salt (kala namak), 1 tbsp tamarind paste, juice of 2 lemons, salt to taste, and 2 cups cold water. Strain through a fine sieve. The pani should be intensely flavorful - adjust spices as needed. Chill in the refrigerator.",
      "MAKE SWEET TAMARIND CHUTNEY: Soak 100g tamarind in 1 cup warm water for 20 minutes. Extract the pulp and strain. Cook the pulp with 1/2 cup jaggery, 1 tsp roasted cumin powder, 1/2 tsp red chili powder, 1/2 tsp black salt, and regular salt. Simmer until thick enough to coat the back of a spoon. Cool completely.",
      "PREPARE THE FILLING: Boil 3 medium potatoes and 1/2 cup white peas (safed matar) until soft. Peel and mash the potatoes coarsely. Mix with the peas. Season with 1 tsp chaat masala, 1/2 tsp red chili powder, 1/2 tsp cumin powder, salt, and 2 tbsp chopped coriander.",
      "ROLL AND CUT PURIS: Divide the rested dough into small portions. Roll each as thin as possible (almost translucent) on a lightly floured surface. Cut into 2-inch circles using a cookie cutter or small bowl. Gather scraps and re-roll.",
      "FRY THE PURIS: Heat oil to 180°C. The oil temperature is crucial - too hot and they won't puff, too cold and they'll be oily. Slide 4-5 puris at a time into the oil. They should sink first, then float up and puff. Press gently with a slotted spoon to encourage puffing. Fry until crisp and pale golden (about 30-40 seconds). Drain on paper towels.",
      "ASSEMBLE: Tap the center of each puri to create a hole. Fill with a spoonful of potato-pea filling. Top with a little sweet chutney. Fill with cold spicy green pani just before eating.",
      "SERVE: Serve immediately after filling. Provide extra puris, filling, chutneys, and pani on the side so everyone can make their own. The puris should be crispy, the filling soft, and the pani ice-cold and tangy!"
    ] 
  },
  { 
    id: 13, 
    title: "Gajar Halwa", 
    cuisine: "North Indian", 
    course: "Dessert", 
    imageKeyword: "dessert", 
    time: "60 mins", 
    difficulty: "Medium", 
    ingredients: ["Carrot", "Milk", "Sugar", "Ghee", "Nuts"], 
    instructions: [
      "GRATE THE CARROTS: Wash and peel 1 kg carrots (preferably the red/pink Delhi variety). Grate using the fine holes of a grater. The finer the grate, the smoother the halwa.",
      "COOK IN MILK: In a heavy-bottomed pan or kadai, combine the grated carrots with 1 liter full-fat milk. Bring to a boil, then reduce heat to medium. Cook uncovered, stirring frequently, until the milk is completely absorbed. This takes about 30-35 minutes.",
      "THE KEY TO GOOD HALWA: Keep stirring every few minutes to prevent sticking. Scrape the sides of the pan to incorporate the milk solids (mawa) that form there - this adds to the richness. The carrots will reduce significantly and turn a deeper color.",
      "ADD GHEE: Once all the milk is absorbed, add 4 tbsp ghee. Increase heat to medium-high and sauté the carrot mixture for 8-10 minutes. The halwa will start to leave the sides of the pan.",
      "ADD SUGAR: Add 3/4 cup sugar (adjust to taste). The mixture will become wet again as sugar melts. Continue cooking and stirring until the sugar is fully incorporated and the mixture thickens again, about 8-10 minutes.",
      "PREPARE NUTS: While the halwa cooks, heat 1 tbsp ghee in a small pan. Fry 2 tbsp cashew halves, 2 tbsp raisins, and 2 tbsp sliced almonds until golden. Set aside.",
      "ADD AROMATICS: Once the halwa reaches a thick, glistening consistency and starts to leave the pan, add 1/2 tsp cardamom powder. Mix well.",
      "FINISH AND GARNISH: Fold in most of the fried nuts, reserving some for garnish. Cook for another 2 minutes. Transfer to a serving dish and top with remaining nuts and a few saffron strands (optional).",
      "SERVE: Gajar halwa can be served warm or chilled. For extra indulgence, top with a scoop of vanilla ice cream or a dollop of clotted cream (malai). Refrigerated halwa keeps for up to a week."
    ] 
  },
  { 
    id: 14, 
    title: "Samosa", 
    cuisine: "North Indian", 
    course: "Snack", 
    imageKeyword: "samosa", 
    time: "60 mins", 
    difficulty: "Hard", 
    ingredients: ["Maida", "Potato", "Peas", "Ajwain"], 
    instructions: [
      "MAKE THE DOUGH: In a bowl, combine 2 cups maida, 1/2 tsp salt, and 1/2 tsp ajwain (carom seeds). Add 4 tbsp hot oil/ghee and rub into the flour until it resembles breadcrumbs. Gradually add cold water (about 1/2 cup) to form a stiff dough. Knead for 5-6 minutes until smooth. Cover and rest for 30 minutes.",
      "PREPARE THE FILLING: Boil 4 medium potatoes until soft. Peel and crumble (don't mash smooth - texture is important). Boil 1/2 cup green peas until tender. Set both aside.",
      "MAKE THE TEMPERING: Heat 3 tbsp oil in a pan. Add 1 tsp cumin seeds, let them splutter. Add 1 tsp fennel seeds and 1/4 tsp hing. Add 1-inch grated ginger and 2-3 chopped green chilies. Sauté for 1 minute.",
      "SPICE THE FILLING: Add 1 tsp coriander powder, 1/2 tsp garam masala, 1/2 tsp red chili powder, 1/2 tsp amchur (dry mango powder), and salt. Add the crumbled potatoes and peas. Mix well and cook for 4-5 minutes. Add 2 tbsp chopped coriander. Let the filling cool completely before filling.",
      "SHAPE SAMOSAS: Divide dough into 8 balls. Roll each ball into an oval about 6-7 inches long. Cut in half to get two semi-circles. Take one semi-circle, moisten the straight edge with water, and form a cone by overlapping the straight edges. Seal well.",
      "FILL AND SEAL: Hold the cone and fill with 2 tbsp of filling, leaving space at the top. Don't overfill. Moisten the inside edges of the opening and pinch together to seal, creating the triangular shape. Ensure there are no cracks.",
      "REST BEFORE FRYING: Place shaped samosas on a tray and let them rest for 15 minutes. This helps the seal set and prevents them from opening while frying.",
      "FRY SAMOSAS: Heat oil for deep frying to 160°C (lower than usual). Slide in samosas and fry on medium-low heat for 8-10 minutes, turning occasionally, until golden brown and crispy. The slow frying ensures the outer layer becomes flaky and the inside cooks through.",
      "SERVE: Drain on paper towels. Serve hot with tamarind chutney, mint chutney, and sliced onions. The outer shell should be crispy and flaky, the filling well-spiced and aromatic."
    ] 
  },
  { 
    id: 15, 
    title: "Dal Makhani", 
    cuisine: "Punjabi", 
    course: "Dinner", 
    imageKeyword: "curry", 
    time: "120 mins", 
    difficulty: "Hard", 
    ingredients: ["Urad Dal", "Kidney Beans", "Butter", "Cream", "Tomato"], 
    instructions: [
      "SOAK THE LENTILS: Wash and soak 1 cup whole black urad dal and 1/4 cup rajma (kidney beans) together in plenty of water overnight or for at least 8 hours.",
      "PRESSURE COOK: Drain and add the soaked lentils to a pressure cooker with 4 cups water and 1/2 tsp salt. Pressure cook for 6-7 whistles on high, then on low for 15 minutes. The dal should be completely soft and mushy, rajma should be easily mashable.",
      "PREPARE TOMATO PUREE: Blend 4 medium tomatoes to a smooth puree. This fresh tomato base is essential for authentic flavor.",
      "MAKE THE BASE: In a heavy-bottomed pot, heat 3 tbsp butter. Add 1 large onion (finely chopped) and sauté until deep golden brown, about 12-15 minutes. This caramelization adds sweetness and depth.",
      "ADD AROMATICS: Add 1 tbsp ginger-garlic paste and sauté for 2 minutes until raw smell disappears. Add the tomato puree and cook on medium heat for 10-12 minutes until thick and oil starts to separate.",
      "ADD SPICES: Add 1 tsp red chili powder, 1/2 tsp garam masala, 1/4 tsp turmeric, and salt to taste. Cook for 2 minutes.",
      "COMBINE AND SLOW COOK: Add the cooked dal to the tomato mixture along with 1 cup water. Mash some dal against the sides for creaminess. Add 2 tbsp butter. This is where patience comes in - simmer on the lowest heat for at least 1 hour, stirring every 10-15 minutes.",
      "THE RESTAURANT SECRET: As it cooks, keep adding small amounts of water if it gets too thick, and additional butter. The long cooking time on low heat is what transforms this into restaurant-style dal makhani. The color deepens and flavors intensify.",
      "FINISH WITH CREAM: In the last 15 minutes, add 1/4 cup cream and 2 tbsp crushed kasuri methi (dried fenugreek leaves). Stir well and let it simmer.",
      "SERVE: Adjust seasoning. Transfer to a serving bowl, top with a generous swirl of cream, a pat of butter, and a sprinkle of kasuri methi. Serve with hot naan or jeera rice. The dal should be rich, creamy, and deeply flavored."
    ] 
  },
  { 
    id: 16, 
    title: "Masala Chai", 
    cuisine: "Indian", 
    course: "Beverage", 
    imageKeyword: "tea", 
    time: "10 mins", 
    difficulty: "Easy", 
    ingredients: ["Milk", "Tea Powder", "Ginger", "Cardamom", "Sugar"], 
    instructions: [
      "PREPARE SPICES: Lightly crush 2 green cardamom pods and 1/2 inch fresh ginger (or grate it). You can also add 2-3 black peppercorns and a small piece of cinnamon for extra flavor.",
      "BOIL WATER WITH SPICES: In a saucepan, add 1 cup water and all the crushed/grated spices. Bring to a boil and let it simmer for 2-3 minutes to extract the flavors from the spices.",
      "ADD TEA LEAVES: Add 2 heaped tsp of strong tea leaves (Assam tea works best for chai). Boil for another minute until the water turns dark.",
      "ADD SUGAR: Add 2-3 tsp sugar (adjust to taste). Let it dissolve completely. Adding sugar at this stage allows it to blend better with the tea.",
      "ADD MILK: Pour in 1 cup milk. Bring to a boil, watching carefully as milk tends to overflow quickly.",
      "THE BOILING TECHNIQUE: Once it rises, reduce heat and let it simmer. Then increase heat again and let it rise. Repeat this 2-3 times. This makes the chai thick and frothy, and ensures the tea is well-brewed.",
      "SIMMER: Let the chai simmer on low heat for 2-3 minutes. The longer it simmers, the stronger the flavor. The chai should turn a beautiful tan/caramel color.",
      "STRAIN AND SERVE: Strain the chai into cups using a fine mesh strainer. The chai should be hot, aromatic, and have a perfect balance of spice, sweetness, and tea flavor. Serve immediately with biscuits or snacks."
    ] 
  },
  { 
    id: 17, 
    title: "Aloo Paratha", 
    cuisine: "North Indian", 
    course: "Breakfast", 
    imageKeyword: "paratha", 
    time: "40 mins", 
    difficulty: "Medium", 
    ingredients: ["Wheat Flour", "Potato", "Green Chili", "Butter"], 
    instructions: [
      "MAKE THE DOUGH: In a bowl, combine 2 cups whole wheat flour with 1/2 tsp salt. Gradually add water (about 3/4 cup) to form a soft, pliable dough. Knead for 5-6 minutes until smooth. The dough should be softer than roti dough. Cover and rest for 20 minutes.",
      "PREPARE THE FILLING: Boil 3 large potatoes until completely soft. Peel while still warm and mash thoroughly - no lumps should remain.",
      "SEASON THE FILLING: To the mashed potatoes, add 2-3 finely chopped green chilies, 1 tsp cumin powder, 1/2 tsp red chili powder, 1/2 tsp amchur (dry mango powder), 1/2 tsp garam masala, 2 tbsp finely chopped coriander, 1 small onion (finely chopped - optional), and salt to taste. Mix well. The filling should be flavorful but not wet.",
      "DIVIDE AND SHAPE: Divide the dough into 8 equal balls. Divide the potato filling into 8 portions. Take one dough ball and roll into a small circle (about 4 inches).",
      "STUFF THE PARATHA: Place one portion of filling in the center of the rolled dough. Bring all edges together to enclose the filling, pinch to seal. Flatten the stuffed ball gently with your palm, dust with flour.",
      "ROLL CAREFULLY: Using gentle pressure, roll the stuffed ball into a circle about 7-8 inches in diameter. Be careful not to press too hard or the filling will burst out. If it tears, patch it up and continue.",
      "COOK ON TAWA: Heat a tawa/griddle over medium-high heat. Place the paratha and cook for 30 seconds until light brown spots appear. Flip and cook the other side.",
      "ADD GHEE/BUTTER: Apply ghee or butter generously on the cooked side. Flip again and apply ghee on the other side too. Press the edges gently with a spatula to ensure even cooking. Cook until both sides have golden-brown spots.",
      "SERVE HOT: Serve immediately with a dollop of butter, yogurt, pickle, and a side of onion slices. The paratha should be crispy on the outside with a soft, flavorful filling inside."
    ] 
  },
  { 
    id: 18, 
    title: "Poha", 
    cuisine: "Maharashtrian", 
    course: "Breakfast", 
    imageKeyword: "rice", 
    time: "20 mins", 
    difficulty: "Easy", 
    ingredients: ["Poha", "Onion", "Potato", "Peanuts", "Turmeric"], 
    instructions: [
      "RINSE THE POHA: Take 2 cups thick poha (flattened rice) in a colander. Rinse gently under running water for about 30 seconds. The poha should be moist but not soggy. Sprinkle 1/2 tsp salt and 1/4 tsp turmeric over it. Toss gently and set aside for 5 minutes.",
      "PREPARE INGREDIENTS: Dice 1 medium potato into small cubes. Finely chop 1 large onion. Slit 2-3 green chilies. Keep curry leaves and coriander ready.",
      "FRY PEANUTS: Heat 3 tbsp oil in a pan. Add 1/4 cup raw peanuts and fry until golden and crunchy. Remove and set aside.",
      "MAKE THE TEMPERING: In the same oil, add 1 tsp mustard seeds. When they splutter, add 1/2 tsp cumin seeds. Then add 10-12 curry leaves (be careful, they will splutter), and the slit green chilies.",
      "COOK POTATOES: Add the diced potatoes and a pinch of salt. Cover and cook on medium heat for 5-6 minutes, stirring occasionally, until potatoes are cooked through and slightly crispy on edges.",
      "ADD ONIONS: Add the chopped onions and sauté for 2-3 minutes until they turn translucent. Don't brown them.",
      "ADD POHA: Add the rinsed poha to the pan. Add 1/2 tsp sugar (this is the secret ingredient that balances the flavors). Gently fold everything together using a flat spatula. Be gentle to avoid breaking the poha.",
      "STEAM AND SERVE: Sprinkle 2-3 tbsp water if the poha seems dry. Cover and cook on low heat for 2-3 minutes. Remove lid and add the fried peanuts and 2 tbsp fresh coriander. Give a final gentle mix.",
      "GARNISH AND SERVE: Serve hot, garnished with more coriander, a squeeze of lemon juice, some sev (optional), and freshly grated coconut. Serve with a side of jalebi for the classic Indori combination!"
    ] 
  },
  { 
    id: 19, 
    title: "Malai Kofta", 
    cuisine: "Mughlai", 
    course: "Dinner", 
    imageKeyword: "curry", 
    time: "60 mins", 
    difficulty: "Hard", 
    ingredients: ["Paneer", "Potato", "Cream", "Cashew", "Tomato"], 
    instructions: [
      "MAKE KOFTA MIXTURE: Grate 200g paneer and 2 boiled potatoes finely. Add 2 tbsp cornflour, 1/4 tsp cardamom powder, salt, 1 tbsp finely chopped coriander, and 1 tbsp raisins and cashew pieces. Mix well to form a smooth, binding dough.",
      "SHAPE THE KOFTAS: Divide the mixture into 12 equal portions. Roll each into a smooth ball. Optionally, stuff each ball with a small piece of cashew or a raisin for a surprise center.",
      "FRY THE KOFTAS: Heat oil for deep frying to 170°C. Fry koftas in batches until golden brown all over (3-4 minutes). Don't overcrowd the pan. Drain on paper towels. IMPORTANT: Add koftas to gravy just before serving or they become soggy.",
      "MAKE CASHEW-ONION PASTE: Heat 1 tbsp ghee in a pan. Add 1 sliced onion and 15-20 cashews. Sauté until onions are golden and cashews are slightly browned. Cool and grind to a smooth paste with a little water.",
      "PREPARE TOMATO PUREE: Blanch 4 medium tomatoes, peel, and blend to a smooth puree.",
      "COOK THE GRAVY: Heat 3 tbsp ghee in a heavy pan. Add 1 tsp cumin seeds. Once they splutter, add 1 tbsp ginger-garlic paste and sauté for 1 minute. Add the tomato puree and cook for 8-10 minutes until oil separates.",
      "ADD PASTES AND SPICES: Add the cashew-onion paste, 1/2 tsp turmeric, 1 tsp red chili powder, 1 tsp coriander powder, and salt. Mix well and cook for 5 minutes.",
      "MAKE IT CREAMY: Add 1/2 cup cream and 1/2 cup water. Simmer for 10 minutes. Add 1/2 tsp garam masala, 1/4 tsp cardamom powder, and 1 tsp kasuri methi (crushed). Adjust salt and consistency.",
      "SERVE: Just before serving, gently place the koftas in the hot gravy or serve gravy and koftas separately. Garnish with cream and coriander. Serve immediately with naan or rice."
    ] 
  },
  { 
    id: 20, 
    title: "Pav Bhaji", 
    cuisine: "Street Food", 
    course: "Dinner", 
    imageKeyword: "curry", 
    time: "45 mins", 
    difficulty: "Medium", 
    ingredients: ["Potato", "Cauliflower", "Peas", "Butter", "Pav"], 
    instructions: [
      "BOIL THE VEGETABLES: Roughly chop 3 medium potatoes, 1/2 small cauliflower, and 1 medium carrot. Boil together with 1/2 cup green peas until completely soft. Drain and mash together coarsely while still hot.",
      "PREPARE ONION-TOMATO: Finely chop 2 large onions and 3 medium tomatoes. Also chop 1 capsicum into small pieces.",
      "COOK THE BASE: In a large flat pan (tawa) or kadai, heat 4 tbsp butter. Add the chopped onions and sauté until golden brown, about 8-10 minutes. Add 1 tbsp ginger-garlic paste and cook for 2 minutes.",
      "ADD TOMATOES AND CAPSICUM: Add the chopped tomatoes and capsicum. Cook until tomatoes turn mushy and oil separates, about 6-8 minutes. Mash the tomatoes with the back of your spatula as they cook.",
      "ADD SPICES: Add 3 tbsp pav bhaji masala (this is the key!), 1 tsp red chili powder, 1/2 tsp turmeric, and salt to taste. Cook for 2-3 minutes until fragrant.",
      "ADD VEGETABLES: Add the mashed vegetables to the pan. Mix well with the masala base. Add 1 cup water and let it simmer.",
      "THE MASHING TECHNIQUE: Using a potato masher or the back of a flat ladle, continuously mash and mix the bhaji on the tawa. This is what gives pav bhaji its characteristic smooth-chunky texture. Add more butter as you go.",
      "ADJUST CONSISTENCY: Add water as needed to get your desired consistency - it should be thick but not dry. Cook for 10-15 minutes, continuously mashing and stirring. Add 2 tbsp more butter.",
      "PREPARE THE PAV: Slice pavs horizontally. Heat butter on a flat tawa and toast the pavs until golden and crispy on the cut sides.",
      "SERVE: Transfer bhaji to a serving dish. Top with a large dollop of butter, chopped onions, coriander, and a squeeze of lemon. Serve with hot buttered pav and extra sliced onions and lemon wedges on the side."
    ] 
  },
  // South Indian Filter Coffee
  {
    id: 21,
    title: 'South Indian Filter Coffee',
    cuisine: 'South Indian',
    course: 'Beverage',
    imageKeyword: 'filtercoffee',
    time: '10 mins',
    difficulty: 'Easy',
    ingredients: [
      '2 tbsp coffee powder (filter coffee blend)',
      '1 cup water',
      '1 cup milk',
      '2–3 tsp sugar',
    ],
    instructions: [
      'Add 2 tbsp filter coffee powder to the top chamber of the coffee filter and press gently with the plunger.',
      'Pour 1 cup boiling water into the top chamber, cover and let it drip for 5–7 minutes until thick decoction collects in the bottom chamber.',
      'Bring 1 cup milk to a gentle boil on low heat (2–3 minutes), then simmer for 1 minute.',
      'In a tumbler, mix 1/4 cup decoction with hot milk and 2–3 tsp sugar (adjust to taste).',
      'Pour coffee between tumbler and davara 3–4 times to froth, then serve immediately.',
    ],
  },
  // Iced Cold Coffee
  {
    id: 22,
    title: 'Iced Cold Coffee',
    cuisine: 'Indian',
    course: 'Beverage',
    imageKeyword: 'coldcoffee',
    time: '8 mins',
    difficulty: 'Easy',
    ingredients: [
      '1.5 cups chilled milk',
      '2 tbsp instant coffee powder',
      '2 tbsp sugar',
      '4–5 ice cubes',
      '1 tbsp chocolate syrup (optional)',
    ],
    instructions: [
      'In a small bowl, mix 2 tbsp instant coffee powder with 2 tbsp hot water to make a smooth concentrate.',
      'Add coffee concentrate, 2 tbsp sugar and 1.5 cups chilled milk to a blender jar.',
      'Blend for 30–40 seconds until frothy.',
      'Drizzle chocolate syrup along the inside of serving glasses if using.',
      'Add 2–3 ice cubes to each glass, pour the cold coffee and serve immediately.',
    ],
  },
  // Badam Milk
  {
    id: 23,
    title: 'Badam Milk',
    cuisine: 'Indian',
    course: 'Beverage',
    imageKeyword: 'milkshake',
    time: '20 mins',
    difficulty: 'Medium',
    ingredients: [
      '15–20 almonds',
      '2 cups milk',
      '3–4 tsp sugar',
      '2–3 strands saffron',
      '1/4 tsp cardamom powder',
    ],
    instructions: [
      'Soak 15–20 almonds in hot water for 10 minutes, peel the skins and set aside.',
      'Blend peeled almonds with 1/4 cup milk into a smooth paste (about 1 minute).',
      'In a saucepan, heat 2 cups milk on low flame for 3–4 minutes, then add almond paste.',
      'Stir continuously for 4–5 minutes until slightly thickened, then add 3–4 tsp sugar, saffron and 1/4 tsp cardamom powder.',
      'Simmer for another 2 minutes, switch off and serve warm or chilled.',
    ],
  },
  // Mango Lassi
  {
    id: 24,
    title: 'Mango Lassi',
    cuisine: 'North Indian',
    course: 'Beverage',
    imageKeyword: 'lassi',
    time: '10 mins',
    difficulty: 'Easy',
    ingredients: [
      '1 ripe mango (or 1 cup mango pulp)',
      '1 cup thick yogurt',
      '1/2 cup chilled water or milk',
      '2–3 tsp sugar or honey',
      'A pinch of cardamom powder',
    ],
    instructions: [
      'Peel and chop 1 ripe mango into small cubes.',
      'Add mango, 1 cup thick yogurt, 1/2 cup chilled water or milk and 2–3 tsp sugar/honey to a blender.',
      'Blend for 30–40 seconds until smooth and creamy.',
      'Add a pinch of cardamom powder and blend once more for a few seconds.',
      'Pour into chilled glasses and garnish with a few mango pieces or chopped nuts.',
    ],
  },
  // Masala Chaas (Spiced Buttermilk)
  {
    id: 25,
    title: 'Masala Chaas (Buttermilk)',
    cuisine: 'Indian',
    course: 'Beverage',
    imageKeyword: 'chaas',
    time: '5 mins',
    difficulty: 'Easy',
    ingredients: [
      '1 cup thick yogurt',
      '2 cups chilled water',
      '1/4 tsp roasted cumin powder',
      '2 tbsp finely chopped coriander',
      '1 green chili (finely chopped, optional)',
      'Salt to taste',
    ],
    instructions: [
      'In a jug, whisk 1 cup yogurt with 2 cups chilled water for 1–2 minutes until smooth and slightly frothy.',
      'Add 1/4 tsp roasted cumin powder, salt to taste and 2 tbsp chopped coriander.',
      'Add finely chopped green chili if you like it spicy.',
      'Stir everything well and chill for 10–15 minutes if time permits.',
      'Serve in glasses, topped with a pinch more cumin powder and coriander.',
    ],
  },
];

// 2. Generator Configuration
const MAIN_INGREDIENTS = [
  "Paneer", "Chicken", "Mutton", "Aloo (Potato)", "Gobi (Cauliflower)", 
  "Mushroom", "Baby Corn", "Egg", "Fish", "Prawns", "Soya Chunks", 
  "Mixed Veg", "Bhindi (Okra)", "Baingan (Eggplant)", "Chana (Chickpeas)"
];

const COOKING_STYLES = [
  { 
    name: "Butter Masala", 
    cuisine: "North Indian", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Butter", "Tomato", "Cream"], 
    steps: [
      "Heat 2 tbsp butter in a pan. Add 1 chopped onion and sauté until golden brown (8-10 mins). Add 10 cashews and sauté for 2 mins.",
      "Add 1 tbsp ginger-garlic paste and cook for 2 mins until raw smell disappears.",
      "Add 2 cups tomato puree and cook on medium heat for 15-20 mins until oil separates. Cool and blend to smooth paste, strain for silky texture.",
      "Return gravy to pan. Add 1 tsp red chili powder, 1/2 tsp garam masala, 1 tsp sugar, and salt. Simmer 5 mins.",
      "Add cooked main ingredient to the gravy. Pour in 1/2 cup cream and stir gently.",
      "Crush 1 tbsp kasuri methi between palms and add. Simmer everything together for 5-7 mins.",
      "Finish with a pat of butter and swirl of cream. Serve hot with naan or rice."
    ] 
  },
  { 
    name: "Kadai", 
    cuisine: "North Indian", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Capsicum", "Onion", "Coriander Seeds"], 
    steps: [
      "Dry roast 2 tbsp coriander seeds and 6-8 dried red chilies until fragrant. Cool and grind to coarse powder (kadai masala).",
      "Heat 3 tbsp oil in a kadai or wok. Add 1 tsp cumin seeds, then add 2 cubed onions and sauté for 3-4 mins.",
      "Add 1 tbsp ginger-garlic paste, cook 2 mins. Add 2 chopped tomatoes and cook until mushy.",
      "Add 1 tsp turmeric, prepared kadai masala, and salt. Cook 3-4 mins until oil separates.",
      "Add your main ingredient and 1/4 cup water. Cover and cook until done.",
      "Add 1 cubed capsicum and 1 cubed onion (large pieces). Toss on high heat for 3-4 mins - veggies should be crisp.",
      "Garnish with fresh coriander and julienned ginger. Serve hot with roti."
    ] 
  },
  { 
    name: "Chettinad", 
    cuisine: "South Indian", 
    diff: "Hard", 
    type: "Curry", 
    extra: ["Coconut", "Curry Leaves", "Black Pepper"], 
    steps: [
      "Dry roast 2 tbsp coriander seeds, 1 tsp cumin, 1 tsp fennel, 1 tsp black pepper, 6 dried red chilies, and 2 tbsp grated coconut until fragrant.",
      "Cool and grind to fine paste with a little water. This is the Chettinad masala base.",
      "Heat 3 tbsp oil. Add 1 tsp mustard seeds, curry leaves, and 2 chopped onions. Sauté until golden.",
      "Add 1 tbsp ginger-garlic paste, cook 2 mins. Add 2 chopped tomatoes, cook until soft.",
      "Add the ground masala paste, 1/2 tsp turmeric, and salt. Cook 5-6 mins until oil separates.",
      "Add your main ingredient with 1 cup water. Cover and simmer until cooked through.",
      "Finish with fresh curry leaves fried in ghee. Adjust spice - Chettinad is meant to be bold and peppery!"
    ] 
  },
  { 
    name: "Kolhapuri", 
    cuisine: "Maharashtrian", 
    diff: "Hard", 
    type: "Curry", 
    extra: ["Sesame Seeds", "Dry Coconut", "Red Chili"], 
    steps: [
      "Dry roast: 2 tbsp dry coconut, 1 tbsp sesame seeds, 1 tbsp coriander seeds, 1 tsp cumin, 8-10 dry red chilies, 1 tsp poppy seeds until dark and fragrant.",
      "Grind roasted spices with 2 tbsp fried onion to a fine paste. This is Kolhapuri masala.",
      "Heat 3 tbsp oil. Add 2 finely chopped onions, sauté until deep brown (15 mins). Add 1 tbsp ginger-garlic paste.",
      "Add 2 chopped tomatoes, cook until completely broken down and oil separates.",
      "Add the Kolhapuri masala paste, 1/2 tsp turmeric, and salt. Cook 5 mins, adding water if needed.",
      "Add your main ingredient and 1 cup water. Cover and cook until done. The gravy should be thick and fiery red.",
      "Garnish with coriander. Serve with bhakri or chapati. Warning: This is SPICY!"
    ] 
  },
  { 
    name: "Korma", 
    cuisine: "Mughlai", 
    diff: "Hard", 
    type: "Curry", 
    extra: ["Yogurt", "Cashew", "Fried Onion"], 
    steps: [
      "Marinate main ingredient in 1/2 cup yogurt, 1 tsp ginger-garlic paste, 1/2 tsp turmeric, and salt for 1 hour.",
      "Fry 2 sliced onions until deep golden. Remove half for later. Blend remaining with 15 cashews and 1 tbsp poppy seeds into paste.",
      "Heat 3 tbsp ghee. Add 2 bay leaves, 4 cardamom pods, 4 cloves. Add onion-nut paste, cook 5 mins.",
      "Add marinated ingredient with marinade. Cook on medium until oil separates (10-15 mins).",
      "Add 1/4 cup warm water, cover and cook until done. Don't add too much water - korma should be rich.",
      "Add 1/4 cup cream, 1/2 tsp garam masala, and 1/4 tsp cardamom powder. Simmer 5 mins.",
      "Top with reserved fried onions and chopped coriander. Serve with biryani rice or naan."
    ] 
  },
  { 
    name: "Tikka Masala", 
    cuisine: "Punjabi", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Yogurt", "Tomato", "Cream"], 
    steps: [
      "Marinate main ingredient in 1/2 cup yogurt, 1 tbsp lemon juice, 2 tsp tikka masala, 1 tbsp ginger-garlic paste, and salt for 2+ hours.",
      "Thread on skewers or spread on baking tray. Grill/broil until charred (10-12 mins), turning once. Set aside.",
      "Heat 2 tbsp butter. Add 1 chopped onion, cook until soft. Add 1 tbsp ginger-garlic paste.",
      "Add 400g tomato puree, cook 15 mins until thick and oil separates. Blend and strain for smooth gravy.",
      "Return to pan. Add 1 tsp red chili, 1 tsp coriander powder, 1/2 tsp cumin, salt, and 1 tsp sugar.",
      "Add grilled ingredient pieces. Pour in 1/2 cup cream, add 1 tbsp kasuri methi. Simmer 5-7 mins.",
      "Finish with butter and cream swirl. Serve with garlic naan."
    ] 
  },
  { 
    name: "Pepper Fry", 
    cuisine: "South Indian", 
    diff: "Easy", 
    type: "Dry", 
    extra: ["Black Pepper", "Curry Leaves", "Fennel"], 
    steps: [
      "Season main ingredient with 1/2 tsp turmeric, salt, and cook/pan-fry until done. Set aside.",
      "Heat 3 tbsp oil. Add 1/2 tsp fennel seeds, 1/2 tsp cumin seeds, curry leaves. Let splutter.",
      "Add 2 sliced onions, sauté until edges brown (6-8 mins). Add 1 tbsp ginger-garlic paste.",
      "Add cooked ingredient back to pan. Add 2 tsp freshly crushed black pepper (the star!), salt to taste.",
      "Toss on high heat for 5-6 mins. The dish should be dry with the pepper coating every piece.",
      "Add more curry leaves and a squeeze of lemon. Serve hot as appetizer or side dish."
    ] 
  },
  { 
    name: "65", 
    cuisine: "South Indian", 
    diff: "Medium", 
    type: "Snack", 
    extra: ["Yogurt", "Red Chili", "Curry Leaves", "Corn Flour"], 
    steps: [
      "Cut main ingredient into bite-sized pieces. Marinate with 2 tbsp yogurt, 1 tbsp ginger-garlic paste, 1 tsp red chili powder, 1/2 tsp turmeric, salt, and 1 egg for 30 mins.",
      "Add 2 tbsp corn flour and 1 tbsp rice flour to marinated pieces. Mix well - batter should coat evenly.",
      "Heat oil to 175°C. Deep fry pieces in batches until golden and crispy (4-5 mins). Drain and set aside.",
      "In 2 tbsp oil, add 1 tsp mustard seeds, curry leaves, 2 slit green chilies, 1 sliced onion. Sauté 2 mins.",
      "Add fried pieces to the tempering. Toss on high heat for 1-2 mins.",
      "Sprinkle extra curry leaves and serve hot with onion rings and lemon wedges."
    ] 
  },
  { 
    name: "Do Pyaza", 
    cuisine: "North Indian", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Onion", "Tomato", "Ginger"], 
    steps: [
      "'Do Pyaza' means double onions - half goes in gravy, half added at end. Slice 4 onions total.",
      "Heat 3 tbsp oil. Add 2 sliced onions, cook until deep brown (15 mins). Add 1 tbsp ginger-garlic paste.",
      "Add 2 pureed tomatoes and cook until oil separates (10 mins). Add 1 tsp coriander powder, 1/2 tsp cumin, 1/2 tsp turmeric, 1 tsp red chili, and salt.",
      "Add your main ingredient with 1/2 cup water. Cover and cook until almost done.",
      "Cut remaining 2 onions into large petals. Add to curry and cook 5 more mins - onions should be soft but hold shape.",
      "Add 1/2 tsp garam masala and fresh coriander. The gravy should be thick with chunky onion pieces throughout."
    ] 
  },
  { 
    name: "Handi", 
    cuisine: "North Indian", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Yogurt", "Cream", "Tomato"], 
    steps: [
      "Heat 3 tbsp ghee in a handi (clay pot) or heavy pan. Add 1 bay leaf, 2 cardamom, 2 cloves.",
      "Add 2 chopped onions, cook until light brown. Add 1 tbsp ginger-garlic paste, cook 2 mins.",
      "Add 1/2 cup whisked yogurt (room temp) slowly, stirring constantly to prevent curdling.",
      "Cook yogurt until reduced and oil separates. Add 1 chopped tomato, cook until soft.",
      "Add your main ingredient, 1/2 tsp turmeric, 1 tsp red chili, 1 tsp coriander powder, and salt.",
      "Add 1/2 cup water, cover with a heavy lid and cook on low heat (dum style) until done. Don't open frequently.",
      "Finish with 2 tbsp cream, 1/2 tsp garam masala, and fresh coriander. Serve in the handi itself."
    ] 
  },
  { 
    name: "Bhurji", 
    cuisine: "North Indian", 
    diff: "Easy", 
    type: "Dry", 
    extra: ["Onion", "Green Chili", "Tomato"], 
    steps: [
      "Heat 2 tbsp oil. Add 1/2 tsp cumin seeds and let splutter.",
      "Add 1 finely chopped onion and 2-3 chopped green chilies. Sauté until onion is soft (4-5 mins).",
      "Add 1 chopped tomato and cook until soft. Add 1/4 tsp turmeric and salt.",
      "Add your main ingredient, breaking it into small pieces as you stir.",
      "Scramble continuously on medium heat until well cooked and slightly dry (5-8 mins).",
      "Add 1/4 tsp garam masala and 2 tbsp chopped coriander. Quick stir and serve hot with pav or paratha."
    ] 
  },
  { 
    name: "Ghee Roast", 
    cuisine: "Mangalorean", 
    diff: "Hard", 
    type: "Dry", 
    extra: ["Ghee", "Byadgi Chili", "Tamarind"], 
    steps: [
      "Soak 15-20 Byadgi chilies in warm water for 20 mins. Grind with 1 tbsp tamarind, 6-8 garlic cloves, 1/2 inch ginger, and salt to paste.",
      "Dry roast 2 tbsp coriander seeds, 1 tsp cumin, 1 tsp peppercorns, 1/2 tsp fenugreek until fragrant. Grind to powder.",
      "Marinate main ingredient with the chili paste and half the roasted spice powder for 30 mins.",
      "Heat 4 tbsp ghee (generous!) in a pan. Add marinated ingredient and cook on medium heat.",
      "Keep tossing and adding ghee as needed. The ingredient should roast, not stew. Cook 15-20 mins.",
      "Add remaining spice powder and more ghee. The final dish should be dry with a glistening red coating.",
      "Serve hot garnished with curry leaves fried in ghee. The rich, spicy, tangy flavor is addictive!"
    ] 
  },
  { 
    name: "Vindaloo", 
    cuisine: "Goan", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Vinegar", "Garlic", "Potato"], 
    steps: [
      "Make vindaloo paste: Blend 10 dried red chilies, 10 garlic cloves, 1 inch ginger, 1 tsp cumin, 1/2 tsp turmeric, 6 cloves, 1 inch cinnamon with 1/4 cup vinegar.",
      "Marinate main ingredient in half the paste with salt for 2+ hours (overnight is best).",
      "Heat 3 tbsp oil. Add 2 sliced onions, cook until brown. Add remaining paste, cook 5 mins.",
      "Add marinated ingredient with marinade. Sear on high heat for 5 mins.",
      "Add 1 cup water and cubed potatoes. Cover and simmer until both are cooked (25-30 mins).",
      "Add 1 tsp jaggery to balance the sourness. Adjust salt and vinegar. Gravy should be tangy and spicy.",
      "Rest for a few hours if possible - vindaloo tastes better the next day!"
    ] 
  },
  { 
    name: "Saag (Spinach)", 
    cuisine: "Punjabi", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Spinach", "Garlic", "Cream"], 
    steps: [
      "Blanch 500g spinach in boiling water for 2 mins. Transfer immediately to ice water. Drain and blend to smooth puree.",
      "Heat 2 tbsp butter. Add 1 tsp cumin seeds, 6-8 minced garlic cloves, and 2 slit green chilies. Sauté 2 mins.",
      "Add 1 finely chopped onion, cook until soft. Add 1 chopped tomato, cook until mushy.",
      "Add spinach puree, 1/2 tsp turmeric, 1 tsp coriander powder, and salt. Cook 8-10 mins.",
      "Add your main ingredient (paneer, chicken, etc.) and 1/4 cup water. Simmer until cooked through.",
      "Finish with 1/4 cup cream and 1/2 tsp garam masala. Serve with a drizzle of cream and butter."
    ] 
  },
  { 
    name: "Manchurian", 
    cuisine: "Indo-Chinese", 
    diff: "Medium", 
    type: "Snack", 
    extra: ["Soy Sauce", "Garlic", "Spring Onion"], 
    steps: [
      "Make balls: Grate/mince main ingredient, mix with 2 tbsp corn flour, 1 tbsp maida, salt, pepper. Form small balls.",
      "Deep fry balls until golden and crispy. Drain and set aside.",
      "For sauce: Heat 2 tbsp oil. Add 1 tbsp minced garlic, 1 tbsp minced ginger, 2 slit green chilies. Sauté 1 min.",
      "Add 1/2 sliced onion and 1/2 sliced capsicum. Toss on high heat 2 mins.",
      "Add 2 tbsp soy sauce, 1 tbsp chili sauce, 1 tsp vinegar, 1/2 tsp sugar, salt, and 1/4 cup water.",
      "Mix 1 tbsp corn flour with 2 tbsp water, add to sauce. Cook until thickened.",
      "Add fried balls to sauce, toss well. Garnish with spring onion greens. Serve immediately while crispy!"
    ] 
  },
  { 
    name: "Pulao", 
    cuisine: "Indian", 
    diff: "Easy", 
    type: "Lunch", 
    extra: ["Rice", "Whole Spices", "Ghee"], 
    steps: [
      "Wash and soak 1.5 cups basmati rice for 30 mins. Drain well.",
      "Heat 2 tbsp ghee. Add 1 bay leaf, 4 cloves, 4 cardamom, 1 inch cinnamon, 1 tsp cumin seeds.",
      "Add 1 sliced onion and sauté until golden. Add your main ingredient and sauté 3-4 mins.",
      "Add the drained rice and gently stir for 2 mins, coating rice with ghee.",
      "Add 3 cups hot water (or stock), 1/2 tsp turmeric, and salt. Bring to boil.",
      "Reduce heat to lowest, cover tightly and cook for 15 mins. Don't open the lid!",
      "Turn off heat, let rest 5 mins covered. Fluff gently with fork and serve."
    ] 
  },
  { 
    name: "Achari", 
    cuisine: "North Indian", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Pickle Spices", "Mustard Oil", "Fennel"], 
    steps: [
      "Prepare achari spice mix: 1 tsp each of fennel, nigella (kalonji), fenugreek, mustard seeds, and cumin seeds.",
      "Heat 3 tbsp mustard oil until smoking, then cool slightly. Add the achari spice mix and let splutter.",
      "Add 1 sliced onion, cook until golden. Add 1 tbsp ginger-garlic paste and 2 slit green chilies.",
      "Add 1 pureed tomato, 1 tsp red chili, 1/2 tsp turmeric, and salt. Cook until oil separates.",
      "Add your main ingredient with 1/2 cup water. Cover and cook until done.",
      "Add 1 tsp mango pickle masala (or more pickle spices), 1 tbsp pickle oil, and 1/2 tsp amchur.",
      "Simmer 5 mins. The curry should be tangy and have distinct pickle flavors. Serve with paratha."
    ] 
  },
  { 
    name: "Lababdar", 
    cuisine: "Mughlai", 
    diff: "Hard", 
    type: "Curry", 
    extra: ["Cream", "Cashew", "Tomato", "Cheese"], 
    steps: [
      "Soak 15 cashews in hot water for 15 mins. Blend to smooth paste.",
      "Heat 2 tbsp butter. Add 1 chopped onion, cook until golden. Add 1 tbsp ginger-garlic paste.",
      "Add 2 cups tomato puree, cook 15 mins until thick. Blend smooth and strain.",
      "Return gravy to pan. Add cashew paste, 1/2 tsp turmeric, 1 tsp coriander powder, salt, and 1 tsp sugar.",
      "Add your main ingredient. Simmer until cooked through.",
      "Add 1/4 cup cream and 2 tbsp grated processed cheese. Stir until cheese melts and gravy is glossy.",
      "Add 1/2 tsp garam masala, 1 tbsp kasuri methi. Finish with cream swirl. Rich and indulgent!"
    ] 
  },
  { 
    name: "Jalfrezi", 
    cuisine: "Bengali/British", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Capsicum", "Onion", "Tomato"], 
    steps: [
      "Cut vegetables into large, chunky pieces: 1 onion in petals, 1 capsicum in strips, 1 tomato in wedges.",
      "Heat 3 tbsp oil in a wok/kadai until very hot (almost smoking).",
      "Add your main ingredient and stir-fry on high heat until seared (3-4 mins). Remove and set aside.",
      "In same pan, add onions and capsicum. Toss on high heat 2-3 mins - they should char slightly but stay crisp.",
      "Add 1 tbsp ginger-garlic paste, 2-3 slit green chilies. Toss 1 min.",
      "Add tomato wedges, 1 tsp cumin, 1 tsp coriander powder, 1/2 tsp red chili, and salt.",
      "Return main ingredient. Add 2 tbsp thick tomato sauce. Toss everything together 2-3 mins.",
      "Serve immediately - jalfrezi should be slightly dry, smoky, and with crunchy vegetables."
    ] 
  },
  { 
    name: "Malai Curry", 
    cuisine: "Bengali", 
    diff: "Medium", 
    type: "Curry", 
    extra: ["Coconut Milk", "Mustard Oil", "Green Chili"], 
    steps: [
      "Marinate main ingredient with 1/2 tsp turmeric and salt for 15 mins.",
      "Heat 3 tbsp mustard oil until smoking, then cool slightly. Add 1 bay leaf, 2 cardamom, 1/2 tsp nigella seeds.",
      "Add 1 sliced onion, cook until soft. Add 1 tsp ginger paste and 4-5 slit green chilies.",
      "Add 1/4 tsp turmeric and the marinated ingredient. Sear on medium-high heat for 5 mins.",
      "Add 1 cup coconut milk (not cream, it's too thick) and 1/2 cup water. Bring to gentle simmer.",
      "Cover and cook until done. Don't let it boil vigorously or coconut milk will split.",
      "Finish with 2 tbsp thick coconut cream and more slit green chilies. The curry should be creamy white with a subtle sweetness."
    ] 
  }
];

// 3. The Generator Function
const generateDatabase = () => {
  let db = [...CORE_RECIPES];
  let idCounter = 100;

  MAIN_INGREDIENTS.forEach(ing => {
    COOKING_STYLES.forEach(style => {
      if(ing === "Fish" && style.name === "Butter Masala") return;

      let imgKey = "curry";
      if (ing.toLowerCase().includes("chicken")) imgKey = "chicken";
      else if (ing.toLowerCase().includes("paneer")) imgKey = "paneer";
      else if (ing.toLowerCase().includes("fish")) imgKey = "fish";
      else if (ing.toLowerCase().includes("rice")) imgKey = "biryani";
      else if (style.type === "Snack") imgKey = "samosa";
      
      db.push({
        id: idCounter++,
        title: `${ing} ${style.name}`,
        cuisine: style.cuisine,
        course: style.type === "Curry" || style.type === "Dry" ? "Dinner" : style.type === "Lunch" ? "Lunch" : "Snack",
        imageKeyword: imgKey,
        time: "40 mins",
        difficulty: style.diff as any,
        ingredients: [ing, ...style.extra, "Onion", "Spices", "Oil/Ghee"],
        instructions: [
          `Prep: Clean and cut ${ing} into desired size.`,
          ...style.steps,
          "Adjust salt and spices to taste.",
          "Serve hot."
        ],
        defaultServings: 4,
      });
    });
  });
  
  return db;
};

// --- STAPLES FOR QUICK ADD ---
const COMMON_INGREDIENTS = [
  "Rice", "Atta", "Besan", "Potato", "Onion", "Tomato", "Milk", 
  "Yogurt", "Paneer", "Chicken", "Egg", "Bread", "Ghee", 
  "Toor Dal", "Moong Dal", "Chickpeas", "Mustard Seeds", "Cumin", "Ginger", "Garlic", "Coriander"
];

const DAILY_TIPS = [
  "Add a pinch of sugar to balance very spicy curries.",
  "Toast your dry spices in a pan before grinding for deeper flavour.",
  "Always add garam masala near the end so it stays aromatic.",
  "Use leftover rice for quick pulao with just onions and whole spices.",
  "Save pasta water or dal water to adjust curry consistency instead of plain water.",
  "Rest biryani for 10 minutes before serving so the flavours settle.",
];

// --- INGREDIENT SUBSTITUTIONS ---
const INGREDIENT_SUBSTITUTIONS: Record<string, string[]> = {
  "Paneer": ["Tofu", "Chicken", "Mushrooms"],
  "Chicken": ["Paneer", "Tofu", "Mushrooms"],
  "Ghee": ["Butter", "Oil", "Coconut Oil"],
  "Yogurt": ["Sour Cream", "Buttermilk", "Coconut Cream"],
  "Cream": ["Coconut Cream", "Cashew Cream", "Milk + Butter"],
  "Basmati Rice": ["Jasmine Rice", "Long Grain Rice", "Brown Rice"],
  "Mustard Seeds": ["Cumin Seeds", "Fenugreek Seeds"],
  "Curry Leaves": ["Bay Leaves", "Basil Leaves"],
  "Kasuri Methi": ["Fresh Fenugreek", "Dried Basil"],
  "Tamarind": ["Lemon Juice", "Vinegar", "Amchur"],
  "Jaggery": ["Brown Sugar", "Honey", "Maple Syrup"],
  "Asafoetida": ["Garlic Powder", "Onion Powder"],
  "Coconut": ["Almonds", "Cashews", "Coconut Milk Powder"],
};

// --- CUISINE DATA ---
const CUISINE_DATA: Record<string, { region: string; description: string; specialties: string[] }> = {
  "Punjabi": { region: "North India", description: "Rich, buttery dishes with robust flavors", specialties: ["Butter Chicken", "Dal Makhani", "Sarson da Saag"] },
  "South Indian": { region: "South India", description: "Rice-based dishes with coconut and curry leaves", specialties: ["Dosa", "Idli", "Sambar"] },
  "Gujarati": { region: "Gujarat", description: "Sweet and savory vegetarian cuisine", specialties: ["Dhokla", "Thepla", "Undhiyu"] },
  "Bengali": { region: "West Bengal", description: "Fish and sweets with mustard oil", specialties: ["Fish Curry", "Rasgulla", "Mishti Doi"] },
  "Hyderabadi": { region: "Telangana", description: "Royal cuisine with Persian influences", specialties: ["Biryani", "Haleem", "Kebabs"] },
  "Rajasthani": { region: "Rajasthan", description: "Desert cuisine with preserved foods", specialties: ["Dal Baati", "Gatte ki Sabzi", "Ker Sangri"] },
  "Maharashtrian": { region: "Maharashtra", description: "Spicy and tangy flavors", specialties: ["Pav Bhaji", "Vada Pav", "Misal Pav"] },
  "Kerala": { region: "Kerala", description: "Coconut-rich coastal cuisine", specialties: ["Appam", "Fish Curry", "Puttu"] },
};

// --- RECIPE COLLECTIONS ---
const DEFAULT_COLLECTIONS: Collection[] = [
  { id: "weeknight", name: "Weeknight Dinners", description: "Quick meals for busy evenings", recipeIds: [] },
  { id: "festival", name: "Festival Specials", description: "Traditional dishes for celebrations", recipeIds: [] },
  { id: "quick", name: "Quick & Easy", description: "Under 30 minutes", recipeIds: [] },
  { id: "healthy", name: "Healthy Choices", description: "Nutritious and balanced", recipeIds: [] },
  { id: "comfort", name: "Comfort Food", description: "Hearty and satisfying", recipeIds: [] },
];

// --- SEASONAL MONTHS ---
const SEASONAL_INGREDIENTS: Record<string, number[]> = {
  "Mango": [4, 5, 6], // Apr, May, Jun
  "Tomato": [5, 6, 7, 8], // May-Aug
  "Cucumber": [5, 6, 7, 8], // May-Aug
  "Okra": [6, 7, 8, 9], // Jun-Sep
  "Brinjal": [7, 8, 9, 10], // Jul-Oct
  "Pumpkin": [9, 10, 11], // Sep-Nov
  "Cauliflower": [10, 11, 12, 1], // Oct-Jan
  "Peas": [11, 12, 1, 2], // Nov-Feb
  "Spinach": [11, 12, 1, 2, 3], // Nov-Mar
};

// --- NUTRITION ESTIMATES (per serving, default 4 servings) ---
const getNutritionEstimate = (recipe: Recipe): Recipe['nutrition'] => {
  const baseCalories = recipe.ingredients.length * 50;
  const protein = recipe.ingredients.filter(i => 
    i.toLowerCase().includes('chicken') || 
    i.toLowerCase().includes('paneer') || 
    i.toLowerCase().includes('dal') ||
    i.toLowerCase().includes('egg')
  ).length * 8;
  const carbs = recipe.ingredients.filter(i => 
    i.toLowerCase().includes('rice') || 
    i.toLowerCase().includes('atta') || 
    i.toLowerCase().includes('flour') ||
    i.toLowerCase().includes('potato')
  ).length * 15;
  const fat = recipe.ingredients.filter(i => 
    i.toLowerCase().includes('ghee') || 
    i.toLowerCase().includes('butter') || 
    i.toLowerCase().includes('oil') ||
    i.toLowerCase().includes('cream')
  ).length * 10;
  
  return {
    calories: Math.round(baseCalories + protein * 4 + carbs * 4 + fat * 9),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: Math.round(recipe.ingredients.length * 2),
  };
};

const App = () => {
  const [recipes] = useState<Recipe[]>(() => generateDatabase());
  const [currentView, setCurrentView] = useState<View>('home');
  const [myPantry, setMyPantry] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'possible'>('all');
  const [activeCourse, setActiveCourse] = useState<Course | 'All'>('All');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'All'>('All');
  const [maxTime, setMaxTime] = useState(0); // 0 = any time
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]); // Multi-select courses
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [historyIds, setHistoryIds] = useState<number[]>([]);
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Cook mode
  const [cookModeRecipe, setCookModeRecipe] = useState<any | null>(null);
  const [cookStepIndex, setCookStepIndex] = useState(0);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Shopping list
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  // Recipe notes
  const [recipeNotes, setRecipeNotes] = useState<Record<number, string>>({});
  // Advanced filters panel
  const [showFilters, setShowFilters] = useState(false);
  // Toast notifications
  const { toasts, addToast, dismissToast } = useToast();
  // Recipe scaling
  const [recipeServings, setRecipeServings] = useState<Record<number, number>>({});
  // Collections
  const [collections, setCollections] = useState<Collection[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pc_collections');
        return saved ? JSON.parse(saved) : DEFAULT_COLLECTIONS;
      } catch { return DEFAULT_COLLECTIONS; }
    }
    return DEFAULT_COLLECTIONS;
  });
  // Meal planning
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pc_mealplan');
        return saved ? JSON.parse(saved) : {};
      } catch { return {}; }
    }
    return {};
  });
  // Recipe comparison
  const [compareRecipes, setCompareRecipes] = useState<number[]>([]);
  // Active timers
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  // Selected collection
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  // Print mode
  const [printMode, setPrintMode] = useState(false);
  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Recipe ratings
  const [recipeRatings, setRecipeRatings] = useState<Record<number, { rating: number; review?: string }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pc_ratings');
        return saved ? JSON.parse(saved) : {};
      } catch { return {}; }
    }
    return {};
  });
  // Meal prep mode
  const [mealPrepMode, setMealPrepMode] = useState(false);
  const [mealPrepRecipes, setMealPrepRecipes] = useState<number[]>([]);
  // Enhanced search filters
  const [searchFilters, setSearchFilters] = useState({
    ingredients: [] as string[],
    excludeIngredients: [] as string[],
    maxPrepTime: 0,
    minRating: 0,
  });
  // Recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pc_recent_searches');
        return saved ? JSON.parse(saved) : [];
      } catch { return []; }
    }
    return [];
  });
  const [searchSuggestionsIndex, setSearchSuggestionsIndex] = useState(-1);

  const deferredSearch = useDeferredValue(searchQuery);
  const deferredPantry = useDeferredValue(myPantry);

  // Use date-based index for consistent server/client hydration
  const dailyTip = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  }, []);

  const trendingRecipes = useMemo(
    () => recipes.slice(0, 5),
    [recipes]
  );

  const mobileDockItems = useMemo(
    () => [
      {
        label: 'Home',
        icon: (
          <Home
            size={18}
            className={currentView === 'home' ? 'text-orange-400' : 'text-slate-300'}
          />
        ),
        onClick: () => setCurrentView('home'),
      },
      {
        label: 'Saved',
        icon: (
          <Heart
            size={18}
            className={currentView === 'saved' ? 'text-orange-400' : 'text-slate-300'}
          />
        ),
        onClick: () => setCurrentView('saved'),
      },
      {
        label: 'History',
        icon: (
          <History
            size={18}
            className={currentView === 'history' ? 'text-orange-400' : 'text-slate-300'}
          />
        ),
        onClick: () => setCurrentView('history'),
      },
      {
        label: 'List',
        icon: (
          <ClipboardList
            size={18}
            className={currentView === 'shopping' ? 'text-orange-400' : 'text-slate-300'}
          />
        ),
        onClick: () => setCurrentView('shopping'),
      },
    ],
    [currentView] // only rebuild when the active tab changes
  );

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setHeaderShrunk(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Set mounted to prevent hydration mismatch with browser extensions
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // "/" to focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.getElementById('main-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // "Esc" to close modals/overlays
      if (e.key === 'Escape') {
        if (selectedRecipe) {
          setSelectedRecipe(null);
        }
        if (cookModeRecipe) {
          setCookModeRecipe(null);
        }
        if (showFilters) {
          setShowFilters(false);
        }
      }

      // "g" then "h" for home (GitHub-style)
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        const handleG = (e2: KeyboardEvent) => {
          if (e2.key === 'h') {
            e2.preventDefault();
            setCurrentView('home');
          }
          document.removeEventListener('keydown', handleG);
        };
        document.addEventListener('keydown', handleG);
        setTimeout(() => document.removeEventListener('keydown', handleG), 1000);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [selectedRecipe, cookModeRecipe, showFilters]);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const pantry = window.localStorage.getItem('pc_pantry');
      const saved = window.localStorage.getItem('pc_saved');
      const history = window.localStorage.getItem('pc_history');
      const view = window.localStorage.getItem('pc_view');
      const course = window.localStorage.getItem('pc_course');
      const tab = window.localStorage.getItem('pc_tab');
      if (pantry) setMyPantry(JSON.parse(pantry));
      if (saved) setSavedIds(JSON.parse(saved));
      if (history) setHistoryIds(JSON.parse(history));
      if (view) setCurrentView(view as View);
      if (course) setActiveCourse(course as any);
      if (tab === 'all' || tab === 'possible') setActiveTab(tab);
    } catch (e) {
      console.warn('MasalaVault: failed to restore state', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('pc_pantry', JSON.stringify(myPantry));
  }, [myPantry]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('pc_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('pc_history', JSON.stringify(historyIds));
  }, [historyIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('pc_view', currentView);
    window.localStorage.setItem('pc_course', String(activeCourse));
    window.localStorage.setItem('pc_tab', activeTab);
  }, [currentView, activeCourse, activeTab]);

  const toggleSave = useCallback(
    (id: number, recipeName?: string) => {
      setSavedIds((prev) => {
        const isSaved = prev.includes(id);
        if (isSaved) {
          addToast(recipeName ? `Removed "${recipeName}" from saved` : 'Recipe removed', 'info');
          return prev.filter((i) => i !== id);
        } else {
          addToast(recipeName ? `Saved "${recipeName}"` : 'Recipe saved!', 'success');
          return [...prev, id];
        }
      });
    },
    [addToast]
  );

  // Save recent search
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pc_recent_searches', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const openRecipe = useCallback((r: any) => {
    setSelectedRecipe(r);
    setHistoryIds((prev) => {
      const newHist = [r.id, ...prev.filter((id) => id !== r.id)];
      return newHist.slice(0, 50);
    });
  }, []);

  const startCookMode = (recipe: any) => {
    setCookModeRecipe(recipe);
    setCookStepIndex(0);
  };

  const closeCookMode = () => {
    setCookModeRecipe(null);
    setCookStepIndex(0);
  };

  const handleCookComplete = useCallback(() => {
    addToast('🎉 Congratulations! You completed the recipe!', 'success');
  }, [addToast]);

  const addIngredient = useCallback(
    (ing: string) => {
      const f = ing.trim().toLowerCase();
      if (!f) return;
      setMyPantry((prev) => {
        if (prev.includes(f)) return prev;
        addToast(`Added "${f}" to pantry`, 'success');
        return [...prev, f];
      });
      setInputValue('');
    },
    [addToast]
  );

  // Shopping list helpers
  const addToShoppingList = useCallback((ingredients: string[]) => {
    setShoppingList((prev) => {
      const newItems = ingredients.filter(i => !prev.includes(i.toLowerCase()));
      if (newItems.length > 0) {
        addToast(`Added ${newItems.length} item${newItems.length > 1 ? 's' : ''} to shopping list`, 'success');
      }
      return [...prev, ...newItems.map(i => i.toLowerCase())];
    });
  }, [addToast]);

  const removeFromShoppingList = useCallback((item: string) => {
    setShoppingList((prev) => prev.filter(i => i !== item));
  }, []);

  const clearShoppingList = useCallback(() => {
    setShoppingList([]);
    addToast('Shopping list cleared', 'info');
  }, [addToast]);

  // Recipe notes helpers
  const saveNote = useCallback((recipeId: number, note: string) => {
    setRecipeNotes((prev) => ({ ...prev, [recipeId]: note }));
    addToast('Note saved', 'success');
  }, [addToast]);

  // Share recipe
  // Timer management
  useEffect(() => {
    if (activeTimers.length === 0) return;
    const interval = setInterval(() => {
      setActiveTimers(prev => prev.map(timer => ({
        ...timer,
        remaining: Math.max(0, timer.remaining - 1)
      })).filter(t => t.remaining > 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimers]);

  // Persist collections and meal plan
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_collections', JSON.stringify(collections));
    }
  }, [collections]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_mealplan', JSON.stringify(mealPlan));
    }
  }, [mealPlan]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_ratings', JSON.stringify(recipeRatings));
    }
  }, [recipeRatings]);

  const addTimer = useCallback((stepIndex: number, duration: number, label: string, recipeId: number) => {
    const timerId = `${recipeId}-${stepIndex}-${Date.now()}`;
    setActiveTimers(prev => [...prev, { id: timerId, label, duration, remaining: duration, stepIndex }]);
    addToast(`Timer started: ${label} (${formatTime(duration)})`, 'info');
  }, [addToast]);

  const removeTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => prev.filter(t => t.id !== timerId));
  }, []);

  const updateServings = useCallback((recipeId: number, servings: number) => {
    setRecipeServings(prev => ({ ...prev, [recipeId]: servings }));
  }, []);

  const addToCollection = useCallback((recipeId: number, collectionId: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId 
        ? { ...c, recipeIds: [...c.recipeIds.filter(id => id !== recipeId), recipeId] }
        : c
    ));
    addToast('Added to collection', 'success');
  }, [addToast]);

  const removeFromCollection = useCallback((recipeId: number, collectionId: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId 
        ? { ...c, recipeIds: c.recipeIds.filter(id => id !== recipeId) }
        : c
    ));
    addToast('Removed from collection', 'info');
  }, [addToast]);

  const addToMealPlan = useCallback((recipeId: number, day: string, meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setMealPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: recipeId }
    }));
    addToast('Added to meal plan', 'success');
  }, [addToast]);

  const toggleCompare = useCallback((recipeId: number) => {
    setCompareRecipes(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else if (prev.length < 3) {
        return [...prev, recipeId];
      } else {
        addToast('Maximum 3 recipes can be compared', 'info');
        return prev;
      }
    });
  }, [addToast]);

  const printRecipe = useCallback((recipe: any) => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintMode(false), 100);
    }, 100);
  }, []);

  const exportRecipe = useCallback(async (recipe: any, format: 'text' | 'json') => {
    const text = format === 'text' 
      ? `${recipe.title}\n\nCuisine: ${recipe.cuisine}\nTime: ${recipe.time}\nDifficulty: ${recipe.difficulty}\n\nIngredients:\n${recipe.ingredients.map((i: string) => `- ${i}`).join('\n')}\n\nInstructions:\n${recipe.instructions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n\n')}`
      : JSON.stringify(recipe, null, 2);
    
    const blob = new Blob([text], { type: format === 'text' ? 'text/plain' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, '_')}.${format === 'text' ? 'txt' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Recipe exported', 'success');
  }, [addToast]);

  const rateRecipe = useCallback((recipeId: number, rating: number, review?: string) => {
    setRecipeRatings(prev => ({
      ...prev,
      [recipeId]: { rating, review: review || prev[recipeId]?.review }
    }));
    addToast(`Rated ${rating} star${rating !== 1 ? 's' : ''}`, 'success');
  }, [addToast]);

  const toggleMealPrep = useCallback((recipeId: number) => {
    setMealPrepRecipes(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  }, []);

  // Recipe suggestions based on history
  const suggestedRecipes = useMemo(() => {
    if (historyIds.length === 0) return [];
    const historyRecipes = recipes.filter(r => historyIds.includes(r.id));
    const commonIngredients = new Map<string, number>();
    
    historyRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        commonIngredients.set(ing, (commonIngredients.get(ing) || 0) + 1);
      });
    });
    
    const topIngredients = Array.from(commonIngredients.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ing]) => ing);
    
    return recipes
      .filter(r => !historyIds.includes(r.id))
      .map(recipe => {
        const matchCount = recipe.ingredients.filter(ing => 
          topIngredients.some(top => ing.toLowerCase().includes(top.toLowerCase()))
        ).length;
        return { recipe, score: matchCount };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.recipe);
  }, [historyIds, recipes]);

  // Grocery list optimization - group by store section
  const optimizedShoppingList = useMemo(() => {
    const sections: Record<string, string[]> = {
      'Produce': ['Onion', 'Tomato', 'Potato', 'Ginger', 'Garlic', 'Coriander', 'Mint', 'Spinach', 'Cucumber', 'Okra', 'Brinjal', 'Cauliflower', 'Peas'],
      'Dairy': ['Milk', 'Yogurt', 'Cream', 'Butter', 'Ghee', 'Paneer', 'Cheese'],
      'Meat & Seafood': ['Chicken', 'Mutton', 'Fish', 'Egg'],
      'Grains & Pulses': ['Rice', 'Atta', 'Besan', 'Toor Dal', 'Moong Dal', 'Chickpeas', 'Urad Dal'],
      'Spices & Condiments': ['Mustard Seeds', 'Cumin', 'Turmeric', 'Red Chili Powder', 'Garam Masala', 'Biryani Masala', 'Kasuri Methi', 'Curry Leaves', 'Asafoetida', 'Tamarind', 'Jaggery'],
      'Pantry': ['Oil', 'Salt', 'Sugar', 'Bread', 'Cashews', 'Almonds', 'Coconut', 'Saffron'],
    };
    
    const grouped: Record<string, string[]> = {};
    
    shoppingList.forEach(item => {
      let placed = false;
      for (const [section, items] of Object.entries(sections)) {
        if (items.some(i => item.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(item.toLowerCase()))) {
          if (!grouped[section]) grouped[section] = [];
          grouped[section].push(item);
          placed = true;
          break;
        }
      }
      if (!placed) {
        if (!grouped['Other']) grouped['Other'] = [];
        grouped['Other'].push(item);
      }
    });
    
    return grouped;
  }, [shoppingList]);

  const shareRecipe = useCallback(async (recipe: any) => {
    const text = `Check out this recipe: ${recipe.title}\n\nIngredients: ${recipe.ingredients.join(', ')}\n\nFrom MasalaVault 🍳`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text });
        addToast('Shared successfully!', 'success');
      } catch (e) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      addToast('Recipe copied to clipboard!', 'success');
    }
  }, [addToast]);

  const filteredRecipes = useMemo(() => {
    let list: any[] = recipes;

    if (currentView === 'saved') list = list.filter(r => savedIds.includes(r.id));
    if (currentView === 'history') list = list.filter(r => historyIds.includes(r.id));

    // use deferredSearch here
    if (deferredSearch) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.ingredients.some((i: string) => i.toLowerCase().includes(q))
      );
    }

    // Difficulty filter
    if (activeDifficulty !== 'All') {
      list = list.filter(r => r.difficulty === activeDifficulty);
    }

    // Time filter
    if (maxTime > 0) {
      list = list.filter(r => {
        const mins = parseInt(r.time, 10);
        return !isNaN(mins) && mins <= maxTime;
      });
    }

    // Rating filter
    if (searchFilters.minRating > 0) {
      list = list.filter(r => {
        const rating = recipeRatings[r.id]?.rating || 0;
        return rating >= searchFilters.minRating;
      });
    }

    const matched = list.map(recipe => {
      const have = recipe.ingredients.filter((ing: string) =>
        deferredPantry.some(
          p =>
            ing.toLowerCase().includes(p) ||
            p.includes(ing.toLowerCase()) ||
            (p.includes('flour') && ing.toLowerCase().includes('flour'))
        )
      );
      const missing = recipe.ingredients.filter((ing: string) => !have.includes(ing));
      const percentage = Math.round((have.length / recipe.ingredients.length) * 100);
      return { ...recipe, have, missing, percentage };
    });

    matched.sort((a, b) => {
      if (a.missing.length === 0 && b.missing.length > 0) return -1;
      if (b.missing.length === 0 && a.missing.length > 0) return 1;
      return b.percentage - a.percentage;
    });

    return matched.filter(
      r =>
        (activeTab === 'possible' ? r.missing.length === 0 : true) &&
        (selectedCourses.length > 0
          ? selectedCourses.includes(r.course)
          : activeCourse === 'All' ? true : r.course === activeCourse)
    );
  }, [
    recipes,
    deferredPantry,
    savedIds,
    historyIds,
    currentView,
    activeTab,
    activeCourse,
    selectedCourses,
    activeDifficulty,
    maxTime,
    deferredSearch,
    searchFilters,
    recipeRatings,
  ]);

  const topMatches = useMemo(
    () => filteredRecipes.slice(0, 3),
    [filteredRecipes]
  );

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));

  const visiblePages = useMemo<(number | 'dots')[]>(() => {
    const pages: (number | 'dots')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const push = (p: number | 'dots') => {
      if (pages[pages.length - 1] !== p) pages.push(p);
    };
    // Always show first page
    push(1);
    // Left dots
    if (currentPage > 4) push('dots');
    // Window around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) push(p);
    // Right dots
    if (currentPage < totalPages - 3) push('dots');
    // Always show last page
    push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredRecipes.slice(start, end);
  }, [filteredRecipes, currentPage]);

  // Optional: reset to page 1 when filters/search change
  // Use stringified version of selectedCourses to avoid array reference issues
  const selectedCoursesKey = useMemo(() => selectedCourses.sort().join(','), [selectedCourses]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCourse, selectedCoursesKey, activeTab, activeDifficulty, maxTime, searchQuery, currentView]);

  // Structured Data for SEO - Use consistent URLs to avoid hydration mismatch
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masalavault.com';
  
  const websiteStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MasalaVault',
    description: 'Your comprehensive Indian cooking companion. Organize your pantry, discover recipes, and master Indian cuisine.',
    url: baseUrl,
    applicationCategory: 'FoodApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
  }), []);

  const organizationStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MasalaVault',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description: 'Your comprehensive Indian cooking companion',
    sameAs: [
      'https://github.com/Me-Kalyan',
      'https://twitter.com/masalavault',
    ],
  }), []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Structured Data for SEO */}
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={organizationStructuredData} />
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Skip to main content
      </a>
      
      {/* Aurora background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Aurora
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      {/* Fixed glass header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pointer-events-none">
        <div
          className={`
            max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-5
            rounded-2xl border px-4 md:px-6 py-2.5
            transition-all duration-300 ease-out
            backdrop-blur-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.04] border-white/[0.08]
            transform-gpu will-change-transform
            shadow-[0_4px_24px_rgba(0,0,0,0.3)]
            ${headerShrunk ? 'scale-[0.98] shadow-[0_2px_16px_rgba(0,0,0,0.4)]' : 'scale-100'}
            pointer-events-auto
          `}
        >
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-gradient-to-tr from-orange-500 to-red-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-500/30 ring-1 ring-white/10">
              <ChefHat size={24} strokeWidth={2.5} />
            </div>
            <div className="leading-tight hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight cal-sans-regular bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                MasalaVault
              </h1>
              <p className="text-[9px] text-orange-300/90 font-semibold uppercase tracking-[0.25em]">
                YOUR SPICE VAULT, YOUR RECIPES
              </p>
            </div>
          </div>
          {/* Search – smooth expand */}
          <div
            className={`relative group hidden sm:block flex-1 transition-all duration-300 ease-out ${
              searchFocused ? 'max-w-xl' : 'max-w-md'
            }`}
          >
            <Search
              className="absolute left-4 top-2.5 text-slate-300/70 group-focus-within:text-orange-300 transition-colors z-10"
              size={18}
            />
            <input
              id="main-search-input"
              type="text"
              placeholder="Search recipes or ingredients... (Press / to focus)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchSuggestionsIndex(-1);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  e.preventDefault();
                  saveRecentSearch(searchQuery);
                  setSearchFocused(false);
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const filtered = recipes.filter(r => 
                    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.ingredients.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()))
                  );
                  setSearchSuggestionsIndex(prev => 
                    prev < Math.min(filtered.length, 6) - 1 ? prev + 1 : prev
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSearchSuggestionsIndex(prev => prev > 0 ? prev - 1 : -1);
                } else if (e.key === 'Escape') {
                  setSearchFocused(false);
                  setSearchSuggestionsIndex(-1);
                }
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm border focus:outline-none transition-all duration-300 ring-0 focus:ring-2 focus:ring-orange-400/50 bg-white/[0.07] border-white/[0.08] text-slate-50 placeholder-slate-500 shadow-inner shadow-black/20"
            />
            {/* Search Suggestions */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="px-4 py-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Recent Searches</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecentSearches([]);
                              if (typeof window !== 'undefined') {
                                localStorage.removeItem('pc_recent_searches');
                              }
                            }}
                            className="text-[10px] text-slate-500 hover:text-slate-300"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.slice(0, 5).map((search, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSearchQuery(search);
                                saveRecentSearch(search);
                                setSearchFocused(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10 rounded-lg flex items-center gap-2"
                            >
                              <History size={14} className="text-slate-500" />
                              <span>{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Popular Searches */}
                    <div className="px-4 py-2 border-t border-white/10">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Popular Searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Biryani', 'Butter Masala', 'Paneer', 'Chicken Curry', 'Dal', 'Naan'].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              saveRecentSearch(term);
                              setSearchFocused(false);
                            }}
                            className="px-3 py-1.5 text-xs text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Trending Recipes */}
                    <div className="px-4 py-2 border-t border-white/10">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Trending</span>
                      </div>
                      <div className="space-y-1">
                        {trendingRecipes.slice(0, 3).map((recipe) => (
                          <button
                            key={recipe.id}
                            type="button"
                            onClick={() => {
                              openRecipe({ ...recipe, have: [], missing: recipe.ingredients, percentage: 0 });
                              setSearchQuery('');
                              setSearchFocused(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-white/10 rounded-lg flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                              {recipe.course === 'Breakfast' ? '🍳' : 
                               recipe.course === 'Lunch' ? '🍱' :
                               recipe.course === 'Dinner' ? '🍽️' :
                               recipe.course === 'Snack' ? '🥪' :
                               recipe.course === 'Beverage' ? '☕' : '🍴'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-100">{recipe.title}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{recipe.cuisine} • {recipe.time}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Search Results */}
                    {recipes
                      .filter(r => 
                        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.ingredients.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .slice(0, 6)
                      .map((recipe, idx) => (
                        <button
                          key={recipe.id}
                          type="button"
                          onClick={() => {
                            openRecipe({ ...recipe, have: [], missing: recipe.ingredients, percentage: 0 });
                            saveRecentSearch(searchQuery);
                            setSearchQuery('');
                            setSearchFocused(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors ${
                            idx === searchSuggestionsIndex ? 'bg-white/10' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                            {recipe.course === 'Breakfast' ? '🍳' : 
                             recipe.course === 'Lunch' ? '🍱' :
                             recipe.course === 'Dinner' ? '🍽️' :
                             recipe.course === 'Snack' ? '🥪' :
                             recipe.course === 'Beverage' ? '☕' : '🍴'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-100">{recipe.title}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{recipe.cuisine} • {recipe.time}</p>
                          </div>
                        </button>
                      ))}
                    {recipes.filter(r => 
                      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      r.ingredients.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400 text-center">
                        No recipes found for "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {/* Nav */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'home' as View, label: 'Home', icon: Home },
                { id: 'saved' as View, label: 'Saved', icon: Heart },
                { id: 'history' as View, label: 'History', icon: History },
                { id: 'collections' as View, label: 'Collections', icon: BookOpen },
                { id: 'mealplan' as View, label: 'Meal Plan', icon: Calendar },
                { id: 'compare' as View, label: 'Compare', icon: TrendingUp },
                { id: 'cuisine' as View, label: 'Cuisines', icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white/[0.12] text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-3 md:hidden bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl z-50">
              <div className="space-y-1">
                {[
                  { id: 'home' as View, label: 'Home', icon: Home },
                  { id: 'saved' as View, label: 'Saved', icon: Heart },
                  { id: 'history' as View, label: 'History', icon: History },
                  { id: 'collections' as View, label: 'Collections', icon: BookOpen },
                  { id: 'mealplan' as View, label: 'Meal Plan', icon: Calendar },
                  { id: 'compare' as View, label: 'Compare', icon: TrendingUp },
                  { id: 'cuisine' as View, label: 'Cuisines', icon: MapPin },
                  { id: 'shopping' as View, label: 'Shopping List', icon: ClipboardList },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-white/[0.12] text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Fade + blur where content meets the header */}
      <div
        className="
          pointer-events-none
          fixed top-0 left-0 right-0
          h-24
          z-30
          bg-gradient-to-b
          from-[#050010]
          via-[#050010]/70
          to-transparent
          backdrop-blur-xl
        "
      />
      {/* MAIN CONTENT */}
      <main id="main-content" className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-20 pt-28 font-sans text-slate-200" role="main" aria-label="Main content">
        {/* This wrapper applies the fade ONLY to the content */}
        <div
          className="relative grid lg:grid-cols-12 gap-4 md:gap-6"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0, black 24px, black 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0, black 24px, black 100%)',
          }}
        >
          {/* VIEW: ABOUT / LANDING PAGE */}
        {currentView === 'about' && (
           <div className="col-span-12">
              {/* Hero Section */}
              <section className="text-center py-16 md:py-24 mb-16">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-tr from-orange-400 to-red-600 rounded-[2rem] rotate-12 shadow-2xl flex items-center justify-center text-white animate-bounce-in">
                  <ChefHat size={64} />
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-fade-in">
                  MasalaVault
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto font-medium">
                  Your Spice Vault, Your Recipes
                </p>
                <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  The comprehensive Indian cooking companion featuring an intelligent matching engine and over {recipes.length} detailed recipes. Organize your pantry, discover new dishes, and master authentic Indian cuisine.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => setCurrentView('home')}
                    className="magnetic-button px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-red-700 transition-all flex items-center gap-2"
                  >
                    <ChefHat size={20} />
                    Start Cooking
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      const pantryInput = document.querySelector('input[placeholder*="Add ingredient"]') as HTMLInputElement;
                      if (pantryInput) pantryInput.focus();
                    }}
                    className="px-8 py-4 bg-white/10 text-slate-200 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Add Ingredients
                  </button>
                </div>
              </section>

              {/* Stats Section */}
              <section className="mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="p-6 rounded-3xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-orange-500/30 transition-all group">
                    <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2 group-hover:scale-110 transition-transform">{recipes.length}+</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Recipes</div>
                  </div>
                  <div className="p-6 rounded-3xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all group">
                    <div className="text-4xl md:text-5xl font-black text-blue-500 mb-2 group-hover:scale-110 transition-transform">{recipes.reduce((acc, r) => acc + r.ingredients.length, 0)}+</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Ingredients</div>
                  </div>
                  <div className="p-6 rounded-3xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-green-500/30 transition-all group">
                    <div className="text-4xl md:text-5xl font-black text-green-500 mb-2 group-hover:scale-110 transition-transform">100%</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Offline</div>
                  </div>
                  <div className="p-6 rounded-3xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-purple-500/30 transition-all group">
                    <div className="text-4xl md:text-5xl font-black text-purple-500 mb-2 group-hover:scale-110 transition-transform">{Object.keys(CUISINE_DATA).length}</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Cuisines</div>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                  Powerful Features
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Search,
                      title: 'Smart Recipe Matching',
                      description: 'Find recipes based on what\'s in your pantry. Our intelligent algorithm matches ingredients to suggest perfect dishes.',
                      color: 'orange',
                    },
                    {
                      icon: ShoppingBag,
                      title: 'Pantry Management',
                      description: 'Organize your ingredients, track what you have, and never run out of essentials.',
                      color: 'blue',
                    },
                    {
                      icon: Calendar,
                      title: 'Meal Planning',
                      description: 'Plan your weekly meals, organize recipes by day, and streamline your cooking schedule.',
                      color: 'green',
                    },
                    {
                      icon: Timer,
                      title: 'Cooking Timers',
                      description: 'Built-in timers for recipe steps. Never overcook or undercook again.',
                      color: 'red',
                    },
                    {
                      icon: BookOpen,
                      title: 'Recipe Collections',
                      description: 'Create custom collections, save favorites, and organize recipes your way.',
                      color: 'purple',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Recipe Comparison',
                      description: 'Compare multiple recipes side-by-side to find the perfect one for your needs.',
                      color: 'amber',
                    },
                  ].map((feature, idx) => {
                    const Icon = feature.icon;
                    const colorClasses = {
                      orange: 'from-orange-500/20 to-orange-500/10 text-orange-400 border-orange-500/20',
                      blue: 'from-blue-500/20 to-blue-500/10 text-blue-400 border-blue-500/20',
                      green: 'from-green-500/20 to-green-500/10 text-green-400 border-green-500/20',
                      red: 'from-red-500/20 to-red-500/10 text-red-400 border-red-500/20',
                      purple: 'from-purple-500/20 to-purple-500/10 text-purple-400 border-purple-500/20',
                      amber: 'from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/20',
                    };
                    return (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/20 transition-all group animate-fade-in"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-200">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                  What Cooks Are Saying
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Priya Sharma',
                      role: 'Home Cook',
                      content: 'MasalaVault has transformed how I cook! The pantry matching feature is genius - I can always find something to make with what I have.',
                      rating: 5,
                    },
                    {
                      name: 'Raj Patel',
                      role: 'Food Enthusiast',
                      content: 'The recipe collections and meal planning features are game-changers. I\'ve organized my entire cooking routine around this app.',
                      rating: 5,
                    },
                    {
                      name: 'Anita Desai',
                      role: 'Chef',
                      content: 'As a professional chef, I appreciate the attention to detail. The timers, substitutions, and nutritional info make this incredibly useful.',
                      rating: 5,
                    },
                  ].map((testimonial, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl border bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-orange-500/30 transition-all animate-fade-in"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">★</span>
                        ))}
                      </div>
                      <p className="text-slate-300 mb-4 italic leading-relaxed">"{testimonial.content}"</p>
                      <div>
                        <div className="font-semibold text-slate-200">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <section className="text-center py-16 rounded-3xl border bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-200">
                  Ready to Transform Your Cooking?
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Join thousands of home cooks who are discovering new recipes and organizing their kitchens with MasalaVault.
                </p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="magnetic-button px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  Get Started Free
                </button>
              </section>
           </div>
        )}

        {currentView === 'settings' && (
          <div className="col-span-12 py-16 text-center text-sm text-slate-500">
            Settings coming soon.
          </div>
        )}

        {/* VIEW: SHOPPING LIST */}
        {currentView === 'shopping' && (
          <div className="col-span-12 max-w-3xl mx-auto py-8">
            <div className="p-6 rounded-[2rem] border backdrop-blur-2xl bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold flex items-center gap-2 text-xl sm:text-2xl">
                  <ClipboardList className="text-orange-500" size={24} />
                  Shopping List
                </h2>
                {shoppingList.length > 0 && (
                  <button
                    onClick={clearShoppingList}
                    className="text-xs sm:text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {shoppingList.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <ClipboardList size={40} className="text-orange-400/50" />
                  </div>
                  <p className="font-medium text-lg mb-2">Your shopping list is empty</p>
                  <p className="text-sm text-slate-500">Add missing ingredients from recipes to start your list</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(optimizedShoppingList).map(([section, items]) => (
                    <div key={section}>
                      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                        {section}
                      </h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                          >
                            <span className="capitalize text-slate-200 text-sm sm:text-base">{item}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  addIngredient(item);
                                  removeFromShoppingList(item);
                                }}
                                className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all font-medium"
                                aria-label={`Mark ${item} as purchased`}
                              >
                                Got it
                              </button>
                              <button
                                onClick={() => removeFromShoppingList(item)}
                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                aria-label={`Remove ${item}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {shoppingList.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => {
                      const text = `Shopping List:\n\n${Object.entries(optimizedShoppingList).map(([section, items]) => 
                        `${section}:\n${items.map(i => `  • ${i}`).join('\n')}`
                      ).join('\n\n')}`;
                      navigator.clipboard.writeText(text);
                      addToast('Shopping list copied!', 'success');
                    }}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
                  >
                    Copy list to clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: COLLECTIONS */}
        {currentView === 'collections' && (
          <div className="col-span-12 max-w-4xl mx-auto py-8">
            <div className="mb-6">
              <h2 className="font-bold text-2xl mb-2 flex items-center gap-2">
                <BookOpen className="text-orange-500" size={28} />
                Recipe Collections
              </h2>
              <p className="text-slate-400 text-sm">Organize your favorite recipes into collections</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {collections.map(collection => (
                <div key={collection.id} className="p-5 rounded-2xl border backdrop-blur-2xl bg-white/5 border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{collection.name}</h3>
                      <p className="text-sm text-slate-400">{collection.description}</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">
                      {collection.recipeIds.length} recipes
                    </span>
                  </div>
                  {collection.recipeIds.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {collection.recipeIds.map(id => {
                        const recipe = recipes.find(r => r.id === id);
                        return recipe ? (
                          <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-sm text-slate-300">{recipe.title}</span>
                            <button
                              onClick={() => removeFromCollection(id, collection.id)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No recipes in this collection</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: MEAL PLANNING */}
        {currentView === 'mealplan' && (
          <div className="col-span-12 max-w-6xl mx-auto py-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-2xl sm:text-3xl mb-2 flex items-center gap-2">
                  <Calendar className="text-orange-500" size={28} />
                  Meal Planning
                </h2>
                <p className="text-slate-400 text-sm">Plan your meals for the week</p>
              </div>
              <button
                onClick={() => setMealPrepMode(!mealPrepMode)}
                className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all ${
                  mealPrepMode
                    ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {mealPrepMode ? 'Exit Meal Prep' : 'Meal Prep Mode'}
              </button>
            </div>
            
            {mealPrepMode && mealPrepRecipes.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl border backdrop-blur-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                <h3 className="font-semibold mb-3 text-slate-200 flex items-center gap-2">
                  <ChefHat className="text-orange-400" size={18} />
                  Meal Prep Recipes ({mealPrepRecipes.length})
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mealPrepRecipes.map(id => {
                    const recipe = recipes.find(r => r.id === id);
                    if (!recipe) return null;
                    return (
                      <div key={id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="text-sm text-slate-300">{recipe.title}</span>
                        <button
                          onClick={() => toggleMealPrep(id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      const allIngredients = mealPrepRecipes.flatMap(id => {
                        const recipe = recipes.find(r => r.id === id);
                        return recipe ? recipe.ingredients : [];
                      });
                      const uniqueIngredients = Array.from(new Set(allIngredients));
                      setShoppingList(prev => {
                        const combined = [...prev, ...uniqueIngredients.filter(i => !prev.includes(i.toLowerCase()))];
                        return Array.from(new Set(combined.map(i => i.toLowerCase()))).map(i => 
                          uniqueIngredients.find(orig => orig.toLowerCase() === i) || i
                        );
                      });
                      addToast('Ingredients added to shopping list!', 'success');
                    }}
                    className="w-full py-2.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 font-medium text-sm hover:bg-orange-500/30 transition-all"
                  >
                    Add All Ingredients to Shopping List
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                const dayPlan = mealPlan[day] || {};
                return (
                  <div key={day} className="p-4 rounded-2xl border backdrop-blur-2xl bg-white/5 border-white/10">
                    <h3 className="font-semibold mb-3 text-center text-sm sm:text-base">{day.slice(0, 3)}</h3>
                    <div className="space-y-2">
                      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(meal => {
                        const recipeId = dayPlan[meal];
                        const recipe = recipeId ? recipes.find(r => r.id === recipeId) : null;
                        return (
                          <div key={meal} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                            <div className="text-[10px] uppercase text-slate-500 mb-1">{meal}</div>
                            {recipe ? (
                              <div className="space-y-1">
                                <div className="text-xs text-slate-300 font-medium">{recipe.title}</div>
                                {mealPrepMode && (
                                  <button
                                    onClick={() => toggleMealPrep(recipe.id)}
                                    className={`text-[10px] px-2 py-0.5 rounded ${
                                      mealPrepRecipes.includes(recipe.id)
                                        ? 'bg-orange-500/20 text-orange-400'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                                  >
                                    {mealPrepRecipes.includes(recipe.id) ? 'Added' : 'Add to Prep'}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500">No recipe</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: RECIPE COMPARISON */}
        {currentView === 'compare' && (
          <div className="col-span-12 max-w-6xl mx-auto py-8">
            <div className="mb-6">
              <h2 className="font-bold text-2xl mb-2 flex items-center gap-2">
                <TrendingUp className="text-orange-500" size={28} />
                Compare Recipes
              </h2>
              <p className="text-slate-400 text-sm">Select up to 3 recipes to compare side-by-side</p>
            </div>
            {compareRecipes.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-medium">No recipes selected for comparison</p>
                <p className="text-sm mt-1">Click "Compare" on recipe cards to add them here</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {compareRecipes.map(id => {
                  const recipe = recipes.find(r => r.id === id);
                  if (!recipe) return null;
                  const nutrition = recipe.nutrition || getNutritionEstimate(recipe);
                  return (
                    <div key={id} className="p-5 rounded-2xl border backdrop-blur-2xl bg-white/5 border-white/10">
                      <h3 className="font-semibold text-lg mb-3">{recipe.title}</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Time</div>
                          <div className="text-slate-200">{recipe.time}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Difficulty</div>
                          <div className="text-slate-200">{recipe.difficulty}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Ingredients</div>
                          <div className="text-slate-200">{recipe.ingredients.length} items</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">Calories</div>
                          <div className="text-slate-200">{nutrition.calories} per serving</div>
                        </div>
                        <button
                          onClick={() => toggleCompare(id)}
                          className="w-full mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW: CUISINE EXPLORER */}
        {currentView === 'cuisine' && (
          <div className="col-span-12 max-w-6xl mx-auto py-8">
            <div className="mb-6">
              <h2 className="font-bold text-2xl mb-2 flex items-center gap-2">
                <MapPin className="text-orange-500" size={28} />
                Cuisine Explorer
              </h2>
              <p className="text-slate-400 text-sm">Explore recipes by regional cuisines</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(CUISINE_DATA).map(([cuisine, data]) => {
                const cuisineRecipes = recipes.filter(r => r.cuisine === cuisine);
                return (
                  <div key={cuisine} className="p-5 rounded-2xl border backdrop-blur-2xl bg-white/5 border-white/10">
                    <h3 className="font-semibold text-lg mb-1">{cuisine}</h3>
                    <div className="text-xs text-slate-500 mb-2">{data.region}</div>
                    <p className="text-sm text-slate-400 mb-3">{data.description}</p>
                    <div className="text-xs text-slate-500 mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {data.specialties.slice(0, 3).map(specialty => (
                        <span key={specialty} className="px-2 py-1 rounded-lg bg-white/5 text-[10px] text-slate-400">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mb-2">{cuisineRecipes.length} recipes available</div>
                    <button
                      onClick={() => {
                        setActiveCourse('All');
                        setSearchQuery(cuisine);
                        setCurrentView('home');
                      }}
                      className="w-full mt-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs hover:bg-orange-500/20"
                    >
                      View Recipes
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: HOME / SAVED / HISTORY */}
        {currentView !== 'about' && currentView !== 'settings' && currentView !== 'collections' && currentView !== 'mealplan' && currentView !== 'compare' && currentView !== 'cuisine' && (
          <>
            {/* LEFT SIDEBAR: PANTRY */}
            <div className={`lg:col-span-4 hidden lg:block`}>
              <div
                className={`
                  p-5 rounded-2xl border sticky top-24
                  backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]
                  bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                  border-white/[0.08]
                `}
              >
                <h2 className="font-bold flex items-center gap-3 mb-6 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 ring-1 ring-orange-500/30">
                    <ShoppingBag className="text-orange-400" size={20}/>
                  </div>
                  Your Pantry
                </h2>
                
                <div className="flex gap-2 mb-6">
                  <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIngredient(inputValue)}
                    placeholder="Add ingredient..."
                    className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all bg-black/30 border-white/[0.08] text-white placeholder-slate-500 text-sm"
                  />
                  <button 
                    onClick={() => addIngredient(inputValue)} 
                    className="magnetic-button px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-95 font-medium text-sm flex items-center gap-1.5"
                    aria-label="Add ingredient to pantry"
                  >
                    <Plus size={18}/>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-3">Quick Add</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_INGREDIENTS.slice(0, 12).map(ing => (
                      <button 
                        key={ing} 
                        onClick={() => addIngredient(ing)} 
                        disabled={myPantry.includes(ing.toLowerCase())} 
                        className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] disabled:opacity-20 disabled:cursor-not-allowed text-slate-300"
                        aria-label={`Add ${ing} to pantry`}
                        aria-disabled={myPantry.includes(ing.toLowerCase())}
                      >
                        + {ing}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 border-white/[0.06]">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">In Pantry <span className="text-orange-400">({myPantry.length})</span></span>
                      {myPantry.length > 0 && (
                        <button 
                          onClick={() => setMyPantry([])} 
                          className="text-[10px] text-red-400/80 hover:text-red-400 transition-colors font-medium"
                          aria-label="Clear all pantry items"
                        >
                          Clear All
                        </button>
                      )}
                   </div>
                   <div className="min-h-[80px] flex flex-wrap content-start gap-1.5">
                      {myPantry.map(ing => (
                        <span key={ing} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 text-orange-200 hover:border-orange-500/30 transition-all">
                          <span className="capitalize">{ing}</span> 
                          <button 
                            onClick={() => setMyPantry(p => p.filter(i => i !== ing))} 
                            className="opacity-50 group-hover:opacity-100 hover:text-red-400 transition-all"
                            aria-label={`Remove ${ing} from pantry`}
                          >
                            <X size={12}/>
                          </button>
                        </span>
                      ))}
                      {myPantry.length === 0 && (
                        <div className="w-full text-center py-6">
                          <p className="text-slate-500 text-sm">Your pantry is empty</p>
                          <p className="text-slate-600 text-xs mt-1">Add ingredients above to get started</p>
                        </div>
                      )}
                   </div>
                </div>

                {/* DISCOVER PANEL */}
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase flex items-center gap-2 text-slate-500">
                      <Sparkles size={13} className="text-orange-400/80" />
                      Discover
                    </h3>
                    <span className="text-[9px] uppercase tracking-[0.12em] text-slate-600 bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-0.5">
                      {recipes.length} recipes
                    </span>
                  </div>
                  {/* From your pantry */}
                  {myPantry.length > 0 && topMatches.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium text-slate-400">
                          Ready to cook
                        </span>
                        <span className="text-[9px] uppercase text-slate-600">
                          {myPantry.length} item{myPantry.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {topMatches.map((recipe) => (
                          <button
                            key={recipe.id}
                            type="button"
                            onClick={() => openRecipe(recipe)}
                            className="w-full text-left px-3 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all duration-200 bg-emerald-500/5 border-emerald-500/15 text-slate-200 hover:bg-emerald-500/10 hover:border-emerald-500/25"
                          >
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                                {recipe.cuisine}
                              </span>
                              <span className="text-[12px] font-medium line-clamp-1">
                                {recipe.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-400">
                              {recipe.percentage}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Trending */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Compass size={12} className="text-purple-400/80" />
                        Trending
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {trendingRecipes.slice(0, 3).map((recipe) => (
                        <button
                          key={recipe.id}
                          type="button"
                          onClick={() => openRecipe(recipe)}
                          className="w-full text-left px-3 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all duration-200 bg-white/[0.03] border-white/[0.06] text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.1]"
                        >
                          <span className="text-[12px] font-medium line-clamp-1">
                            {recipe.title}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {recipe.time}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Recipe Suggestions */}
                  {suggestedRecipes.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                          <TrendingUp size={12} className="text-blue-400/80" />
                          Suggested for you
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {suggestedRecipes.slice(0, 3).map((recipe) => (
                          <button
                            key={recipe.id}
                            type="button"
                            onClick={() => openRecipe(recipe)}
                            className="w-full text-left px-3 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all duration-200 bg-blue-500/5 border-blue-500/15 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/25"
                          >
                            <span className="text-[12px] font-medium line-clamp-1">
                              {recipe.title}
                            </span>
                            <span className="text-[10px] text-blue-400">
                              {recipe.time}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Daily tip */}
                  <div className="relative px-3.5 py-3 rounded-xl text-xs flex gap-3 bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10">
                    <div className="mt-0.5">
                      <Lightbulb size={14} className="text-amber-400/80" />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-400/60 mb-1">
                        Tip
                      </p>
                      <p className="text-[11px] leading-relaxed text-slate-400">{dailyTip}</p>
                    </div>
                  </div>
                </div>

                {/* ANALYTICS WITH VISUALIZATIONS */}
                <div className="mt-5 space-y-4">
                  {/* Most Cooked Recipe */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Most Cooked</span>
                    </div>
                    {historyIds.length > 0 ? (
                      <>
                        <div className="text-sm font-medium text-slate-200 mb-2 truncate">
                          {recipes.find(r => r.id === historyIds[0])?.title ?? '—'}
                        </div>
                        <ProgressBar
                          value={(historyIds.filter(id => id === historyIds[0]).length / historyIds.length) * 100}
                          color="orange"
                          size="sm"
                        />
                        <div className="text-xs text-slate-500 mt-1">
                          Cooked {historyIds.filter(id => id === historyIds[0]).length} time{historyIds.filter(id => id === historyIds[0]).length !== 1 ? 's' : ''}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-500">No cooking history yet</div>
                    )}
                  </div>

                  {/* Average Cook Time */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Cook Time</span>
                    </div>
                    {(() => {
                      if (!historyIds.length) return <div className="text-sm text-slate-500">No data</div>;
                      const times = historyIds
                        .map(id => recipes.find(r => r.id === id))
                        .filter(Boolean)
                        .map(r => {
                          const n = parseInt((r as any).time, 10);
                          return isNaN(n) ? 0 : n;
                        });
                      if (!times.length) return <div className="text-sm text-slate-500">No data</div>;
                      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
                      const maxTime = Math.max(...times, 60);
                      return (
                        <>
                          <div className="text-2xl font-bold text-slate-200 mb-2">{avg} mins</div>
                          <ProgressBar
                            value={(avg / maxTime) * 100}
                            color="blue"
                            size="sm"
                          />
                          <div className="text-xs text-slate-500 mt-1">
                            Based on {times.length} recipe{times.length !== 1 ? 's' : ''}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Cooking Streak */}
                  {historyIds.length > 0 && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">This Week</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-200 mb-2">
                        {new Set(historyIds.slice(0, 7)).size} recipes
                      </div>
                      <ProgressBar
                        value={(new Set(historyIds.slice(0, 7)).size / 7) * 100}
                        color="green"
                        size="sm"
                      />
                      <div className="text-xs text-slate-500 mt-1">Unique recipes cooked</div>
                    </div>
                  )}
                </div>

                {/* PANTRY PRESETS */}
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-3">
                    Quick Presets
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: '🍳 South Indian',
                        items: ['rice', 'urad dal', 'poha', 'curd', 'potato'],
                      },
                      {
                        label: '🍛 North Indian',
                        items: ['wheat flour', 'potato', 'paneer', 'tomato', 'onion'],
                      },
                      {
                        label: '🎉 Party Mode',
                        items: ['chicken', 'paneer', 'biryani rice', 'curd', 'snacks'],
                      },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => preset.items.forEach(i => addIngredient(i))}
                        className="px-3 py-2 rounded-lg text-[11px] font-medium bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RECIPE GRID */}
            <div className="lg:col-span-8 col-span-12">
               {/* Mobile Pantry Input */}
               <div className="lg:hidden mb-5">
                 <div className="p-3 rounded-2xl border flex gap-2 bg-white/[0.04] border-white/[0.08] backdrop-blur-xl">
                    <input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addIngredient(inputValue)}
                      placeholder="Add ingredients..."
                      className="flex-1 bg-transparent focus:outline-none text-sm placeholder-slate-500"
                    />
                    <button onClick={() => addIngredient(inputValue)} className="text-orange-400 font-semibold px-3 text-sm">Add</button>
                 </div>
                 {myPantry.length > 0 && (
                   <div className="flex gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
                      {myPantry.map(ing => (
                        <span key={ing} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-orange-500/10 border border-orange-500/20 text-orange-200 capitalize">{ing}</span>
                      ))}
                   </div>
                 )}
               </div>

               {/* FILTERS – GLASS PANEL */}
               <div className="mb-6 sticky top-24 z-30">
                 <div
                   className={`
                     flex flex-col gap-3
                     rounded-2xl border px-4 py-3 md:px-5 md:py-4
                     backdrop-blur-2xl
                     shadow-[0_8px_40px_rgba(0,0,0,0.5)]
                     bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                     border-white/[0.08]
                   `}
                 >
                   {/* Top row: Course tabs + toggles */}
                   <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                     {/* Course tabs */}
                     <div className="flex w-full md:w-auto overflow-x-auto gap-1.5 no-scrollbar">
                       {COURSE_FILTERS.map(({ value, label }) => (
                         <button
                           key={value}
                           onClick={() => setActiveCourse(value)}
                           className={`
                             px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap
                             transition-all duration-200
                             ${activeCourse === value
                               ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                               : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                             }
                           `}
                         >
                           {label}
                         </button>
                       ))}
                     </div>
                     {/* Right side controls */}
                     <div className="flex items-center gap-2">
                       {/* Advanced filters button */}
                       <button
                         onClick={() => setShowFilters(!showFilters)}
                         className={`
                           flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium
                           border transition-all duration-200
                           ${showFilters
                             ? 'bg-white/[0.1] border-white/[0.15] text-white'
                             : 'border-white/[0.08] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                           }
                         `}
                       >
                         <Filter size={13} />
                         Filters
                         {(activeDifficulty !== 'All' || maxTime > 0 || searchFilters.minRating > 0 || selectedCourses.length > 0) && (
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                         )}
                       </button>
                       {/* All / Cook Now toggle */}
                       <div
                         className={`
                           flex items-center gap-1 rounded-xl border p-1
                           bg-black/40 border-white/[0.08]
                         `}
                       >
                         <button
                           onClick={() => setActiveTab('all')}
                           className={`
                             px-4 py-1.5 rounded-lg text-[12px] font-medium
                             transition-all duration-200
                             ${activeTab === 'all'
                               ? 'bg-white/[0.12] text-white'
                               : 'text-slate-400 hover:text-slate-200'
                             }
                           `}
                         >
                           All
                         </button>
                         <button
                           onClick={() => setActiveTab('possible')}
                          className={`
                            px-4 py-1.5 rounded-lg text-[12px] font-medium
                            transition-all duration-200
                            ${activeTab === 'possible'
                              ? 'bg-emerald-500/90 text-white shadow-sm shadow-emerald-500/30'
                              : 'text-slate-400 hover:text-slate-200'
                            }
                          `}
                        >
                          Cook Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filter Chips */}
                  {(activeCourse !== 'All' || activeDifficulty !== 'All' || maxTime > 0 || searchFilters.minRating > 0 || selectedCourses.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">Active Filters:</span>
                      {activeCourse !== 'All' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-medium">
                          {activeCourse}
                          <button
                            onClick={() => setActiveCourse('All')}
                            className="hover:text-orange-200"
                            aria-label={`Remove ${activeCourse} filter`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {selectedCourses.map(course => (
                        <span key={course} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                          {course}
                          <button
                            onClick={() => setSelectedCourses(prev => prev.filter(c => c !== course))}
                            className="hover:text-blue-200"
                            aria-label={`Remove ${course} filter`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      {activeDifficulty !== 'All' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                          {activeDifficulty}
                          <button
                            onClick={() => setActiveDifficulty('All')}
                            className="hover:text-emerald-200"
                            aria-label={`Remove ${activeDifficulty} filter`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {maxTime > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium">
                          {TIME_FILTERS.find(f => f.value === maxTime)?.label}
                          <button
                            onClick={() => setMaxTime(0)}
                            className="hover:text-purple-200"
                            aria-label="Remove time filter"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {searchFilters.minRating > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium">
                          {searchFilters.minRating}+ ⭐
                          <button
                            onClick={() => setSearchFilters(prev => ({ ...prev, minRating: 0 }))}
                            className="hover:text-yellow-200"
                            aria-label="Remove rating filter"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setActiveCourse('All');
                          setActiveDifficulty('All');
                          setMaxTime(0);
                          setSelectedCourses([]);
                          setSearchFilters(prev => ({ ...prev, minRating: 0 }));
                        }}
                        className="ml-auto text-[11px] text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-500/10 transition-all font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Advanced Filters Panel */}
                  {showFilters && (
                    <div className="space-y-4 pt-3 border-t border-white/10">
                      {/* Filter Presets */}
                      <div className="mb-4">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 block">Quick Presets:</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Quick Meals', difficulty: 'Easy' as Difficulty, time: 30 },
                            { label: 'Weekend Cooking', difficulty: 'Hard' as Difficulty, time: 90 },
                            { label: 'Beginner Friendly', difficulty: 'Easy' as Difficulty, time: 60 },
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveDifficulty(preset.difficulty);
                                setMaxTime(preset.time);
                              }}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Course - Multi-select */}
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Course:</span>
                          <div className="flex gap-1 flex-wrap flex-1">
                            {COURSE_FILTERS.filter(f => f.value !== 'All').map(({ value, label }) => {
                              const isSelected = selectedCourses.includes(value as Course);
                              return (
                                <button
                                  key={value}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedCourses(prev => prev.filter(c => c !== value));
                                    } else {
                                      setSelectedCourses(prev => [...prev, value as Course]);
                                      setActiveCourse('All'); // Clear single select
                                    }
                                  }}
                                  className={`
                                    px-3 py-1 rounded-full text-[11px] font-semibold
                                    transition-all
                                    ${isSelected
                                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                                    }
                                  `}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {/* Difficulty */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Difficulty:</span>
                          <div className="flex gap-1 flex-wrap">
                            {DIFFICULTY_FILTERS.map(({ value, label, color }) => (
                              <button
                                key={value}
                                onClick={() => setActiveDifficulty(value)}
                                className={`
                                  px-3 py-1 rounded-full text-[11px] font-semibold
                                  transition-all
                                  ${activeDifficulty === value
                                    ? 'bg-white/15 text-white'
                                    : `${color} hover:bg-white/10`
                                  }
                                `}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Time */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Time:</span>
                          <div className="flex gap-1 flex-wrap">
                            {TIME_FILTERS.map(({ value, label }) => (
                              <button
                                key={value}
                                onClick={() => setMaxTime(value)}
                                className={`
                                  px-3 py-1 rounded-full text-[11px] font-semibold
                                  transition-all
                                  ${maxTime === value
                                    ? 'bg-white/15 text-white'
                                    : 'text-slate-300 hover:bg-white/10'
                                  }
                                `}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Filters */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
                        {/* Rating Filter */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Min Rating:</span>
                          <div className="flex gap-1">
                            {[0, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                onClick={() => setSearchFilters(prev => ({ ...prev, minRating: rating }))}
                                className={`
                                  px-2.5 py-1 rounded-lg text-[11px] font-semibold
                                  transition-all
                                  ${searchFilters.minRating === rating
                                    ? 'bg-white/15 text-white'
                                    : 'text-slate-400 hover:bg-white/10'
                                  }
                                `}
                              >
                                {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

               {/* Recipe Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-8">
                  {paginatedRecipes.map((recipe, index) => {
                    const isCookable = recipe.missing.length === 0;
                    const isLeftColumn = index % 2 === 0;
                    const glowColor = isCookable
                      ? 'rgba(52, 211, 153, 0.55)'   // emerald for "cook now"
                      : 'rgba(255, 140, 0, 0.55)';   // orange for others
                    const lateralOffset = isLeftColumn ? '-18px' : '18px';
                    const hoverGlowClass = `hover:shadow-[0_22px_60px_rgba(0,0,0,0.9),_${lateralOffset}_0_44px_${glowColor}]`;
                    return (
                      <div
                        key={recipe.id}
                        onClick={() => openRecipe(recipe)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openRecipe(recipe);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={`
                          group relative flex flex-col rounded-[1.75rem] cursor-pointer
                          bg-gradient-to-b from-white/[0.07] to-white/[0.03]
                          backdrop-blur-2xl
                          border border-white/[0.08]
                          overflow-hidden
                          transition-all duration-300 ease-out
                          transform-gpu will-change-transform
                          hover:-translate-y-1.5 hover:border-white/[0.15]
                          focus:outline-none focus:ring-2 focus:ring-orange-500/50
                          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                          hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                          ${hoverGlowClass}
                          stagger-item
                        `}
                        style={{
                          animationDelay: `${index * 0.05}s`,
                        }}
                        aria-label={`View recipe: ${recipe.title}`}
                      >
                         
                         <div className="h-52 relative overflow-hidden bg-slate-900/50">
                            <RecipeImage
                              recipe={recipe}
                              className="relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"/>
                            
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                               <button
                                 onClick={(e) => { e.stopPropagation(); toggleSave(recipe.id, recipe.title); }}
                                 aria-label={`${savedIds.includes(recipe.id) ? 'Remove' : 'Save'} ${recipe.title}`}
                                 className={`
                                   p-2 rounded-full backdrop-blur-md
                                   transition-transform duration-150 hover:scale-110 active:scale-95
                                   ${savedIds.includes(recipe.id)
                                     ? 'bg-red-500 text-white'
                                     : 'bg-black/30 text-white hover:bg-black/50'}
                                 `}
                               >
                                 <Heart
                                   size={18}
                                   className="transition-transform duration-150"
                                   fill={savedIds.includes(recipe.id) ? 'currentColor' : 'none'}
                                 />
                               </button>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                               <div className="text-white">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[9px] font-semibold uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">{recipe.cuisine}</span>
                                    {isCookable && <span className="text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/90 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/20"><CheckCircle2 size={10} strokeWidth={2.5}/> Ready</span>}
                                  </div>
                                  <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-lg">{recipe.title}</h3>
                                  {mounted && recipeRatings[recipe.id]?.rating && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <span className="text-yellow-400 text-xs">★</span>
                                      <span className="text-xs text-white/80">{recipeRatings[recipe.id].rating}/5</span>
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>

                         <div className="p-5 flex-grow flex flex-col">
                            {/* stats */}
                            <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium mb-5 flex-wrap">
                              <span className="flex items-center gap-1.5 text-slate-200 bg-white/[0.05] px-2.5 py-1 rounded-lg">
                                <Clock size={13} className="text-orange-400" />
                                {recipe.time}
                              </span>
                              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                                recipe.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                recipe.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                <Zap size={13} />
                                {recipe.difficulty}
                              </span>
                              {mounted && recipeRatings[recipe.id]?.rating && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400">
                                  <span className="text-xs">★</span>
                                  <span className="text-[11px]">{recipeRatings[recipe.id].rating}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1 ml-auto text-[10px] uppercase tracking-wider text-slate-400">
                                {recipe.ingredients.length} items
                              </span>
                            </div>
                            {/* progress */}
                            <div className="mt-auto pt-4 border-t border-white/[0.05]">
                              <div className="h-1 w-full rounded-full overflow-hidden mb-2.5 bg-white/[0.08]">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                                    isCookable 
                                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                                      : 'bg-gradient-to-r from-orange-500 to-amber-400'
                                  }`}
                                  style={{ width: `${recipe.percentage}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] font-medium tracking-wide">
                                <span className="text-slate-400">{recipe.have.length} in pantry</span>
                                <span className={isCookable ? 'text-emerald-400' : 'text-orange-400'}>{recipe.percentage}% match</span>
                              </div>
                            </div>
                         </div>
                      </div>
                    )
                  })}
                  {filteredRecipes.length === 0 && (
                     <div className="col-span-full py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                          <Utensils size={48} className="text-orange-400/50" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-200">No recipes found</h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                          {searchQuery 
                            ? `No recipes match "${searchQuery}". Try a different search term.`
                            : activeTab === 'possible'
                            ? "Add some ingredients to your pantry to see recipes you can cook right now!"
                            : "Try adding some basic ingredients like 'Onion', 'Rice', or 'Chicken' to see matching recipes."
                          }
                        </p>
                        {!searchQuery && activeTab === 'all' && (
                          <button
                            onClick={() => {
                              setMyPantry(['Onion', 'Rice', 'Tomato', 'Chicken', 'Ginger', 'Garlic']);
                              setSearchQuery('');
                              addToast('Sample ingredients added!', 'success');
                            }}
                            className="px-6 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all font-medium text-sm"
                          >
                            Add Sample Ingredients
                          </button>
                        )}
                     </div>
                  )}
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 mb-16 flex justify-center">
                      <div className="overflow-x-auto no-scrollbar">
                        <div
                          className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 backdrop-blur-2xl border bg-white/[0.04] border-white/[0.06]"
                        >
                          {/* Prev button */}
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`
                              w-8 h-8 rounded-lg flex items-center justify-center text-sm
                              transition-all duration-200
                              ${currentPage === 1
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-400 hover:bg-white/[0.08] hover:text-white'
                              }
                            `}
                          >
                            ‹
                          </button>
                          {/* Page numbers with ellipsis */}
                          {visiblePages.map((p, idx) =>
                            p === 'dots' ? (
                              <span
                                key={`dots-${idx}`}
                                className="px-1.5 text-[11px] text-slate-600"
                              >
                                …
                              </span>
                            ) : (
                              <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`
                                  min-w-[2rem] h-8 rounded-lg text-[12px] font-medium
                                  flex items-center justify-center px-2
                                  transition-all duration-200
                                  ${currentPage === p
                                    ? 'bg-white/[0.12] text-white'
                                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                                  }
                                `}
                              >
                                {p}
                              </button>
                            )
                          )}
                          {/* Next button */}
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`
                              w-8 h-8 rounded-lg flex items-center justify-center text-sm
                              transition-all duration-200
                              ${currentPage === totalPages
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-400 hover:bg-white/[0.08] hover:text-white'
                              }
                            `}
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
               </div>
            </div>
          </>
        )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Branding Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-tr from-orange-500 to-red-600 p-2 rounded-xl text-white shadow-lg shadow-orange-500/30 ring-1 ring-white/10">
                  <ChefHat size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight cal-sans-regular bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    MasalaVault
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Your Spice Vault, Your Recipes</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Your comprehensive Indian cooking companion. Discover, organize, and master authentic recipes.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://github.com/Me-Kalyan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-orange-400 transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/masalavault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-orange-400 transition-all"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('saved')}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    Saved Recipes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('collections')}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    Collections
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('mealplan')}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    Meal Plan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('about')}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider">Features</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-slate-400">Recipe Discovery</span>
                </li>
                <li>
                  <span className="text-sm text-slate-400">Pantry Management</span>
                </li>
                <li>
                  <span className="text-sm text-slate-400">Meal Planning</span>
                </li>
                <li>
                  <span className="text-sm text-slate-400">Shopping Lists</span>
                </li>
                <li>
                  <span className="text-sm text-slate-400">Cooking Timers</span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} MasalaVault. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Made with <span className="text-red-500">❤️</span> for Indian cooking enthusiasts
            </p>
          </div>
        </div>
      </footer>

      {/* MOBILE DOCK NAV */}
      {mounted && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 flex justify-center pb-3 pointer-events-none">
          <Dock
            items={mobileDockItems}
            panelHeight={64}
            baseItemSize={44}
            magnification={64}
            className="pointer-events-auto"
          />
        </div>
      )}

      {/* MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl">
           <div
             className="w-full max-w-4xl max-h-[95vh] sm:max-h-[85vh] rounded-xl sm:rounded-2xl flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-white/[0.08] backdrop-blur-2xl"
           >
              
              <div className="relative h-56 md:h-64 shrink-0">
                <RecipeImage recipe={selectedRecipe} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"/>
                <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-md transition-colors border border-white/[0.08]" aria-label="Close recipe"><X size={18}/></button>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                   <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-[10px] font-semibold uppercase tracking-wider mb-2 inline-block shadow-lg shadow-orange-500/20">{selectedRecipe.cuisine}</span>
                   <h2 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg">{selectedRecipe.title}</h2>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-5 md:p-7">
                 <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-5">
                       {/* Servings Adjuster */}
                       <div className="mb-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-[11px] font-medium text-slate-500 flex items-center gap-2">
                             <Scale size={14} className="text-orange-400" />
                             Servings
                           </span>
                           <div className="flex items-center gap-2">
                             <button
                               onClick={() => {
                                 const current = recipeServings[selectedRecipe.id] || 4;
                                 if (current > 1) updateServings(selectedRecipe.id, current - 1);
                               }}
                               className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-white/[0.1] transition-all"
                             >
                               <Minus size={14} />
                             </button>
                             <span className="text-sm font-semibold text-slate-200 w-8 text-center">
                               {recipeServings[selectedRecipe.id] || 4}
                             </span>
                             <button
                               onClick={() => {
                                 const current = recipeServings[selectedRecipe.id] || 4;
                                 if (current < 12) updateServings(selectedRecipe.id, current + 1);
                               }}
                               className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-white/[0.1] transition-all"
                             >
                               <PlusIcon size={14} />
                             </button>
                           </div>
                         </div>
                       </div>

                       <h3 className="font-semibold flex items-center gap-2 mb-4 text-slate-200 text-sm">
                         <div className="p-1.5 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/30">
                           <ShoppingBag size={16} className="text-orange-400"/>
                         </div>
                         Ingredients
                         <span className="ml-auto text-[10px] text-slate-500 font-normal">{selectedRecipe.ingredients.length} items</span>
                       </h3>
                       <div className="space-y-1.5">
                          {selectedRecipe.ingredients.map((ing: string) => {
                             const have = selectedRecipe.have?.includes(ing) ?? false;
                             const servings = recipeServings[selectedRecipe.id] || 4;
                             const scale = servings / 4;
                             const scaledIng = scale !== 1 ? scaleIngredient(ing, scale) : ing;
                             const subs = getSubstitutions(ing);
                             return (
                                <div key={ing} className={`px-3.5 py-2.5 rounded-xl border ${have ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/[0.03] border-white/[0.06]'}`}>
                                   <div className="flex items-center gap-3 text-[13px] font-medium transition-all">
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${have ? 'bg-emerald-500 text-white' : 'bg-white/[0.08] border border-white/[0.1]'}`}>{have && <CheckCircle2 size={10} strokeWidth={3}/>}</div>
                                      <span className={`capitalize flex-1 ${have ? 'text-emerald-200' : 'text-slate-400'}`}>{scaledIng}</span>
                                      {isSeasonal(ing) && <span className="text-[10px] text-emerald-400" title="In season">🍃</span>}
                                   </div>
                                   {!have && subs.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-white/[0.05]">
                                         <div className="text-[10px] text-slate-500 mb-1">Substitutes:</div>
                                         <div className="flex flex-wrap gap-1.5">
                                            {subs.map(sub => (
                                               <button
                                                  key={sub}
                                                  onClick={() => addIngredient(sub)}
                                                  className="px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[10px] text-slate-400 hover:bg-white/[0.1] hover:text-slate-300 transition-all"
                                               >
                                                  {sub}
                                               </button>
                                            ))}
                                         </div>
                                      </div>
                                   )}
                                </div>
                             )
                          })}
                       </div>

                       {/* Nutrition Info */}
                       {(() => {
                          const nutrition = selectedRecipe.nutrition || getNutritionEstimate(selectedRecipe);
                          const servings = recipeServings[selectedRecipe.id] || 4;
                          return (
                             <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <h4 className="text-[11px] font-medium text-slate-500 mb-3 flex items-center gap-2">
                                   <Apple size={14} className="text-orange-400" />
                                   Nutrition (per serving)
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                   <div>
                                      <div className="text-slate-400">Calories</div>
                                      <div className="text-slate-200 font-semibold">{Math.round((nutrition.calories / 4) * servings)}</div>
                                   </div>
                                   <div>
                                      <div className="text-slate-400">Protein</div>
                                      <div className="text-slate-200 font-semibold">{Math.round((nutrition.protein / 4) * servings)}g</div>
                                   </div>
                                   <div>
                                      <div className="text-slate-400">Carbs</div>
                                      <div className="text-slate-200 font-semibold">{Math.round((nutrition.carbs / 4) * servings)}g</div>
                                   </div>
                                   <div>
                                      <div className="text-slate-400">Fat</div>
                                      <div className="text-slate-200 font-semibold">{Math.round((nutrition.fat / 4) * servings)}g</div>
                                   </div>
                                </div>
                             </div>
                          );
                       })()}

                       {/* Difficulty Breakdown */}
                       {(() => {
                          const reasons = getDifficultyReasons(selectedRecipe);
                          return reasons.length > 0 && (
                             <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <h4 className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-2">
                                   <Info size={14} className="text-orange-400" />
                                   Why {selectedRecipe.difficulty}?
                                </h4>
                                <ul className="space-y-1.5">
                                   {reasons.map((reason, i) => (
                                      <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2">
                                         <span className="text-orange-400 mt-0.5">•</span>
                                         <span>{reason}</span>
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          );
                       })()}

                       {/* Spice Level */}
                       <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                         <div className="flex items-center justify-between">
                           <span className="text-[11px] font-medium text-slate-500">Spice Level</span>
                           <div className="flex gap-0.5">
                             {[1, 2, 3, 4, 5].map((level) => {
                               const recipeSpice = selectedRecipe.difficulty === 'Hard' ? 4 : selectedRecipe.difficulty === 'Medium' ? 3 : 2;
                               return (
                                 <span
                                   key={level}
                                   className={`text-sm ${level <= recipeSpice ? '' : 'opacity-20'}`}
                                 >
                                   🌶️
                                 </span>
                               );
                             })}
                           </div>
                         </div>
                       </div>

                       {/* Recipe Rating */}
                       <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                         <h4 className="text-[11px] font-medium text-slate-500 mb-3 flex items-center gap-2">
                           <Sparkles size={14} className="text-orange-400" />
                           Your Rating
                         </h4>
                         <div className="flex items-center gap-2 mb-3">
                           {[1, 2, 3, 4, 5].map((star) => {
                             const currentRating = recipeRatings[selectedRecipe.id]?.rating || 0;
                             return (
                               <button
                                 key={star}
                                 onClick={() => rateRecipe(selectedRecipe.id, star)}
                                 className={`text-2xl transition-all ${
                                   star <= currentRating
                                     ? 'text-yellow-400 scale-110'
                                     : 'text-slate-600 hover:text-yellow-400/50'
                                 }`}
                                 aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                               >
                                 ★
                               </button>
                             );
                           })}
                           {recipeRatings[selectedRecipe.id]?.rating && (
                             <span className="text-xs text-slate-400 ml-2">
                               {recipeRatings[selectedRecipe.id].rating}/5
                             </span>
                           )}
                         </div>
                         {recipeRatings[selectedRecipe.id]?.rating && (
                           <textarea
                             placeholder="Write a review (optional)..."
                             value={recipeRatings[selectedRecipe.id]?.review || ''}
                             onChange={(e) => {
                               const rating = recipeRatings[selectedRecipe.id]?.rating || 0;
                               rateRecipe(selectedRecipe.id, rating, e.target.value);
                             }}
                             className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/[0.06] text-[12px] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 resize-none transition-all"
                             rows={2}
                           />
                         )}
                       </div>

                       {/* Recipe Notes */}
                       <div className="mt-4">
                         <h4 className="text-[11px] font-medium text-slate-500 mb-2">Personal Notes</h4>
                         <textarea
                           placeholder="Add notes..."
                           value={recipeNotes[selectedRecipe.id] || ''}
                           onChange={(e) => setRecipeNotes(prev => ({ ...prev, [selectedRecipe.id]: e.target.value }))}
                           className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/[0.06] text-[13px] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/30 resize-none transition-all"
                           rows={2}
                         />
                         {recipeNotes[selectedRecipe.id] && (
                           <button
                             onClick={() => saveNote(selectedRecipe.id, recipeNotes[selectedRecipe.id])}
                             className="mt-1.5 text-[11px] text-orange-400 hover:text-orange-300 font-medium"
                           >
                             Save note
                           </button>
                         )}
                       </div>
                    </div>
                    <div className="md:col-span-7">
                       {/* Video Tutorial */}
                       {selectedRecipe.videoUrl && (
                          <div className="mb-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                             <h4 className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-2">
                                <Video size={14} className="text-orange-400" />
                                Video Tutorial
                             </h4>
                             <a
                                href={selectedRecipe.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[12px] text-slate-300 hover:bg-white/[0.1] transition-all"
                             >
                                <Play size={14} className="text-orange-400" />
                                Watch on YouTube
                             </a>
                          </div>
                       )}

                       <h3 className="font-semibold flex items-center gap-2 mb-4 text-slate-200 text-sm">
                         <div className="p-1.5 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/30">
                           <ChefHat size={16} className="text-orange-400"/>
                         </div>
                         Preparation
                         <span className="ml-auto text-[10px] text-slate-500 font-normal">{selectedRecipe.instructions.length} steps</span>
                       </h3>
                       <div className="space-y-4 pl-5 relative">
                          <div className="absolute left-[19px] top-5 bottom-5 w-[2px] bg-gradient-to-b from-orange-500/30 via-white/10 to-transparent rounded-full"/>
                          {selectedRecipe.instructions.map((step: string, i: number) => {
                             const timerMatch = step.match(/(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs)/i);
                             const hasTimer = timerMatch !== null;
                             const timerDuration = hasTimer ? parseTime(timerMatch[0]) : 0;
                             return (
                                <div key={i} className="relative flex gap-4">
                                   <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border z-10 text-lg bg-slate-900 border-white/[0.08] shadow-sm">{getStepEmoji(step)}</div>
                                   <div className="pt-0.5 flex-1">
                                      <div className="flex items-center gap-2 mb-0.5">
                                         <span className="text-[9px] font-semibold uppercase text-slate-500 tracking-[0.15em]">Step {i + 1}</span>
                                         {hasTimer && (
                                            <button
                                               onClick={() => addTimer(i, timerDuration, `Step ${i + 1}`, selectedRecipe.id)}
                                               className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 hover:bg-orange-500/20 transition-all"
                                            >
                                               <Timer size={10} />
                                               {formatTime(timerDuration)}
                                            </button>
                                         )}
                                      </div>
                                      <p className="text-[13px] leading-relaxed text-slate-300">{step}</p>
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="px-5 py-4 border-t flex flex-wrap gap-2.5 justify-between items-center shrink-0 bg-slate-950/80 border-white/[0.06]">
                 <div className="flex gap-2 flex-wrap">
                   <button
                     onClick={() => toggleSave(selectedRecipe.id, selectedRecipe.title)}
                     className={`px-3.5 py-2.5 rounded-xl border font-medium text-[13px] flex items-center gap-2 transition-all ${
                       savedIds.includes(selectedRecipe.id)
                         ? 'bg-red-500/10 border-red-500/30 text-red-400'
                         : 'border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                     }`}
                   >
                     <Heart
                       size={16}
                       className="transition-transform duration-150"
                       fill={savedIds.includes(selectedRecipe.id) ? 'currentColor' : 'none'}
                     />
                     {savedIds.includes(selectedRecipe.id) ? 'Saved' : 'Save'}
                   </button>
                   <button
                     onClick={() => addToShoppingList(selectedRecipe.missing ?? selectedRecipe.ingredients)}
                     disabled={(selectedRecipe.missing?.length ?? selectedRecipe.ingredients.length) === 0}
                     className="px-3.5 py-2.5 rounded-xl border font-medium text-[13px] flex items-center gap-2 transition-all border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                   >
                     <ClipboardList size={16} />
                     <span className="hidden sm:inline">Add {selectedRecipe.missing?.length ?? selectedRecipe.ingredients.length} to list</span>
                     <span className="sm:hidden">{selectedRecipe.missing?.length ?? selectedRecipe.ingredients.length}</span>
                   </button>
                   <button
                     onClick={() => toggleCompare(selectedRecipe.id)}
                     className={`px-3.5 py-2.5 rounded-xl border font-medium text-[13px] flex items-center gap-2 transition-all ${
                       compareRecipes.includes(selectedRecipe.id)
                         ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                         : 'border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                     }`}
                     aria-label="Compare recipe"
                   >
                     <TrendingUp size={16} />
                     <span className="hidden sm:inline">Compare</span>
                   </button>
                   <button
                     onClick={() => {
                       toggleMealPrep(selectedRecipe.id);
                       if (!mealPrepRecipes.includes(selectedRecipe.id)) {
                         addToast('Added to meal prep', 'success');
                       }
                     }}
                     className={`px-3.5 py-2.5 rounded-xl border font-medium text-[13px] flex items-center gap-2 transition-all ${
                       mealPrepRecipes.includes(selectedRecipe.id)
                         ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                         : 'border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                     }`}
                     aria-label="Add to meal prep"
                   >
                     <ChefHat size={16} />
                     <span className="hidden sm:inline">Meal Prep</span>
                   </button>
                   <button
                     onClick={() => shareRecipe(selectedRecipe)}
                     className="p-2.5 rounded-xl border transition-all border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                     title="Share"
                   >
                     <Share2 size={16} />
                   </button>
                   <button
                     onClick={() => printRecipe(selectedRecipe)}
                     className="p-2.5 rounded-xl border transition-all border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                     title="Print"
                   >
                     <Printer size={16} />
                   </button>
                   <div className="relative group">
                     <button
                       className="p-2.5 rounded-xl border transition-all border-white/[0.08] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                       title="Export"
                     >
                       <Download size={16} />
                     </button>
                     <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                        <div className="bg-slate-800 border border-white/[0.1] rounded-lg p-1 shadow-xl">
                           <button
                              onClick={() => exportRecipe(selectedRecipe, 'text')}
                              className="w-full px-3 py-2 text-left text-[12px] text-slate-300 hover:bg-white/[0.05] rounded-lg flex items-center gap-2"
                           >
                              <Copy size={14} />
                              Export as Text
                           </button>
                           <button
                              onClick={() => exportRecipe(selectedRecipe, 'json')}
                              className="w-full px-3 py-2 text-left text-[12px] text-slate-300 hover:bg-white/[0.05] rounded-lg flex items-center gap-2"
                           >
                              <Download size={14} />
                              Export as JSON
                           </button>
                        </div>
                     </div>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button
                     onClick={() => startCookMode(selectedRecipe)}
                     className="px-5 py-2.5 rounded-xl font-semibold text-[13px] bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all"
                   >
                     Start Cooking
                   </button>
                   <button
                     onClick={() => setSelectedRecipe(null)}
                     className="px-5 py-2.5 bg-white/[0.06] text-slate-300 rounded-xl font-medium text-[13px] border border-white/[0.08] hover:bg-white/[0.1] transition-all"
                   >
                     Close
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <CookModeOverlay
        recipe={cookModeRecipe}
        stepIndex={cookStepIndex}
        onStepChange={setCookStepIndex}
        onClose={closeCookMode}
        onComplete={handleCookComplete}
      />

      {/* Active Timers */}
      {activeTimers.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50 space-y-2">
          {activeTimers.map(timer => (
            <div
              key={timer.id}
              className="p-4 rounded-xl border backdrop-blur-2xl bg-slate-900/95 border-white/10 shadow-xl min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer size={16} className="text-orange-400" />
                  <span className="text-sm font-semibold text-slate-200">{timer.label}</span>
                </div>
                <button
                  onClick={() => removeTimer(timer.id)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {formatTime(timer.remaining)}
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000"
                  style={{ width: `${(timer.remaining / timer.duration) * 100}%` }}
                />
              </div>
              {timer.remaining === 0 && (
                <div className="mt-2 text-xs text-emerald-400 font-semibold">Time's up! ⏰</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
};

export default App;
