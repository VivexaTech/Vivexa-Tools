'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Gift,
  Copy,
  Check,
  Compass,
  Heart
} from 'lucide-react';

export const AgeCalculatorWorkspace: React.FC = () => {
  // Default to a realistic DOB e.g. 2000-01-15
  const [dob, setDob] = useState('2000-01-15');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second for live age ticking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chronological age computation
  const calculateAge = () => {
    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Days in previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total metrics
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysInWeek = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next Birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayDayName = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    // Zodiac
    const day = birth.getDate();
    const month = birth.getMonth() + 1;
    let westernZodiac = 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) westernZodiac = 'Aquarius ♒';
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) westernZodiac = 'Pisces ♓';
    else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) westernZodiac = 'Aries ♈';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) westernZodiac = 'Taurus ♉';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) westernZodiac = 'Gemini ♊';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) westernZodiac = 'Cancer ♋';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) westernZodiac = 'Leo ♌';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) westernZodiac = 'Virgo ♍';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) westernZodiac = 'Libra ♎';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) westernZodiac = 'Scorpio ♏';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) westernZodiac = 'Sagittarius ♐';
    else westernZodiac = 'Capricorn ♑';

    const chineseZodiacs = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];
    const birthYear = birth.getFullYear();
    const chineseZodiac = chineseZodiacs[(birthYear - 4) % 12];

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysInWeek,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilNextBday,
      nextBdayDayName,
      westernZodiac,
      chineseZodiac,
    };
  };

  const ageData = calculateAge();

  const copySummary = () => {
    if (!ageData) return;
    const summary = `Chronological Age: ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days (${ageData.totalDays.toLocaleString()} total days lived).\nCalculated with Vivexa Tools (https://tools.vivexatech.in/calculator/age-calculator)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Date Pickers */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Calculate Age As Of
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {ageData ? (
        <div className="space-y-6">
          {/* Main Big Age Banner */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full w-fit">
                Chronological Age
              </span>
              <button
                type="button"
                onClick={copySummary}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors w-fit cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center my-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/15">
                <div className="text-3xl sm:text-5xl font-black">{ageData.years}</div>
                <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Years</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/15">
                <div className="text-3xl sm:text-5xl font-black">{ageData.months}</div>
                <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Months</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/15">
                <div className="text-3xl sm:text-5xl font-black">{ageData.days}</div>
                <div className="text-xs sm:text-sm font-medium text-indigo-100 mt-1">Days</div>
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm text-indigo-100 mt-2 font-mono">
              Live: {currentTime.toLocaleTimeString()} (Precise to the second)
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Gift className="w-4 h-4" />
                <span>Next Birthday</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {ageData.daysUntilNextBday} {ageData.daysUntilNextBday === 1 ? 'day' : 'days'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Falls on a {ageData.nextBdayDayName}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Total Days Lived</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {ageData.totalDays.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {ageData.totalWeeks.toLocaleString()} weeks & {ageData.remainingDaysInWeek} days
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Total Hours</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {ageData.totalHours.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ~{ageData.totalMinutes.toLocaleString()} minutes
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                <span>Zodiac Signs</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {ageData.westernZodiac}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Year of the {ageData.chineseZodiac}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-sm">
          Please select a valid date of birth earlier than the target date.
        </div>
      )}
    </div>
  );
};
