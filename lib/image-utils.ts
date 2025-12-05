/**
 * Image URL utilities for recipes
 */

import type { Recipe } from '@/types/recipe';

const RECIPE_IMAGE_MAP: Record<string, string> = {
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

export const getRecipeImageUrl = (recipe: Recipe, width: number = 520): string => {
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

