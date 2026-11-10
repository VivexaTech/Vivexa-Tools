'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { addPageNumbersToPdf, getPdfPageCount } from '@/lib/pdf/pdfProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { getPdfJs } from '@/lib/pdf/pdfOcrHelper';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  Hash, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle,
  Eye,
  Sliders,
  FileText
} from 'lucide-react';

export const AddPageNumbersWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings
  const [position, setPosition] = useState<
    'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  >('bottom-center');
  const [fontSize, setFontSize] = useState<number>(11);
  const [startPage, setStartPage] = useState<number>(1); // e.g. skip cover page = 2
  const [startNumberVal, setStartNumberVal] = useState<number>(1); // e.g. numbering starts at 1
  const [formatStyle, setFormatStyle] = useState<'number' | 'page-x' | 'page-x-of-y' | 'x-slash-y' | 'dash-x-dash'>('page-x-of-y');
  const [textColor, setTextColor] = useState<string>('#334155');
  const [marginOffset, setMarginOffset] = useState<number>(25);

  // Result
  const [outputBytes, setOutputBytes] = useState<Uint8Array | null>(null);
  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPageRendering, setIsPageRendering] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    async function renderPage() {
      if (!file || !pageCanvasRef.current) return;
      setIsPageRendering(true);
      try {
        const pdfjs = await getPdfJs();
        const ab = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(ab),
          useWorkerFetch: false,
          useSystemFonts: true,
        } as any);
        const doc = await loadingTask.promise;
        const page = await doc.getPage(Math.min(startPage || 1, doc.numPages));
        const canvas = pageCanvasRef.current;
        if (!canvas || isCancelled) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const viewport = page.getViewport({ scale: 0.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await (page.render as any)({ canvasContext: ctx, viewport, canvas }).promise;
      } catch (err) {
        console.error('Page render error:', err);
      } finally {
        if (!isCancelled) setIsPageRendering(false);
      }
    }
    renderPage();
    return () => {
      isCancelled = true;
    };
  }, [file, startPage]);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setOutputBytes(null);

    try {
      const count = await getPdfPageCount(selected);
      setPageCount(count);
    } catch (err) {
      setErrorMessage('Could not load PDF document. Please verify the file is not corrupted.');
    }
  };

  const formatSampleText = (pageIdx: number): string => {
    const num = startNumberVal + (pageIdx - 1);
    switch (formatStyle) {
      case 'number':
        return `${num}`;
      case 'page-x':
        return `Page ${num}`;
      case 'page-x-of-y':
        return `Page ${num} of ${pageCount}`;
      case 'x-slash-y':
        return `${num} / ${pageCount}`;
      case 'dash-x-dash':
        return `- ${num} -`;
      default:
        return `${num}`;
    }
  };

  const handleApply = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Map color string to RGB
      const r = parseInt(textColor.slice(1, 3), 16) / 255 || 0.2;
      const g = parseInt(textColor.slice(3, 5), 16) / 255 || 0.2;
      const b = parseInt(textColor.slice(5, 7), 16) / 255 || 0.2;

      const bytes = await addPageNumbersToPdf(file, {
        position,
        fontSize,
        startPage,
        startNumberVal,
        formatStyle,
        marginOffset,
        color: { r, g, b }
      });

      setOutputBytes(bytes);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add page numbers to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBytes || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'document';
    downloadBlob(outputBytes, `${name}_numbered.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPageCount(1);
    setOutputBytes(null);
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
          maxSizeMb={60}
          label="Select or drop PDF to add custom page numbers"
          sublabel="Live visual preview, adjustable font size, margins, positions, and styling."
        />
      ) : (
        <div className="space-y-6">
          {/* File Selected Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {pageCount} {pageCount === 1 ? 'page' : 'pages'} • {formatBytes(file.size)}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Settings Panel */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-5">
              {/* Position Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Page Number Position (6 Quadrants)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top-left', label: 'Top Left' },
                    { id: 'top-center', label: 'Top Center' },
                    { id: 'top-right', label: 'Top Right' },
                    { id: 'bottom-left', label: 'Bottom Left' },
                    { id: 'bottom-center', label: 'Bottom Center' },
                    { id: 'bottom-right', label: 'Bottom Right' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPosition(p.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        position === p.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numbering Format */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number Format Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'page-x-of-y', label: `Page 1 of ${pageCount}` },
                    { id: 'x-slash-y', label: `1 / ${pageCount}` },
                    { id: 'page-x', label: 'Page 1' },
                    { id: 'number', label: '1 (Plain number)' },
                    { id: 'dash-x-dash', label: '- 1 - (Dashed)' }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormatStyle(fmt.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        formatStyle === fmt.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size & Margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Font Size: {fontSize} pt
                    </label>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Small (8pt)</span>
                    <span>Standard (11pt)</span>
                    <span>Large (24pt)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Margin Offset: {marginOffset} pt
                    </label>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={marginOffset}
                    onChange={(e) => setMarginOffset(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Tight</span>
                    <span>Standard</span>
                    <span>Wide</span>
                  </div>
                </div>
              </div>

              {/* Start Page & Starting Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start on Page
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={pageCount}
                    value={startPage}
                    onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Set to 2 to skip cover page.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { hex: '#334155', name: 'Slate' },
                      { hex: '#0F172A', name: 'Black' },
                      { hex: '#1D4ED8', name: 'Blue' },
                      { hex: '#B91C1C', name: 'Red' }
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setTextColor(c.hex)}
                        className={`w-7 h-7 rounded-full border-2 ${
                          textColor === c.hex ? 'ring-2 ring-indigo-500 ring-offset-1' : 'border-slate-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Sheet Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-100 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Page Placement Preview</span>
              </span>

              {/* Real PDF Page Placement Canvas */}
              <div className="relative shadow-md rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-white max-w-[280px]">
                <canvas ref={pageCanvasRef} className="block w-full h-auto" />
                {isPageRendering && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  </div>
                )}
                {/* Live Positioned Page Number Text */}
                <div
                  className={`absolute font-mono font-bold transition-all duration-200 ${
                    position === 'top-left'
                      ? 'top-4 left-4 text-left'
                      : position === 'top-center'
                      ? 'top-4 left-1/2 -translate-x-1/2 text-center'
                      : position === 'top-right'
                      ? 'top-4 right-4 text-right'
                      : position === 'bottom-left'
                      ? 'bottom-4 left-4 text-left'
                      : position === 'bottom-right'
                      ? 'bottom-4 right-4 text-right'
                      : 'bottom-4 left-1/2 -translate-x-1/2 text-center'
                  }`}
                  style={{
                    color: textColor,
                    fontSize: `${Math.max(9, Math.min(16, fontSize))}px`
                  }}
                >
                  {formatSampleText(1)}
                </div>
              </div>

              <span className="text-[11px] text-slate-400 mt-3 text-center">
                Updates in real-time as you change position, font size, or color.
              </span>
            </div>
          </div>

          {/* Action Trigger / Result */}
          {!outputBytes ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleApply}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Numbering PDF Pages...</span>
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4" />
                    <span>Apply Page Numbers to PDF</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-900">
                      Page Numbers Applied!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Formatted {pageCount} pages ({formatBytes(outputBytes.byteLength)})
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOutputBytes(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Adjust Settings
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Numbered PDF</span>
                </button>
              </div>

              {/* Numbered Result Real Preview */}
              <div className="pt-3">
                <RealPdfViewer source={outputBytes} title={`Numbered: ${file?.name || 'document.pdf'}`} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
