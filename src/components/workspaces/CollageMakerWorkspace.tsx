'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  UploadCloud,
  Download,
  Trash2,
  Sparkles,
  ShieldCheck,
  Check,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

interface UploadedPhoto {
  id: string;
  url: string;
  imgElement?: HTMLImageElement;
}

export const CollageMakerWorkspace: React.FC = () => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9' | '9:16'>('1:1');
  const [spacing, setSpacing] = useState<number>(8);
  const [borderRadius, setBorderRadius] = useState<number>(6);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isRendering, setIsRendering] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setPhotos((prev) => [
            ...prev,
            { id: Math.random().toString(), url, imgElement: img },
          ]);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  // Re-render collage onto canvas whenever state changes
  useEffect(() => {
    renderCollage();
  }, [photos, aspectRatio, spacing, borderRadius, bgColor]);

  const renderCollage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define base canvas dimensions based on aspect ratio
    let width = 1200;
    let height = 1200;
    if (aspectRatio === '4:5') {
      width = 1200;
      height = 1500;
    } else if (aspectRatio === '16:9') {
      width = 1600;
      height = 900;
    } else if (aspectRatio === '9:16') {
      width = 900;
      height = 1600;
    }

    canvas.width = width;
    canvas.height = height;

    // Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    if (photos.length === 0) return;

    // Determine grid rows & cols
    let cols = 1;
    let rows = 1;
    const n = photos.length;

    if (n === 2) {
      cols = 2;
      rows = 1;
    } else if (n === 3) {
      cols = 3;
      rows = 1;
    } else if (n === 4) {
      cols = 2;
      rows = 2;
    } else if (n <= 6) {
      cols = 3;
      rows = 2;
    } else {
      cols = 3;
      rows = 3;
    }

    const pad = spacing * 2;
    const cellWidth = (width - pad * (cols + 1)) / cols;
    const cellHeight = (height - pad * (rows + 1)) / rows;

    photos.slice(0, cols * rows).forEach((photo, index) => {
      if (!photo.imgElement) return;

      const c = index % cols;
      const r = Math.floor(index / cols);

      const x = pad + c * (cellWidth + pad);
      const y = pad + r * (cellHeight + pad);

      ctx.save();
      // Rounded clipping path
      ctx.beginPath();
      const radius = borderRadius * 2;
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + cellWidth, y, x + cellWidth, y + cellHeight, radius);
      ctx.arcTo(x + cellWidth, y + cellHeight, x, y + cellHeight, radius);
      ctx.arcTo(x, y + cellHeight, x, y, radius);
      ctx.arcTo(x, y, x + cellWidth, y, radius);
      ctx.closePath();
      ctx.clip();

      // Object fit: cover within cell
      const img = photo.imgElement;
      const imgRatio = img.width / img.height;
      const cellRatio = cellWidth / cellHeight;

      let renderW = cellWidth;
      let renderH = cellHeight;
      let offsetX = x;
      let offsetY = y;

      if (imgRatio > cellRatio) {
        renderH = cellHeight;
        renderW = cellHeight * imgRatio;
        offsetX = x - (renderW - cellWidth) / 2;
      } else {
        renderW = cellWidth;
        renderH = cellWidth / imgRatio;
        offsetY = y - (renderH - cellHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    });
  };

  const downloadImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas || photos.length === 0) return;

    const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.92 : undefined);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `collage-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls & Uploads (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Add Photos ({photos.length})</span>
            </h3>

            <input
              type="file"
              id="multiPhotoInput"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="multiPhotoInput"
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
            >
              <ImageIcon className="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Click or Drop Photos Here</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Upload 2 to 9 photos (JPG, PNG, WebP)</span>
            </label>

            {/* Photo Thumbnails Strip */}
            {photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {photos.map((p) => (
                  <div key={p.id} className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={p.url} alt="Thumb" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Layout & Style Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Canvas Styling & Ratios</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: '1:1', label: '1:1 Square' },
                  { id: '4:5', label: '4:5 Post' },
                  { id: '16:9', label: '16:9 Wide' },
                  { id: '9:16', label: '9:16 Story' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setAspectRatio(r.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                      aspectRatio === r.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Border Spacing ({spacing}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Corner Radius ({borderRadius}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Background Frame Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5"
                />
                <div className="flex gap-1.5">
                  {['#ffffff', '#0f172a', '#f1f5f9', '#fef2f2', '#f0fdf4'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBgColor(c)}
                      className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 shadow-2xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Canvas Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Live Collage Canvas
            </span>

            <div className="w-full max-w-md p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[320px]">
              {photos.length === 0 ? (
                <div className="text-center text-xs text-slate-400 p-8">
                  Upload photos on the left to generate your collage preview.
                </div>
              ) : (
                <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl shadow-md" />
              )}
            </div>

            <div className="w-full mt-6 space-y-2">
              <button
                type="button"
                onClick={() => downloadImage('png')}
                disabled={photos.length === 0}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Resolution PNG</span>
              </button>

              <button
                type="button"
                onClick={() => downloadImage('jpeg')}
                disabled={photos.length === 0}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Compressed JPG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
