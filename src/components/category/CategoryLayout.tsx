'use client';

import React, { useState } from 'react';
import { CategoryDefinition, ToolDefinition } from '@/types/tools';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ToolCard } from '@/components/common/ToolCard';
import { Search, Filter, ShieldCheck } from 'lucide-react';

interface CategoryLayoutProps {
  category: CategoryDefinition;
  tools: ToolDefinition[];
}

export const CategoryLayout: React.FC<CategoryLayoutProps> = ({ category, tools }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const breadcrumbs = [{ label: category.name }];

  const filteredTools = tools.filter((tool) => {
    const matchesSubcategory =
      selectedSubcategory === 'All' || tool.subcategory === selectedSubcategory;

    const matchesSearch =
      !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.searchKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubcategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />

        {/* Category Header */}
        <div className="mt-4 mb-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {category.badge}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser Privacy</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {tools.length} Tools Available
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            {category.description}
          </p>

          {/* Search bar within Category */}
          <div className="mt-6 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search within ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Subcategory Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedSubcategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubcategory === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All ({tools.length})
          </button>
          {category.subcategories.map((sub) => {
            const count = tools.filter((t) => t.subcategory === sub).length;
            if (count === 0) return null;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubcategory === sub
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>

        {/* Tool Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base font-semibold text-slate-700">No tools found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or subcategory filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
