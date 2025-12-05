'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Users, Heart, ChefHat, Sparkles, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();

  const stats = [
    { label: 'Recipes', value: '100+', icon: ChefHat },
    { label: 'Users', value: 'Growing', icon: Users },
    { label: 'Cuisines', value: 'Authentic', icon: Globe },
  ];

  const values = [
    {
      icon: ChefHat,
      title: 'Authenticity',
      description: 'Preserving traditional recipes and cooking methods passed down through generations.',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Making Indian cuisine approachable for everyone, regardless of cooking experience.',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Using modern technology to enhance the cooking experience while respecting tradition.',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
    },
  ];

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

        {/* Hero Header */}
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
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <ChefHat size={40} className="text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
            About MasalaVault
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive Indian cooking companion, designed to help you discover, 
            organize, and master authentic Indian cuisine with confidence and joy.
          </p>
        </motion.div>

        {/* Stats */}
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={isFirstRender ? { opacity: 0, scale: 0.9 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 0.5,
                  delay: isFirstRender ? 0.2 + index * 0.05 : 0,
                }}
              >
                <Card className="text-center border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                      <Icon size={28} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission Section */}
        <motion.section
          id="mission"
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.25 : 0,
          }}
          className="mb-16"
        >
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                  <Target size={32} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-4">Our Mission</Badge>
                  <h2 className="text-3xl font-bold mb-4">Preserving Culinary Heritage</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    At MasalaVault, we believe that cooking should be accessible, enjoyable, and authentic. 
                    Our mission is to preserve and share the rich culinary heritage of Indian cuisine while 
                    making it easy for everyone to cook delicious, traditional meals at home.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We&apos;re committed to providing accurate, tested recipes that honor traditional cooking methods 
                    while embracing modern convenience. Every recipe in our collection is carefully curated to 
                    ensure authenticity and delicious results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.3 : 0,
          }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do at MasalaVault
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={isFirstRender ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                    delay: isFirstRender ? 0.35 + index * 0.05 : 0,
                  }}
                >
                  <Card className="h-full border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                    <CardContent className="p-8">
                      <div className={cn('inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6', value.color)}>
                        <Icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          id="team"
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.4 : 0,
          }}
        >
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-8">
                <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                  <Users size={32} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-4">Our Team</Badge>
                  <h2 className="text-3xl font-bold mb-4">Built with Passion</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    MasalaVault is built with passion by a team of food enthusiasts, developers, 
                    and culinary experts who share a love for Indian cuisine. We combine technical 
                    expertise with culinary knowledge to create the best cooking experience.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-blue-600 dark:text-blue-300 shrink-0" />
                    <h3 className="font-semibold text-lg">Development Team</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed ml-8">
                    Building the platform with modern web technologies to deliver the best user experience, 
                    performance, and accessibility.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ChefHat size={20} className="text-blue-600 dark:text-blue-300 shrink-0" />
                    <h3 className="font-semibold text-lg">Culinary Experts</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed ml-8">
                    Curating authentic recipes and ensuring accuracy in cooking instructions, techniques, 
                    and ingredient measurements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
