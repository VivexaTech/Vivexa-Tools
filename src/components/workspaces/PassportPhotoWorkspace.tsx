'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import {
  PASSPORT_PRESETS,
  PAPER_SIZES,
  PhotoPreset,
  UploadedPhoto,
  calculateSheetLayout,
  renderCroppedPhotoCanvas,
  renderPrintableSheetCanvas,
  generatePrintablePdf,
  exportCroppedPhotosZip,
} from '@/lib/image/passportSheetHelper';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import {
  UserCheck,
  Plus,
  Minus,
  Trash2,
  Download,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Move,
  CheckCircle2,
  Layers,
  Sparkles,
  Archive,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface PassportPhotoWorkspaceProps {
  initialBgColor?: string;
}

export const PassportPhotoWorkspace: React.FC<PassportPhotoWorkspaceProps> = ({
  initialBgColor = '#FFFFFF',
}) => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  // Settings
  const [selectedPresetId, setSelectedPresetId] = useState<string>('35x45mm');
  const [selectedPaperSize, setSelectedPaperSize] = useState<'A4' | 'A5' | '4x6in'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [bgColor, setBgColor] = useState<string>(initialBgColor);
  const [marginMm, setMarginMm] = useState<number>(5);
  const [spacingMm, setSpacingMm] = useState<number>(3);

  // Sheet Preview & Export State
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const sheetCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedPreset = PASSPORT_PRESETS.find((p) => p.id === selectedPresetId) || PASSPORT_PRESETS[0];

  // Upload handler
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;

    const newPhotos: UploadedPhoto[] = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      copies: 4, // Default 4 copies
      crop: { zoom: 1.0, panX: 0, panY: 0 },
    }));

    setPhotos((prev) => {
      const merged = [...prev, ...newPhotos];
      if (!activePhotoId && merged.length > 0) {
        setActivePhotoId(merged[0].id);
      }
      return merged;
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activePhotoId === id) {
        setActivePhotoId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const updateCopies = (id: string, delta: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, copies: Math.max(1, p.copies + delta) } : p))
    );
  };

  const setExactCopies = (id: string, val: number) => {
    const num = Math.max(1, isNaN(val) ? 1 : Math.floor(val));
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, copies: num } : p)));
  };

  const updateCrop = (id: string, partial: Partial<UploadedPhoto['crop']>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, crop: { ...p.crop, ...partial } } : p))
    );
  };

  const activePhoto = photos.find((p) => p.id === activePhotoId) || photos[0];
  const totalCopies = photos.reduce((acc, p) => acc + p.copies, 0);

  // Layout calculation
  const layout = calculateSheetLayout(
    selectedPaperSize,
    orientation,
    selectedPreset,
    marginMm,
    spacingMm,
    totalCopies
  );

  // Ensure currentSheetIndex stays within bounds
  useEffect(() => {
    if (currentSheetIndex >= layout.totalSheets) {
      setCurrentSheetIndex(Math.max(0, layout.totalSheets - 1));
    }
  }, [layout.totalSheets, currentSheetIndex]);

  // Render crop preview for active photo
  useEffect(() => {
    let active = true;
    async function renderCrop() {
      if (!activePhoto || !cropCanvasRef.current) return;
      try {
        const cropped = await renderCroppedPhotoCanvas(activePhoto, selectedPreset, 150, bgColor);
        if (!active || !cropCanvasRef.current) return;
        const canvas = cropCanvasRef.current;
        canvas.width = cropped.width;
        canvas.height = cropped.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(cropped, 0, 0);
      } catch (err) {
        console.warn('Crop preview render error:', err);
      }
    }
    renderCrop();
    return () => {
      active = false;
    };
  }, [activePhoto, selectedPreset, bgColor]);

  // Render sheet preview canvas
  useEffect(() => {
    let active = true;
    async function renderSheet() {
      if (photos.length === 0 || !sheetCanvasRef.current) return;
      try {
        const sheetCanvas = await renderPrintableSheetCanvas(
          photos,
          currentSheetIndex,
          layout,
          selectedPreset,
          100, // 100 DPI for fast screen preview
          bgColor
        );
        if (!active || !sheetCanvasRef.current) return;
        const target = sheetCanvasRef.current;
        target.width = sheetCanvas.width;
        target.height = sheetCanvas.height;
        const ctx = target.getContext('2d');
        if (ctx) ctx.drawImage(sheetCanvas, 0, 0);
      } catch (err) {
        console.warn('Sheet preview render error:', err);
      }
    }
    renderSheet();
    return () => {
      active = false;
    };
  }, [photos, currentSheetIndex, layout, selectedPreset, bgColor]);

  // Export handlers
  const handleDownloadPdf = async () => {
    if (photos.length === 0) return;
    setIsExporting(true);
    try {
      const pdfBytes = await generatePrintablePdf(photos, layout, selectedPreset, bgColor);
      downloadBlob(pdfBytes, `passport_photos_${selectedPaperSize}_${layout.totalSheets}sheets.pdf`);
    } catch (err) {
      alert('Failed to generate printable PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSheetPng = async () => {
    if (photos.length === 0) return;
    setIsExporting(true);
    try {
      const highResCanvas = await renderPrintableSheetCanvas(
        photos,
        currentSheetIndex,
        layout,
        selectedPreset,
        300,
        bgColor
      );
      highResCanvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `passport_sheet_${currentSheetIndex + 1}_of_${layout.totalSheets}_300dpi.png`);
        }
        setIsExporting(false);
      }, 'image/png');
    } catch (err) {
      setIsExporting(false);
      alert('Failed to export sheet image.');
    }
  };

  const handleDownloadZip = async () => {
    if (photos.length === 0) return;
    setIsExporting(true);
    try {
      const zipBlob = await exportCroppedPhotosZip(photos, selectedPreset, 300, bgColor);
      downloadBlob(zipBlob, `cropped_passport_photos_package.zip`);
    } catch (err) {
      alert('Failed to export cropped photos ZIP.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPhotos([]);
    setActivePhotoId(null);
    setCurrentSheetIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {photos.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/jpeg,image/png,image/webp"
          multiple={true}
          maxSizeMb={30}
          label="Upload one or multiple portrait photos"
          sublabel="JPG, PNG, or WEBP. Ratio-locked cropping, custom copy quantities & printable multi-sheet layout."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-8">
          {/* Top Control Bar: Uploaded Photos Carousel & Add More */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Uploaded Photographs ({photos.length} Photos • {totalCopies} Total Copies)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a photo to crop and adjust copies. Each photo can have a different quantity.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add More Photos</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Reset All
                </button>
              </div>
            </div>

            {/* Photo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {photos.map((p, idx) => {
                const isSelected = p.id === activePhotoId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePhotoId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.previewUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-12 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate">
                          Photo #{idx + 1}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {p.file.name}
                        </span>
                      </div>
                    </div>

                    {/* Per-Photo Copy Quantity Controls */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => updateCopies(p.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                        title="Decrease copies"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={p.copies}
                        onChange={(e) => setExactCopies(p.id, parseInt(e.target.value, 10))}
                        className="w-11 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs font-bold text-slate-800 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => updateCopies(p.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                        title="Increase copies"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="w-7 h-7 ml-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Ratio-Locked Cropping & Repositioning */}
          {activePhoto && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Fixed-Ratio Crop & Framing (Photo #{photos.findIndex((p) => p.id === activePhoto.id) + 1})</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ratio is locked to {selectedPreset.label}. Zoom and pan to frame the face accurately.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Copies of this photo:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    {activePhoto.copies} copies
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                {/* Crop Controls */}
                <div className="space-y-4">
                  {/* Aspect Ratio Preset Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Crop Ratio & Standard Dimension
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PASSPORT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPresetId(preset.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            selectedPresetId === preset.id
                              ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 font-bold text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Zoom Scale</span>
                      </span>
                      <span>{Math.round(activePhoto.crop.zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.05"
                      value={activePhoto.crop.zoom}
                      onChange={(e) => updateCrop(activePhoto.id, { zoom: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Pan Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Horizontal Pan (X)
                      </span>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="1"
                        value={activePhoto.crop.panX}
                        onChange={(e) => updateCrop(activePhoto.id, { panX: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Vertical Pan (Y)
                      </span>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="1"
                        value={activePhoto.crop.panY}
                        onChange={(e) => updateCrop(activePhoto.id, { panY: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Background Color Toggle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Background Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'White', color: '#FFFFFF' },
                        { label: 'Off-White', color: '#F8FAFC' },
                        { label: 'Light Blue', color: '#93C5FD' },
                        { label: 'Official Red', color: '#DC2626' },
                      ].map((bg) => (
                        <button
                          key={bg.color}
                          type="button"
                          onClick={() => setBgColor(bg.color)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                            bgColor === bg.color
                              ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: bg.color }}
                          />
                          <span>{bg.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Cropped Photo Preview with Face Framing Guide */}
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="relative border-2 border-indigo-500 shadow-lg rounded overflow-hidden">
                    <canvas ref={cropCanvasRef} className="max-w-[180px] max-h-[240px] h-auto object-contain" />
                    {/* Simulated subtle face alignment guide */}
                    <div className="absolute inset-x-8 inset-y-6 border border-dashed border-indigo-400/50 rounded-full pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    {selectedPreset.wMm} × {selectedPreset.hMm} mm • Ratio Locked ({selectedPreset.ratio.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Printable Sheet Configuration & Multi-Sheet Layout */}
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Printable Sheet Arrangement</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fits {layout.capacityPerSheet} photos per sheet ({layout.cols} columns × {layout.rows} rows). Total {layout.totalCopies} copies will be printed across {layout.totalSheets} {layout.totalSheets === 1 ? 'sheet' : 'sheets'}.
                </p>
              </div>

              {/* Multi-Sheet Switcher */}
              {layout.totalSheets > 1 && (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCurrentSheetIndex((s) => Math.max(0, s - 1))}
                    disabled={currentSheetIndex <= 0}
                    className="p-1 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 px-2">
                    Sheet {currentSheetIndex + 1} of {layout.totalSheets}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentSheetIndex((s) => Math.min(layout.totalSheets - 1, s + 1))}
                    disabled={currentSheetIndex >= layout.totalSheets - 1}
                    className="p-1 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Paper Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Paper Size
                </label>
                <select
                  value={selectedPaperSize}
                  onChange={(e) => setSelectedPaperSize(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="A5">A5 (148 × 210 mm)</option>
                  <option value="4x6in">4 × 6 Inch Photo Paper</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Photo Spacing
                </label>
                <select
                  value={spacingMm}
                  onChange={(e) => setSpacingMm(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={2}>2 mm (Tight)</option>
                  <option value={3}>3 mm (Standard)</option>
                  <option value={5}>5 mm (Spacious)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Outer Margin
                </label>
                <select
                  value={marginMm}
                  onChange={(e) => setMarginMm(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={5}>5 mm (Standard)</option>
                  <option value={8}>8 mm (Wide)</option>
                  <option value={10}>10 mm (Extra Wide)</option>
                </select>
              </div>
            </div>

            {/* Printable Sheet Canvas Preview */}
            <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center items-center overflow-auto max-h-[500px]">
              <canvas
                ref={sheetCanvasRef}
                className="bg-white shadow-xl rounded border border-slate-300 max-w-full h-auto object-contain"
              />
            </div>

            {/* Export Actions Bar */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                <span>Download Printable Sheet (PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSheetPng}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
              >
                <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Save Sheet (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
              >
                <Archive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Download Cropped Photos (ZIP)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
