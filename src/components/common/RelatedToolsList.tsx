import React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/types/tools';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';

interface RelatedToolsListProps {
  tools: ToolDefinition[];
}

export const RelatedToolsList: React.FC<RelatedToolsListProps> = ({ tools }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Other utilities you may find helpful.
            </p>
          </div>
        </div>
        <Link
          href="/tools"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
        >
          <span>All tools</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/${tool.category}/${tool.slug}`}
            className="group flex flex-col justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-sm transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {tool.category}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {tool.shortDescription}
              </p>
            </div>
            <div className="mt-3 pt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open tool</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
