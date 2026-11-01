'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { processPdfForOcr, processImageForOcr, OcrResult, OcrPageItem } from '@/lib/pdf/pdfOcrHelper';
import {
  ScanText,
  Copy,
  Check,
  Download,
  RotateCcw,
  RotateCw,
  Loader2,
  AlertCircle,
  FileText,
  Zap,
  Sliders,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface OcrWorkspaceProps {
  toolSlug?: string;
}

export const OcrWorkspace: React.FC<OcrWorkspaceProps> = ({ toolSlug = 'image-to-text' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('eng');
  const [enhanceContrast, setEnhanceContrast] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [extractedResult, setExtractedResult] = useState<OcrResult | null>(null);
  const [singleImageText, setSingleImageText] = useState<string | null>(null);
  const [activePageTab, setActivePageTab] = useState<number | 'all'>('all');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPdf = file?.name.toLowerCase().endsWith('.pdf') || file?.type === 'application/pdf' || toolSlug.includes('pdf');

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setExtractedResult(null);
    setSingleImageText(null);
    setRotationAngle(0);
    setActivePageTab('all');

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const runOcr = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProgressPercent(5);

      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        setProgressStatus('Reading PDF structure...');
        const res: OcrResult = await processPdfForOcr(
          file,
          language,
          (info) => {
            setProgressStatus(info.pageStatus);
            setProgressPercent(info.percent);
          },
          { enhanceContrast }
        );

        setExtractedResult(res);
        setProgressPercent(100);
      } else {
        // Image OCR with Tesseract & Preprocessing
        setProgressStatus(`Loading ${language.toUpperCase()} OCR neural model...`);
        const text = await processImageForOcr(
          file,
          language,
          (status, pct) => {
            setProgressStatus(status);
            setProgressPercent(pct);
          },
          { enhanceContrast }
        );

        setSingleImageText(text);
        setProgressPercent(100);
      }
    } catch (err: any) {
      let friendlyMsg = err.message || 'Text extraction failed.';
      if (err.code === 'PDF_PASSWORD_PROTECTED') {
        friendlyMsg = 'This PDF is password-protected. Please unlock the file before running text extraction.';
      } else if (err.code === 'PDF_LOAD_FAILED') {
        friendlyMsg = 'Could not load PDF document. Please verify the file is not corrupted.';
      } else if (err.code === 'NO_TEXT_DETECTED') {
        friendlyMsg = 'No readable text was detected. Ensure the scan or photo is oriented right-side up, clear, and has sufficient contrast.';
      }
      setErrorMessage(friendlyMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const getFullText = (): string => {
    if (singleImageText) return singleImageText;
    if (extractedResult) {
      if (activePageTab === 'all') return extractedResult.text;
      const targetPage = extractedResult.pages.find((p) => p.pageNumber === activePageTab);
      return targetPage ? targetPage.text : '';
    }
    return '';
  };

  const copyText = () => {
    const textToCopy = getFullText();
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadTextFile = () => {
    const textToSave = getFullText();
    if (!textToSave || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || 'extracted_text';
    const suffix = activePageTab === 'all' ? '_full_text' : `_page_${activePageTab}`;
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${base}${suffix}.txt`);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setExtractedResult(null);
    setSingleImageText(null);
    setIsProcessing(false);
    setProgressPercent(0);
    setErrorMessage(null);
    setRotationAngle(0);
  };

  const fullText = getFullText();
  const wordCount = fullText ? fullText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = fullText ? fullText.length : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="space-y-1">
            <span className="font-bold">Extraction Issue:</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept={isPdf ? '.pdf,application/pdf' : 'image/*,.pdf'}
          multiple={false}
          maxSizeMb={60}
          label={isPdf ? 'Upload PDF document to extract text' : 'Upload photo, scan, screenshot, or PDF'}
          sublabel="100% in-browser OCR & vector text extraction. Supports English & Hindi."
        />
      ) : (
        <div className="space-y-6">
          {/* File Selected Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                {isPdf ? <FileText className="w-5 h-5" /> : <ScanText className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatBytes(file.size)} • {isPdf ? 'PDF Document' : 'Raster Image'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              disabled={isProcessing}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
            >
              Change File
            </button>
          </div>

          {/* OCR Configuration Controls */}
          <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Language Model
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="eng">English (eng)</option>
                  <option value="hin">Hindi (hin)</option>
                  <option value="eng+hin">English + Hindi (Mixed / Bilingual)</option>
                  <option value="spa">Spanish (spa)</option>
                  <option value="fra">French (fra)</option>
                  <option value="deu">German (deu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Preprocessing Pipeline
                </label>
                <label className="flex items-center gap-2.5 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enhanceContrast}
                    onChange={(e) => setEnhanceContrast(e.target.checked)}
                    disabled={isProcessing}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Auto contrast enhancement & background cleanup
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action / Progress Area */}
          {!extractedResult && !singleImageText ? (
            <div className="space-y-4">
              {isProcessing && (
                <div className="p-5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span>{progressStatus || 'Extracting text...'}</span>
                    </span>
                    <span className="font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-indigo-200/60 dark:bg-indigo-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={runOcr}
                  disabled={isProcessing}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <ScanText className="w-4 h-4" />
                  <span>{isPdf ? 'Extract Text from PDF' : 'Start OCR Extraction'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Results Presentation */
            <div className="space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      Extracted Text ({wordCount.toLocaleString()} words • {charCount.toLocaleString()} characters)
                    </span>
                  </div>
                  {extractedResult && (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3" />
                      <span>
                        {extractedResult.method === 'direct_text'
                          ? 'Instant Selectable Vector Text Stream'
                          : extractedResult.method === 'hybrid'
                          ? 'Hybrid Direct & Neural OCR Engine'
                          : 'High-Resolution Neural OCR Engine'}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyText}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadTextFile}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save as .TXT</span>
                  </button>
                </div>
              </div>

              {/* Multi-Page Tabs for PDF */}
              {extractedResult && extractedResult.pages.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActivePageTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      activePageTab === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    All Pages ({extractedResult.pages.length})
                  </button>
                  {extractedResult.pages.map((p) => (
                    <button
                      key={p.pageNumber}
                      type="button"
                      onClick={() => setActivePageTab(p.pageNumber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        activePageTab === p.pageNumber
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      Page {p.pageNumber} {p.method === 'ocr' ? '(OCR)' : '(Digital)'}
                    </button>
                  ))}
                </div>
              )}

              {/* Selectable & Copyable Text Display */}
              <textarea
                readOnly
                value={fullText}
                rows={14}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:bg-white dark:focus:bg-slate-900 leading-relaxed resize-y selection:bg-indigo-500 selection:text-white"
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Select, copy, or edit the extracted text above freely.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setExtractedResult(null);
                    setSingleImageText(null);
                    setProgressPercent(0);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Scan Another Document
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
