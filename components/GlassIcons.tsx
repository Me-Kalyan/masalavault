'use client';

import React from 'react';

const gradientMapping: Record<string, string> = {
  orange: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(0, 84%, 60%))', // Orange to red (website theme)
  red: 'linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 72%, 51%))', // Red variant
  blue: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(0, 84%, 60%))', // Use orange/red for all
  purple: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(0, 84%, 60%))', // Use orange/red for all
  indigo: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(0, 84%, 60%))', // Use orange/red for all
  green: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(0, 84%, 60%))', // Use orange/red for all
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
    <div className={`flex items-center justify-center gap-2 sm:gap-3 w-full ${className || ''}`}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={item.onClick}
          aria-label={item.label}
          className={`relative bg-transparent outline-none border-none cursor-pointer flex-1 max-w-[80px] aspect-square [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group touch-manipulation ${
            item.customClass || ''
          }`}
        >
          <span
            className="absolute top-0 left-0 w-full h-full rounded-2xl block transition-[opacity,transform] duration-150 ease-out origin-[100%_100%] rotate-[15deg] [will-change:transform]"
            style={{
              ...getBackgroundStyle(item.color),
              boxShadow: '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)'
            }}
          ></span>

          <span
            className="absolute top-0 left-0 w-full h-full rounded-2xl bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-150 ease-out origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] [-moz-backdrop-filter:blur(0.75em)] [will-change:transform] transform"
            style={{
              boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
            }}
          >
            <span className="m-auto w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white" aria-hidden="true">
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

