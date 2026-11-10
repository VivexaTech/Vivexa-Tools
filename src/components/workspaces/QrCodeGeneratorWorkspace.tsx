'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Link as LinkIcon,
  FileText,
  Wifi,
  Mail,
  Phone,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export const QrCodeGeneratorWorkspace: React.FC = () => {
  const [qrType, setQrType] = useState<QrType>('url');

  // Input states
  const [url, setUrl] = useState('https://tools.vivexatech.in');
  const [text, setText] = useState('Welcome to Vivexa Tools! Fast, secure, and private browser-based utilities.');
  const [wifiSsid, setWifiSsid] = useState('Office_WiFi_5G');
  const [wifiPassword, setWifiPassword] = useState('VivexaTech@2026');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [emailTo, setEmailTo] = useState('support@vivexatech.in');
  const [emailSubject, setEmailSubject] = useState('Inquiry from Vivexa Tools');
  const [emailBody, setEmailBody] = useState('Hello Team,\n\nI would like to inquire about...');
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');

  // Customization states
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [qrSize, setQrSize] = useState<number>(360);
  const [margin, setMargin] = useState<number>(2);

  // Status & output
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute raw payload based on type
  const getRawPayload = (): string => {
    switch (qrType) {
      case 'url':
        return url.trim() || 'https://tools.vivexatech.in';
      case 'text':
        return text || '';
      case 'wifi': {
        const h = wifiHidden ? 'H:true;' : '';
        const t = wifiAuth === 'nopass' ? 'nopass' : wifiAuth;
        const p = wifiAuth === 'nopass' ? '' : `P:${wifiPassword};`;
        return `WIFI:S:${wifiSsid};T:${t};${p}${h};`;
      }
      case 'email': {
        const encSubject = encodeURIComponent(emailSubject);
        const encBody = encodeURIComponent(emailBody);
        return `mailto:${emailTo}?subject=${encSubject}&body=${encBody}`;
      }
      case 'phone':
        return `tel:${phoneNumber.replace(/\s+/g, '')}`;
      default:
        return url;
    }
  };

  useEffect(() => {
    generateQr();
  }, [qrType, url, text, wifiSsid, wifiPassword, wifiAuth, wifiHidden, emailTo, emailSubject, emailBody, phoneNumber, fgColor, bgColor, errorLevel, qrSize, margin]);

  const generateQr = async () => {
    setIsGenerating(true);
    try {
      const payload = getRawPayload();
      const options: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: errorLevel,
        margin,
        width: qrSize,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      };

      const urlData = await QRCode.toDataURL(payload, options);
      setDataUrl(urlData);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, payload, options);
      }
    } catch (err) {
      console.error('QR generation error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-vivexa-${qrType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = async () => {
    try {
      const payload = getRawPayload();
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        errorCorrectionLevel: errorLevel,
        margin,
        width: qrSize,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-vivexa-${qrType}-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export SVG', err);
    }
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 'image/png');
    } catch (err) {
      // Fallback: copy payload
      await navigator.clipboard.writeText(getRawPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const printQr = () => {
    if (!dataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - Vivexa Tools</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
            img { max-width: 320px; height: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
            h2 { margin: 16px 0 6px 0; color: #0f172a; font-size: 18px; }
            p { margin: 0; color: #64748b; font-size: 13px; font-family: monospace; word-break: break-all; max-width: 400px; }
            .brand { margin-top: 24px; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Scannable QR Code" />
          <h2>Scannable QR Code</h2>
          <p>${getRawPayload()}</p>
          <div class="brand">Generated privately via tools.vivexatech.in</div>
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
      {/* Type Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {[
            { id: 'url', label: 'Website URL', icon: LinkIcon },
            { id: 'text', label: 'Plain Text', icon: FileText },
            { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'phone', label: 'Phone', icon: Phone },
          ].map((item) => {
            const Icon = item.icon;
            const active = qrType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setQrType(item.id as QrType)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
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
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>QR Content Details</span>
            </h3>

            {/* URL Input */}
            {qrType === 'url' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Target Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Plain Text Input */}
            {qrType === 'text' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Plain Text Message
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter any text, notice, address, or serial number..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Wi-Fi Input */}
            {qrType === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyHomeWiFi"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Security Encryption
                  </label>
                  <select
                    value={wifiAuth}
                    onChange={(e) => setWifiAuth(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                    <option value="WEP">WEP (Legacy)</option>
                    <option value="nopass">No Password (Open)</option>
                  </select>
                </div>
                {wifiAuth !== 'nopass' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Wi-Fi Password
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="wifiHiddenCheck"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="wifiHiddenCheck" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    Hidden Wi-Fi SSID
                  </label>
                </div>
              </div>
            )}

            {/* Email Input */}
            {qrType === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Default Message Body
                  </label>
                  <textarea
                    rows={3}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Message..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Phone Input */}
            {qrType === 'phone' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Style & Options Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Colors & Error Correction
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Foreground (Dots) Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Error Correction Level
                </label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="L">Level L - Low (7% recovery)</option>
                  <option value="M">Level M - Medium (15% recovery)</option>
                  <option value="Q">Level Q - Quartile (25% recovery)</option>
                  <option value="H">Level H - High (30% recovery - Best for print)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Quiet Zone Margin ({margin} modules)
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Action Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Live Scannable Preview
            </span>

            {/* QR Canvas Display */}
            <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-inner flex items-center justify-center min-h-[280px] w-full max-w-[320px]">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-xs" />
            </div>

            <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Rendered</span>
            </div>

            {/* Download and Action Buttons */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                type="button"
                onClick={downloadPng}
                disabled={!dataUrl}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG Image</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={downloadSvg}
                  disabled={!dataUrl}
                  className="py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  disabled={!dataUrl}
                  className="py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Image'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={printQr}
                disabled={!dataUrl}
                className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print QR Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
