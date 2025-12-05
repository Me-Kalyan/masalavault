'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import RecipeCard from './RecipeCard';
import type { Recipe, RecipeWithMatch } from '@/types/recipe';

interface RecipeGridProps {
  recipes: (Recipe | RecipeWithMatch)[];
  isSaved?: (recipeId: number) => boolean;
  onSave?: (recipeId: number) => void;
  className?: string;
}

export default function RecipeGrid({ recipes, isSaved, onSave, className }: RecipeGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">No recipes found.</p>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={shouldReduceMotion 
              ? { opacity: 0 }
              : { opacity: 0, y: 16, scale: 0.96 }
            }
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1 
            }}
            transition={shouldReduceMotion
              ? { duration: 0.2 }
              : {
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  mass: 0.5,
                  delay: index * 0.03,
                }
            }
            viewport={{ once: true, margin: '-50px' }}
          >
            <RecipeCard
              recipe={recipe}
              isSaved={isSaved ? isSaved(recipe.id) : false}
              onSave={onSave}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

