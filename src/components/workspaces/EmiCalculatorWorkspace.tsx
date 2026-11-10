'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  PieChart,
  Calendar,
  Download,
  Copy,
  Check,
  TrendingDown,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const EmiCalculatorWorkspace: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly'>('yearly');

  // Currency prefix / formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const calculations = useMemo(() => {
    const P = principal;
    const r = annualRate / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total months

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalPercent: 100,
        interestPercent: 0,
        schedule: [],
      };
    }

    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const principalPercent = (P / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    // Build Amortization Schedule
    let balance = P;
    const schedule: Array<{
      month: number;
      year: number;
      principalPaid: number;
      interestPaid: number;
      totalPaid: number;
      balance: number;
    }> = [];

    for (let m = 1; m <= n; m++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);

      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        principalPaid: principalForMonth,
        interestPaid: interestForMonth,
        totalPaid: emi,
        balance,
      });
    }

    return {
      monthlyEmi: emi,
      totalInterest,
      totalPayment,
      principalPercent,
      interestPercent,
      schedule,
    };
  }, [principal, annualRate, tenureYears]);

  // Aggregate yearly schedule
  const yearlySchedule = useMemo(() => {
    const yearsMap: Record<number, { year: number; principalPaid: number; interestPaid: number; totalPaid: number; balance: number }> = {};
    calculations.schedule.forEach((item) => {
      if (!yearsMap[item.year]) {
        yearsMap[item.year] = {
          year: item.year,
          principalPaid: 0,
          interestPaid: 0,
          totalPaid: 0,
          balance: item.balance,
        };
      }
      yearsMap[item.year].principalPaid += item.principalPaid;
      yearsMap[item.year].interestPaid += item.interestPaid;
      yearsMap[item.year].totalPaid += item.totalPaid;
      yearsMap[item.year].balance = item.balance; // End of year balance
    });
    return Object.values(yearsMap);
  }, [calculations.schedule]);

  const downloadCsv = () => {
    const headers = ['Year,Principal Paid,Interest Paid,Total Payment,Remaining Balance\n'];
    const rows = yearlySchedule.map(
      (y) => `${y.year},${Math.round(y.principalPaid)},${Math.round(y.interestPaid)},${Math.round(y.totalPaid)},${Math.round(y.balance)}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-amortization-schedule-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySummary = () => {
    const text = `Loan Amount: ₹${formatCurrency(principal)}\nInterest Rate: ${annualRate}%\nTenure: ${tenureYears} Years\nMonthly EMI: ₹${formatCurrency(calculations.monthlyEmi)}\nTotal Interest: ₹${formatCurrency(calculations.totalInterest)}\nTotal Payable: ₹${formatCurrency(calculations.totalPayment)}\nCalculated via Vivexa Tools (https://tools.vivexatech.in/calculator/emi-calculator)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <span>Loan Parameters</span>
            </h3>

            {/* Principal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Loan Amount
                </label>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <span>₹</span>
                  <input
                    type="number"
                    min="10000"
                    max="100000000"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-28 bg-transparent text-right focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="25000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>₹50K</span>
                <span>₹50L</span>
                <span>₹1Cr</span>
                <span>₹2Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Annual Interest Rate (% P.A.)
                </label>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.1"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-16 bg-transparent text-right focus:outline-none"
                  />
                  <span>%</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Loan Tenure
                </label>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-12 bg-transparent text-right focus:outline-none"
                  />
                  <span>Years ({tenureYears * 12} Mo)</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 Yr</span>
                <span>10 Yrs</span>
                <span>20 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Monthly Loan EMI
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
                ₹{formatCurrency(calculations.monthlyEmi)}
              </div>
              <div className="text-xs text-indigo-100 mt-1">Per Month for {tenureYears * 12} Months</div>
            </div>

            <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-indigo-100 block">Total Interest</span>
                <span className="text-base sm:text-lg font-bold">
                  ₹{formatCurrency(calculations.totalInterest)}
                </span>
              </div>
              <div>
                <span className="text-xs text-indigo-100 block">Total Amount</span>
                <span className="text-base sm:text-lg font-bold">
                  ₹{formatCurrency(calculations.totalPayment)}
                </span>
              </div>
            </div>

            {/* Proportional Ratio Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-indigo-100 font-medium">
                <span>Principal: {calculations.principalPercent.toFixed(1)}%</span>
                <span>Interest: {calculations.interestPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-400 h-full"
                  style={{ width: `${calculations.principalPercent}%` }}
                />
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: `${calculations.interestPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Loan Amortization Schedule</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Year-by-year principal reduction and interest payoff table
            </p>
          </div>

          <button
            type="button"
            onClick={downloadCsv}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Amortization CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Principal Paid</th>
                <th className="py-2.5 px-3">Interest Paid</th>
                <th className="py-2.5 px-3">Total Payment</th>
                <th className="py-2.5 px-3">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {yearlySchedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 font-mono">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Year {row.year}</td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">₹{formatCurrency(row.principalPaid)}</td>
                  <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">₹{formatCurrency(row.interestPaid)}</td>
                  <td className="py-2.5 px-3 font-medium">₹{formatCurrency(row.totalPaid)}</td>
                  <td className="py-2.5 px-3 text-slate-500">₹{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
