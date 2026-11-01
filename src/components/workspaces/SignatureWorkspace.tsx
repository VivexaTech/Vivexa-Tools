'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { 
  PenTool, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  Maximize2,
  Trash2
} from 'lucide-react';

interface SignatureWorkspaceProps {
  presetSlug?: string;
}

export const SignatureWorkspace: React.FC<SignatureWorkspaceProps> = ({
  presetSlug = 'resize-signature-6x2cm-300dpi'
}) => {
  const [mode, setMode] = useState<'upload' | 'draw'>(
    presetSlug === 'generate-signature' ? 'draw' : 'upload'
  );
  const [file, setFile] = useState<File | null>(null);
  const [penColor, setPenColor] = useState<string>('#0F172A');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Settings
  const [signaturePreset, setSignaturePreset] = useState<'6x2' | '50x20' | '35x45'>(
    presetSlug.includes('50x20') ? '50x20' : presetSlug.includes('35x45') ? '35x45' : '6x2'
  );
  const [whitenBg, setWhitenBg] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg'>('png');

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = {
    '6x2': { label: '6 cm × 2 cm @ 300 DPI (709 × 236 px)', wPx: 709, hPx: 236 },
    '50x20': { label: '50 mm × 20 mm (591 × 236 px)', wPx: 591, hPx: 236 },
    '35x45': { label: '35 mm × 45 mm (413 × 531 px)', wPx: 413, hPx: 531 }
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
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
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setResultBlob(null);
  };

  const processSignature = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const cfg = presets[signaturePreset];
      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = cfg.wPx;
      targetCanvas.height = cfg.hPx;
      const tCtx = targetCanvas.getContext('2d');
      if (!tCtx) throw new Error('Canvas not supported');

      // Background
      if (!whitenBg && exportFormat === 'png') {
        // Transparent
      } else {
        tCtx.fillStyle = '#FFFFFF';
        tCtx.fillRect(0, 0, cfg.wPx, cfg.hPx);
      }

      if (mode === 'draw') {
        const source = canvasRef.current;
        if (!source) throw new Error('Please draw your signature first.');
        tCtx.drawImage(source, 0, 0, cfg.wPx, cfg.hPx);
      } else if (file) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        // Fit proportionally inside target dimensions
        const scale = Math.min((cfg.wPx * 0.9) / img.width, (cfg.hPx * 0.9) / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const x = (cfg.wPx - drawW) / 2;
        const y = (cfg.hPx - drawH) / 2;

        tCtx.drawImage(img, x, y, drawW, drawH);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('Please upload or draw a signature.');
      }

      const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
      const blob: Blob = await new Promise((resolve) =>
        targetCanvas.toBlob((b) => resolve(b!), mimeType, 0.95)
      );

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const newUrl = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(newUrl);
      setResultDims({ width: cfg.wPx, height: cfg.hPx });
    } catch (err: any) {
      setErrorMessage(err.message || 'Signature processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `signature_${signaturePreset}.${exportFormat}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 pb-4 mb-6 gap-2">
        <button
          type="button"
          onClick={() => { setMode('upload'); setResultBlob(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'upload'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Upload Scanned Signature
        </button>
        <button
          type="button"
          onClick={() => { setMode('draw'); setResultBlob(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'draw'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Draw Digital Signature
        </button>
      </div>

      <div className="space-y-6">
        {mode === 'upload' ? (
          !file ? (
            <Dropzone
              onFilesSelected={(files) => { setFile(files[0]); setResultBlob(null); }}
              accept="image/jpeg,image/png,image/webp"
              multiple={false}
              maxSizeMb={20}
              label="Upload signature photo or scan"
              sublabel="Resize to exact portal requirements (6x2cm at 300 DPI, 50x20mm, 35x45mm)."
            />
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setFile(null); setResultBlob(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                Change
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Ink Color:</span>
                {['#0F172A', '#1E40AF', '#B91C1C'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setPenColor(col)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      penColor === col ? 'ring-2 ring-indigo-500 ring-offset-1' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Canvas</span>
              </button>
            </div>

            <div className="border border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={230}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 touch-none cursor-crosshair bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Draw smoothly using mouse or touchscreen inside the box.
            </p>
          </div>
        )}

        {/* Dimension & Export Settings */}
        <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Official Dimension Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => {
                const item = presets[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSignaturePreset(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      signaturePreset === key
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">
                      {key === '6x2' ? '6 cm × 2 cm' : key === '50x20' ? '50 mm × 20 mm' : '35 mm × 45 mm'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="whiten"
                checked={whitenBg}
                onChange={(e) => setWhitenBg(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
              <label htmlFor="whiten" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Solid White Background (Required for exam portals)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Format:</span>
              <button
                type="button"
                onClick={() => setExportFormat('png')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  exportFormat === 'png' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('jpg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  exportFormat === 'jpg' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                JPG
              </button>
            </div>
          </div>
        </div>

        {/* Action */}
        {!resultBlob ? (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={processSignature}
              disabled={isProcessing || (mode === 'upload' && !file)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Formatting Signature...</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Resize &amp; Format Signature</span>
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
                    Signature Ready for Submission!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Dimensions: {resultDims?.width} × {resultDims?.height} px ({formatBytes(resultBlob.size)})
                  </p>
                </div>
              </div>
            </div>

            {resultUrl && (
              <div className="p-4 rounded-xl bg-white border border-emerald-100 flex flex-col items-center justify-center">
                <img
                  src={resultUrl}
                  alt="Processed signature"
                  className="max-h-24 object-contain border border-slate-200 rounded p-1"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResultBlob(null)}
                className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Edit Settings
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Compliant Signature</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
