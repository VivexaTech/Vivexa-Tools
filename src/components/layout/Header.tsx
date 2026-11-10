'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Pipette, 
  Search, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight,
  Layers
} from 'lucide-react';
import { searchTools, ALL_TOOLS } from '@/config/tools';
import { ToolDefinition } from '@/types/tools';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { BrandLogo } from '@/components/common/BrandLogo';
import Image from 'next/image';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToolDefinition[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchTools(searchQuery).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'PDF Tools', href: '/pdf', icon: FileText, color: 'text-indigo-600' },
    { name: 'Image Tools', href: '/image', icon: ImageIcon, color: 'text-blue-600' },
    { name: 'Audio Tools', href: '/audio', icon: Music, color: 'text-violet-600' },
    { name: 'Video Tools', href: '/video', icon: Video, color: 'text-sky-600' },
    { name: 'Color Picker', href: '/color', icon: Pipette, color: 'text-emerald-600' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Official Transparent Brand Logo */}
            <Link href="/" className="group" aria-label="Vivexa Tools Homepage">
              <BrandLogo size="md" priority />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search, Theme Toggle, All Tools & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs sm:text-sm font-medium transition-colors"
                aria-label="Search tools"
              >
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                <span className="hidden sm:inline">Search tools...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              <Link
                href="/tools"
                className="hidden md:inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
              >
                All Tools
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon || Layers;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && <Icon className={`w-4 h-4 ${link.color}`} />}
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
              <Link
                href="/tools"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40"
              >
                <span>Browse All {ALL_TOOLS.length} Tools</span>
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero server file uploads. All processing is 100% local.</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 md:p-20 flex justify-center items-start">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search PDF, image, audio, video tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800">
              {searchQuery && searchResults.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No tools found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}

              {searchResults.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${tool.category}/${tool.slug}`}
                  onClick={() => setSearchModalOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tool.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                        {tool.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {tool.shortDescription}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}

              {!searchQuery && (
                <div className="p-4 text-xs text-slate-400 dark:text-slate-500">
                  Try searching for: <span className="font-medium text-slate-600 dark:text-slate-300">merge pdf</span>, <span className="font-medium text-slate-600 dark:text-slate-300">passport photo</span>, <span className="font-medium text-slate-600 dark:text-slate-300">compress 50kb</span>, <span className="font-medium text-slate-600 dark:text-slate-300">favicon generator</span>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
