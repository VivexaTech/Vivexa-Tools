'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Camera,
  StopCircle,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Barcode
} from 'lucide-react';

export const BarcodeScannerWorkspace: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [decodedCode, setDecodedCode] = useState<{ format: string; rawValue: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanningCamera(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleModeChange = (newMode: 'upload' | 'camera') => {
    stopCamera();
    setMode(newMode);
    setErrorMsg(null);
  };

  const scanImageWithBarcodeDetector = async (imageSource: ImageBitmapSource) => {
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['code_128', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_39', 'itf'],
        });
        const barcodes = await barcodeDetector.detect(imageSource);
        if (barcodes && barcodes.length > 0) {
          return {
            format: barcodes[0].format || 'Detected Barcode',
            rawValue: barcodes[0].rawValue || '',
          };
        }
      } catch (e) {
        console.warn('BarcodeDetector error', e);
      }
    }
    return null;
  };

  const handleImageUpload = async (file: File) => {
    setErrorMsg(null);
    setDecodedCode(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewImage(dataUrl);

      const img = new Image();
      img.onload = async () => {
        try {
          const detected = await scanImageWithBarcodeDetector(img);
          if (detected) {
            setDecodedCode(detected);
          } else {
            setErrorMsg('Barcode was not detected. Please ensure the bars are in focus, horizontal, and well-lit.');
          }
        } catch (err: any) {
          setErrorMsg('Failed to process image for barcode detection.');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setErrorMsg(null);
    setDecodedCode(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanningCamera(true);
        scanCameraLoop();
      }
    } catch (err: any) {
      console.error('Camera error', err);
      setErrorMsg('Camera access denied or unavailable. Please grant webcam permissions or use image upload.');
      setIsScanningCamera(false);
    }
  };

  const scanCameraLoop = async () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanCameraLoop);
      return;
    }

    try {
      const detected = await scanImageWithBarcodeDetector(videoRef.current);
      if (detected) {
        setDecodedCode(detected);
        stopCamera();
        return;
      }
    } catch (err) {
      // Continue loop
    }

    animationFrameId.current = requestAnimationFrame(scanCameraLoop);
  };

  const copyToClipboard = async () => {
    if (!decodedCode) return;
    await navigator.clipboard.writeText(decodedCode.rawValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => handleModeChange('upload')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('camera')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'camera'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera Scanner</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {mode === 'upload' ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-center space-y-4">
              <input
                type="file"
                id="barcodeImageInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <label
                htmlFor="barcodeImageInput"
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 cursor-pointer transition-colors group bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Barcode className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Drop a product barcode image or photo
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports EAN-13, UPC-A, Code 128, Code 39
                </p>
                <span className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs">
                  Browse Files
                </span>
              </label>

              {previewImage && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                    Scanned Barcode Image
                  </span>
                  <div className="max-w-[280px] mx-auto p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <img src={previewImage} alt="Uploaded Barcode" className="max-h-56 mx-auto rounded-lg object-contain" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-center space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-4/3 max-w-md mx-auto flex items-center justify-center border border-slate-800">
                <video ref={videoRef} className="w-full h-full object-cover" />
                {isScanningCamera && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-36 border-2 border-indigo-400 rounded-xl flex items-center justify-center">
                      <div className="w-52 h-0.5 bg-indigo-500 animate-pulse" />
                    </div>
                  </div>
                )}
                {!isScanningCamera && (
                  <div className="text-slate-400 text-xs px-4">
                    Camera is currently off. Click below to start scanning.
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                {!isScanningCamera ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Start Webcam</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Stop Camera</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right Output Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Barcode className="w-4 h-4 text-indigo-600" />
              <span>Decoded Barcode</span>
            </h3>

            {decodedCode ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Barcode Standard:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                      {decodedCode.format}
                    </span>
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-white break-all">
                    {decodedCode.rawValue}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Number!' : 'Copy Barcode Number'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecodedCode(null);
                      setPreviewImage(null);
                      setErrorMsg(null);
                      if (mode === 'camera') startCamera();
                    }}
                    className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Another Barcode</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                No barcode detected yet. Upload a barcode image or activate webcam scanning.
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side. No images leave your browser.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
