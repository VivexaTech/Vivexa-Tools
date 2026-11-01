'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: { img: 28, text: 'text-base', subtext: 'text-[9px]' },
  md: { img: 36, text: 'text-lg', subtext: 'text-[10px]' },
  lg: { img: 44, text: 'text-xl', subtext: 'text-xs' },
  xl: { img: 56, text: 'text-2xl', subtext: 'text-xs' },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  priority = false,
}) => {
  const dimensions = SIZE_MAP[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 
        Official transparent logo icon without any artificial purple background,
        container box, rounded rectangle, or background padding.
        Uses object-fit: contain to preserve exact original proportions.
        In dark mode, a soft drop-shadow ensures high visibility of dark strokes against slate-900/950.
      */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon-package/favicon-192x192.png"
          alt="Vivexa Tools"
          width={dimensions.img}
          height={dimensions.img}
          style={{ width: dimensions.img, height: dimensions.img }}
          className="object-contain dark:drop-shadow-[0_1px_2px_rgba(255,255,255,0.22)] transition-transform group-hover:scale-105 duration-200"
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold ${dimensions.text} text-slate-900 dark:text-white tracking-tight flex items-center gap-1`}>
            Vivexa<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Tools</span>
          </span>
          <span className={`${dimensions.subtext} text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5`}>
            100% In-Browser Privacy
          </span>
        </div>
      )}
    </div>
  );
};
