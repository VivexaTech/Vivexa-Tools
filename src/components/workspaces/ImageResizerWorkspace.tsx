'use client';

import React, { useState, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { 
  resizeImage, 
  addNameAndDobToPhoto, 
  applyImageFilters, 
  convertUnitsToPixels 
} from '@/lib/image/imageProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { 
  Scaling, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Lock,
  Unlock,
  Type
} from 'lucide-react';

interface ImageResizerWorkspaceProps {
  toolSlug?: string;
}

export const ImageResizerWorkspace: React.FC<ImageResizerWorkspaceProps> = ({
  toolSlug = 'image-resizer'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [origDims, setOrigDims] = useState<{ width: number; height: number } | null>(null);

  // Resize Settings
  const [unit, setUnit] = useState<'px' | 'cm' | 'mm' | 'in'>(
    toolSlug.includes('centimeter') ? 'cm' : toolSlug.includes('millimeter') ? 'mm' : toolSlug.includes('inch') ? 'in' : 'px'
  );
  const [widthVal, setWidthVal] = useState<number>(800);
  const [heightVal, setHeightVal] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [dpi, setDpi] = useState<number>(300);

  // Name & DOB Settings
  const [candidateName, setCandidateName] = useState<string>('JOHN DOE');
  const [dateText, setDateText] = useState<string>('DOP: 15/10/2026');

  // Filters & Effects
  const [filterMode, setFilterMode] = useState<'none' | 'grayscale' | 'blackWhite' | 'pixelate' | 'border'>('none');
  const [pixelateSize, setPixelateSize] = useState<number>(12);
  const [borderWidth, setBorderWidth] = useState<number>(10);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setResultBlob(null);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setOrigDims({ width: img.width, height: img.height });
      setWidthVal(img.width);
      setHeightVal(img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setWidthVal(val);
    if (lockAspect && origDims && origDims.width > 0) {
      const ratio = origDims.height / origDims.width;
      setHeightVal(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeightVal(val);
    if (lockAspect && origDims && origDims.height > 0) {
      const ratio = origDims.width / origDims.height;
      setWidthVal(Math.round(val * ratio));
    }
  };

  const processImage = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      let blob: Blob;

      if (toolSlug === 'add-name-and-dob-on-photo') {
        blob = await addNameAndDobToPhoto(file, candidateName, dateText);
      } else if (filterMode !== 'none' || toolSlug === 'image-effects') {
        blob = await applyImageFilters(file, {
          grayscale: filterMode === 'grayscale',
          blackWhite: filterMode === 'blackWhite',
          pixelate: filterMode === 'pixelate' ? pixelateSize : undefined,
          borderWidth: filterMode === 'border' ? borderWidth : undefined,
          borderColor: '#FFFFFF'
        });
      } else {
        const res = await resizeImage(file, {
          width: widthVal,
          height: heightVal,
          unit,
          dpi,
          maintainAspectRatio: lockAspect
        });
        blob = res.blob;
      }

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    downloadBlob(resultBlob, `processed_${file.name}`);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
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
          accept="image/jpeg,image/png,image/webp,image/bmp"
          multiple={false}
          maxSizeMb={50}
          label="Upload an image to resize or edit"
          sublabel="Change pixel dimensions, convert cm/mm/inches, add name and date, or apply filters."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {origDims?.width} × {origDims?.height} px • {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Change Photo
            </button>
          </div>

          {/* Setting Panels */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
            {toolSlug === 'add-name-and-dob-on-photo' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="JOHN DOE"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm uppercase font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Photograph or DOB
                  </label>
                  <input
                    type="text"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    placeholder="DOP: 15/10/2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm uppercase font-semibold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Adds a clean white strip with uppercase black font at the bottom of the photo.
                  </p>
                </div>
              </div>
            ) : toolSlug === 'image-effects' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Visual Effect
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'none', label: 'Original' },
                    { id: 'grayscale', label: 'Grayscale' },
                    { id: 'blackWhite', label: 'High-Contrast B&W' },
                    { id: 'pixelate', label: 'Pixelate / Censor' },
                    { id: 'border', label: 'Add White Border' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFilterMode(mode.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                        filterMode === mode.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {filterMode === 'pixelate' && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">Pixelate Size: {pixelateSize}px</span>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={pixelateSize}
                      onChange={(e) => setPixelateSize(parseInt(e.target.value))}
                      className="w-48"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Unit selector */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Measurement Unit
                  </span>
                  <div className="flex gap-1.5">
                    {(['px', 'cm', 'mm', 'in'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase ${
                          unit === u
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Width ({unit})
                    </label>
                    <input
                      type="number"
                      value={widthVal}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Height ({unit})
                    </label>
                    <input
                      type="number"
                      value={heightVal}
                      onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setLockAspect(!lockAspect)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600"
                  >
                    {lockAspect ? <Lock className="w-3.5 h-3.5 text-indigo-600" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Lock Aspect Ratio</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">DPI:</span>
                    {[72, 150, 300].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDpi(d)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          dpi === d ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action */}
          {!resultBlob ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={processImage}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Image...</span>
                  </>
                ) : (
                  <>
                    <Scaling className="w-4 h-4" />
                    <span>Apply &amp; Process Image</span>
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
                      Image Processed Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Output Size: {formatBytes(resultBlob.size)}
                    </p>
                  </div>
                </div>
              </div>

              {resultUrl && (
                <div className="p-4 rounded-xl bg-white border border-emerald-100 flex flex-col items-center justify-center">
                  <img
                    src={resultUrl}
                    alt="Processed result"
                    className="max-h-56 object-contain rounded border border-slate-200"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultBlob(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Adjust
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
