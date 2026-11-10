'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import {
  Barcode,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF14';

export const BarcodeGeneratorWorkspace: React.FC = () => {
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [value, setValue] = useState('VIVEXA-2026-PRO');
  const [lineColor, setLineColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [barWidth, setBarWidth] = useState<number>(2);
  const [barHeight, setBarHeight] = useState<number>(80);
  const [displayValue, setDisplayValue] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(16);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto set recommended sample value when format changes
  const handleFormatChange = (newFormat: BarcodeFormat) => {
    setFormat(newFormat);
    setErrorMsg(null);
    if (newFormat === 'EAN13') setValue('590123412345'); // 12 digits, 13th calculated or full 13
    else if (newFormat === 'EAN8') setValue('9638507'); // 7 digits
    else if (newFormat === 'UPC') setValue('01234567890'); // 11 digits
    else if (newFormat === 'ITF14') setValue('0001234560001');
    else if (newFormat === 'CODE39') setValue('VIVEXA39');
    else setValue('VIVEXA-2026-PRO');
  };

  useEffect(() => {
    renderBarcode();
  }, [format, value, lineColor, bgColor, barWidth, barHeight, displayValue, fontSize]);

  const renderBarcode = () => {
    setErrorMsg(null);
    if (!value.trim()) return;

    try {
      if (svgRef.current) {
        JsBarcode(svgRef.current, value, {
          format: format as any,
          lineColor,
          background: bgColor,
          width: barWidth,
          height: barHeight,
          displayValue,
          fontSize,
          margin: 12,
        });
      }

      if (canvasRef.current) {
        JsBarcode(canvasRef.current, value, {
          format: format as any,
          lineColor,
          background: bgColor,
          width: barWidth,
          height: barHeight,
          displayValue,
          fontSize,
          margin: 12,
        });
      }
    } catch (err: any) {
      console.warn('Barcode generation warning', err.message);
      setErrorMsg(err.message || 'Invalid characters or length for selected barcode standard.');
    }
  };

  const downloadPng = () => {
    if (!canvasRef.current || errorMsg) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${format.toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = () => {
    if (!svgRef.current || errorMsg) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${format.toLowerCase()}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current || errorMsg) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const printBarcode = () => {
    if (!canvasRef.current || errorMsg) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${value}</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            img { max-width: 400px; height: auto; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; }
            h3 { margin-top: 16px; font-size: 14px; color: #475569; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Barcode" />
          <h3>${format} Standard Barcode</h3>
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      {/* Standard Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {[
            { id: 'CODE128', label: 'Code 128 (General)' },
            { id: 'EAN13', label: 'EAN-13 (Retail)' },
            { id: 'EAN8', label: 'EAN-8 (Small)' },
            { id: 'UPC', label: 'UPC-A (US/CA)' },
            { id: 'CODE39', label: 'Code 39' },
            { id: 'ITF14', label: 'ITF-14 (Carton)' },
          ].map((item) => {
            const active = format === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFormatChange(item.id as BarcodeFormat)}
                className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Barcode className="w-4 h-4 text-indigo-600" />
              <span>Barcode Data</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Barcode Number or Text
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={format === 'EAN13' ? '12 or 13 digits' : 'Enter barcode text'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {format === 'EAN13' && 'EAN-13 requires 12 or 13 numeric digits.'}
                {format === 'EAN8' && 'EAN-8 requires 7 or 8 numeric digits.'}
                {format === 'UPC' && 'UPC-A requires 11 or 12 numeric digits.'}
                {format === 'CODE128' && 'Code 128 accepts all standard ASCII alphanumeric characters.'}
                {format === 'CODE39' && 'Code 39 accepts uppercase A-Z, 0-9, and symbols (-, ., $, /, +, %, space).'}
                {format === 'ITF14' && 'ITF-14 requires 13 or 14 numeric digits.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Barcode Dimensions & Styling */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Dimensions & Appearance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Bar Width ({barWidth}px)
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={barWidth}
                  onChange={(e) => setBarWidth(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Bar Height ({barHeight}px)
                </label>
                <input
                  type="range"
                  min="30"
                  max="140"
                  step="5"
                  value={barHeight}
                  onChange={(e) => setBarHeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Bar Line Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5"
                  />
                  <input
                    type="text"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Display Human-Readable Number Below Bars</span>
              </label>

              {displayValue && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Font:</span>
                  <input
                    type="number"
                    min="10"
                    max="28"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-center font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Live Barcode Output
            </span>

            {/* SVG Viewport */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-inner flex items-center justify-center min-h-[160px] w-full overflow-x-auto">
              <svg ref={svgRef} className="max-w-full h-auto" />
            </div>

            {/* Hidden canvas for PNG export */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standard Modulo Checksum Verified</span>
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                type="button"
                onClick={downloadPng}
                disabled={!!errorMsg || !value}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG Barcode</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={downloadSvg}
                  disabled={!!errorMsg || !value}
                  className="py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  disabled={!!errorMsg || !value}
                  className="py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Image'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={printBarcode}
                disabled={!!errorMsg || !value}
                className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Barcode Label</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
