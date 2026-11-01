'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ToolCard } from '@/components/common/ToolCard';
import { ALL_TOOLS, searchTools } from '@/config/tools';
import { CATEGORY_LIST } from '@/config/categories';
import { ToolCategory } from '@/types/tools';
import { Search, Sparkles, ShieldCheck } from 'lucide-react';

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [onlyPopular, setOnlyPopular] = useState(false);

  const filtered = searchTools(
    searchQuery,
    selectedCategory === 'all' ? undefined : selectedCategory
  ).filter((tool) => (!onlyPopular ? true : tool.isPopular));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'All Tools Directory' }]} />

        {/* Directory Header */}
        <div className="mt-4 mb-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Universal Directory
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Processing</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            All Online Utilities
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Browse and search all {ALL_TOOLS.length} privacy-focused tools across PDF, image, audio, video, and color inspection.
          </p>

          {/* Search Input */}
          <div className="mt-6 max-w-xl relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tool name or keyword (e.g. merge, compress, passport, trim)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              All Categories ({ALL_TOOLS.length})
            </button>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
            <input
              type="checkbox"
              checked={onlyPopular}
              onChange={(e) => setOnlyPopular(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300"
            />
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Show Popular Only</span>
          </label>
        </div>

        {/* Tool Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base font-semibold text-slate-700">No tools match your query</p>
            <p className="text-xs text-slate-500 mt-1">
              Try clearing your search filters to explore all available tools.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
