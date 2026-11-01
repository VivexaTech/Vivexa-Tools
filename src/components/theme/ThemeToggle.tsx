'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = theme || 'system';
  const isDark = resolvedTheme === 'dark';

  const options = [
    {
      value: 'light',
      label: 'Light',
      description: 'Always light theme',
      icon: Sun,
      iconColor: 'text-amber-500',
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Always dark theme',
      icon: Moon,
      iconColor: 'text-indigo-400',
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow OS preference',
      icon: Laptop,
      iconColor: 'text-slate-400',
    },
  ];

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        aria-label={`Theme setting: currently ${currentTheme}. Click to choose Light, Dark, or System.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={`Theme: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`}
      >
        {currentTheme === 'system' ? (
          <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        ) : isDark ? (
          <Moon className="w-4 h-4 text-indigo-400 transition-transform" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform" />
        )}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select color theme"
          className="absolute right-0 mt-2 w-44 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Appearance
          </div>

          <div className="p-1 space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = currentTheme === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${opt.iconColor}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
