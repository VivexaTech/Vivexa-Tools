import React from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/types/tools';
import { 
  Combine, 
  Scissors, 
  Trash2, 
  FileOutput, 
  Layers, 
  Minimize2, 
  RotateCw, 
  Hash, 
  Stamp, 
  PenTool, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  FileUp, 
  ScanText, 
  FileCode, 
  CheckSquare, 
  Columns, 
  FileText, 
  FileType, 
  UserCheck, 
  Maximize2, 
  User, 
  Square, 
  Type, 
  Award, 
  CreditCard, 
  Scaling, 
  Crop, 
  Sparkles, 
  ArrowRightLeft, 
  Music, 
  Video, 
  Pipette, 
  FileSpreadsheet,
  Globe,
  ArrowRight,
  QrCode,
  ScanLine,
  Barcode,
  Camera,
  Calendar,
  DollarSign,
  Percent,
  Scale,
  Coins,
  Code,
  Code2,
  Mic,
  Volume2,
  GraduationCap,
  Keyboard,
  Receipt,
  Wallet,
  LayoutGrid,
  BadgeCheck,
} from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Combine,
  Scissors,
  Trash2,
  FileOutput,
  Layers,
  Minimize2,
  RotateCw,
  Hash,
  Stamp,
  PenTool,
  Lock,
  Unlock,
  Image: ImageIcon,
  FileUp,
  ScanText,
  FileCode,
  CheckSquare,
  Columns,
  FileText,
  FileType,
  UserCheck,
  Maximize2,
  User,
  Square,
  Type,
  Award,
  CreditCard,
  Scaling,
  Crop,
  Sparkles,
  ArrowRightLeft,
  Music,
  Video,
  Pipette,
  FileSpreadsheet,
  Globe,
  QrCode,
  ScanLine,
  Barcode,
  Camera,
  Calendar,
  DollarSign,
  Percent,
  Scale,
  Coins,
  Code,
  Code2,
  Mic,
  Volume2,
  GraduationCap,
  Keyboard,
  Receipt,
  Wallet,
  LayoutGrid,
  BadgeCheck,
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const Icon = iconMap[tool.icon] || FileText;

  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-md hover:shadow-indigo-50/50 dark:hover:shadow-none transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            {tool.isPopular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                Popular
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {tool.category}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {tool.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
          {tool.subcategory}
        </span>
        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
