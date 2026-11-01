'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CATEGORY_LIST 
} from '@/config/categories';
import { 
  getPopularTools, 
  searchTools, 
  ALL_TOOLS 
} from '@/config/tools';
import { CategoryCard } from '@/components/common/CategoryCard';
import { ToolCard } from '@/components/common/ToolCard';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Zap, 
  ArrowRight, 
  Layers,
  CheckCircle2,
  HardDriveDownload,
  Filter
} from 'lucide-react';
import { ToolCategory } from '@/types/tools';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function HomePage() {
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const popularTools = getPopularTools().slice(0, 12);

  // Search results for hero search box
  const heroSearchResults = heroSearchQuery.trim()
    ? searchTools(heroSearchQuery).slice(0, 6)
    : [];

  // Filtered tools for Section D (Directory)
  const directoryTools = searchTools(
    directorySearchQuery,
    selectedCategory === 'all' ? undefined : selectedCategory
  );

  return (
    <div className="min-h-screen bg-slate-50/40 dark:bg-slate-950 transition-colors">
      {/* SECTION A: HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center">
            <BrandLogo size="lg" showText={false} priority />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% In-Browser Privacy • Zero Server Uploads</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href="https://www.vivexatech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline decoration-indigo-300 font-bold"
            >
              By Vivexa Tech
            </a>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            All Your Everyday Tools.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              One Simple Place.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Convert, compress, edit, and organize your files with free online tools. Simple to use, fast to process, and designed with client-side privacy in mind.
          </p>

          {/* Prominent, Functional Search Bar */}
          <div className="max-w-2xl mx-auto pt-2 text-left relative">
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-indigo-100/50 dark:shadow-none border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-950 transition-all">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Search PDF, image, audio, video tools..."
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                className="w-full py-4 pl-3 pr-4 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
              />
              {heroSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHeroSearchQuery('')}
                  className="mr-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {heroSearchQuery.trim() && (
              <div className="absolute top-full mt-2 inset-x-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-30 p-2 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95">
                {heroSearchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No matching tools found for &ldquo;{heroSearchQuery}&rdquo;.
                  </div>
                ) : (
                  heroSearchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.category}/${tool.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {tool.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tool.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick-Launch Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium mr-1">Trending:</span>
            {[
              { label: 'PDF to Word (.docx)', href: '/pdf/pdf-to-word' },
              { label: 'Word to PDF', href: '/pdf/word-to-pdf' },
              { label: 'Passport Photo', href: '/image/passport-photo-maker' },
              { label: 'Favicon Generator', href: '/image/favicon-generator' },
              { label: 'Sign PDF', href: '/pdf/sign-pdf' },
              { label: 'Protect PDF (AES-256)', href: '/pdf/protect-pdf' },
              { label: 'Unlock PDF', href: '/pdf/unlock-pdf' },
              { label: 'Merge PDF', href: '/pdf/merge-pdf' },
            ].map((tag) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 shadow-2xs transition-all font-medium"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#all-tools-directory"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#categories"
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
            >
              Browse Categories
            </a>
          </div>

          {/* Architecture Transparency Showcase Card */}
          <div className="pt-6 max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Client-Side Hardware Engine Active
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Zero Network Transmission</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span>Pure Memory Buffers</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">1. Local Ingestion</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    Files stream directly into browser RAM via HTML5 File and FileReader APIs without network transit.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">2. Browser Execution</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    Wasm, Web Cryptography, Canvas 2D, and Web Audio transform your files right on your device CPU/GPU.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">3. Direct Download</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    Processed blobs generate instant direct downloads and are wiped from memory on tab close.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: POPULAR TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Most Used Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Tools
            </h2>
          </div>
          <Link
            href="/tools"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
          >
            <span>View all {ALL_TOOLS.length} tools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* SECTION C: BROWSE BY CATEGORY */}
      <section id="categories" className="bg-slate-100/60 dark:bg-slate-900/60 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Complete Toolkit
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every utility is organized into specialized workspaces with dedicated step-by-step guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_LIST.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: EXPLORE ALL TOOLS (SEARCHABLE & FILTERABLE DIRECTORY) */}
      <section id="all-tools-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore All Tools Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing {directoryTools.length} of {ALL_TOOLS.length} available utilities.
            </p>
          </div>

          {/* Search bar inside directory */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name or keyword..."
              value={directorySearchQuery}
              onChange={(e) => setDirectorySearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            All Categories ({ALL_TOOLS.length})
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        {directoryTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {directoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No tools found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search query or selecting &ldquo;All Categories&rdquo;.
            </p>
          </div>
        )}
      </section>

      {/* SECTION E: PRIVACY AND SIMPLICITY */}
      <section className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Zero-Server Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Privacy First. Everything Stays on Your Device.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Unlike other platforms that upload your confidential contracts, personal photos, and sensitive records to remote cloud servers, Vivexa Tools processes supported operations directly inside your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                100% Client-Side Processing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Files are read into your browser&apos;s local memory using WebAssembly, HTML5 Canvas, and Web APIs. Your documents never touch external processing servers.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Lightning Fast Execution
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No waiting in queue, no slow server upload bars, and no file size limits imposed by network bandwidth. Operations complete as fast as your device CPU and GPU can compute.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Transparent &amp; Free Forever
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No registration, no accounts, no credit cards, and no watermarks added to your downloaded outputs. Just genuine, accessible tools for your everyday workflow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
