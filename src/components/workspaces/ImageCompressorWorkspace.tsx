'use client';

import React, { useState, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { compressImageToTarget } from '@/lib/image/imageProcessing';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { 
  Minimize2, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ImageCompressorWorkspaceProps {
  defaultTargetKb?: number;
}

export const ImageCompressorWorkspace: React.FC<ImageCompressorWorkspaceProps> = ({
  defaultTargetKb = 50
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState<number>(defaultTargetKb);
  const [formatChoice, setFormatChoice] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultStats, setResultStats] = useState<{
    originalSize: number;
    compressedSize: number;
    qualityUsed: number;
    savingsPercent: number;
  } | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState<string | null>(null);

  const presets = [10, 20, 50, 100, 200, 500, 1024];

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setResultBlob(null);

    const url = URL.createObjectURL(selected);
    setOriginalPreviewUrl(url);
  };

  const runCompression = async () => {
    if (!file) return;

    try {
      setIsCompressing(true);
      setErrorMessage(null);

      const targetBytes = targetKb * 1024;
      const res = await compressImageToTarget(file, targetBytes, formatChoice);

      setResultBlob(res.blob);
      const savings = Math.max(0, file.size - res.actualSize);
      const savingsPercent = Math.round((savings / file.size) * 100);

      setResultStats({
        originalSize: file.size,
        compressedSize: res.actualSize,
        qualityUsed: res.qualityUsed,
        savingsPercent
      });

      if (compressedPreviewUrl) URL.revokeObjectURL(compressedPreviewUrl);
      const preview = URL.createObjectURL(res.blob);
      setCompressedPreviewUrl(preview);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to compress image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const ext = formatChoice === 'image/webp' ? '.webp' : '.jpg';
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'compressed_image';
    downloadBlob(resultBlob, `${name}_${targetKb}kb${ext}`);
  };

  const resetAll = () => {
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (compressedPreviewUrl) URL.revokeObjectURL(compressedPreviewUrl);
    setFile(null);
    setResultBlob(null);
    setResultStats(null);
    setOriginalPreviewUrl(null);
    setCompressedPreviewUrl(null);
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
          label="Select or drop an image to compress"
          sublabel="Target exact file sizes in KB with private in-browser compression."
        />
      ) : (
        <div className="space-y-6">
          {/* File Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              {originalPreviewUrl && (
                <img
                  src={originalPreviewUrl}
                  alt="Original preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  Original: {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Choose Another
            </button>
          </div>

          {/* Target Settings */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target File Size (KB)
                </label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Target: {targetKb >= 1024 ? `${(targetKb / 1024).toFixed(1)} MB` : `${targetKb} KB`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">Kilobytes</span>
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Quick Popular Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTargetKb(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      targetKb === p
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {p >= 1024 ? `${p / 1024} MB` : `${p} KB`}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Output Format:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormatChoice('image/jpeg')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    formatChoice === 'image/jpeg'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  JPG / JPEG
                </button>
                <button
                  type="button"
                  onClick={() => setFormatChoice('image/webp')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                    formatChoice === 'image/webp'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  WebP (Smaller)
                </button>
              </div>
            </div>
          </div>

          {/* Compress Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={runCompression}
              disabled={isCompressing}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iterative Binary Compressing...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Compress to {targetKb} KB</span>
                </>
              )}
            </button>
          </div>

          {/* Results Comparison Card */}
          {resultStats && resultBlob && (
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-900">
                      Compression Complete!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Target was {targetKb} KB • Achieved {formatBytes(resultStats.compressedSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-600 text-white shadow-sm">
                    {resultStats.savingsPercent}% Smaller
                  </span>
                </div>
              </div>

              {/* Side-by-Side Size Info */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-xl bg-white/80 border border-emerald-100">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">
                    Original Size
                  </span>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {formatBytes(resultStats.originalSize)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/80 border border-emerald-100">
                  <span className="text-[11px] text-emerald-700 uppercase font-semibold">
                    Compressed Size
                  </span>
                  <p className="text-base font-bold text-emerald-700 mt-0.5">
                    {formatBytes(resultStats.compressedSize)}
                  </p>
                </div>
              </div>

              {/* Download Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed Image</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
