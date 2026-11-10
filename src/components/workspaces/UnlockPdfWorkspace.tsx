'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { isEncrypted, decryptPDF } from '@pdfsmaller/pdf-decrypt';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  KeyRound,
  Info
} from 'lucide-react';

export const UnlockPdfWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [encryptionInfo, setEncryptionInfo] = useState<{
    encrypted: boolean;
    algorithm?: string;
    keyLength?: number;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [decryptedBytes, setDecryptedBytes] = useState<Uint8Array | null>(null);

  const handlePdfLoaded = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setDecryptedBytes(null);
    setPassword('');
    setIsInspecting(true);

    try {
      const buffer = new Uint8Array(await selected.arrayBuffer());
      const info = await isEncrypted(buffer);
      setEncryptionInfo(info);
      if (!info.encrypted) {
        setErrorMessage('This PDF document is not password-protected. Decryption is not required.');
      }
    } catch (err: any) {
      console.warn('Inspection note:', err);
      // Fallback: assume encrypted if PDF loading failed
      setEncryptionInfo({ encrypted: true });
    } finally {
      setIsInspecting(false);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;
    if (!password) {
      setErrorMessage('Please enter the document password to unlock.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const decrypted = await decryptPDF(buffer, password);

      // Verify that the decrypted file opens cleanly without credentials
      await PDFDocument.load(decrypted);

      setDecryptedBytes(decrypted);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Incorrect password')) {
        setErrorMessage('Incorrect password. Please verify the password and try again.');
      } else if (msg.includes('not encrypted')) {
        setErrorMessage('This PDF is already unprotected.');
      } else {
        setErrorMessage(msg || 'Failed to unlock PDF. Please check your password and file integrity.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!decryptedBytes || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(decryptedBytes, `${baseName}-unlocked.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setEncryptionInfo(null);
    setPassword('');
    setDecryptedBytes(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!file && (
        <Dropzone
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMb={100}
          onFilesSelected={handlePdfLoaded}
          label="Drop your protected PDF here"
          sublabel="Remove password restrictions locally in your browser. Supports AES-256 and RC4 encryption."
        />
      )}

      {/* Main Configuration & Unlocking Panel */}
      {file && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Header File Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm line-clamp-1">{file.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {encryptionInfo?.encrypted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <Lock className="w-3.5 h-3.5" />
                  Encrypted {encryptionInfo.algorithm ? `(${encryptionInfo.algorithm})` : ''}
                </span>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-colors"
              >
                Change File
              </button>
            </div>
          </div>

          {/* Success State */}
          {decryptedBytes ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-5">
              <div className="flex items-center gap-3 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>PDF Successfully Unlocked!</span>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed">
                All password restrictions, user permissions, and encryption layers have been permanently removed. Your new PDF can now be opened, printed, and edited freely by anyone without entering credentials.
              </p>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/70 border border-emerald-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Original Size:</span>
                  <span className="font-semibold text-slate-700">{formatBytes(file.size)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Unlocked Size:</span>
                  <span className="font-semibold text-emerald-700">{formatBytes(decryptedBytes.length)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Unlocked PDF
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Unlock Another
                </button>
              </div>

              {/* Decrypted Document Live Preview */}
              <div className="pt-2">
                <RealPdfViewer source={decryptedBytes} title={`Decrypted: ${file?.name || 'Document.pdf'}`} />
              </div>
            </div>
          ) : (
            /* Input Password Section */
            <div className="space-y-5">
              {isInspecting ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 text-slate-600 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span>Inspecting document encryption dictionary...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enter PDF Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type document password to unlock..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUnlock();
                        }}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      You must know the password set by the creator to decrypt the file. Password cracking or brute-forcing is not supported.
                    </p>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleUnlock}
                    disabled={isProcessing || !password}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Decrypting Document in Browser...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Unlock & Decrypt PDF
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Privacy & Technology Transparency Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side In-Memory Decryption</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your password and PDF content are processed exclusively within your device's browser memory using native Web Cryptography and zero-server decryption. No password or document is ever sent over the network or stored on any server.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
