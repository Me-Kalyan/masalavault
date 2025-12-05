'use client';

import React from 'react';

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
};

interface GlassIconItem {
  icon: React.ReactNode;
  color: string;
  label: string;
  onClick?: () => void;
  customClass?: string;
}

interface GlassIconsProps {
  items: GlassIconItem[];
  className?: string;
}

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-4 ${className || ''}`}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={item.onClick}
          aria-label={item.label}
          className={`relative bg-transparent outline-none border-none cursor-pointer w-12 h-12 sm:w-14 sm:h-14 [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
            item.customClass || ''
          }`}
        >
          <span
            className="absolute top-0 left-0 w-full h-full rounded-2xl block transition-[opacity,transform] duration-200 ease-out origin-[100%_100%] rotate-[15deg] [will-change:transform] active:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
            style={{
              ...getBackgroundStyle(item.color),
              boxShadow: '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)'
            }}
          ></span>

          <span
            className="absolute top-0 left-0 w-full h-full rounded-2xl bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-200 ease-out origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] [-moz-backdrop-filter:blur(0.75em)] [will-change:transform] transform active:[transform:translate3d(0,0,2em)]"
            style={{
              boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
            }}
          >
            <span className="m-auto w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-white" aria-hidden="true">
              {item.icon}
            </span>
          </span>

          <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-[10px] sm:text-xs opacity-0 transition-[opacity,transform] duration-200 ease-out translate-y-0 sm:group-hover:opacity-100 sm:group-hover:[transform:translateY(20%)] text-slate-300">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;

