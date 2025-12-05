'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { ArrowLeft, Heart, Share2, Clock, Users, Zap, ChefHat, CheckCircle2, Timer, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import RecipeCardStack from '@/components/recipes/RecipeCardStack';
import { getRecipeSlug, getSimilarRecipes, getRecipeBySlug } from '@/lib/recipe-utils';
import { getSavedRecipes, saveRecipe, unsaveRecipe, addToHistory } from '@/lib/storage';
import { getRecipeImageUrl } from '@/lib/image-utils';
import { generateDatabase } from '@/lib/recipes';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types/recipe';

export default function RecipeDetailPage() {
  const isFirstRender = useIsFirstRender();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [heartClicked, setHeartClicked] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [allRecipes] = useState<Recipe[]>(() => generateDatabase());

  useEffect(() => {
    const loadedRecipe = getRecipeBySlug(slug, allRecipes);
    if (loadedRecipe) {
      setRecipe(loadedRecipe);
      setIsSaved(getSavedRecipes().includes(loadedRecipe.id));
      addToHistory(loadedRecipe.id);
    }
  }, [slug, allRecipes]);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (isSaved) {
      unsaveRecipe(recipe.id);
    } else {
      saveRecipe(recipe.id);
      setHeartClicked(true);
      setTimeout(() => setHeartClicked(false), 600);
    }
    setIsSaved(!isSaved);
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const similarRecipes = getSimilarRecipes(recipe, allRecipes, 6);

  return (
    <div className="min-h-screen">
      {/* Sticky Top Bar */}
      <motion.div
        initial={isFirstRender ? { y: -12, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.5,
        }}
        className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b"
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg md:text-xl font-bold line-clamp-1 flex-1 text-center">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={handleSave} className="group">
                <Heart
                  size={20}
                  className={cn(
                    'transition-all duration-300 shrink-0',
                    isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
                    heartClicked && 'drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]',
                    heartClicked && 'scale-110'
                  )}
                />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Recipe Image */}
        <motion.div
          initial={isFirstRender ? { opacity: 0, scale: 0.96 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.1 : 0,
          }}
          className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-muted"
        >
          <img
            src={getRecipeImageUrl(recipe, 1200)}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Key Info Cards */}
        <motion.div
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.15 : 0,
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Clock size={20} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground mb-1">Prep Time</p>
              <p className="font-semibold">{recipe.prepTime || 'N/A'} min</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ChefHat size={20} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground mb-1">Cook Time</p>
              <p className="font-semibold">{recipe.cookTime || recipe.time}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users size={20} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground mb-1">Servings</p>
              <p className="font-semibold">{recipe.defaultServings || 4}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap size={20} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
              <Badge
                variant="outline"
                className={
                  recipe.difficulty === 'Easy' ? 'border-emerald-500 text-emerald-600' :
                  recipe.difficulty === 'Medium' ? 'border-amber-500 text-amber-600' :
                  'border-red-500 text-red-600'
                }
              >
                {recipe.difficulty}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{recipe.cuisine}</Badge>
          <Badge variant="secondary">{recipe.course}</Badge>
          {recipe.nutrition && (
            <Badge variant="outline">
              {recipe.nutrition.calories} cal
            </Badge>
          )}
        </div>

        {/* Ingredients Section */}
        <motion.section
          initial={isFirstRender ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isFirstRender ? 0.2 : 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={checkedIngredients.has(index)}
                      onCheckedChange={() => toggleIngredient(index)}
                      className="shrink-0"
                    />
                    <label
                      className={`flex-1 cursor-pointer ${
                        checkedIngredients.has(index)
                          ? 'line-through text-muted-foreground'
                          : ''
                      }`}
                    >
                      {ingredient}
                    </label>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Instructions Section */}
        <motion.section
          initial={isFirstRender ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isFirstRender ? 0.3 : 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat size={20} className="text-primary" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm md:text-base leading-relaxed">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Related Recipes */}
        {similarRecipes.length > 0 && (
          <motion.section
            initial={isFirstRender ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isFirstRender ? 0.5 : 0 }}
          >
            <h2 className="text-2xl font-bold mb-6">Similar Recipes</h2>
            <RecipeCardStack
              recipes={similarRecipes}
              isSaved={(id) => getSavedRecipes().includes(id)}
              onSave={(id) => {
                if (getSavedRecipes().includes(id)) {
                  unsaveRecipe(id);
                } else {
                  saveRecipe(id);
                }
              }}
            />
          </motion.section>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 pt-8 border-t">
          <Button variant="outline" size="lg">
            <Printer size={18} className="mr-2" />
            Print Recipe
          </Button>
          <Button variant="outline" size="lg">
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
