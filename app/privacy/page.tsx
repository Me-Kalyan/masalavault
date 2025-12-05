'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { ArrowLeft, Shield, Lock, Eye, FileText, Database, Cookie, UserCheck, Users, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function PrivacyPolicy() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const sections = [
    {
      icon: Lock,
      title: 'Introduction',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
      ),
    },
    {
      icon: Eye,
      title: 'Information We Collect',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-300" />
              Information You Provide
            </h3>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Pantry ingredients and preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Saved recipes and collections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Recipe ratings and reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Meal planning data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Cooking history</span>
              </li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-300" />
              Automatically Collected Information
            </h3>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Usage data and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Device information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Browser type and version</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>IP address (anonymized)</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      title: 'How We Use Your Information',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="space-y-2 text-muted-foreground ml-6">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Provide and improve our services</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Personalize your cooking experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Recommend recipes based on your preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Analyze usage patterns to enhance functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Ensure security and prevent fraud</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: Database,
      title: 'Data Storage',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
      content: (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-foreground leading-relaxed font-medium">
            All your data is stored locally in your browser using localStorage. We do not transmit, store, or have access to your personal data on our servers. Your information remains private and secure on your device.
          </p>
        </div>
      ),
    },
    {
      icon: Cookie,
      title: 'Cookies',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-300',
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies to enhance your experience. You can manage your cookie preferences through the cookie consent banner. Types of cookies we use:
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-blue-600 dark:text-blue-300" />
                <strong className="text-foreground">Necessary Cookies:</strong>
              </div>
              <p className="text-sm text-muted-foreground">Required for the website to function</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={18} className="text-purple-600 dark:text-purple-300" />
                <strong className="text-foreground">Analytics Cookies:</strong>
              </div>
              <p className="text-sm text-muted-foreground">Help us understand how you use our website</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Cookie size={18} className="text-emerald-600 dark:text-emerald-300" />
                <strong className="text-foreground">Marketing Cookies:</strong>
              </div>
              <p className="text-sm text-muted-foreground">Used for personalized advertising (if enabled)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You have the right to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Access your personal data', 'Delete your data at any time (clear browser storage)', 'Modify your cookie preferences', 'Export your data'].map((right, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{right}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Users,
      title: 'Third-Party Services',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may use third-party services for analytics and image hosting. These services have their own privacy policies. We use Unsplash for recipe images, which may collect usage data in accordance with their privacy policy.
        </p>
      ),
    },
    {
      icon: AlertCircle,
      title: "Children's Privacy",
      color: 'bg-red-500/10 text-red-600 dark:text-red-300',
      content: (
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-foreground leading-relaxed">
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </div>
      ),
    },
    {
      icon: FileText,
      title: 'Changes to This Policy',
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
        </p>
      ),
    },
    {
      icon: Mail,
      title: 'Contact Us',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
      content: (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-muted-foreground leading-relaxed mb-3">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <a 
            href="mailto:helpmasalavault@gmail.com" 
            className="text-primary hover:underline font-medium"
          >
            helpmasalavault@gmail.com
          </a>
        </div>
      ),
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
                  <Shield size={40} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-4">Privacy Policy</Badge>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Your Privacy Matters
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    We are committed to protecting your privacy and ensuring transparency about how we handle your data.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: <span className="font-medium text-foreground">{lastUpdated}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Sections with Accordion */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Policy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <AccordionItem key={section.title} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className={cn('p-2 rounded-lg shrink-0', section.color)}>
                          <Icon size={20} />
                        </div>
                        <span className="font-semibold text-lg">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="ml-12">
                        {section.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
