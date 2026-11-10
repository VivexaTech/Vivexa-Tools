'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Flame
} from 'lucide-react';

const PASSAGES = {
  easy: [
    'The quick brown fox jumps over the lazy dog. Sunshine brings happiness and warmth to everyone who walks in the park on a bright Sunday morning.',
    'Reading books expands our imagination and helps us learn about distant worlds. Good habits formed at youth make all the difference in our future.',
  ],
  medium: [
    'Technology has transformed the way human beings communicate across continents. With instant messaging and video calls, geographic distance is no longer a barrier to global collaboration.',
    'Effective time management allows individuals to achieve balance between demanding professional responsibilities and meaningful personal pursuits.',
  ],
  hard: [
    'Asynchronous JavaScript relies heavily on promises, microtask queues, and event loops to orchestrate non-blocking input and output operations without deadlocks.',
    'In cryptography, asymmetric public-key algorithms guarantee authentication and confidentiality across untrusted communication networks without transmitting secret keys.',
  ],
};

export const TypingSpeedTestWorkspace: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [passage, setPassage] = useState<string>(PASSAGES.medium[0]);
  const [userInput, setUserInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset passage
  const resetTest = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(selectedDuration);
    setUserInput('');
    const list = PASSAGES[difficulty];
    const next = list[Math.floor(Math.random() * list.length)];
    setPassage(next);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    resetTest();
  }, [difficulty, selectedDuration]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    setUserInput(value);

    // If completed passage
    if (value.length >= passage.length) {
      setIsActive(false);
      setIsFinished(true);
    }
  };

  // Metrics computation
  let correctChars = 0;
  let wrongChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === passage[i]) {
      correctChars++;
    } else {
      wrongChars++;
    }
  }

  const secondsElapsed = Math.max(1, selectedDuration - timeLeft);
  const minutesElapsed = secondsElapsed / 60;
  const grossWpm = Math.round(userInput.length / 5 / minutesElapsed) || 0;
  const netWpm = Math.max(0, Math.round(correctChars / 5 / minutesElapsed)) || 0;
  const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Durations */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Duration:</span>
          {[30, 60, 120].map((d) => (
            <button
              key={d}
              type="button"
              disabled={isActive}
              onClick={() => setSelectedDuration(d)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedDuration === d
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {d === 60 ? '1 Minute' : d === 120 ? '2 Minutes' : '30 Sec'}
            </button>
          ))}
        </div>

        {/* Difficulties */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              disabled={isActive}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs capitalize transition-all ${
                difficulty === diff
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Typing Arena */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Live Counters */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Time Left</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {timeLeft}s
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Net WPM</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {netWpm}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Accuracy</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {accuracy}%
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Errors</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-rose-500">
              {wrongChars}
            </span>
          </div>
        </div>

        {/* Character By Character Highlight Display */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-base sm:text-lg leading-loose select-none">
          {passage.split('').map((char, index) => {
            let color = 'text-slate-400 dark:text-slate-500';
            let bg = '';
            if (index < userInput.length) {
              if (userInput[index] === char) {
                color = 'text-emerald-600 dark:text-emerald-400 font-bold';
              } else {
                color = 'text-white font-bold';
                bg = 'bg-rose-500 rounded px-0.5';
              }
            } else if (index === userInput.length) {
              bg = 'border-b-2 border-indigo-600 dark:border-indigo-400 animate-pulse';
            }

            return (
              <span key={index} className={`${color} ${bg}`}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden / Transparent typing input field */}
        {!isFinished ? (
          <div>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onPaste={(e) => e.preventDefault()}
              placeholder="Start typing here... (Paste is disabled for accuracy)"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all"
              autoFocus
            />
          </div>
        ) : (
          /* Finished Scorecard */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-2xl font-black">Typing Test Completed!</h3>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-black">{netWpm}</div>
                <div className="text-xs text-indigo-100">Net WPM</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-black">{accuracy}%</div>
                <div className="text-xs text-indigo-100">Accuracy</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl font-black">{wrongChars}</div>
                <div className="text-xs text-indigo-100">Mistakes</div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetTest}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-700 hover:bg-indigo-50 shadow-md inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
          <span>Click input and start typing to activate timer.</span>
          <button
            type="button"
            onClick={resetTest}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
