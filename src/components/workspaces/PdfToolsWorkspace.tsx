'use client';

import React, { useState, useRef } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { 
  rotatePdf, 
  removePdfPages, 
  extractPdfPages, 
  addWatermarkToPdf, 
  addPageNumbersToPdf, 
  imagesToPdf, 
  compressPdf, 
  signPdf,
  getPdfPageCount 
} from '@/lib/pdf/pdfProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  FileText, 
  CheckCircle, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle,
  RotateCw,
  Stamp,
  Hash,
  Lock,
  PenTool,
  Image as ImageIcon
} from 'lucide-react';

interface PdfToolsWorkspaceProps {
  toolSlug: string;
}

export const PdfToolsWorkspace: React.FC<PdfToolsWorkspaceProps> = ({ toolSlug }) => {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [outputBytes, setOutputBytes] = useState<Uint8Array | null>(null);
  const [outputStats, setOutputStats] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'source' | 'output'>('source');

  // Settings
  const [rotationDegrees, setRotationDegrees] = useState<number>(90);
  const [rotationScope, setRotationScope] = useState<'all' | 'odd' | 'even'>('all');
  const [pagesInput, setPagesInput] = useState<string>('');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.25);
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pageSizeChoice, setPageSizeChoice] = useState<'A4' | 'fit'>('A4');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handlePdfLoaded = async (files: File[]) => {
    if (files.length === 0) return;
    setErrorMessage(null);
    setOutputBytes(null);

    if (toolSlug === 'jpg-to-pdf') {
      setImages(files);
      return;
    }

    const selected = files[0];
    try {
      const count = await getPdfPageCount(selected);
      setFile(selected);
      setPageCount(count);
      setPagesInput('1');
    } catch (err) {
      setErrorMessage('Could not load PDF document. Please verify the file is not corrupted.');
    }
  };

  const handleProcess = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      if (toolSlug === 'jpg-to-pdf') {
        if (images.length === 0) throw new Error('Please upload at least one image.');
        const bytes = await imagesToPdf(images, { pageSize: pageSizeChoice, margin: 20 });
        setOutputBytes(bytes);
        setOutputStats(`Created PDF with ${images.length} images (${formatBytes(bytes.byteLength)})`);
      } else if (file) {
        if (toolSlug === 'rotate-pdf') {
          const bytes = await rotatePdf(file, rotationDegrees, rotationScope);
          setOutputBytes(bytes);
          setOutputStats(`Rotated ${rotationScope} pages by ${rotationDegrees}°`);
        } else if (toolSlug === 'compress-pdf' || toolSlug === 'optimize-pdf') {
          const res = await compressPdf(file);
          setOutputBytes(res.bytes);
          const saved = Math.max(0, res.originalSize - res.newSize);
          const percent = Math.round((saved / res.originalSize) * 100);
          setOutputStats(`Original: ${formatBytes(res.originalSize)} → New: ${formatBytes(res.newSize)} (${percent}% saved)`);
        } else if (toolSlug === 'add-watermark') {
          const bytes = await addWatermarkToPdf(file, watermarkText, { opacity: watermarkOpacity });
          setOutputBytes(bytes);
          setOutputStats(`Watermark "${watermarkText}" applied across all pages`);
        } else if (toolSlug === 'add-page-numbers') {
          const bytes = await addPageNumbersToPdf(file, { position: pageNumberPosition });
          setOutputBytes(bytes);
          setOutputStats(`Page numbers added at ${pageNumberPosition}`);
        } else if (toolSlug === 'remove-pdf-pages') {
          const pagesToRemove = pagesInput.split(',').map((p) => parseInt(p.trim(), 10)).filter((n) => !isNaN(n));
          const bytes = await removePdfPages(file, pagesToRemove);
          setOutputBytes(bytes);
          setOutputStats(`Removed ${pagesToRemove.length} pages`);
        } else if (toolSlug === 'extract-pdf-pages') {
          const pagesToExtract = pagesInput.split(',').map((p) => parseInt(p.trim(), 10)).filter((n) => !isNaN(n));
          const bytes = await extractPdfPages(file, pagesToExtract);
          setOutputBytes(bytes);
          setOutputStats(`Extracted ${pagesToExtract.length} pages into new PDF`);
        } else if (toolSlug === 'sign-pdf') {
          if (!signatureDataUrl) throw new Error('Please draw or save your signature first.');
          const bytes = await signPdf(file, signatureDataUrl, 1);
          setOutputBytes(bytes);
          setOutputStats(`Signature embedded on page 1`);
        }
      }
      setPreviewMode('output');
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed. Please verify settings.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBytes) return;
    const name = file ? `processed_${file.name}` : 'converted_document.pdf';
    downloadBlob(outputBytes, name);
  };

  const resetAll = () => {
    setFile(null);
    setImages([]);
    setOutputBytes(null);
    setOutputStats(null);
    setErrorMessage(null);
  };

  // Drawing Pad Handlers for Sign PDF
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && signatureCanvasRef.current) {
      setIsDrawing(false);
      setSignatureDataUrl(signatureCanvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      const ctx = signatureCanvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, signatureCanvasRef.current.width, signatureCanvasRef.current.height);
      setSignatureDataUrl(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!file && images.length === 0 ? (
        <Dropzone
          onFilesSelected={handlePdfLoaded}
          accept={toolSlug === 'jpg-to-pdf' ? 'image/jpeg,image/png,image/webp' : '.pdf,application/pdf'}
          multiple={toolSlug === 'jpg-to-pdf'}
          maxSizeMb={80}
          label={toolSlug === 'jpg-to-pdf' ? 'Select or drop images to convert to PDF' : 'Select or drop your PDF document here'}
        />
      ) : (
        <div className="space-y-6">
          {/* File Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                {toolSlug === 'jpg-to-pdf' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {toolSlug === 'jpg-to-pdf' ? `${images.length} images selected` : file?.name}
                </p>
                <p className="text-xs text-slate-500">
                  {toolSlug === 'jpg-to-pdf'
                    ? formatBytes(images.reduce((a, b) => a + b.size, 0))
                    : `${pageCount} pages • ${formatBytes(file?.size || 0)}`}
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

          {/* Tool Settings Configuration */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
            {toolSlug === 'rotate-pdf' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rotation Angle
                </label>
                <div className="flex flex-wrap gap-2">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotationDegrees(deg)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        rotationDegrees === deg
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {deg}° Clockwise
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider pt-2">
                  Pages to Rotate
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'odd', 'even'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRotationScope(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize ${
                        rotationScope === s
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {s} Pages
                    </button>
                  ))}
                </div>
              </div>
            )}

            {toolSlug === 'add-watermark' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"
                  placeholder="CONFIDENTIAL"
                />

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Transparency: {Math.round(watermarkOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-48"
                  />
                </div>
              </div>
            )}

            {toolSlug === 'add-page-numbers' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Number Placement
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'bottom-center', label: 'Bottom Center' },
                    { id: 'bottom-right', label: 'Bottom Right' },
                    { id: 'top-right', label: 'Top Right' }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPageNumberPosition(pos.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border ${
                        pageNumberPosition === pos.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(toolSlug === 'remove-pdf-pages' || toolSlug === 'extract-pdf-pages') && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {toolSlug === 'remove-pdf-pages' ? 'Page Numbers to Remove' : 'Page Numbers to Extract'}
                </label>
                <input
                  type="text"
                  value={pagesInput}
                  onChange={(e) => setPagesInput(e.target.value)}
                  placeholder="e.g. 2, 4, 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Total available pages in document: 1 to {pageCount}. Comma-separated (e.g. 1, 3, 5).
                </p>
              </div>
            )}

            {toolSlug === 'sign-pdf' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Draw Your Signature Below
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Clear Drawing
                  </button>
                </div>
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner">
                  <canvas
                    ref={signatureCanvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-36 touch-none cursor-crosshair bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Draw with your finger or mouse inside the box above. It will be positioned on page 1.
                </p>
              </div>
            )}

            {toolSlug === 'jpg-to-pdf' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Sizing Format
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPageSizeChoice('A4')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                      pageSizeChoice === 'A4'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Standard A4 Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageSizeChoice('fit')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                      pageSizeChoice === 'fit'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Fit to Exact Image Size
                  </button>
                </div>
              </div>
            )}

            {(toolSlug === 'compress-pdf' || toolSlug === 'optimize-pdf') && (
              <div className="text-xs text-slate-600 bg-white p-3.5 rounded-lg border border-slate-200">
                Optimization cleans unused stream dictionaries, deflates uncompressed content buffers, and rebuilds cross-reference indexes locally.
              </div>
            )}
          </div>

          {/* Action / Result */}
          {!outputBytes ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleProcess}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Locally...</span>
                  </>
                ) : (
                  <>
                    <span>Apply &amp; Process PDF</span>
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
                    Operation Completed!
                  </h4>
                  <p className="text-xs text-emerald-700">{outputStats}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOutputBytes(null)}
                  className="px-3.5 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Adjust Settings</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Result PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Real Live PDF Document Preview */}
          {(file || outputBytes) && (
            <div className="pt-2 space-y-3">
              {outputBytes && file && (
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Preview:</span>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('output')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      previewMode === 'output'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Processed Result
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('source')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      previewMode === 'source'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Original Upload
                  </button>
                </div>
              )}

              <RealPdfViewer
                source={previewMode === 'output' && outputBytes ? outputBytes : file}
                title={
                  previewMode === 'output' && outputBytes
                    ? `Processed Result: ${file?.name || 'Output.pdf'}`
                    : `Original File: ${file?.name || 'Document'}`
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
