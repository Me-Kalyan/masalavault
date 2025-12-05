'use client';

import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  view: string;
  className?: string;
}

export default function PageTransition({ children, view, className = '' }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prevView, setPrevView] = useState(view);

  useEffect(() => {
    if (prevView !== view) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setPrevView(view);
        setIsVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [view, prevView]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}

