'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { ArrowLeft, Scale, FileText, CheckCircle, AlertTriangle, Ban, Link2, RefreshCw, Gavel, Mail, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function TermsOfService() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const sections = [
    {
      icon: FileText,
      title: 'Agreement to Terms',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing and using MasalaVault, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      ),
    },
    {
      icon: CheckCircle,
      title: 'Use License',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Permission is granted to temporarily use MasalaVault for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <div className="space-y-2">
            {[
              'Modify or copy the materials',
              'Use the materials for any commercial purpose or for any public display',
              'Attempt to reverse engineer any software contained on the website',
              'Remove any copyright or other proprietary notations from the materials',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <XCircle size={18} className="text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: FileText,
      title: 'Service Description',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault provides recipe discovery, pantry management, and meal planning services. We strive to provide accurate recipe information, but we cannot guarantee the accuracy, completeness, or usefulness of any recipe or cooking instruction.
        </p>
      ),
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimer',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
      content: (
        <div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The materials on MasalaVault are provided on an &apos;as is&apos; basis. MasalaVault makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Implied warranties or conditions of merchantability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Fitness for a particular purpose</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Non-infringement of intellectual property or other violation of rights</span>
            </li>
          </ul>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 dark:text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground leading-relaxed font-semibold mb-1">Important Safety Notice</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cooking involves risks. Always follow proper food safety guidelines. We are not responsible for any foodborne illness, injury, or damage resulting from the use of recipes on this platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Ban,
      title: 'Limitations',
      color: 'bg-red-500/10 text-red-600 dark:text-red-300',
      content: (
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-muted-foreground leading-relaxed">
            In no event shall MasalaVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MasalaVault, even if MasalaVault or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </div>
      ),
    },
    {
      icon: FileText,
      title: 'Accuracy of Materials',
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          The materials appearing on MasalaVault could include technical, typographical, or photographic errors. MasalaVault does not warrant that any of the materials on its website are accurate, complete, or current. MasalaVault may make changes to the materials contained on its website at any time without notice.
        </p>
      ),
    },
    {
      icon: Link2,
      title: 'Links',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MasalaVault. Use of any such linked website is at the user&apos;s own risk.
        </p>
      ),
    },
    {
      icon: RefreshCw,
      title: 'Modifications',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>
      ),
    },
    {
      icon: Gavel,
      title: 'Governing Law',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts.
        </p>
      ),
    },
    {
      icon: Mail,
      title: 'Contact Information',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-300',
      content: (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-muted-foreground leading-relaxed mb-3">
            If you have any questions about these Terms of Service, please contact us:
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
                  <Scale size={40} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-4">Terms of Service</Badge>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Terms & Conditions
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Please read these terms carefully before using MasalaVault. By using our service, you agree to these terms.
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
            <CardTitle className="text-2xl">Terms & Conditions</CardTitle>
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
