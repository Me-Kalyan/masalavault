'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, BookOpen, MessageCircle, Search, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { cn } from '@/lib/utils';

export default function HelpPage() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I search for recipes?',
      answer: 'Use the search bar on the home page to search by recipe name, ingredients, or cuisine. You can also filter by course, difficulty, or cooking time using the filter options.',
      category: 'Getting Started',
    },
    {
      question: 'How do I save recipes?',
      answer: 'Click the heart icon on any recipe card or recipe detail page. Saved recipes can be accessed from the "Saved" section in the navigation menu.',
      category: 'Getting Started',
    },
    {
      question: 'Can I filter recipes by ingredients?',
      answer: 'Yes! Add ingredients to your pantry, and we\'ll show you recipes that match what you have available, sorted by match percentage. The higher the percentage, the more ingredients you have.',
      category: 'Features',
    },
    {
      question: 'How accurate are the cooking times?',
      answer: 'Cooking times are estimates based on standard preparation. Actual times may vary based on your equipment, experience level, and specific ingredients used.',
      category: 'Cooking',
    },
    {
      question: 'Can I adjust serving sizes?',
      answer: 'Currently, recipes are shown with default serving sizes. We\'re working on a feature to adjust serving sizes and automatically scale ingredients.',
      category: 'Features',
    },
    {
      question: 'How do I add ingredients to my pantry?',
      answer: 'On the home page, you\'ll find a pantry section where you can add ingredients. Simply type the ingredient name and press Enter or click the add button.',
      category: 'Getting Started',
    },
    {
      question: 'Are the recipes authentic?',
      answer: 'Yes! All our recipes are carefully curated to ensure authenticity. We work with culinary experts to preserve traditional cooking methods and flavors.',
      category: 'About Recipes',
    },
    {
      question: 'Can I print recipes?',
      answer: 'Yes! On any recipe detail page, you\'ll find a print button that allows you to print the recipe with all ingredients and instructions.',
      category: 'Features',
    },
  ];

  const guides = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using MasalaVault to discover and save recipes.',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
      href: '#getting-started',
    },
    {
      title: 'Using Your Pantry',
      description: 'How to add ingredients and find recipes based on what you have.',
      icon: Search,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      href: '#pantry',
    },
    {
      title: 'Cooking Tips',
      description: 'Tips and tricks for cooking authentic Indian dishes like a pro.',
      icon: Lightbulb,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
      href: '#tips',
    },
  ];

  const filteredFAQs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const faqsByCategory = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-6xl">
        {/* Back Button */}
        <motion.div
          initial={isFirstRender ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.5,
          }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.1 : 0,
          }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle size={32} className="text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions and learn how to make the most of MasalaVault.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="search"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>
        </motion.div>

        {/* Guides Section */}
        <motion.section
          id="guides"
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.15 : 0,
          }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.title}
                  initial={isFirstRender ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                    delay: isFirstRender ? 0.2 + index * 0.05 : 0,
                  }}
                >
                  <Card className="h-full border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/30 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={cn('inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4', guide.color)}>
                        <Icon size={24} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                      <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                        Learn more
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          id="faq"
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.3 : 0,
          }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <HelpCircle size={28} className="text-blue-600 dark:text-blue-300" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                {searchQuery ? `Found ${filteredFAQs.length} results` : 'Browse common questions and answers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found. Try a different search term.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(faqsByCategory).map(([category, categoryFAQs], categoryIndex) => (
                    <div key={category} className={cn(categoryIndex > 0 && 'mt-6')}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        {category}
                      </h3>
                      {categoryFAQs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border-border">
                          <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </div>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Still Need Help */}
        <motion.div
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.4 : 0,
          }}
          className="mt-12"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <MessageCircle size={32} className="text-blue-600 dark:text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Can&apos;t find what you&apos;re looking for? Contact our support team.
              </p>
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
