'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { getPdfPageCount, signPdf } from '@/lib/pdf/pdfProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { getPdfJs } from '@/lib/pdf/pdfOcrHelper';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  PenTool, 
  Upload, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Download, 
  Loader2, 
  AlertCircle,
  Eye,
  Sliders,
  FileText,
  ShieldCheck,
  Move
} from 'lucide-react';

export const SignPdfWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Signature Source Mode: 'draw' | 'upload'
  const [sigMode, setSigMode] = useState<'draw' | 'upload'>('draw');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Drawing pad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState<string>('#0F172A');
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Placement state
  const [posXPercent, setPosXPercent] = useState<number>(65); // 0 to 80%
  const [posYPercent, setPosYPercent] = useState<number>(80); // 0 to 85%
  const [sigWidth, setSigWidth] = useState<number>(140); // PDF points
  const [sigHeight, setSigHeight] = useState<number>(60);
  const [sigOpacity, setSigOpacity] = useState<number>(1.0);

  // Result
  const [signedBytes, setSignedBytes] = useState<Uint8Array | null>(null);
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
        const page = await doc.getPage(targetPage);
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
  }, [file, targetPage]);

  const handlePdfSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setSignedBytes(null);

    try {
      const count = await getPdfPageCount(selected);
      setPageCount(count);
      setTargetPage(count); // Default to last page where signature blocks usually reside
    } catch (err) {
      setErrorMessage('Could not load PDF document. Please verify the file is not corrupted.');
    }
  };

  // Upload Signature Handler
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setSignatureDataUrl(url);

      // Measure natural aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        setSigWidth(140);
        setSigHeight(Math.round(140 / aspect));
      };
      img.src = url;
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Drawing Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setSignatureDataUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
    setHasDrawn(false);
  };

  const handleApplySignature = async () => {
    if (!file) return;
    if (!signatureDataUrl) {
      setErrorMessage('Please draw or upload your signature before applying.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Convert percentage coordinates (0-100) into PDF points
      // In PDF, Y=0 is at bottom, Y=height is at top
      const xPercent = posXPercent / 100;
      const yPercent = (100 - posYPercent - 15) / 100;

      const bytes = await signPdf(file, signatureDataUrl, targetPage, {
        xPercent: Math.max(0, Math.min(0.85, xPercent)),
        yPercent: Math.max(0, Math.min(0.85, yPercent)),
        width: sigWidth,
        height: sigHeight
      });

      setSignedBytes(bytes);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to embed signature into PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!signedBytes || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'document';
    downloadBlob(signedBytes, `${name}_signed.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPageCount(1);
    setSignatureDataUrl(null);
    setSignedBytes(null);
    setErrorMessage(null);
    clearCanvas();
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
          onFilesSelected={handlePdfSelected}
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMb={60}
          label="Select or drop PDF document to sign"
          sublabel="Draw your signature or upload transparent PNG, position it on any page with live preview."
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
              Change PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Signature Creation & Positioning */}
            <div className="lg:col-span-7 space-y-5">
              {/* Mode Switcher */}
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSigMode('draw')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    sigMode === 'draw'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => setSigMode('upload')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    sigMode === 'upload'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload Transparent PNG
                </button>
              </div>

              {sigMode === 'draw' ? (
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700 uppercase">Ink:</span>
                      {[
                        { hex: '#0F172A', name: 'Black' },
                        { hex: '#1D4ED8', name: 'Blue' },
                        { hex: '#B91C1C', name: 'Red' }
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setPenColor(c.hex)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            penColor === c.hex ? 'ring-2 ring-indigo-500 ring-offset-1' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Smooth Drawing Canvas */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={180}
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
                  <p className="text-[11px] text-slate-400">
                    Sign with mouse, finger, or stylus. Exports with transparent background.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upload Signature Image
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl bg-white cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-indigo-600 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">Choose PNG or JPG signature</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Transparent PNG recommended</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                  </label>
                  {signatureDataUrl && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                      <img src={signatureDataUrl} alt="Signature preview" className="max-h-12 object-contain" />
                      <button
                        type="button"
                        onClick={() => setSignatureDataUrl(null)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Placement & Page Controls */}
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Place on Page
                    </label>
                    <select
                      value={targetPage}
                      onChange={(e) => setTargetPage(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                    >
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p}>
                          Page {p} {p === pageCount ? '(Last Page)' : p === 1 ? '(First Page)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Signature Size ({sigWidth}pt)
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="240"
                      step="5"
                      value={sigWidth}
                      onChange={(e) => {
                        const newW = parseInt(e.target.value, 10);
                        const aspect = sigWidth / (sigHeight || 1);
                        setSigWidth(newW);
                        setSigHeight(Math.round(newW / aspect));
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                    />
                  </div>
                </div>

                {/* Quick Quadrant Presets */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Position Quadrants:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Bottom Right', x: 65, y: 80 },
                      { label: 'Bottom Left', x: 10, y: 80 },
                      { label: 'Bottom Center', x: 38, y: 80 },
                      { label: 'Top Right', x: 65, y: 15 },
                    ].map((pos) => (
                      <button
                        key={pos.label}
                        type="button"
                        onClick={() => {
                          setPosXPercent(pos.x);
                          setPosYPercent(pos.y);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          posXPercent === pos.x && posYPercent === pos.y
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live PDF Page Placement Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-100 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Page {targetPage} Placement Preview</span>
              </span>

              {/* Real PDF Page Placement Canvas */}
              <div className="relative shadow-md rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-white max-w-[280px]">
                <canvas ref={pageCanvasRef} className="block w-full h-auto" />
                {isPageRendering && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  </div>
                )}
                {/* Live Positioned Signature Preview */}
                {signatureDataUrl && (
                  <div
                    className="absolute pointer-events-none transition-all duration-150"
                    style={{
                      left: `${posXPercent}%`,
                      top: `${posYPercent}%`,
                      width: `${Math.round(sigWidth * 0.45)}px`
                    }}
                  >
                    <img
                      src={signatureDataUrl}
                      alt="Signature"
                      className="w-full h-auto object-contain filter drop-shadow-xs"
                    />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-3 text-center">
                Visual signature image embedded with native PDF coordinates.
              </p>
            </div>
          </div>

          {/* Legal Transparency Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Signatures:</strong> This tool places an authentic visual signature image onto your document. It is not an asymmetric cryptographic certificate signature (such as Adobe AATL or PKI digital certificates).
            </span>
          </div>

          {/* Action Trigger / Result */}
          {!signedBytes ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleApplySignature}
                disabled={isProcessing || !signatureDataUrl}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing PDF Document...</span>
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" />
                    <span>Embed Signature on Page {targetPage}</span>
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
                      PDF Document Signed Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Signature embedded on Page {targetPage} ({formatBytes(signedBytes.byteLength)})
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSignedBytes(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Adjust Position
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed PDF</span>
                </button>
              </div>

              {/* Signed Document Live Preview */}
              <div className="pt-3">
                <RealPdfViewer source={signedBytes} title={`Signed: ${file?.name || 'document.pdf'}`} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
