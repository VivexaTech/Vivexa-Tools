'use client';

import React, { useState, useMemo } from 'react';
import {
  Coins,
  ArrowRightLeft,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Settings2,
  Clock
} from 'lucide-react';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number; // 1 USD in this currency
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 86.8 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.96 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.81 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rateToUsd: 3.67 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUsd: 1.43 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rateToUsd: 1.6 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUsd: 153.5 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', rateToUsd: 1.35 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUsd: 0.91 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToUsd: 7.28 },
};

export const CurrencyConverterWorkspace: React.FC = () => {
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('INR');
  const [amount, setAmount] = useState<number>(100);
  const [customRate, setCustomRate] = useState<string>('');
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Benchmark rate
  const benchmarkRate = useMemo(() => {
    const from = CURRENCIES[fromCode];
    const to = CURRENCIES[toCode];
    if (!from || !to) return 1;
    // 1 From in USD = 1 / from.rateToUsd
    // 1 From in To = (1 / from.rateToUsd) * to.rateToUsd
    return to.rateToUsd / from.rateToUsd;
  }, [fromCode, toCode]);

  // Active rate
  const effectiveRate = useCustomRate && customRate && !isNaN(Number(customRate))
    ? Number(customRate)
    : benchmarkRate;

  const convertedValue = amount * effectiveRate;

  const swap = () => {
    const tmp = fromCode;
    setFromCode(toCode);
    setToCode(tmp);
    setUseCustomRate(false);
    setCustomRate('');
  };

  const copyResult = () => {
    const text = `${amount} ${fromCode} = ${convertedValue.toFixed(2)} ${toCode} (Rate: 1 ${fromCode} = ${effectiveRate.toFixed(4)} ${toCode})\nCalculated via Vivexa Tools (https://tools.vivexatech.in/calculator/currency-converter)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-indigo-600" />
              <span>Currency Exchange</span>
            </h3>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Amount to Convert
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  {CURRENCIES[fromCode]?.symbol || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">From Currency</label>
                <select
                  value={fromCode}
                  onChange={(e) => {
                    setFromCode(e.target.value);
                    setUseCustomRate(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={swap}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Swap currencies"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">To Currency</label>
                <select
                  value={toCode}
                  onChange={(e) => {
                    setToCode(e.target.value);
                    setUseCustomRate(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Rate Accordion */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomRate}
                  onChange={(e) => setUseCustomRate(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Set custom exchange rate (e.g. your bank\'s card markup rate)</span>
              </label>

              {useCustomRate && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <span className="text-xs text-slate-500">1 {fromCode} =</span>
                  <input
                    type="number"
                    step="any"
                    placeholder={benchmarkRate.toFixed(4)}
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                  />
                  <span className="text-xs font-semibold">{toCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Output Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Converted Total
              </span>
              <button
                type="button"
                onClick={copyResult}
                className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black">
                {CURRENCIES[toCode]?.symbol || ''} {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-indigo-100 mt-1">
                {amount} {fromCode} in {CURRENCIES[toCode]?.name}
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 text-xs space-y-1.5">
              <div className="flex justify-between text-indigo-100">
                <span>Exchange Rate:</span>
                <span className="font-mono font-bold text-white">
                  1 {fromCode} = {effectiveRate.toFixed(4)} {toCode}
                </span>
              </div>
              <div className="flex justify-between text-indigo-100">
                <span>Inverse Rate:</span>
                <span className="font-mono text-indigo-200">
                  1 {toCode} = {(1 / effectiveRate).toFixed(4)} {fromCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-2 text-[11px] text-indigo-200">
                <Clock className="w-3 h-3" />
                <span>Benchmark reference rates. Set custom rate anytime.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
