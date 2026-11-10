'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { isEncrypted } from '@pdfsmaller/pdf-decrypt';
import { downloadBlob, formatBytes } from '@/lib/downloads';
import { getPdfPageCount } from '@/lib/pdf/pdfProcessing';
import { RealPdfViewer } from '@/components/pdf/RealPdfViewer';
import { 
  Lock, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff,
  FileText
} from 'lucide-react';

export const ProtectPdfWorkspace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [algorithm, setAlgorithm] = useState<'AES-256' | 'RC4'>('AES-256');

  // Permissions
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowModifying, setAllowModifying] = useState(false);

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [protectedBytes, setProtectedBytes] = useState<Uint8Array | null>(null);
  const [verifiedEncryption, setVerifiedEncryption] = useState<any>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setProtectedBytes(null);
    setVerifiedEncryption(null);

    try {
      const buffer = await selected.arrayBuffer();
      const encCheck = await isEncrypted(new Uint8Array(buffer));
      if (encCheck.encrypted) {
        setErrorMessage('This PDF document is already password-protected. Please unlock it first.');
        return;
      }
      const count = await getPdfPageCount(selected);
      setPageCount(count);
    } catch (err: any) {
      setErrorMessage('Could not load PDF document. Please verify the file is not corrupted.');
    }
  };

  const handleProtect = async () => {
    if (!file) return;

    if (!password.trim()) {
      setErrorMessage('Please enter a password to protect your PDF.');
      return;
    }
    if (password.length < 3) {
      setErrorMessage('Password must be at least 3 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const buffer = await file.arrayBuffer();
      const rawBytes = new Uint8Array(buffer);

      // Apply genuine client-side AES-256 or RC4 PDF encryption
      const encrypted = await encryptPDF(rawBytes, password, {
        algorithm,
        allowPrinting,
        allowCopying,
        allowModifying
      });

      // Independently verify that the resulting buffer is genuinely encrypted
      const check = await isEncrypted(encrypted);
      if (!check.encrypted) {
        throw new Error('Verification failed: exported buffer was not encrypted.');
      }

      setProtectedBytes(encrypted);
      setVerifiedEncryption(check);
    } catch (err: any) {
      setErrorMessage(err.message || 'Encryption failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!protectedBytes || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || 'document';
    downloadBlob(protectedBytes, `${base}_protected.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setProtectedBytes(null);
    setVerifiedEncryption(null);
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
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMb={60}
          label="Select or drop PDF to password-protect"
          sublabel="Genuine AES-256 client-side encryption. Document cannot be opened without your password."
        />
      ) : (
        <div className="space-y-6">
          {/* File Selected Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {pageCount} {pageCount === 1 ? 'page' : 'pages'} • {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Change PDF
            </button>
          </div>

          {/* Encryption Settings Panel */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-5">
            {/* Password Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Set Document Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong password..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Encryption Algorithm Selection */}
            <div className="pt-3 border-t border-slate-200/60">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Encryption Cipher Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAlgorithm('AES-256')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    algorithm === 'AES-256'
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-800">AES-256 (Recommended)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Military-grade 256-bit encryption. Supported by modern PDF readers.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setAlgorithm('RC4')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    algorithm === 'RC4'
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-800">RC4 (128-bit Legacy)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Compatible with older Adobe Acrobat 5.0+ and legacy software.
                  </p>
                </button>
              </div>
            </div>

            {/* Permission Toggles */}
            <div className="pt-3 border-t border-slate-200/60 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Document Permissions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={allowPrinting}
                    onChange={(e) => setAllowPrinting(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                  <span>Allow Printing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={allowCopying}
                    onChange={(e) => setAllowCopying(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                  <span>Allow Text Copying</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={allowModifying}
                    onChange={(e) => setAllowModifying(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                  <span>Allow Modifying</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Trigger / Result */}
          {!protectedBytes ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleProtect}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Encrypting with {algorithm}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Encrypt &amp; Protect PDF</span>
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
                      PDF Document Encrypted Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Standard: {verifiedEncryption?.algorithm} ({verifiedEncryption?.keyLength}-bit cipher) • File: {formatBytes(protectedBytes.byteLength)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    Password Protected
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-100 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Security Verification:</p>
                <p>
                  This document has been verified with genuine PDF encryption dictionaries. Any standard PDF viewer (Adobe Acrobat, Chrome, Preview, Edge) will require the password before displaying pages.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProtectedBytes(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Protected PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Real PDF Preview of original file */}
          {file && !protectedBytes && (
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                Document Page Preview:
              </span>
              <RealPdfViewer source={file} title={file.name} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
