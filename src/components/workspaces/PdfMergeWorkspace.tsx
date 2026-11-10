'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { mergePdfs, getPdfPageCount } from '@/lib/pdf/pdfProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  FileText, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  CheckCircle, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle,
  Plus
} from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export const PdfMergeWorkspace: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Uint8Array | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [mergedStats, setMergedStats] = useState<{ totalPages: number; size: number } | null>(null);

  const handleFilesAdded = async (newFiles: File[]) => {
    setErrorMessage(null);
    setMergedBlob(null);

    const items: PdfFileItem[] = [];
    for (const f of newFiles) {
      if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
        setErrorMessage(`File "${f.name}" is not a valid PDF.`);
        continue;
      }
      try {
        const count = await getPdfPageCount(f);
        items.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          pageCount: count
        });
      } catch (err) {
        setErrorMessage(`Could not read "${f.name}". It might be corrupted or password-protected.`);
      }
    }

    setPdfFiles((prev) => [...prev, ...items]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === pdfFiles.length - 1) return;
    setPdfFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeFile = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setErrorMessage('Please add at least two PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const files = pdfFiles.map((p) => p.file);
      const resultBytes = await mergePdfs(files);
      const totalPages = pdfFiles.reduce((acc, curr) => acc + curr.pageCount, 0);

      setMergedBlob(resultBytes);
      setMergedStats({
        totalPages,
        size: resultBytes.byteLength
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while merging your PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadBlob(mergedBlob, 'merged_document.pdf');
  };

  const resetAll = () => {
    setPdfFiles([]);
    setMergedBlob(null);
    setMergedStats(null);
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

      {pdfFiles.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFilesAdded}
          accept=".pdf,application/pdf"
          multiple={true}
          maxSizeMb={80}
          label="Select or drop PDF files here to merge"
          sublabel="Combine two or more documents into a single PDF in seconds."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Selected Documents ({pdfFiles.length})
              </h3>
              <p className="text-xs text-slate-500">
                Arrange the files in the order you want them combined.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Add More PDFs</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) handleFilesAdded(Array.from(e.target.files));
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={resetAll}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Reorderable Files List */}
          <div className="space-y-2.5">
            {pdfFiles.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {idx + 1}. {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === pdfFiles.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Action / Result Bar */}
          {!mergedBlob ? (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Total: <span className="font-semibold text-slate-800">{pdfFiles.length} files</span>,{' '}
                <span className="font-semibold text-slate-800">
                  {pdfFiles.reduce((acc, curr) => acc + curr.pageCount, 0)} pages
                </span>
              </div>
              <button
                type="button"
                onClick={handleMerge}
                disabled={isProcessing || pdfFiles.length < 2}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Combining Pages...</span>
                  </>
                ) : (
                  <>
                    <span>Merge {pdfFiles.length} PDF Files</span>
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
                    PDF Documents Merged Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Combined into {mergedStats?.totalPages} pages ({formatBytes(mergedStats?.size || 0)})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Merge Another</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Merged PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Real Live PDF Preview for Merged Result or Selected Input */}
          {(mergedBlob || pdfFiles.length > 0) && (
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {mergedBlob ? 'Merged Document Output Preview:' : 'Source Document Preview:'}
                </span>
                {!mergedBlob && pdfFiles.length > 1 && (
                  <select
                    value={selectedFileId || pdfFiles[0]?.id}
                    onChange={(e) => setSelectedFileId(e.target.value)}
                    className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    {pdfFiles.map((p, i) => (
                      <option key={p.id} value={p.id}>
                        {i + 1}. {p.file.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <RealPdfViewer
                source={
                  mergedBlob
                    ? mergedBlob
                    : pdfFiles.find((p) => p.id === (selectedFileId || pdfFiles[0]?.id))?.file || null
                }
                title={
                  mergedBlob
                    ? 'Combined Merged Output.pdf'
                    : pdfFiles.find((p) => p.id === (selectedFileId || pdfFiles[0]?.id))?.file.name
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
