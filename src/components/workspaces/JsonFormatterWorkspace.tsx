'use client';

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  FileCode,
  Minimize2
} from 'lucide-react';

export const JsonFormatterWorkspace: React.FC = () => {
  const sampleJson = `{\n  "project": "Vivexa Tools",\n  "version": "2.0.0",\n  "privacy": {\n    "zeroServerUploads": true,\n    "clientSideProcessing": true\n  },\n  "features": [\n    "PDF Tools",\n    "Image Compress & Passport",\n    "QR & Barcode Studio",\n    "Developer Utilities"\n  ]\n}`;

  const [inputJson, setInputJson] = useState<string>(sampleJson);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorLocation, setErrorLocation] = useState<{ line: number; col: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{ keys: number; bytes: number } | null>(null);

  useEffect(() => {
    validateAndAnalyze(inputJson);
  }, [inputJson]);

  const validateAndAnalyze = (text: string) => {
    if (!text.trim()) {
      setErrorMsg(null);
      setErrorLocation(null);
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setErrorMsg(null);
      setErrorLocation(null);

      // Count keys
      let keyCount = 0;
      const countKeys = (obj: any) => {
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach((k) => {
            keyCount++;
            countKeys(obj[k]);
          });
        }
      };
      countKeys(parsed);

      setStats({
        keys: keyCount,
        bytes: new Blob([text]).size,
      });
    } catch (err: any) {
      setStats(null);
      const msg = err.message || 'Invalid JSON syntax';
      setErrorMsg(msg);

      // Attempt to extract position from error message (e.g. "at position 45")
      const posMatch = msg.match(/position\s+(\d+)/i);
      if (posMatch) {
        const charIndex = parseInt(posMatch[1], 10);
        const lines = text.slice(0, charIndex).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        setErrorLocation({ line, col });
      } else {
        setErrorLocation(null);
      }
    }
  };

  const handleFormat = (spaces: number) => {
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, spaces);
      setInputJson(formatted);
    } catch (err: any) {
      setErrorMsg('Cannot format invalid JSON. Please fix syntax errors first.');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
    } catch (err: any) {
      setErrorMsg('Cannot minify invalid JSON. Please fix syntax errors first.');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([inputJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-json-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputJson(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleFormat(2)}
            className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            Beautify (2 Spaces)
          </button>
          <button
            type="button"
            onClick={() => handleFormat(4)}
            className="px-3 py-1.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
          >
            Beautify (4 Spaces)
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3 py-1.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            onClick={() => setInputJson(sampleJson)}
            className="px-3 py-1.5 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            Load Sample
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            id="jsonFileInput"
            accept=".json,application/json,text/plain"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="jsonFileInput"
            className="px-3 py-1.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
          >
            Upload .json
          </label>
          <button
            type="button"
            onClick={() => setInputJson('')}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-500 cursor-pointer transition-colors"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="relative">
          <textarea
            rows={18}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
            spellCheck={false}
          />
        </div>

        {/* Validation Status Banner */}
        {errorMsg ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Syntax Error:</strong> {errorMsg}
                {errorLocation && ` (Near Line ${errorLocation.line}, Column ${errorLocation.col})`}
              </span>
            </div>
          </div>
        ) : stats ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Valid JSON Syntax</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
              <span>Keys: {stats.keys}</span>
              <span>Size: {(stats.bytes / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero server upload. Processed in browser memory.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!inputJson}
              className="py-2 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!inputJson || !!errorMsg}
              className="py-2 px-4 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
