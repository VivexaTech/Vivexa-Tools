'use client';

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  Calculator,
  ArrowRightLeft,
  Award
} from 'lucide-react';

interface CgpaConverterWorkspaceProps {
  initialMode?: 'cgpa-to-percentage' | 'percentage-to-cgpa';
}

export const CgpaConverterWorkspace: React.FC<CgpaConverterWorkspaceProps> = ({
  initialMode = 'cgpa-to-percentage',
}) => {
  const [mode, setMode] = useState<'cgpa-to-percentage' | 'percentage-to-cgpa'>(initialMode);

  // CGPA to % states
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [formulaType, setFormulaType] = useState<'cbse' | 'mumbai' | 'custom'>('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<number>(9.5);

  // Semester breakdown mode
  const [isSemesterMode, setIsSemesterMode] = useState<boolean>(false);
  const [semesters, setSemesters] = useState<Array<{ sem: number; sgpa: number; credits: number }>>([
    { sem: 1, sgpa: 8.2, credits: 20 },
    { sem: 2, sgpa: 8.4, credits: 20 },
    { sem: 3, sgpa: 8.6, credits: 22 },
    { sem: 4, sgpa: 8.8, credits: 22 },
  ]);

  // % to CGPA states
  const [percentage, setPercentage] = useState<number>(80.75);

  const [copied, setCopied] = useState<boolean>(false);

  // Compute CGPA to %
  const cgpaResult = useMemo(() => {
    let activeCgpa = cgpa;

    if (isSemesterMode) {
      const totalWeighted = semesters.reduce((acc, s) => acc + s.sgpa * s.credits, 0);
      const totalCredits = semesters.reduce((acc, s) => acc + s.credits, 0);
      activeCgpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;
    }

    let percent = 0;
    if (formulaType === 'cbse') {
      percent = activeCgpa * 9.5;
    } else if (formulaType === 'mumbai') {
      percent = 7.1 * activeCgpa + 12;
    } else {
      percent = activeCgpa * customMultiplier;
    }

    percent = Math.min(100, Math.max(0, percent));

    let division = 'Pass Class';
    if (percent >= 75) division = 'First Class with Distinction';
    else if (percent >= 60) division = 'First Class';
    else if (percent >= 50) division = 'Second Class';

    return {
      activeCgpa,
      percent,
      division,
    };
  }, [cgpa, formulaType, customMultiplier, isSemesterMode, semesters]);

  // Compute % to CGPA
  const percentResult = useMemo(() => {
    const cgpa10 = Math.min(10, Math.max(0, percentage / 9.5));
    // 4.0 scale estimation
    const gpa4 = Math.min(4.0, Math.max(0, (percentage / 100) * 4));

    let grade = 'F';
    if (percentage >= 90) grade = 'O (Outstanding / A+)';
    else if (percentage >= 80) grade = 'A (Excellent)';
    else if (percentage >= 70) grade = 'B+ (Very Good)';
    else if (percentage >= 60) grade = 'B (Good)';
    else if (percentage >= 50) grade = 'C (Fair)';
    else if (percentage >= 40) grade = 'P (Pass)';

    return {
      cgpa10,
      gpa4,
      grade,
    };
  }, [percentage]);

  const copyResult = () => {
    let text = '';
    if (mode === 'cgpa-to-percentage') {
      text = `CGPA: ${cgpaResult.activeCgpa.toFixed(2)} | Equivalent Percentage: ${cgpaResult.percent.toFixed(2)}% (${cgpaResult.division})\nCalculated with Vivexa Tools (https://tools.vivexatech.in/student/cgpa-to-percentage)`;
    } else {
      text = `Percentage: ${percentage}% | Equivalent 10-Point CGPA: ${percentResult.cgpa10.toFixed(2)} | US 4.0 GPA: ${percentResult.gpa4.toFixed(2)} (${percentResult.grade})\nCalculated with Vivexa Tools (https://tools.vivexatech.in/student/percentage-to-cgpa)`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Mode Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setMode('cgpa-to-percentage')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'cgpa-to-percentage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>CGPA to Percentage</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('percentage-to-cgpa')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'percentage-to-cgpa'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Percentage to CGPA</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {mode === 'cgpa-to-percentage' ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>CGPA Conversion Details</span>
              </h3>

              {/* Formula selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  University Formula Standard
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormulaType('cbse')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                      formulaType === 'cbse'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    CBSE / AICTE (9.5×)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormulaType('mumbai')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                      formulaType === 'mumbai'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Mumbai Univ (7.1×)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormulaType('custom')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                      formulaType === 'custom'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Custom Multiplier
                  </button>
                </div>
              </div>

              {formulaType === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Custom Multiplier (X in: CGPA × X)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMultiplier}
                    onChange={(e) => setCustomMultiplier(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold"
                  />
                </div>
              )}

              {/* CGPA Input or Semester Mode */}
              {!isSemesterMode ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Enter CGPA (Scale of 10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-2xl font-black font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Semester-Wise SGPA & Credits
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {semesters.map((sem, idx) => (
                      <div key={sem.sem} className="flex items-center gap-3">
                        <span className="text-xs font-semibold w-16 text-slate-500">Sem {sem.sem}:</span>
                        <input
                          type="number"
                          placeholder="SGPA"
                          min="0"
                          max="10"
                          step="0.01"
                          value={sem.sgpa}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSemesters((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, sgpa: val } : s))
                            );
                          }}
                          className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                        />
                        <span className="text-xs text-slate-400">Credits:</span>
                        <input
                          type="number"
                          placeholder="Credits"
                          min="1"
                          max="40"
                          value={sem.credits}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSemesters((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, credits: val } : s))
                            );
                          }}
                          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSemesters((prev) => [
                        ...prev,
                        { sem: prev.length + 1, sgpa: 8.0, credits: 20 },
                      ])
                    }
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    + Add Semester
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSemesterMode(!isSemesterMode)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  {isSemesterMode ? '← Switch to Single CGPA Score Input' : 'Switch to Semester-Wise SGPA Calculator →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>Percentage Input</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Enter Your Academic Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-2xl font-black font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl">
                    %
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                Standard reverse formula: <strong>CGPA = Percentage ÷ 9.5</strong> according to CBSE and AICTE grading guidelines.
              </div>
            </div>
          )}
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                {mode === 'cgpa-to-percentage' ? 'Converted Percentage' : 'Converted 10-Point CGPA'}
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

            {mode === 'cgpa-to-percentage' ? (
              <>
                <div>
                  <div className="text-4xl sm:text-5xl font-black">
                    {cgpaResult.percent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-indigo-100 mt-1">
                    Based on {cgpaResult.activeCgpa.toFixed(2)} CGPA
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Academic Classification:
                    </span>
                  </div>
                  <div className="text-sm font-bold text-indigo-100 bg-white/10 px-3 py-2 rounded-xl">
                    {cgpaResult.division}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-4xl sm:text-5xl font-black">
                    {percentResult.cgpa10.toFixed(2)}
                  </div>
                  <div className="text-xs text-indigo-100 mt-1">
                    10-Point Scale Equivalent
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-3 text-xs">
                  <div className="flex justify-between text-indigo-100">
                    <span>US 4.0 GPA Equivalent:</span>
                    <span className="font-bold text-white text-sm">{percentResult.gpa4.toFixed(2)} / 4.0</span>
                  </div>
                  <div className="flex justify-between text-indigo-100">
                    <span>Letter Grade:</span>
                    <span className="font-bold text-white text-sm">{percentResult.grade}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
