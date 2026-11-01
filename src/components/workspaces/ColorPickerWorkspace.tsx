'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { rgbToHex, rgbToHsl } from '@/lib/image/imageProcessing';
import { 
  Pipette, 
  Copy, 
  Check, 
  Layers, 
  ZoomIn, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ColorPickerWorkspaceProps {
  mode?: 'image' | 'pdf';
}

interface ColorSample {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

export const ColorPickerWorkspace: React.FC<ColorPickerWorkspaceProps> = ({ mode = 'image' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<ColorSample>({
    hex: '#4F46E5',
    rgb: 'rgb(79, 70, 229)',
    rgba: 'rgba(79, 70, 229, 1.0)',
    hsl: 'hsl(244, 75%, 60%)',
    r: 79,
    g: 70,
    b: 229,
    a: 255
  });
  const [paletteHistory, setPaletteHistory] = useState<ColorSample[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Loupe & Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showLoupe, setShowLoupe] = useState(false);
  const loupeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = url;
  };

  const sampleColorAt = (canvasX: number, canvasY: number): ColorSample | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const pixel = ctx.getImageData(Math.floor(canvasX), Math.floor(canvasY), 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = pixel[3];
    const hex = rgbToHex(r, g, b);
    const rgbStr = `rgb(${r}, ${g}, ${b})`;
    const rgbaStr = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
    const hslStr = rgbToHsl(r, g, b);

    return { hex, rgb: rgbStr, rgba: rgbaStr, hsl: hslStr, r, g, b, a };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowLoupe(true);

    // Update 8x magnifying loupe
    const loupe = loupeCanvasRef.current;
    if (loupe && canvas) {
      const lCtx = loupe.getContext('2d');
      if (lCtx) {
        lCtx.imageSmoothingEnabled = false;
        lCtx.clearRect(0, 0, loupe.width, loupe.height);

        // Sample 15x15 pixel region around cursor
        const sampleSize = 15;
        const sx = Math.max(0, Math.min(canvas.width - sampleSize, x - sampleSize / 2));
        const sy = Math.max(0, Math.min(canvas.height - sampleSize, y - sampleSize / 2));

        lCtx.drawImage(canvas, sx, sy, sampleSize, sampleSize, 0, 0, loupe.width, loupe.height);

        // Draw crosshair center
        lCtx.strokeStyle = '#FFFFFF';
        lCtx.lineWidth = 1.5;
        lCtx.strokeRect(loupe.width / 2 - 4, loupe.height / 2 - 4, 8, 8);
        lCtx.strokeStyle = '#000000';
        lCtx.lineWidth = 1;
        lCtx.strokeRect(loupe.width / 2 - 4, loupe.height / 2 - 4, 8, 8);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const color = sampleColorAt(x, y);
    if (color) {
      setActiveColor(color);
      setPaletteHistory((prev) => {
        if (prev.some((c) => c.hex === color.hex)) return prev;
        return [color, ...prev.slice(0, 9)];
      });
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept={mode === 'pdf' ? '.pdf,application/pdf' : 'image/jpeg,image/png,image/webp,image/bmp,image/svg+xml'}
          multiple={false}
          maxSizeMb={30}
          label={mode === 'pdf' ? 'Upload PDF to inspect colors' : 'Upload an image to inspect colors'}
          sublabel="8x zoom loupe, precision crosshair, instant HEX, RGB, RGBA, and HSL copy."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Pipette className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">Click anywhere on the image to inspect pixels</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Change File
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Image Canvas Area */}
            <div className="lg:col-span-2 relative flex flex-col items-center justify-center bg-slate-100 rounded-2xl border border-slate-200 p-3 overflow-hidden min-h-[350px]">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowLoupe(true)}
                onMouseLeave={() => setShowLoupe(false)}
                onClick={handleCanvasClick}
                className="max-h-[500px] max-w-full object-contain cursor-crosshair rounded-lg shadow-sm"
              />

              {/* Floating Magnifying Loupe */}
              {showLoupe && (
                <div className="absolute top-4 right-4 pointer-events-none bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center animate-in fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    8× Magnifier
                  </span>
                  <canvas
                    ref={loupeCanvasRef}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Color Values & Copy Panel */}
            <div className="space-y-4">
              {/* Active Color Preview Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-2xl shadow-sm border border-slate-200 shrink-0 transition-colors"
                    style={{ backgroundColor: activeColor.hex }}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Color</span>
                    <h3 className="text-xl font-extrabold text-slate-900 font-mono">
                      {activeColor.hex}
                    </h3>
                  </div>
                </div>

                {/* Values copy rows */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  {[
                    { label: 'HEX', value: activeColor.hex, key: 'hex' },
                    { label: 'RGB', value: activeColor.rgb, key: 'rgb' },
                    { label: 'RGBA', value: activeColor.rgba, key: 'rgba' },
                    { label: 'HSL', value: activeColor.hsl, key: 'hsl' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 text-xs"
                    >
                      <span className="font-semibold text-slate-500 w-12">{item.label}</span>
                      <span className="font-mono text-slate-800 font-medium truncate flex-1 text-right pr-2">
                        {item.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.value, item.key)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          copiedKey === item.key
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'hover:bg-slate-100 text-slate-600 border-transparent'
                        }`}
                        aria-label={`Copy ${item.label}`}
                      >
                        {copiedKey === item.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette History */}
              {paletteHistory.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Session Swatch History ({paletteHistory.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {paletteHistory.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveColor(c)}
                        title={`${c.hex} - Click to select`}
                        className="w-8 h-8 rounded-lg border border-slate-200 shadow-xs hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
