import React from 'react';
import Link from 'next/link';
import { CategoryDefinition } from '@/types/tools';
import { getCategoryToolCount } from '@/config/tools';
import { FileText, Image as ImageIcon, Music, Video, Pipette, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryDefinition;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  FileText,
  Image: ImageIcon,
  Music,
  Video,
  Pipette,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = iconMap[category.icon] || FileText;
  const toolCount = getCategoryToolCount(category.id);

  return (
    <Link
      href={`/${category.slug}`}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-50/50 dark:hover:shadow-none transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100/80 dark:from-indigo-950/80 dark:to-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
            {toolCount} {toolCount === 1 ? 'Tool' : 'Tools'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {category.shortDescription}
        </p>

        {/* Subcategories pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {category.subcategories.slice(0, 3).map((sub, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
            >
              {sub}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded-md">
              +{category.subcategories.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
        <span>Explore {category.name}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
