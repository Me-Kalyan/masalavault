'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Heart, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Recipe, RecipeWithMatch } from '@/types/recipe';
import { getRecipeSlug } from '@/lib/recipe-utils';
import { getRecipeImageUrl } from '@/lib/image-utils';

interface RecipeCardProps {
  recipe: Recipe | RecipeWithMatch;
  isSaved?: boolean;
  onSave?: (recipeId: number) => void;
  className?: string;
}

export default function RecipeCard({ recipe, isSaved = false, onSave, className }: RecipeCardProps) {
  const slug = getRecipeSlug(recipe);
  const isCookable = 'percentage' in recipe && recipe.percentage === 100;
  const [heartClicked, setHeartClicked] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(recipe.id);
      setHeartClicked(true);
      setTimeout(() => setHeartClicked(false), 600);
    }
  };

  return (
    <Link href={`/recipe/${slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          mass: 0.5,
        }}
        className={cn('group', className)}
      >
        <Card className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
          {/* Image */}
          <div className="relative h-48 md:h-52 overflow-hidden bg-muted">
            <img
              src={getRecipeImageUrl(recipe)}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Save Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background group"
              onClick={handleSave}
            >
              <Heart
                size={18}
                className={cn(
                  'transition-all duration-300 shrink-0',
                  isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
                  heartClicked && 'drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]',
                  heartClicked && 'scale-110'
                )}
              />
            </Button>

            {/* Badges */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {recipe.cuisine}
              </Badge>
              {isCookable && (
                <Badge variant="default" className="bg-emerald-500 text-white text-xs flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Ready
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-4 md:p-5 flex-grow flex flex-col">
            {/* Title */}
            <h3 className="font-bold text-base md:text-lg mb-3 line-clamp-2 leading-tight">
              {recipe.title}
            </h3>

            {/* Meta Row */}
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-primary shrink-0" />
                <span className="whitespace-nowrap">{recipe.time}</span>
              </div>
              <div className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md shrink-0',
                recipe.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600' :
                recipe.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                'bg-red-500/10 text-red-600'
              )}>
                <Zap size={14} className="shrink-0" />
                <span className="whitespace-nowrap">{recipe.difficulty}</span>
              </div>
            </div>

            {/* Progress Bar (if cookable) */}
            {'percentage' in recipe && (
              <div className="mt-auto pt-3 border-t border-border">
                <div className="h-1.5 w-full rounded-full overflow-hidden bg-muted mb-2">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isCookable
                        ? 'bg-emerald-500'
                        : 'bg-primary'
                    )}
                    style={{ width: `${recipe.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{recipe.have.length} in pantry</span>
                  <span className={isCookable ? 'text-emerald-600 font-medium' : 'text-primary font-medium'}>
                    {recipe.percentage}% match
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

