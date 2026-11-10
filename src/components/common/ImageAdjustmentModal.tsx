'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Crop as CropIcon,
  Download,
  Check,
  RefreshCw,
  Sparkles,
  Eye,
  Maximize2,
  Lock,
  Unlock,
} from 'lucide-react';
import { applySharpenFilter } from '@/lib/ocr/imageQualityAnalyzer';

export interface ImageAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageType: 'photo' | 'signature' | 'qr';
  originalDataUrl: string;
  onSave: (adjustedDataUrl: string) => void;
}

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageAdjustmentModal({
  isOpen,
  onClose,
  title,
  imageType,
  originalDataUrl,
  onSave,
}: ImageAdjustmentModalProps) {
  // Adjustment state
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [zoom, setZoom] = useState<number>(1.0); // 0.5 to 3.0
  const [brightness, setBrightness] = useState<number>(0); // -100 to 100
  const [contrast, setContrast] = useState<number>(0); // -100 to 100
  const [enableSharpness, setEnableSharpness] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '3:4' | '4:1' | 'original'>(
    imageType === 'qr' ? '1:1' : imageType === 'signature' ? '4:1' : '3:4'
  );

  // Crop box in normalized percentage coordinates (0 to 100)
  const [crop, setCrop] = useState<CropBox>({ x: 5, y: 5, width: 90, height: 90 });
  const [isDraggingCrop, setIsDraggingCrop] = useState<string | null>(null); // 'move' or handle name
  const [dragStart, setDragStart] = useState<{ x: number; y: number; crop: CropBox }>({
    x: 0,
    y: 0,
    crop: { x: 5, y: 5, width: 90, height: 90 },
  });

  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop');
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  // Preview canvas ref
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);

  // Loaded image ref
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Initialize image on open
  useEffect(() => {
    if (!isOpen || !originalDataUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgElementRef.current = img;
      setImageLoaded(true);
      // Reset defaults
      setRotation(0);
      setZoom(1.0);
      setBrightness(0);
      setContrast(0);
      setEnableSharpness(false);
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
    };
    img.src = originalDataUrl;
  }, [isOpen, originalDataUrl]);

  // Apply non-destructive render to canvas
  const renderAdjustedCanvas = useCallback((): HTMLCanvasElement | null => {
    const img = imgElementRef.current;
    if (!img) return null;

    // 1. Create a working canvas for base transformations (Rotation, Zoom, Filters)
    const workCanvas = document.createElement('canvas');
    const isRotated90or270 = rotation % 180 !== 0;
    const baseW = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
    const baseH = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

    workCanvas.width = baseW;
    workCanvas.height = baseH;
    const ctx = workCanvas.getContext('2d');
    if (!ctx) return null;

    // Apply Rotation
    ctx.save();
    ctx.translate(baseW / 2, baseH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    // 2. Apply Brightness & Contrast via ImageData
    if (brightness !== 0 || contrast !== 0) {
      const imgData = ctx.getImageData(0, 0, baseW, baseH);
      const data = imgData.data;
      const bFactor = (brightness * 255) / 100;
      // Contrast formula: factor = (259 * (C + 255)) / (255 * (259 - C))
      const c = Math.max(-100, Math.min(100, contrast));
      const cFactor = (259 * (c + 255)) / (255 * (259 - c));

      for (let i = 0; i < data.length; i += 4) {
        // Brightness
        let r = data[i] + bFactor;
        let g = data[i + 1] + bFactor;
        let b = data[i + 2] + bFactor;

        // Contrast
        r = cFactor * (r - 128) + 128;
        g = cFactor * (g - 128) + 128;
        b = cFactor * (b - 128) + 128;

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // 3. Optional Sharpening
    let finalBase = workCanvas;
    if (enableSharpness) {
      finalBase = applySharpenFilter(workCanvas);
    }

    // 4. Extract Crop Region
    const cropX = Math.round((crop.x / 100) * baseW);
    const cropY = Math.round((crop.y / 100) * baseH);
    const cropW = Math.max(10, Math.round((crop.width / 100) * baseW));
    const cropH = Math.max(10, Math.round((crop.height / 100) * baseH));

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = cropW;
    finalCanvas.height = cropH;
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return finalBase;

    finalCtx.drawImage(finalBase, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    return finalCanvas;
  }, [rotation, zoom, brightness, contrast, enableSharpness, crop]);

  // Update live preview canvas
  useEffect(() => {
    if (!isOpen || !imageLoaded) return;
    const outCanvas = renderAdjustedCanvas();
    if (!outCanvas || !previewCanvasRef.current) return;

    const target = previewCanvasRef.current;
    target.width = outCanvas.width;
    target.height = outCanvas.height;
    const ctx = target.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, target.width, target.height);
      ctx.drawImage(outCanvas, 0, 0);
    }
  }, [isOpen, imageLoaded, renderAdjustedCanvas]);

  // Mouse drag handlers for crop box
  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    setIsDraggingCrop(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      crop: { ...crop },
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingCrop || !cropContainerRef.current) return;

      const rect = cropContainerRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

      setCrop((prev) => {
        let { x, y, width, height } = dragStart.crop;

        if (isDraggingCrop === 'move') {
          x = Math.max(0, Math.min(100 - width, x + deltaXPercent));
          y = Math.max(0, Math.min(100 - height, y + deltaYPercent));
        } else if (isDraggingCrop === 'se') {
          width = Math.max(10, Math.min(100 - x, width + deltaXPercent));
          height = Math.max(10, Math.min(100 - y, height + deltaYPercent));
        } else if (isDraggingCrop === 'sw') {
          const newW = Math.max(10, Math.min(x + width, width - deltaXPercent));
          x = x + (width - newW);
          width = newW;
          height = Math.max(10, Math.min(100 - y, height + deltaYPercent));
        } else if (isDraggingCrop === 'ne') {
          width = Math.max(10, Math.min(100 - x, width + deltaXPercent));
          const newH = Math.max(10, Math.min(y + height, height - deltaYPercent));
          y = y + (height - newH);
          height = newH;
        } else if (isDraggingCrop === 'nw') {
          const newW = Math.max(10, Math.min(x + width, width - deltaXPercent));
          x = x + (width - newW);
          width = newW;
          const newH = Math.max(10, Math.min(y + height, height - deltaYPercent));
          y = y + (height - newH);
          height = newH;
        }

        return { x, y, width, height };
      });
    },
    [isDraggingCrop, dragStart]
  );

  const handleMouseUp = () => {
    setIsDraggingCrop(null);
  };

  // Reset to original
  const handleReset = () => {
    setRotation(0);
    setZoom(1.0);
    setBrightness(0);
    setContrast(0);
    setEnableSharpness(false);
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
  };

  // Apply and save
  const handleApply = () => {
    const canvas = renderAdjustedCanvas();
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      onClose();
    }
  };

  // Download directly
  const handleDownload = () => {
    const canvas = renderAdjustedCanvas();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `adjusted_${imageType}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  {imageType} editor
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Non-destructive framing, crop, rotation & clarity adjustment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual Workspace (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('crop')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'crop'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <CropIcon className="w-3.5 h-3.5 inline mr-1" />
                  Crop Box
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('adjust')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'adjust'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 inline mr-1" />
                  Color & Filters
                </button>
              </div>

              {/* View Toggle */}
              <button
                type="button"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 select-none"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Hold to View Original</span>
              </button>
            </div>

            {/* Interactive Canvas Canvas Viewer */}
            <div
              ref={cropContainerRef}
              className="relative w-full aspect-4/3 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 select-none"
            >
              {showOriginal ? (
                // Original View
                <img
                  src={originalDataUrl}
                  alt="Original Extraction"
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />
              ) : activeTab === 'crop' ? (
                // Interactive Crop Area
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {/* Base Image with current rotation/zoom */}
                  <img
                    src={originalDataUrl}
                    alt="Work source"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${zoom})`,
                      transition: 'transform 0.15s ease',
                    }}
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />

                  {/* Crop Overlay Box */}
                  <div
                    style={{
                      left: `${crop.x}%`,
                      top: `${crop.y}%`,
                      width: `${crop.width}%`,
                      height: `${crop.height}%`,
                    }}
                    className="absolute border-2 border-indigo-500 bg-indigo-500/15 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move"
                    onMouseDown={(e) => handleMouseDown(e, 'move')}
                  >
                    {/* Corner Handles */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'nw');
                      }}
                      className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'ne');
                      }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nesw-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'sw');
                      }}
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nesw-resize shadow-md"
                    />
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'se');
                      }}
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize shadow-md"
                    />

                    {/* Rule of thirds grid lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                    </div>
                  </div>
                </div>
              ) : (
                // Filter / Adjust View
                <canvas
                  ref={previewCanvasRef}
                  className="max-h-full max-w-full object-contain pointer-events-none shadow-lg"
                />
              )}
            </div>

            {/* Quick Rotation & Zoom Toolbar */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center gap-1 font-medium"
                  title="Rotate Left 90°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rotate -90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center gap-1 font-medium"
                  title="Rotate Right 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rotate +90°</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.6, Math.round((z - 0.1) * 10) / 10))}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-600 dark:text-slate-400 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, Math.round((z + 0.1) * 10) / 10))}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Settings & Sliders Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Aspect Ratio Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Crop Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAspectRatio('free');
                      setCrop({ x: 5, y: 5, width: 90, height: 90 });
                    }}
                    className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                      aspectRatio === 'free'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    Free Crop
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAspectRatio('1:1');
                      setCrop({ x: 10, y: 10, width: 80, height: 80 });
                    }}
                    className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                      aspectRatio === '1:1'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    1:1 Square
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAspectRatio('3:4');
                      setCrop({ x: 15, y: 5, width: 70, height: 90 });
                    }}
                    className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                      aspectRatio === '3:4'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    3:4 Portrait
                  </button>
                </div>
              </div>

              {/* Brightness Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Brightness</span>
                  <span className="font-mono text-slate-500">{brightness > 0 ? `+${brightness}` : brightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Contrast Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Contrast</span>
                  <span className="font-mono text-slate-500">{contrast > 0 ? `+${contrast}` : contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Sharpness Filter Toggle */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Edge Sharpening</p>
                      <p className="text-[11px] text-slate-500">Unsharp mask for blurry stamps & text</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSharpness}
                    onChange={(e) => setEnableSharpness(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cropped Output Preview
                </span>
                <div className="w-full h-28 flex items-center justify-center overflow-hidden rounded-xl bg-slate-200/50 dark:bg-slate-900/50">
                  <canvas ref={previewCanvasRef} className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Adjustments</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjustments are applied in-browser and preserve your original file.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Update Result</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
