'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { splitPdf, getPdfPageCount } from '@/lib/pdf/pdfProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  FileText, 
  Scissors, 
  CheckCircle, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const PdfSplitWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRanges, setPageRanges] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedPdf, setExtractedPdf] = useState<{ name: string; bytes: Uint8Array } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);
    setExtractedPdf(null);

    try {
      const count = await getPdfPageCount(selected);
      setFile(selected);
      setPageCount(count);
      setPageRanges(count > 1 ? `1-${Math.min(3, count)}` : '1');
    } catch (err) {
      setErrorMessage('Could not load PDF document. File may be encrypted or corrupted.');
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const results = await splitPdf(file, pageRanges);
      if (results.length > 0) {
        setExtractedPdf(results[0]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!extractedPdf) return;
    downloadBlob(extractedPdf.bytes, extractedPdf.name);
  };

  const resetAll = () => {
    setFile(null);
    setPageCount(0);
    setExtractedPdf(null);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMb={80}
          label="Select or drop a PDF file to split"
          sublabel="Extract custom page ranges or separate individual pages."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {pageCount} total pages • {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Change File
            </button>
          </div>

          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Page Range to Extract
              </label>
              <input
                type="text"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder={`e.g. 1-${Math.min(3, pageCount)}, 5`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Total available pages: 1 to {pageCount}. Use hyphens for ranges (e.g. 1-4) and commas for individual pages (e.g. 1, 3, 5).
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPageRanges('1')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 font-medium"
              >
                Page 1 Only
              </button>
              {pageCount >= 2 && (
                <button
                  type="button"
                  onClick={() => setPageRanges(`1-${Math.ceil(pageCount / 2)}`)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 font-medium"
                >
                  First Half (1-{Math.ceil(pageCount / 2)})
                </button>
              )}
              {pageCount >= 2 && (
                <button
                  type="button"
                  onClick={() => setPageRanges(`${Math.ceil(pageCount / 2) + 1}-${pageCount}`)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 font-medium"
                >
                  Second Half ({Math.ceil(pageCount / 2) + 1}-{pageCount})
                </button>
              )}
              <button
                type="button"
                onClick={() => setPageRanges(`1-${pageCount}`)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 font-medium"
              >
                All Pages (1-{pageCount})
              </button>
            </div>
          </div>

          {!extractedPdf ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSplit}
                disabled={isProcessing || !pageRanges.trim()}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Split & Extract PDF</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Pages Extracted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    File: {extractedPdf.name} ({formatBytes(extractedPdf.bytes.byteLength)})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExtractedPdf(null)}
                  className="px-3.5 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Split Another Range</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extracted PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Real Live PDF Document Preview */}
          {(file || extractedPdf) && (
            <div className="pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                {extractedPdf ? 'Extracted Output Preview:' : 'Document Page Preview:'}
              </span>
              <RealPdfViewer
                source={extractedPdf ? extractedPdf.bytes : file}
                title={extractedPdf ? extractedPdf.name : file?.name}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
