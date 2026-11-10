'use client';

import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Dropzone } from '@/components/common/Dropzone';
import { formatBytes } from '@/lib/downloads';
import { processPdfForOcr, processImageForOcrDetailed } from '@/lib/pdf/pdfOcrHelper';
import { ImageAdjustmentModal } from '@/components/common/ImageAdjustmentModal';
import { analyzeImageQuality, ImageQualityReport } from '@/lib/ocr/imageQualityAnalyzer';
import {
  DocumentCategoryType,
  DocumentType,
  ConfidenceRating,
  ExtractedField,
  ExtractedImageItem,
  AddressComponents,
  QrExtractionResult,
  OcrLineItem,
  maskAadhaarNumber,
  validateDocumentConsistency,
  parsePanCardDetails,
  parseAadhaarCardDetails,
  parseVoterIdDetails,
  parseGeneralDocumentDetails,
  extractDocumentImages,
  exportToJson,
  exportToCsv,
  exportToText,
  getConfidenceRating,
} from '@/lib/ocr/documentExtractor';
import {
  CreditCard,
  Fingerprint,
  UserCheck,
  FileText,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  Edit2,
  CheckCircle2,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  QrCode,
  PenTool,
  Image as ImageIcon,
  FolderArchive,
  Save,
  UploadCloud,
  X
} from 'lucide-react';

interface UploadedDocPage {
  id: string;
  file: File;
  previewUrl: string;
  label: string;
}

export const DocumentDetailsExtractorWorkspace: React.FC = () => {
  // Step 1: Document Selection
  const [selectedDocType, setSelectedDocType] = useState<DocumentCategoryType>('pan');

  // Step 2: Upload Mode (Single Page vs Front & Back)
  const [uploadMode, setUploadMode] = useState<'single' | 'dual'>('single');
  const [pages, setPages] = useState<UploadedDocPage[]>([]);

  // OCR Settings
  const [language, setLanguage] = useState<'eng' | 'hin' | 'eng+hin'>('eng+hin');
  const [revealAadhaar, setRevealAadhaar] = useState<boolean>(false);

  // Processing States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Results State
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [consistencyResult, setConsistencyResult] = useState<{
    isConsistent: boolean;
    detectedType: DocumentType;
    warning?: string;
  } | null>(null);

  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [addressComponents, setAddressComponents] = useState<AddressComponents | null>(null);
  const [extractedImages, setExtractedImages] = useState<ExtractedImageItem[]>([]);
  const [qrResult, setQrResult] = useState<QrExtractionResult | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [multiPassApplied, setMultiPassApplied] = useState<boolean>(false);
  const [adjustingImage, setAdjustingImage] = useState<ExtractedImageItem | null>(null);

  // UI Interactive States
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [isRawTextExpanded, setIsRawTextExpanded] = useState<boolean>(false);
  const [allCopied, setAllCopied] = useState<boolean>(false);

  // Clean object URLs on unmount
  useEffect(() => {
    return () => {
      pages.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
    };
  }, [pages]);

  // Handle file additions
  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);
    setIsCompleted(false);

    if (uploadMode === 'single') {
      const f = files[0];
      const preview = f.type.startsWith('image/') ? URL.createObjectURL(f) : '';
      setPages([
        {
          id: 'page-1',
          file: f,
          previewUrl: preview,
          label: 'Primary Document',
        },
      ]);
    } else {
      // Dual mode (Front & Back)
      const newPages: UploadedDocPage[] = files.slice(0, 2).map((f, i) => ({
        id: `page-${i + 1}`,
        file: f,
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
        label: i === 0 ? 'Front Side' : 'Back Side',
      }));
      setPages(newPages);
    }
  };

  const handleRemovePage = (id: string) => {
    const target = pages.find((p) => p.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setPages(pages.filter((p) => p.id !== id));
  };

  const resetAll = () => {
    pages.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    setPages([]);
    setIsCompleted(false);
    setIsProcessing(false);
    setErrorMsg(null);
    setConsistencyResult(null);
    setExtractedFields([]);
    setAddressComponents(null);
    setExtractedImages([]);
    setQrResult(null);
    setRawText('');
    setRevealAadhaar(false);
    setQualityReport(null);
    setMultiPassApplied(false);
    setAdjustingImage(null);
  };

  // Convert File to HTMLCanvasElement for image extraction
  const fileToCanvas = async (file: File): Promise<HTMLCanvasElement | null> => {
    if (!file.type.startsWith('image/')) return null;
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        } else {
          resolve(null);
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  };

  // Main Pipeline Execution
  const runExtraction = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setProgressPercent(5);

    try {
      // Step 1: Uploading & validating document
      setCurrentStep(1);
      setProgressStatus('Validating file integrity and format...');
      setProgressPercent(15);
      await new Promise((r) => setTimeout(r, 200));

      // Step 2: Preparing document & orientation
      setCurrentStep(2);
      setProgressStatus('Preparing high-resolution document canvas & contrast...');
      setProgressPercent(30);

      let fullExtractedText = '';
      const allLines: OcrLineItem[] = [];
      const allExtractedImages: ExtractedImageItem[] = [];
      let combinedQr: QrExtractionResult | undefined;
      let appliedMultiPass = false;

      // Process each uploaded page
      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        setProgressStatus(`Processing ${p.label} with bilingual neural OCR...`);
        setProgressPercent(35 + Math.round((i / pages.length) * 35));

        // OCR Recognition
        let pageText = '';
        if (p.file.type === 'application/pdf' || p.file.name.endsWith('.pdf')) {
          const pdfRes = await processPdfForOcr(
            p.file,
            language,
            (info) => {
              setProgressStatus(`Reading PDF page ${info.currentPage}/${info.totalPages}...`);
            },
            { enhanceContrast: true }
          );
          pageText = pdfRes.text;
        } else {
          // Pre-analyze image quality & run multi-pass OCR
          const canvas = await fileToCanvas(p.file);
          if (canvas && i === 0) {
            const quality = analyzeImageQuality(canvas);
            setQualityReport(quality);
          }

          const ocrDetailed = await processImageForOcrDetailed(
            canvas || p.file,
            language,
            (status: string) => {
              setProgressStatus(status);
            },
            { enhanceContrast: true, multiPass: true }
          );
          pageText = ocrDetailed.text;
          allLines.push(...ocrDetailed.lines);
          if (ocrDetailed.multiPassApplied) appliedMultiPass = true;
        }

        fullExtractedText += (fullExtractedText ? '\n\n' : '') + pageText;

        // Image Extraction (Photograph, Signature, QR Code)
        if (p.file.type.startsWith('image/')) {
          const canvas = await fileToCanvas(p.file);
          if (canvas) {
            const { images, qrResult } = await extractDocumentImages(canvas, selectedDocType, fullExtractedText);
            images.forEach((img) => {
              // Avoid duplicate types across front/back
              if (!allExtractedImages.some((existing) => existing.type === img.type)) {
                allExtractedImages.push(img);
              }
            });
            if (qrResult?.detected && !combinedQr?.detected) {
              combinedQr = qrResult;
            }
          }
        }
      }

      setMultiPassApplied(appliedMultiPass);

      if (!fullExtractedText.trim()) {
        throw new Error(
          'No readable text could be recognized. Ensure the photo is clear, well-lit, and not heavily blurred or obstructed.'
        );
      }

      // Step 3: Consistency Check
      setCurrentStep(4);
      setProgressStatus('Checking document consistency & structure...');
      setProgressPercent(80);

      const consistency = validateDocumentConsistency(selectedDocType, fullExtractedText);
      setConsistencyResult(consistency);

      // Step 4: Specialized Document Parsing with Spatial Layout & Lines
      setProgressStatus('Extracting personal, identification, and address fields...');
      setProgressPercent(90);

      let parsedFields: ExtractedField[] = [];
      let parsedAddress: AddressComponents | null = null;

      if (selectedDocType === 'pan') {
        parsedFields = parsePanCardDetails(fullExtractedText, allLines);
      } else if (selectedDocType === 'aadhaar') {
        const aadhaarRes = parseAadhaarCardDetails(fullExtractedText, allLines);
        parsedFields = aadhaarRes.fields;
        parsedAddress = aadhaarRes.addressComponents;
      } else if (selectedDocType === 'voter_id') {
        parsedFields = parseVoterIdDetails(fullExtractedText, allLines);
      } else {
        parsedFields = parseGeneralDocumentDetails(fullExtractedText);
      }

      // Step 5: Finalizing
      setCurrentStep(6);
      setProgressStatus('Finalizing results dashboard...');
      setProgressPercent(100);

      setRawText(fullExtractedText);
      setExtractedFields(parsedFields);
      setAddressComponents(parsedAddress);
      setExtractedImages(allExtractedImages);
      setQrResult(combinedQr || null);
      setIsCompleted(true);
    } catch (err: any) {
      console.error('Document extraction error', err);
      setErrorMsg(
        err.message ||
          'Failed to process document. Please ensure the file is an undamaged image or PDF.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Field inline edit handlers
  const handleStartEdit = (field: ExtractedField) => {
    setEditingKey(field.key);
    setEditingValue(field.value);
  };

  const handleSaveEdit = (key: string) => {
    setExtractedFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value: editingValue } : f))
    );
    setEditingKey(null);
  };

  const handleCopyField = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = async () => {
    const textReport = exportToText(extractedFields, selectedDocType, {
      maskSensitive: !revealAadhaar,
    });
    await navigator.clipboard.writeText(textReport);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = exportToJson(extractedFields, selectedDocType, {
      maskSensitive: !revealAadhaar,
    });
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocType}-extracted-details-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    const txtStr = exportToText(extractedFields, selectedDocType, {
      maskSensitive: !revealAadhaar,
    });
    const blob = new Blob([txtStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocType}-details-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const csvStr = exportToCsv(extractedFields);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocType}-details-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllImagesZip = async () => {
    if (extractedImages.length === 0) return;
    const zip = new JSZip();

    extractedImages.forEach((img) => {
      const base64Data = img.dataUrl.split(',')[1];
      zip.file(`${selectedDocType}-${img.type}.png`, base64Data, { base64: true });
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocType}-extracted-images-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group fields into Sections
  const personalFields = extractedFields.filter((f) => f.category === 'personal');
  const idFields = extractedFields.filter((f) => f.category === 'identification');
  const addressFields = extractedFields.filter((f) => f.category === 'address');
  const otherFields = extractedFields.filter(
    (f) => !['personal', 'identification', 'address'].includes(f.category || '')
  );

  return (
    <div className="space-y-8">
      {/* Privacy Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="leading-relaxed">
            <strong>100% In-Browser Privacy:</strong> Your sensitive identity cards (PAN, Aadhaar, Voter ID) are processed strictly inside your local device memory using client-side WebAssembly. Zero files are uploaded or stored.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-300 bg-white/60 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Server Uploads</span>
        </div>
      </div>

      {/* STEP 1: DOCUMENT TYPE SELECTION CARDS */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-900 dark:text-white">
          Which document would you like to extract details from?
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select the document type to enable optimized layout detection, multilingual fields, and photo/signature extraction.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {[
            {
              id: 'pan',
              name: 'PAN Card',
              desc: 'Permanent Account Number issued by Income Tax Department',
              icon: CreditCard,
              badges: ['Name & Father Name', 'DOB', 'Photo & Signature', 'QR Code'],
              color: 'indigo',
            },
            {
              id: 'aadhaar',
              name: 'Aadhaar Card',
              desc: '12-digit Unique Identification Number issued by UIDAI',
              icon: Fingerprint,
              badges: ['English & Hindi', 'DOB / YOB', 'Address Breakdown', 'QR Code'],
              color: 'blue',
            },
            {
              id: 'voter_id',
              name: 'Voter ID Card',
              desc: "Elector's Photo Identity Card (EPIC) issued by Election Commission",
              icon: UserCheck,
              badges: ['EPIC Number', 'Elector & Relative', 'DOB / Age', 'Photo'],
              color: 'emerald',
            },
            {
              id: 'general',
              name: 'Other Documents',
              desc: 'General-purpose OCR for multi-page PDFs, bills, and certificates',
              icon: FileText,
              badges: ['Multi-Page PDF', 'Paragraphs', 'Editable Text', 'Universal OCR'],
              color: 'purple',
            },
          ].map((card) => {
            const Icon = card.icon;
            const isSelected = selectedDocType === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setSelectedDocType(card.id as DocumentCategoryType);
                  if (isCompleted) resetAll();
                }}
                className={`relative flex flex-col justify-between text-left p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                        isSelected
                          ? 'bg-indigo-600 text-white scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {card.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {card.badges.slice(0, 2).map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: DOCUMENT UPLOAD & SETTINGS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Document Upload & Pages</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload clear JPG, PNG, WEBP, or PDF documents (max 50 MB)
            </p>
          </div>

          {/* Single vs Dual Page Switcher */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setUploadMode('single');
                if (pages.length > 1) setPages([pages[0]]);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                uploadMode === 'single'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Single Page
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('dual')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                uploadMode === 'dual'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Front & Back Pages
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        {pages.length === 0 ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            multiple={uploadMode === 'dual'}
            label={
              uploadMode === 'dual'
                ? 'Drop Front & Back photos or PDF (Select up to 2 files)'
                : `Drop your ${selectedDocType === 'pan' ? 'PAN Card' : selectedDocType === 'aadhaar' ? 'Aadhaar Card' : selectedDocType === 'voter_id' ? 'Voter ID' : 'Document'} image or PDF`
            }
            sublabel="Processed 100% locally on your machine. Complete privacy guaranteed."
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pages.map((p, idx) => (
                <div
                  key={p.id}
                  className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3.5"
                >
                  {p.previewUrl ? (
                    <img
                      src={p.previewUrl}
                      alt={p.label}
                      className="w-16 h-16 rounded-xl object-contain bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      {p.label}
                    </span>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {p.file.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatBytes(p.file.size)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePage(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {uploadMode === 'dual' && pages.length < 2 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                <span>Upload the Back Side of your document for complete address and QR code extraction.</span>
                <label className="px-3 py-1 bg-white dark:bg-slate-800 border border-amber-300 rounded-xl font-semibold cursor-pointer text-amber-900 dark:text-amber-100 hover:bg-amber-50">
                  Add Back Side
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFilesSelected([e.target.files[0]]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* OCR Language & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">OCR Language:</span>
            <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs">
              {[
                { id: 'eng+hin', label: 'Bilingual (English + Hindi)' },
                { id: 'eng', label: 'English Only' },
                { id: 'hin', label: 'Hindi Only (हिंदी)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLanguage(opt.id as any)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    language === opt.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pages.length > 0 && (
              <button
                type="button"
                onClick={resetAll}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={runExtraction}
              disabled={pages.length === 0 || isProcessing}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{progressStatus || 'Extracting...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Document Information</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PROCESSING PROGRESS */}
      {isProcessing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-sm animate-in fade-in">
          <Loader2 className="w-9 h-9 text-indigo-600 animate-spin mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {progressStatus}
          </h4>
          <p className="text-xs text-slate-400">
            Running local Tesseract neural net with image deskewing and layout segmentation.
          </p>
          <div className="w-64 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* CONSISTENCY WARNING BANNER */}
      {isCompleted && consistencyResult && !consistencyResult.isConsistent && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Document Consistency Notice:</strong>
            <p className="mt-0.5 leading-relaxed">{consistencyResult.warning}</p>
          </div>
        </div>
      )}

      {/* IMAGE QUALITY ADVISORY BANNER */}
      {isCompleted && qualityReport && qualityReport.recommendations.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Document Clarity Advisory:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
              {qualityReport.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
            {multiPassApplied && (
              <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 mt-1">
                ✓ Multi-pass OCR automatically isolated the card boundary and enhanced character contrast.
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: PROFESSIONAL RESULTS DASHBOARD */}
      {isCompleted && !isProcessing && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Global Results Header & Action Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {selectedDocType.toUpperCase().replace('_', ' ')} DETAILS
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Extraction Complete</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Click any field to edit typos before exporting. All data is processed client-side.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {allCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{allCopied ? 'Copied All!' : 'Copy All Details'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>TXT</span>
              </button>
            </div>
          </div>

          {/* SECTION A & B: Identification & Personal Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Identification Details Card */}
              {idFields.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-500">
                    Section 1: Identification Details
                  </h4>

                  <div className="space-y-3">
                    {idFields.map((field) => {
                      const rating = field.confidenceRating || getConfidenceRating(field.confidence);
                      const isAadhaar = selectedDocType === 'aadhaar';
                      const displayVal =
                        isAadhaar && !revealAadhaar && field.maskedValue
                          ? field.maskedValue
                          : field.value;

                      return (
                        <div
                          key={field.key}
                          className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 block mb-0.5">
                              {field.label}
                            </span>
                            <div className="text-lg font-mono font-black text-slate-900 dark:text-white tracking-wide">
                              {displayVal}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isAadhaar && (
                              <button
                                type="button"
                                onClick={() => setRevealAadhaar(!revealAadhaar)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                {revealAadhaar ? (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Mask</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Reveal</span>
                                  </>
                                )}
                              </button>
                            )}

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                rating === 'high'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : rating === 'medium'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : rating === 'needs_review'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {rating === 'needs_review' ? 'Needs Review' : rating}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleCopyField(field.key, displayVal)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800"
                              title="Copy"
                            >
                              {copiedField === field.key ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Personal Information Table Card */}
              {personalFields.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-500">
                    Section 2: Personal Information
                  </h4>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {personalFields.map((field) => {
                      const rating = field.confidenceRating || getConfidenceRating(field.confidence);
                      const isEditing = editingKey === field.key;

                      return (
                        <div
                          key={field.key}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="sm:w-1/3">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {field.label}
                            </span>
                          </div>

                          <div className="flex-1">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  className="w-full px-2.5 py-1 rounded-lg border border-indigo-500 text-xs font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(field.key)}
                                  className="p-1 text-emerald-600"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingKey(null)}
                                  className="p-1 text-slate-400"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {field.value}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                rating === 'high'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : rating === 'medium'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                  : rating === 'needs_review'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {rating === 'needs_review' ? 'Needs Review' : rating}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(field)}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Edit value"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyField(field.key, field.value)}
                              className="p-1 text-slate-400 hover:text-indigo-600"
                              title="Copy"
                            >
                              {copiedField === field.key ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION C: Address Details (Aadhaar Only) */}
              {selectedDocType === 'aadhaar' && addressFields.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-500">
                    Section 3: Address Information
                  </h4>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {addressFields.map((field) => (
                      <div
                        key={field.key}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <span className="sm:w-1/3 text-xs font-semibold text-slate-500">
                          {field.label}
                        </span>
                        <div className="flex-1 text-xs font-medium text-slate-900 dark:text-white">
                          {field.value}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyField(field.key, field.value)}
                          className="p-1 text-slate-400 hover:text-indigo-600"
                        >
                          {copiedField === field.key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION D: Extracted Images (Photo, Signature, QR Code) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-500">
                    Extracted Images ({extractedImages.length})
                  </h4>

                  {extractedImages.length > 1 && (
                    <button
                      type="button"
                      onClick={handleDownloadAllImagesZip}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FolderArchive className="w-3.5 h-3.5" />
                      <span>ZIP Archive</span>
                    </button>
                  )}
                </div>

                {extractedImages.length > 0 ? (
                  <div className="space-y-4">
                    {extractedImages.map((img) => (
                      <div
                        key={img.id}
                        className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2.5"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {img.label}
                          </span>
                          {img.isAdjusted && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Adjusted
                            </span>
                          )}
                        </div>

                        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-h-36 flex items-center justify-center">
                          <img
                            src={img.dataUrl}
                            alt={img.label}
                            className="max-h-28 object-contain rounded-lg"
                          />
                        </div>

                        <div className="flex gap-2 w-full pt-1">
                          <button
                            type="button"
                            onClick={() => setAdjustingImage(img)}
                            className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Sliders className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            <span>Adjust / Crop</span>
                          </button>

                          <a
                            href={img.dataUrl}
                            download={`${selectedDocType}-${img.type}-${Date.now()}.png`}
                            className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No separate photo/signature regions detected in uploaded document.
                  </div>
                )}
              </div>

              {/* QR Code Decoded Data Box */}
              {qrResult?.detected && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <QrCode className="w-4 h-4" />
                    <span>Decoded QR Code Data</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono break-all max-h-40 overflow-y-auto text-slate-800 dark:text-slate-200">
                    {qrResult.qrData}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    {qrResult.verificationNotice}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION E: Complete Raw Recognized Text (Collapsible) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div
              onClick={() => setIsRawTextExpanded(!isRawTextExpanded)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Complete OCR Text Transcript ({rawText.length} characters)</span>
              </h4>
              <button type="button" className="text-slate-400">
                {isRawTextExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isRawTextExpanded && (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white leading-relaxed"
                />
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Editable: Adjust text transcript directly if needed.</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(rawText);
                      setAllCopied(true);
                      setTimeout(() => setAllCopied(false), 2000);
                    }}
                    className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Copy Transcript
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMAGE ADJUSTMENT MODAL */}
      {adjustingImage && (
        <ImageAdjustmentModal
          isOpen={!!adjustingImage}
          onClose={() => setAdjustingImage(null)}
          title={`Adjust ${adjustingImage.label}`}
          imageType={adjustingImage.type}
          originalDataUrl={adjustingImage.dataUrl}
          onSave={(adjustedUrl) => {
            setExtractedImages((prev) =>
              prev.map((it) =>
                it.id === adjustingImage.id
                  ? { ...it, dataUrl: adjustedUrl, isAdjusted: true }
                  : it
              )
            );
          }}
        />
      )}
    </div>
  );
};
