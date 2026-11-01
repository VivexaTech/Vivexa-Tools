import React from 'react';
import { ToolInstruction } from '@/types/tools';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface StepInstructionsProps {
  toolName: string;
  instructions: ToolInstruction[];
  limitations?: string[];
}

export const StepInstructions: React.FC<StepInstructionsProps> = ({
  toolName,
  instructions,
  limitations
}) => {
  if (!instructions || instructions.length === 0) return null;

  return (
    <section className="mt-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            How to Use {toolName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Follow these easy steps to process your file right in your browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructions.map((item) => (
          <div
            key={item.step}
            className="relative bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {item.step}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Step {item.step}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Instant local processing</span>
            </div>
          </div>
        ))}
      </div>

      {limitations && limitations.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300">
          <span className="font-bold">Important Notes & Limitations:</span>
          <ul className="list-disc list-inside mt-1 space-y-1 text-amber-800 dark:text-amber-300">
            {limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
