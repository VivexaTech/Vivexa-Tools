'use client';

import React, { useState, useMemo } from 'react';
import {
  Percent,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Sparkles
} from 'lucide-react';

export const GstCalculatorWorkspace: React.FC = () => {
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInterstate, setIsInterstate] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const rate = gstRate;
    let netAmount = 0;
    let gstAmount = 0;
    let grossAmount = 0;

    if (mode === 'exclusive') {
      // Add GST to base amount
      netAmount = amount;
      gstAmount = (netAmount * rate) / 100;
      grossAmount = netAmount + gstAmount;
    } else {
      // Amount is inclusive of GST: netAmount = gross / (1 + rate/100)
      grossAmount = amount;
      netAmount = grossAmount / (1 + rate / 100);
      gstAmount = grossAmount - netAmount;
    }

    const cgst = isInterstate ? 0 : gstAmount / 2;
    const sgst = isInterstate ? 0 : gstAmount / 2;
    const igst = isInterstate ? gstAmount : 0;

    return {
      netAmount,
      gstAmount,
      grossAmount,
      cgst,
      sgst,
      igst,
    };
  }, [mode, amount, gstRate, isInterstate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const copySummary = () => {
    const text = `GST Summary (${mode === 'exclusive' ? 'GST Added' : 'GST Extracted'})\nBase Amount: ₹${formatCurrency(calculations.netAmount)}\nGST Rate: ${gstRate}%\n${isInterstate ? `IGST: ₹${formatCurrency(calculations.igst)}` : `CGST (50%): ₹${formatCurrency(calculations.cgst)}\nSGST (50%): ₹${formatCurrency(calculations.sgst)}`}\nTotal GST: ₹${formatCurrency(calculations.gstAmount)}\nGross Total: ₹${formatCurrency(calculations.grossAmount)}\nCalculated via Vivexa Tools (https://tools.vivexatech.in/calculator/gst-calculator)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setMode('exclusive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'exclusive'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>GST Exclusive (Add GST)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('inclusive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'inclusive'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>GST Inclusive (Remove GST)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-indigo-600" />
              <span>{mode === 'exclusive' ? 'Base Amount to Add Tax' : 'Total Amount with Included Tax'}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {mode === 'exclusive' ? 'Net Price / Base Amount (₹)' : 'Gross Invoice Price (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* GST Rate Slabs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                GST Tax Slab Rate
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[0, 5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`py-2 px-3 rounded-xl font-bold text-sm transition-all border ${
                      gstRate === rate
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Custom"
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full py-2 px-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Interstate vs Intrastate */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInterstate}
                  onChange={(e) => setIsInterstate(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Inter-State Transaction (IGST 100% instead of CGST + SGST 50/50)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Final Total Amount
              </span>
              <button
                type="button"
                onClick={copySummary}
                className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black">
                ₹{formatCurrency(calculations.grossAmount)}
              </div>
              <div className="text-xs text-indigo-100 mt-1">
                Total Price (Includes ₹{formatCurrency(calculations.gstAmount)} Tax)
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-indigo-100">
                <span>Base Net Amount:</span>
                <span className="font-bold text-white">₹{formatCurrency(calculations.netAmount)}</span>
              </div>
              <div className="flex justify-between text-indigo-100">
                <span>Total GST ({gstRate}%):</span>
                <span className="font-bold text-white">₹{formatCurrency(calculations.gstAmount)}</span>
              </div>
              {!isInterstate ? (
                <>
                  <div className="flex justify-between text-indigo-200 pl-3">
                    <span>CGST ({(gstRate / 2).toFixed(1)}%):</span>
                    <span>₹{formatCurrency(calculations.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-indigo-200 pl-3">
                    <span>SGST ({(gstRate / 2).toFixed(1)}%):</span>
                    <span>₹{formatCurrency(calculations.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-indigo-200 pl-3">
                  <span>IGST ({gstRate}%):</span>
                  <span>₹{formatCurrency(calculations.igst)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
