'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useIsFirstRender } from '@/hooks/useIsFirstRender';
import { ArrowLeft, Scale, FileText, CheckCircle, AlertTriangle, Ban, Link2, RefreshCw, Gavel, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function TermsOfService() {
  const isFirstRender = useIsFirstRender();
  const router = useRouter();
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const sections = [
    {
      icon: FileText,
      title: 'Agreement to Terms',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing and using MasalaVault, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      ),
    },
    {
      icon: CheckCircle,
      title: 'Use License',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Permission is granted to temporarily use MasalaVault for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </>
      ),
    },
    {
      icon: FileText,
      title: 'Service Description',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault provides recipe discovery, pantry management, and meal planning services. We strive to provide accurate recipe information, but we cannot guarantee the accuracy, completeness, or usefulness of any recipe or cooking instruction.
        </p>
      ),
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimer',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The materials on MasalaVault are provided on an 'as is' basis. MasalaVault makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Implied warranties or conditions of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement of intellectual property or other violation of rights</li>
          </ul>
          <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-foreground leading-relaxed">
              <strong>Important:</strong> Cooking involves risks. Always follow proper food safety guidelines. We are not responsible for any foodborne illness, injury, or damage resulting from the use of recipes on this platform.
            </p>
          </div>
        </>
      ),
    },
    {
      icon: Ban,
      title: 'Limitations',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          In no event shall MasalaVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MasalaVault, even if MasalaVault or an authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      ),
    },
    {
      icon: FileText,
      title: 'Accuracy of Materials',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          The materials appearing on MasalaVault could include technical, typographical, or photographic errors. MasalaVault does not warrant that any of the materials on its website are accurate, complete, or current. MasalaVault may make changes to the materials contained on its website at any time without notice.
        </p>
      ),
    },
    {
      icon: Link2,
      title: 'Links',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MasalaVault. Use of any such linked website is at the user's own risk.
        </p>
      ),
    },
    {
      icon: RefreshCw,
      title: 'Modifications',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          MasalaVault may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>
      ),
    },
    {
      icon: Gavel,
      title: 'Governing Law',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts.
        </p>
      ),
    },
    {
      icon: Mail,
      title: 'Contact Information',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about these Terms of Service, please contact us through our website.
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
                  <Scale size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
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
