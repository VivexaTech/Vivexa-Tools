'use client';

import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Dropzone } from '@/components/common/Dropzone';
import { createIcoFromPngBuffers } from '@/lib/image/icoEncoder';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { 
  Sparkles, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Globe, 
  Sun, 
  Moon, 
  Smartphone,
  Sliders,
  Layers,
  FileArchive
} from 'lucide-react';

interface FaviconConfig {
  fitMode: 'contain' | 'cover';
  paddingPercent: number;
  bgColor: string;
  isTransparent: boolean;
  borderRadiusPercent: number;
}

const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 192, 256, 512];

export const FaviconGeneratorWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customization
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [paddingPercent, setPaddingPercent] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [isTransparent, setIsTransparent] = useState<boolean>(true);
  const [borderRadiusPercent, setBorderRadiusPercent] = useState<number>(0);

  // Result
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [generatedPreviews, setGeneratedPreviews] = useState<{ [size: number]: string }>({});
  const [appleTouchPreview, setAppleTouchPreview] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setZipBlob(null);

    const url = URL.createObjectURL(selected);
    setPreviewSrc(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
    };
    img.onerror = () => {
      setErrorMessage('Could not load image. Please provide a standard PNG, JPG, or WebP file.');
    };
    img.src = url;
  };

  // Render a specific size to a canvas and get Blob & Uint8Array
  const renderIconSize = (
    img: HTMLImageElement,
    size: number,
    config: FaviconConfig
  ): Promise<{ dataUrl: string; bytes: Uint8Array }> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Rounded clip if requested
      if (config.borderRadiusPercent > 0) {
        const radius = (size / 2) * (config.borderRadiusPercent / 100);
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.clip();
      }

      // Background
      if (!config.isTransparent) {
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // Padding & Fit calculation
      const pad = (size * (config.paddingPercent / 100));
      const availW = Math.max(1, size - pad * 2);
      const availH = Math.max(1, size - pad * 2);

      let drawW = availW;
      let drawH = availH;
      let drawX = pad;
      let drawY = pad;

      const imgAspect = img.width / img.height;
      const availAspect = availW / availH;

      if (config.fitMode === 'contain') {
        if (imgAspect > availAspect) {
          drawW = availW;
          drawH = availW / imgAspect;
          drawY = pad + (availH - drawH) / 2;
        } else {
          drawH = availH;
          drawW = availH * imgAspect;
          drawX = pad + (availW - drawW) / 2;
        }
      } else {
        // Cover
        if (imgAspect > availAspect) {
          drawH = availH;
          drawW = availH * imgAspect;
          drawX = pad - (drawW - availW) / 2;
        } else {
          drawW = availW;
          drawH = availW / imgAspect;
          drawY = pad - (drawH - availH) / 2;
        }
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed to generate PNG'));
        const reader = new FileReader();
        reader.onloadend = () => {
          const buffer = reader.result as ArrayBuffer;
          resolve({
            dataUrl: canvas.toDataURL('image/png'),
            bytes: new Uint8Array(buffer)
          });
        };
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    });
  };

  const handleGenerate = async () => {
    if (!imgElement) return;

    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const config: FaviconConfig = {
        fitMode,
        paddingPercent,
        bgColor,
        isTransparent,
        borderRadiusPercent
      };

      const zip = new JSZip();
      const folder = zip.folder('vivexa-favicon-package') || zip;
      const previews: { [size: number]: string } = {};

      const icoBuffers: { width: number; height: number; bytes: Uint8Array }[] = [];

      // 1. Generate standard sizes
      for (const size of FAVICON_SIZES) {
        const { dataUrl, bytes } = await renderIconSize(imgElement, size, config);
        previews[size] = dataUrl;
        folder.file(`favicon-${size}x${size}.png`, bytes);

        // Include 16, 32, 48 in the genuine ICO file
        if (size === 16 || size === 32 || size === 48) {
          icoBuffers.push({ width: size, height: size, bytes });
        }
      }

      // 2. Apple Touch Icon (180x180) - usually prefers non-transparent or solid background
      const appleTouch = await renderIconSize(imgElement, 180, {
        ...config,
        // Apple recommends solid background for apple touch icon
        isTransparent: false,
        bgColor: config.isTransparent ? '#FFFFFF' : config.bgColor
      });
      setAppleTouchPreview(appleTouch.dataUrl);
      folder.file('apple-touch-icon.png', appleTouch.bytes);

      // 3. Genuine favicon.ico with 16, 32, 48 px PNG streams
      const icoBytes = createIcoFromPngBuffers(icoBuffers);
      folder.file('favicon.ico', icoBytes);

      // 4. site.webmanifest
      const manifest = {
        name: 'My Website',
        short_name: 'Website',
        icons: [
          {
            src: '/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        theme_color: isTransparent ? '#ffffff' : bgColor,
        background_color: isTransparent ? '#ffffff' : bgColor,
        display: 'standalone'
      };
      folder.file('site.webmanifest', JSON.stringify(manifest, null, 2));

      // 5. README.txt instructions
      const readme = `========================================================================
VIVEXA TOOLS — COMPLETE FAVICON PACKAGE
Generated locally in your browser. 100% Private.
========================================================================

HOW TO INSTALL FAVICONS IN YOUR WEBSITE:

1. Copy all the extracted files into the "public" (or root) directory of your website.

2. Add the following HTML tags inside your <head> section:

   <!-- Standard Favicon -->
   <link rel="icon" href="/favicon.ico" sizes="any">
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

   <!-- Apple Touch Icon (iOS / Safari) -->
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

   <!-- Android Chrome / Web Manifest -->
   <link rel="manifest" href="/site.webmanifest">
   <meta name="theme-color" content="${isTransparent ? '#ffffff' : bgColor}">

========================================================================
FILES INCLUDED IN THIS PACKAGE:
- favicon.ico (Genuine multi-resolution Windows & Browser icon: 16x16, 32x32, 48x48)
- favicon-16x16.png, favicon-32x32.png, favicon-48x48.png
- favicon-64x64.png, favicon-96x96.png, favicon-128x128.png
- favicon-192x192.png, favicon-256x256.png, favicon-512x512.png
- apple-touch-icon.png (180x180 for iOS Safari home screen)
- site.webmanifest (PWA / Android installable manifest)
- README.txt (This guide)

Generated by Vivexa Tools (Developed by Vivexa Tech: https://www.vivexatech.in/)
========================================================================
`;
      folder.file('README.txt', readme);

      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      setZipBlob(content);
      setGeneratedPreviews(previews);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate favicon package.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!zipBlob) return;
    downloadBlob(zipBlob, 'vivexa-favicon-package.zip');
  };

  const resetAll = () => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setFile(null);
    setImgElement(null);
    setPreviewSrc(null);
    setZipBlob(null);
    setGeneratedPreviews({});
    setAppleTouchPreview(null);
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
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          multiple={false}
          maxSizeMb={25}
          label="Upload your logo or icon to generate complete Favicon package"
          sublabel="Generates all standard PNG sizes, apple-touch-icon, genuine favicon.ico, and site.webmanifest in a ZIP."
        />
      ) : (
        <div className="space-y-6">
          {/* File Selected Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Original logo"
                  className="w-12 h-12 rounded-lg object-contain border border-slate-200 bg-white shrink-0 p-1"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {imgElement ? `${imgElement.width} × ${imgElement.height} px` : ''} • {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Replace Logo
            </button>
          </div>

          {/* Configuration Controls */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-5">
            {/* Fit mode & Padding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Image Fit
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      fitMode === 'contain'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Contain (No Crop)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      fitMode === 'cover'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Fill (Square Crop)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Inner Margin / Padding: {paddingPercent}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={paddingPercent}
                  onChange={(e) => setPaddingPercent(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Background Color & Rounded Corners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Background
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTransparent(true)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isTransparent
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Transparent
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsTransparent(false); setBgColor('#FFFFFF'); }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                      !isTransparent && bgColor === '#FFFFFF'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white" />
                    <span>White</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsTransparent(false); setBgColor('#0F172A'); }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                      !isTransparent && bgColor === '#0F172A'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-900" />
                    <span>Dark</span>
                  </button>
                  {!isTransparent && (
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      title="Custom color"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Corner Curvature: {borderRadiusPercent}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={borderRadiusPercent}
                  onChange={(e) => setBorderRadiusPercent(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !imgElement}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating All Sizes &amp; ICO...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{zipBlob ? 'Regenerate Favicon Package' : 'Generate Favicon Package'}</span>
                </>
              )}
            </button>
          </div>

          {/* Previews Section (Multi-preview: Browser tab, Dark/Light background, Apple touch) */}
          {generatedPreviews[32] && (
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-900">
                      Favicon Package Generated!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      12 Assets ready including genuine multi-resolution favicon.ico &amp; webmanifest.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ZIP Package ({formatBytes(zipBlob?.size || 0)})</span>
                </button>
              </div>

              {/* Realistic Contextual Previews */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Contextual Live Previews
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Browser Tab Preview */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Browser Tab</span>
                    </span>
                    <div className="bg-slate-200 p-2 rounded-lg flex items-center gap-2">
                      <div className="bg-white px-3 py-1.5 rounded-md flex items-center gap-2 shadow-xs text-xs font-medium text-slate-800 max-w-full truncate">
                        <img
                          src={generatedPreviews[16]}
                          alt="16px tab icon"
                          className="w-4 h-4 shrink-0"
                        />
                        <span className="truncate">My Website — Home</span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode Preview */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                      <span>Dark Theme Preview</span>
                    </span>
                    <div className="bg-slate-900 p-3 rounded-lg flex items-center justify-center gap-4">
                      <img
                        src={generatedPreviews[32]}
                        alt="32px dark icon"
                        className="w-8 h-8"
                      />
                      <img
                        src={generatedPreviews[64]}
                        alt="64px dark icon"
                        className="w-12 h-12"
                      />
                    </div>
                  </div>

                  {/* Light Mode & Mobile App Touch Preview */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>iOS Apple Touch (180px)</span>
                    </span>
                    <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-center">
                      {appleTouchPreview && (
                        <img
                          src={appleTouchPreview}
                          alt="Apple touch icon"
                          className="w-14 h-14 rounded-2xl shadow-md border border-slate-200"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Content List */}
              <div className="bg-white p-4 rounded-xl border border-emerald-100 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-2">Package Contents (vivexa-favicon-package.zip):</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <span>• favicon.ico (16,32,48)</span>
                  <span>• favicon-16x16.png</span>
                  <span>• favicon-32x32.png</span>
                  <span>• favicon-48x48.png</span>
                  <span>• favicon-64x64.png</span>
                  <span>• favicon-96x96.png</span>
                  <span>• favicon-128x128.png</span>
                  <span>• favicon-192x192.png</span>
                  <span>• favicon-256x256.png</span>
                  <span>• favicon-512x512.png</span>
                  <span>• apple-touch-icon.png</span>
                  <span>• site.webmanifest</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
