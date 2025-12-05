'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Cookie, Settings, Shield, BarChart3, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { cn } from '@/lib/utils';

export default function CookiePolicyPage() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      required: true,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
      examples: ['Session management', 'Security features', 'Load balancing'],
    },
    {
      icon: BarChart3,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      required: false,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
      examples: ['Page views', 'User interactions', 'Performance metrics'],
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'These cookies allow the website to remember choices you make and provide enhanced, personalized features.',
      required: false,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      examples: ['Theme preferences', 'Language settings', 'User preferences'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-5xl">
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
          className="mb-12"
        >
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                  <Cookie size={40} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-4">Cookie Policy</Badge>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Cookie Policy
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Learn about how we use cookies to enhance your experience on MasalaVault.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: <span className="font-medium text-foreground">{lastUpdated}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What are Cookies */}
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
          className="mb-8"
        >
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Info size={24} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">What are Cookies?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                    They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cookie Types */}
        <motion.div
          initial={isFirstRender ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: isFirstRender ? 0.2 : 0,
          }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => {
              const Icon = cookie.icon;
              return (
                <motion.div
                  key={cookie.title}
                  initial={isFirstRender ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                    delay: isFirstRender ? 0.25 + index * 0.05 : 0,
                  }}
                >
                  <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={cn('p-3 rounded-xl shrink-0', cookie.color)}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{cookie.title}</h3>
                            {cookie.required && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20">
                                Always Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {cookie.description}
                          </p>
                          {cookie.examples && (
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-2">Examples:</p>
                              <div className="flex flex-wrap gap-2">
                                {cookie.examples.map((example, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Managing Cookies */}
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
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings size={24} className="text-blue-600 dark:text-blue-300" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You can manage your cookie preferences through your browser settings. Most browsers allow you to refuse or accept cookies, and to delete cookies that have already been set.
              </p>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-amber-600 dark:text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Note:</strong> Disabling certain cookies may impact your experience on our website and limit some functionality. Necessary cookies cannot be disabled as they are essential for the website to function.
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  To manage cookies in your browser:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                    <span><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                    <span><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                    <span><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                    <span><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
