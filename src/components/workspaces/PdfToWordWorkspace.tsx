'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { convertPdfToWord, PdfToWordResult } from '@/lib/pdf/pdfToWord';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import {
  FileText,
  FileCheck,
  Download,
  RotateCcw,
  Loader2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const PdfToWordWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [ocrFallback, setOcrFallback] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [result, setResult] = useState<PdfToWordResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setResult(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setProgressStatus('');
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(10);
    setProgressStatus('Reading PDF document structure...');

    try {
      const res = await convertPdfToWord(file, {
        ocrFallback,
        onProgress: (prog) => {
          const pct = Math.round((prog.page / prog.totalPages) * 90);
          setProgressPercent(pct);
          setProgressStatus(prog.status);
        },
      });

      setProgressPercent(100);
      setProgressStatus('Generating valid DOCX package in memory...');
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to convert PDF to Word. Please check the document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(result.docxBlob, `${baseName}.docx`);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setProgressStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      {!file && (
        <Dropzone
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMb={60}
          onFilesSelected={handleFilesSelected}
          label="Choose PDF to convert to Word (.docx)"
          sublabel="Extracts structured paragraphs, headings, and lists locally. 100% private."
        />
      )}

      {/* Main Configuration & Processing Card */}
      {file && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          {/* File Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              Change File
            </button>
          </div>

          {/* Success State */}
          {result ? (
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-5">
              <div className="flex items-center gap-3 text-blue-900 dark:text-blue-200 font-bold text-base">
                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Word Document Ready!</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                Your PDF has been converted into an authentic Microsoft Word (.docx) document. Headings, reading flow, and paragraphs have been structured for editing in Word or Google Docs.
              </p>

              {/* Conversion Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-100 dark:border-blue-900 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Pages Processed:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{result.pageCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Words Extracted:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{result.wordCount.toLocaleString()}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 dark:text-slate-400 block">DOCX File Size:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{formatBytes(result.docxBlob.size)}</span>
                </div>
              </div>

              {/* Layout Notice Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Layout Notice:</strong> In-browser conversion preserves reading order, paragraphs, and headings. Complex multi-column graphic layouts or proprietary embedded vector art may be reflowed into standard linear Word flow.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Word (.docx)
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Convert Another
                </button>
              </div>
            </div>
          ) : (
            /* Settings & Conversion Trigger */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ocrFallback}
                    onChange={(e) => setOcrFallback(e.target.checked)}
                    disabled={isProcessing}
                    className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Auto-detect and OCR scanned pages
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      If pages have no selectable digital text, automatically runs client-side OCR so scanned document content is not lost.
                    </p>
                  </div>
                </label>
              </div>

              {/* Processing Progress Bar */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-300">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      {progressStatus || 'Converting document...'}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-950 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Conversion Error</p>
                    <p className="text-xs mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Convert Button */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting to Word Document in Browser...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    Convert PDF to Word (.docx)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Privacy Transparency Notice */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side Conversion Engine</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Your confidential documents are parsed locally within your browser using WebAssembly and pure client-side DOCX serialization. No data is sent across the internet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
