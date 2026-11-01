'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { convertWordToPdf, WordToPdfResult } from '@/lib/pdf/wordToPdf';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { getPdfJs } from '@/lib/pdf/pdfOcrHelper';
import {
  FileType,
  FileCheck,
  Download,
  RotateCcw,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const WordToPdfWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [result, setResult] = useState<WordToPdfResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PDF Preview State
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [previewTotalPages, setPreviewTotalPages] = useState<number>(1);
  const [previewPdfDoc, setPreviewPdfDoc] = useState<any>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setResult(null);
    setErrorMessage(null);
    setPreviewPdfDoc(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Reading Word document (.docx)...');

    try {
      const res = await convertWordToPdf(file, {
        pageSize,
        onProgress: (status) => setStatusMessage(status),
      });

      setResult(res);

      // Load PDF for live preview
      const pdfjs = await getPdfJs();
      const loadingTask = pdfjs.getDocument({
        data: res.pdfBytes,
        useWorkerFetch: false,
        useSystemFonts: true,
      } as any);
      const doc = await loadingTask.promise;
      setPreviewPdfDoc(doc);
      setPreviewTotalPages(doc.numPages);
      setPreviewPage(1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to convert Word document to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render preview canvas whenever previewPage or previewPdfDoc changes
  useEffect(() => {
    let active = true;

    async function renderPage() {
      if (!previewPdfDoc || !previewCanvasRef.current) return;
      try {
        const page = await previewPdfDoc.getPage(previewPage);
        if (!active) return;

        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await (page.render as any)({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;
      } catch (e) {
        console.warn('PDF preview render error:', e);
      }
    }

    renderPage();
    return () => {
      active = false;
    };
  }, [previewPdfDoc, previewPage]);

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(result.pdfBytes, `${baseName}.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
    setPreviewPdfDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!file && (
        <Dropzone
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple={false}
          maxSizeMb={50}
          onFilesSelected={handleFilesSelected}
          label="Choose Microsoft Word (.docx) to convert to PDF"
          sublabel="Converts headings, lists, tables, and paragraphs locally. 100% private."
        />
      )}

      {/* Main Processing Panel */}
      {file && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          {/* Header File Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FileType className="w-5 h-5" />
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

          {/* Success Result with Live Preview */}
          {result ? (
            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-5">
              <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-200 font-bold text-base">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>PDF Document Ready!</span>
              </div>
              <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
                Your Word document has been synthesized into a high-quality PDF document with standard page layout, typography, and page numbers.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Total Pages:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{result.pageCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Words Formatted:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{result.wordCount.toLocaleString()}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 dark:text-slate-400 block">PDF Output Size:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{formatBytes(result.pdfBytes.length)}</span>
                </div>
              </div>

              {/* Live PDF Preview */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>PDF Document Preview</span>
                  </span>
                  {previewTotalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                        disabled={previewPage <= 1}
                        className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span>
                        Page {previewPage} of {previewTotalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewPage((p) => Math.min(previewTotalPages, p + 1))}
                        disabled={previewPage >= previewTotalPages}
                        className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center items-center overflow-auto max-h-[480px]">
                  <canvas
                    ref={previewCanvasRef}
                    className="bg-white shadow-md max-w-full h-auto rounded border border-slate-200"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF File
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    PDF Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter')}
                    disabled={isProcessing}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="Letter">US Letter (8.5 × 11 in)</option>
                  </select>
                </div>
              </div>

              {/* Status Indicator */}
              {isProcessing && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>{statusMessage || 'Converting Word to PDF...'}</span>
                </div>
              )}

              {/* Error Notification */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Conversion Error</p>
                    <p className="text-xs mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing PDF in Browser...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    Convert Word (.docx) to PDF
                  </>
                )}
              </button>
            </div>
          )}

          {/* Privacy Transparency Notice */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% In-Browser Document Synthesis</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Your Microsoft Word document is parsed directly in browser memory without sending a single byte to remote cloud servers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
