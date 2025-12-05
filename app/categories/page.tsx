'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { 
  Coffee, 
  UtensilsCrossed, 
  Cookie, 
  IceCream, 
  Apple, 
  ChefHat,
  ArrowRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateDatabase } from '@/lib/recipes';
import { filterByCourse } from '@/lib/recipe-utils';
import type { Course } from '@/types/recipe';

export default function CategoriesPage() {
  const isFirstRender = useIsFirstRender();
  const allRecipes = useMemo(() => generateDatabase(), []);

  const CATEGORIES: Array<{
    course: Course;
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    count: number;
  }> = [
    {
      course: 'Breakfast',
      label: 'Breakfast',
      icon: <Coffee size={24} />,
      description: 'Start your day with delicious morning meals',
      color: 'bg-amber-500',
      count: filterByCourse(allRecipes, 'Breakfast').length,
    },
    {
      course: 'Lunch',
      label: 'Lunch',
      icon: <UtensilsCrossed size={24} />,
      description: 'Satisfying midday meals',
      color: 'bg-orange-500',
      count: filterByCourse(allRecipes, 'Lunch').length,
    },
    {
      course: 'Dinner',
      label: 'Dinner',
      icon: <ChefHat size={24} />,
      description: 'Hearty evening dishes',
      color: 'bg-red-500',
      count: filterByCourse(allRecipes, 'Dinner').length,
    },
    {
      course: 'Snack',
      label: 'Snacks',
      icon: <Cookie size={24} />,
      description: 'Quick bites and appetizers',
      color: 'bg-yellow-500',
      count: filterByCourse(allRecipes, 'Snack').length,
    },
    {
      course: 'Dessert',
      label: 'Desserts',
      icon: <IceCream size={24} />,
      description: 'Sweet treats and indulgences',
      color: 'bg-pink-500',
      count: filterByCourse(allRecipes, 'Dessert').length,
    },
    {
      course: 'Beverage',
      label: 'Beverages',
      icon: <Apple size={24} />,
      description: 'Refreshing drinks and beverages',
      color: 'bg-green-500',
      count: filterByCourse(allRecipes, 'Beverage').length,
    },
  ];
  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Hero Section */}
      <motion.div
        initial={isFirstRender ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.6,
        }}
        className="text-center space-y-4 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold">Browse by Category</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our collection of authentic Indian recipes organized by meal type and course
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.course}
            initial={isFirstRender ? { opacity: 0, y: 16, scale: 0.96 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              mass: 0.5,
              delay: isFirstRender ? index * 0.05 : 0,
            }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <Link href={`/categories/${category.course.toLowerCase()}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${category.color} text-white shrink-0 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{category.label}</h2>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Badge variant="secondary">
                      {category.count} recipes
                    </Badge>
                    <ArrowRight 
                      size={18} 
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
