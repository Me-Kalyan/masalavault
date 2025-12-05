'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Github, 
  Twitter, 
  Mail, 
  HelpCircle, 
  Info, 
  ArrowUp,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'About',
      links: [
        { href: '/about', label: 'About Us', icon: Info },
        { href: '/about#mission', label: 'Our Mission', icon: null },
        { href: '/about#team', label: 'Team', icon: null },
      ],
    },
    {
      title: 'Help & Support',
      links: [
        { href: '/help', label: 'Help Center', icon: HelpCircle },
        { href: '/help#faq', label: 'FAQ', icon: null },
        { href: '/help#guides', label: 'Cooking Guides', icon: null },
        { href: '/contact', label: 'Contact Us', icon: Mail },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy', icon: null },
        { href: '/terms', label: 'Terms of Service', icon: null },
        { href: '/cookie-policy', label: 'Cookie Policy', icon: null },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/Me-Kalyan/masalavault',
      icon: Github,
      external: true,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/masalavault',
      icon: Twitter,
      external: true,
    },
    {
      name: 'Email',
      href: 'mailto:helpmasalavault@gmail.com',
      icon: Mail,
      external: true,
    },
  ];

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-colors" />
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                  <ChefHat size={24} strokeWidth={2.5} />
                </div>
              </motion.div>
              <div className="leading-tight">
                <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  MasalaVault
                </h3>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Your Spice Vault, Your Recipes
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Your comprehensive Indian cooking companion. Discover authentic recipes, 
              organize your pantry, and master the art of Indian cuisine.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Follow Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target={social.external ? '_blank' : undefined}
                      rel={social.external ? 'noopener noreferrer' : undefined}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className={cn(
                        'p-2.5 rounded-lg border border-border bg-background',
                        'hover:bg-accent hover:border-primary/30',
                        'transition-all duration-200',
                        'group'
                      )}
                      aria-label={social.name}
                    >
                      <Icon 
                        size={18} 
                        className="text-muted-foreground group-hover:text-primary transition-colors" 
                      />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-2 text-sm text-muted-foreground',
                          'hover:text-foreground transition-colors duration-200',
                          'group'
                        )}
                      >
                        {Icon && (
                          <Icon 
                            size={16} 
                            className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" 
                          />
                        )}
                        <span>{link.label}</span>
                        {link.href.startsWith('http') && (
                          <ExternalLink 
                            size={12} 
                            className="text-muted-foreground/50 group-hover:text-primary transition-colors" 
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-muted-foreground">
            <span>© {currentYear} MasalaVault. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link 
                href="/privacy" 
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                href="/terms" 
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                href="/cookie-policy" 
                className="hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
          
          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={scrollToTop}
                className={cn(
                  'p-2.5 rounded-lg border border-border bg-background',
                  'hover:bg-accent hover:border-primary/30',
                  'transition-all duration-200',
                  'shadow-sm hover:shadow-md'
                )}
                aria-label="Scroll to top"
              >
                <ArrowUp size={18} className="text-muted-foreground hover:text-primary transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  );
}
