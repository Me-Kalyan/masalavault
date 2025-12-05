'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import RecipeCard from './RecipeCard';
import type { Recipe, RecipeWithMatch } from '@/types/recipe';

interface RecipeCardStackProps {
  recipes: (Recipe | RecipeWithMatch)[];
  title?: string;
  isSaved?: (recipeId: number) => boolean;
  onSave?: (recipeId: number) => void;
}

export default function RecipeCardStack({ 
  recipes, 
  title = "Featured Recipes",
  isSaved,
  onSave 
}: RecipeCardStackProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.5,
          }}
          className="text-2xl md:text-3xl font-bold"
        >
          {title}
        </motion.h2>
      )}
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {recipes.map((recipe, index) => (
            <CarouselItem key={recipe.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3">
              <motion.div
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
                      delay: index * 0.05,
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}

