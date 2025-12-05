'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChefHat, Search, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [savedClicked, setSavedClicked] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform scroll position for navbar shrink effect
  const navbarHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const navbarOpacity = useTransform(scrollY, [0, 50], [1, 0.98]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: null },
    { href: '/saved', label: 'Saved', icon: Heart },
    { href: '/categories', label: 'Categories', icon: null },
  ];

  const handleSearchClick = () => {
    // Scroll to search bar on home page, or navigate to home
    if (pathname === '/') {
      const searchBar = document.querySelector('[data-search-bar]');
      if (searchBar) {
        searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the search input
        const input = searchBar.querySelector('input');
        if (input) {
          setTimeout(() => input.focus(), 300);
        }
      }
    } else {
      router.push('/');
      setTimeout(() => {
        const searchBar = document.querySelector('[data-search-bar]');
        if (searchBar) {
          searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const input = searchBar.querySelector('input');
          if (input) {
            setTimeout(() => input.focus(), 500);
          }
        }
      }, 100);
    }
  };

  return (
    <motion.header
      style={{ 
        height: navbarHeight,
        opacity: navbarOpacity,
      }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-3 md:pt-4 pointer-events-none',
        'transition-all duration-300'
      )}
    >
      <motion.nav
        className={cn(
          'max-w-7xl mx-auto',
          'rounded-2xl border',
          'px-4 md:px-6 py-3 md:py-4',
          'bg-background/95 backdrop-blur-xl backdrop-saturate-150',
          'border-border/60',
          'shadow-lg shadow-black/5',
          'pointer-events-auto',
          isScrolled && 'shadow-xl shadow-black/10 border-border/80'
        )}
        initial={false}
        animate={{
          boxShadow: isScrolled 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group relative"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-colors" />
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all">
                <ChefHat size={22} className="md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
            </motion.div>
            <div className="leading-tight">
              <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                MasalaVault
              </h1>
              <p className="text-[9px] md:text-[10px] text-muted-foreground font-semibold uppercase tracking-wider hidden md:block">
                Your Spice Vault, Your Recipes
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center max-w-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              const isSavedLink = link.href === '/saved';
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (isSavedLink) {
                      setSavedClicked(true);
                      setTimeout(() => setSavedClicked(false), 600);
                    }
                  }}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-all duration-200 ease-out',
                    'flex items-center gap-2 group',
                    'before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2',
                    'before:w-0 before:h-0.5 before:bg-primary before:rounded-full',
                    'before:transition-all before:duration-200',
                    isActive
                      ? 'text-foreground before:w-3/4'
                      : 'text-muted-foreground hover:text-foreground hover:bg-blue-500/30',
                    isSavedLink && 'active:scale-95'
                  )}
                >
                  {Icon && (
                    <Icon 
                      size={16} 
                      className={cn(
                        'transition-all duration-300 shrink-0',
                        isSavedLink && 'fill-red-500 text-red-500',
                        isSavedLink && savedClicked && 'drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]',
                        isSavedLink && savedClicked && 'scale-110',
                        !isSavedLink && isActive && 'text-primary',
                        !isSavedLink && !isActive && 'text-muted-foreground group-hover:text-foreground'
                      )} 
                    />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'hidden md:flex rounded-xl',
                'hover:bg-accent hover:shadow-md',
                'transition-all duration-200',
                'group'
              )}
              onClick={handleSearchClick}
              aria-label="Search recipes"
            >
              <Search 
                size={18} 
                className="transition-transform duration-200 group-hover:scale-110" 
              />
            </Button>

            {/* Saved Button */}
            <Link href="/saved">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'relative rounded-xl',
                  'hover:bg-accent hover:shadow-md',
                  'transition-all duration-200',
                  pathname === '/saved' && 'bg-primary/10 text-primary'
                )}
                aria-label="Saved recipes"
              >
                <Heart 
                  size={18} 
                  className={cn(
                    'transition-colors',
                    pathname === '/saved' && 'fill-primary text-primary'
                  )}
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-xl hover:bg-accent hover:shadow-md transition-all duration-200"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                      <ChefHat size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">MasalaVault</h2>
                      <p className="text-xs text-muted-foreground">Your Spice Vault</p>
                    </div>
                  </div>
                  
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    const isSavedLink = link.href === '/saved';
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (isSavedLink) {
                            setSavedClicked(true);
                            setTimeout(() => setSavedClicked(false), 600);
                          }
                        }}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-muted-foreground hover:text-foreground hover:bg-blue-500/30'
                        )}
                      >
                        {Icon && (
                          <Icon 
                            size={18} 
                            className={cn(
                              'transition-all duration-300',
                              isSavedLink && 'fill-red-500 text-red-500',
                              isSavedLink && savedClicked && 'drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]',
                              isSavedLink && savedClicked && 'scale-110'
                            )} 
                          />
                        )}
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSearchClick}
                    >
                      <Search size={18} className="mr-2" />
                      Search Recipes
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}
