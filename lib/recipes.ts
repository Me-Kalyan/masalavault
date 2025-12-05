/**
 * Recipe data generation and utilities
 * Complete recipe database with core recipes, generator, and helper functions
 */

import type { Recipe, Course, Difficulty } from '@/types/recipe';
import { getRecipeImageUrl } from './image-utils';

// --- FILTER CONSTANTS ---
export const COURSE_FILTERS: { value: Course | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Snack', label: 'Snack' },
  { value: 'Beverage', label: 'Drinks' },
];

export const DIFFICULTY_FILTERS: { value: Difficulty | 'All'; label: string; color: string }[] = [
  { value: 'All', label: 'Any Level', color: 'text-slate-300' },
  { value: 'Easy', label: 'Easy', color: 'text-emerald-400' },
  { value: 'Medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'Hard', label: 'Hard', color: 'text-red-400' },
];

export const TIME_FILTERS = [
  { value: 0, label: 'Any Time' },
  { value: 30, label: '< 30 min' },
  { value: 60, label: '< 1 hour' },
  { value: 90, label: '< 1.5 hours' },
];

// --- HELPER FUNCTIONS ---
export const getStepEmoji = (text: string) => {
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

export const scaleIngredient = (ingredient: string, scale: number): string => {
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

export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  return `${hours}h ${mins}m`;
};

export const getDifficultyReasons = (recipe: Recipe): string[] => {
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

// --- CONSTANTS ---
export const COMMON_INGREDIENTS = [
  "Rice", "Atta", "Besan", "Potato", "Onion", "Tomato", "Milk", 
  "Yogurt", "Paneer", "Chicken", "Egg", "Bread", "Ghee", 
  "Toor Dal", "Moong Dal", "Chickpeas", "Mustard Seeds", "Cumin", "Ginger", "Garlic", "Coriander"
];

export const DAILY_TIPS = [
  "Add a pinch of sugar to balance very spicy curries.",
  "Toast your dry spices in a pan before grinding for deeper flavour.",
  "Always add garam masala near the end so it stays aromatic.",
  "Use leftover rice for quick pulao with just onions and whole spices.",
  "Save pasta water or dal water to adjust curry consistency instead of plain water.",
  "Rest biryani for 10 minutes before serving so the flavours settle.",
];

export const INGREDIENT_SUBSTITUTIONS: Record<string, string[]> = {
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

export const CUISINE_DATA: Record<string, { region: string; description: string; specialties: string[] }> = {
  "Punjabi": { region: "North India", description: "Rich, buttery dishes with robust flavors", specialties: ["Butter Chicken", "Dal Makhani", "Sarson da Saag"] },
  "South Indian": { region: "South India", description: "Rice-based dishes with coconut and curry leaves", specialties: ["Dosa", "Idli", "Sambar"] },
  "Gujarati": { region: "Gujarat", description: "Sweet and savory vegetarian cuisine", specialties: ["Dhokla", "Thepla", "Undhiyu"] },
  "Bengali": { region: "West Bengal", description: "Fish and sweets with mustard oil", specialties: ["Fish Curry", "Rasgulla", "Mishti Doi"] },
  "Hyderabadi": { region: "Telangana", description: "Royal cuisine with Persian influences", specialties: ["Biryani", "Haleem", "Kebabs"] },
  "Rajasthani": { region: "Rajasthan", description: "Desert cuisine with preserved foods", specialties: ["Dal Baati", "Gatte ki Sabzi", "Ker Sangri"] },
  "Maharashtrian": { region: "Maharashtra", description: "Spicy and tangy flavors", specialties: ["Pav Bhaji", "Vada Pav", "Misal Pav"] },
  "Kerala": { region: "Kerala", description: "Coconut-rich coastal cuisine", specialties: ["Appam", "Fish Curry", "Puttu"] },
};

// Collection type definition (if needed in the future)
// export interface Collection {
//   id: string;
//   name: string;
//   description: string;
//   recipeIds: number[];
// }

// export const DEFAULT_COLLECTIONS: Collection[] = [
//   { id: "weeknight", name: "Weeknight Dinners", description: "Quick meals for busy evenings", recipeIds: [] },
//   { id: "festival", name: "Festival Specials", description: "Traditional dishes for celebrations", recipeIds: [] },
//   { id: "quick", name: "Quick & Easy", description: "Under 30 minutes", recipeIds: [] },
//   { id: "healthy", name: "Healthy Choices", description: "Nutritious and balanced", recipeIds: [] },
//   { id: "comfort", name: "Comfort Food", description: "Hearty and satisfying", recipeIds: [] },
// ];

export const SEASONAL_INGREDIENTS: Record<string, number[]> = {
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

export const isSeasonal = (ingredient: string): boolean => {
  const now = new Date().getMonth() + 1; // 1-12
  const seasonal = SEASONAL_INGREDIENTS[ingredient];
  return seasonal ? seasonal.includes(now) : false;
};

export const getSubstitutions = (ingredient: string): string[] => {
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

// --- GENERATOR CONFIGURATION ---
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

// --- GENERATOR FUNCTION ---
export const generateDatabase = (): Recipe[] => {
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
        difficulty: style.diff as Difficulty,
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
  
  // Add nutrition and imageUrl to all recipes
  return db.map(recipe => ({
    ...recipe,
    nutrition: getNutritionEstimate(recipe),
    difficultyReasons: getDifficultyReasons(recipe),
    imageUrl: getRecipeImageUrl(recipe),
  }));
};

// --- NUTRITION ESTIMATES ---
export const getNutritionEstimate = (recipe: Recipe): Recipe['nutrition'] => {
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
