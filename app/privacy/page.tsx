'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { ArrowLeft, Shield, Lock, Eye, FileText, Database, Cookie, UserCheck, Users, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
      ),
    },
    {
      icon: Eye,
      title: 'Information We Collect',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Pantry ingredients and preferences</li>
              <li>Saved recipes and collections</li>
              <li>Recipe ratings and reviews</li>
              <li>Meal planning data</li>
              <li>Cooking history</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Usage data and analytics</li>
              <li>Device information</li>
              <li>Browser type and version</li>
              <li>IP address (anonymized)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      title: 'How We Use Your Information',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide and improve our services</li>
            <li>Personalize your cooking experience</li>
            <li>Recommend recipes based on your preferences</li>
            <li>Analyze usage patterns to enhance functionality</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </>
      ),
    },
    {
      icon: Database,
      title: 'Data Storage',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          All your data is stored locally in your browser using localStorage. We do not transmit, store, or have access to your personal data on our servers. Your information remains private and secure on your device.
        </p>
      ),
    },
    {
      icon: Cookie,
      title: 'Cookies',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies to enhance your experience. You can manage your cookie preferences through the cookie consent banner. Types of cookies we use:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong className="text-foreground">Necessary Cookies:</strong> Required for the website to function</li>
            <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how you use our website</li>
            <li><strong className="text-foreground">Marketing Cookies:</strong> Used for personalized advertising (if enabled)</li>
          </ul>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Access your personal data</li>
            <li>Delete your data at any time (clear browser storage)</li>
            <li>Modify your cookie preferences</li>
            <li>Export your data</li>
          </ul>
        </>
      ),
    },
    {
      icon: Users,
      title: 'Third-Party Services',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may use third-party services for analytics and image hosting. These services have their own privacy policies. We use Unsplash for recipe images, which may collect usage data in accordance with their privacy policy.
        </p>
      ),
    },
    {
      icon: AlertCircle,
      title: "Children's Privacy",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </p>
      ),
    },
    {
      icon: FileText,
      title: 'Changes to This Policy',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      ),
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us through our website or email.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-4xl">
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
          className="mb-8"
        >
          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Shield size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
                  <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={isFirstRender ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 0.5,
                  delay: isFirstRender ? 0.15 + index * 0.03 : 0,
                }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    <Separator className="mb-4" />
                    <div className="text-foreground">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
