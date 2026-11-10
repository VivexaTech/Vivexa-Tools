'use client';

import React from 'react';
import { ToolDefinition } from '@/types/tools';
import { PdfMergeWorkspace } from '@/components/workspaces/PdfMergeWorkspace';
import { PdfSplitWorkspace } from '@/components/workspaces/PdfSplitWorkspace';
import { PdfToolsWorkspace } from '@/components/workspaces/PdfToolsWorkspace';
import { ImageCompressorWorkspace } from '@/components/workspaces/ImageCompressorWorkspace';
import { PassportPhotoWorkspace } from '@/components/workspaces/PassportPhotoWorkspace';
import { SignatureWorkspace } from '@/components/workspaces/SignatureWorkspace';
import { ImageResizerWorkspace } from '@/components/workspaces/ImageResizerWorkspace';
import { FaviconGeneratorWorkspace } from '@/components/workspaces/FaviconGeneratorWorkspace';
import { ColorPickerWorkspace } from '@/components/workspaces/ColorPickerWorkspace';
import { AudioWorkspace } from '@/components/workspaces/AudioWorkspace';
import { VideoWorkspace } from '@/components/workspaces/VideoWorkspace';
import { OcrWorkspace } from '@/components/workspaces/OcrWorkspace';
import { AddPageNumbersWorkspace } from '@/components/workspaces/AddPageNumbersWorkspace';
import { SignPdfWorkspace } from '@/components/workspaces/SignPdfWorkspace';
import { ProtectPdfWorkspace } from '@/components/workspaces/ProtectPdfWorkspace';
import { UnlockPdfWorkspace } from '@/components/workspaces/UnlockPdfWorkspace';
import { PdfToWordWorkspace } from '@/components/workspaces/PdfToWordWorkspace';
import { WordToPdfWorkspace } from '@/components/workspaces/WordToPdfWorkspace';
import { QrCodeGeneratorWorkspace } from '@/components/workspaces/QrCodeGeneratorWorkspace';
import { QrCodeScannerWorkspace } from '@/components/workspaces/QrCodeScannerWorkspace';
import { BarcodeGeneratorWorkspace } from '@/components/workspaces/BarcodeGeneratorWorkspace';
import { BarcodeScannerWorkspace } from '@/components/workspaces/BarcodeScannerWorkspace';
import { AgeCalculatorWorkspace } from '@/components/workspaces/AgeCalculatorWorkspace';
import { EmiCalculatorWorkspace } from '@/components/workspaces/EmiCalculatorWorkspace';
import { GstCalculatorWorkspace } from '@/components/workspaces/GstCalculatorWorkspace';
import { UnitConverterWorkspace } from '@/components/workspaces/UnitConverterWorkspace';
import { CurrencyConverterWorkspace } from '@/components/workspaces/CurrencyConverterWorkspace';
import { JsonFormatterWorkspace } from '@/components/workspaces/JsonFormatterWorkspace';
import { SpeechToTextWorkspace } from '@/components/workspaces/SpeechToTextWorkspace';
import { TextToSpeechWorkspace } from '@/components/workspaces/TextToSpeechWorkspace';
import { CgpaConverterWorkspace } from '@/components/workspaces/CgpaConverterWorkspace';
import { TypingSpeedTestWorkspace } from '@/components/workspaces/TypingSpeedTestWorkspace';
import { BusinessDocumentWorkspace } from '@/components/workspaces/BusinessDocumentWorkspace';
import { IncomeExpenseTrackerWorkspace } from '@/components/workspaces/IncomeExpenseTrackerWorkspace';
import { ResumeGeneratorWorkspace } from '@/components/workspaces/ResumeGeneratorWorkspace';
import { CollageMakerWorkspace } from '@/components/workspaces/CollageMakerWorkspace';
import { DocumentDetailsExtractorWorkspace } from '@/components/workspaces/DocumentDetailsExtractorWorkspace';
import { VideoToGifWorkspace } from '@/components/workspaces/VideoToGifWorkspace';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface WorkspaceDispatcherProps {
  tool: ToolDefinition;
}

export const WorkspaceDispatcher: React.FC<WorkspaceDispatcherProps> = ({ tool }) => {
  // If tool has unsupported status or explanation limitation
  if (tool.status === 'unsupported' || tool.statusReason) {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Honest Browser-Processing Status: {tool.status.toUpperCase()}</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            {tool.statusReason ||
              'This tool requires server-based execution engines (such as native Microsoft Office or cloud GPUs) which are prohibited by our 100% zero-server privacy policy. Your files will never be uploaded.'}
          </p>
        </div>

        {/* Fallback to local processing if available */}
        {tool.category === 'pdf' ? (
          <PdfToolsWorkspace toolSlug={tool.slug} />
        ) : (
          <ImageResizerWorkspace toolSlug={tool.slug} />
        )}
      </div>
    );
  }

  // 1. PDF Tools
  if (tool.slug === 'merge-pdf') {
    return <PdfMergeWorkspace />;
  }
  if (tool.slug === 'split-pdf') {
    return <PdfSplitWorkspace />;
  }
  if (tool.slug === 'add-page-numbers') {
    return <AddPageNumbersWorkspace />;
  }
  if (tool.slug === 'sign-pdf') {
    return <SignPdfWorkspace />;
  }
  if (tool.slug === 'protect-pdf') {
    return <ProtectPdfWorkspace />;
  }
  if (tool.slug === 'unlock-pdf') {
    return <UnlockPdfWorkspace />;
  }
  if (tool.slug === 'pdf-to-word') {
    return <PdfToWordWorkspace />;
  }
  if (tool.slug === 'word-to-pdf') {
    return <WordToPdfWorkspace />;
  }
  if (tool.category === 'pdf' && (tool.slug === 'ocr-pdf' || tool.slug === 'pdf-to-markdown')) {
    return <OcrWorkspace toolSlug={tool.slug} />;
  }
  if (tool.category === 'pdf') {
    return <PdfToolsWorkspace toolSlug={tool.slug} />;
  }

  // 2. Image Tools
  if (tool.slug === 'favicon-generator') {
    return <FaviconGeneratorWorkspace />;
  }

  if (
    tool.slug === 'image-compressor' ||
    tool.slug.startsWith('compress-') ||
    tool.slug.startsWith('jpeg-to-') ||
    tool.slug.startsWith('resize-to-')
  ) {
    // Parse target KB if present in slug
    let targetKb = 50;
    const match = tool.slug.match(/(\d+)-?kb/i);
    if (match) targetKb = parseInt(match[1], 10);
    return <ImageCompressorWorkspace defaultTargetKb={targetKb} />;
  }

  if (
    tool.slug === 'passport-photo-maker' ||
    tool.slug === 'white-background-passport' ||
    tool.slug === 'red-background-passport' ||
    tool.slug === 'resize-image-3-5x4-5cm' ||
    tool.slug === 'resize-image-2x2-inch' ||
    tool.slug === 'ssc-photo' ||
    tool.slug === 'pan-card-photo' ||
    tool.slug === 'upsc-photo'
  ) {
    const isRed = tool.slug === 'red-background-passport';
    return <PassportPhotoWorkspace initialBgColor={isRed ? '#DC2626' : '#FFFFFF'} />;
  }

  if (
    tool.slug === 'generate-signature' ||
    tool.slug.startsWith('resize-signature')
  ) {
    return <SignatureWorkspace presetSlug={tool.slug} />;
  }

  if (tool.slug === 'image-to-text' || tool.slug.endsWith('-to-text')) {
    return <OcrWorkspace toolSlug={tool.slug} />;
  }

  if (
    tool.slug === 'image-resizer' ||
    tool.slug.startsWith('resize-image') ||
    tool.slug === 'crop-image' ||
    tool.slug === 'rotate-image' ||
    tool.slug === 'add-name-and-dob-on-photo' ||
    tool.slug === 'image-effects' ||
    tool.slug === 'image-converter' ||
    tool.slug === 'watermark-images'
  ) {
    return <ImageResizerWorkspace toolSlug={tool.slug} />;
  }

  // 3. Audio Tools
  if (tool.category === 'audio') {
    return <AudioWorkspace toolSlug={tool.slug} />;
  }

  // 4. Video Tools
  if (tool.slug === 'video-to-gif') {
    return <VideoToGifWorkspace />;
  }
  if (tool.category === 'video') {
    return <VideoWorkspace toolSlug={tool.slug} />;
  }

  // 5. Color Picker Tools
  if (tool.category === 'color') {
    return <ColorPickerWorkspace mode={tool.slug.includes('pdf') ? 'pdf' : 'image'} />;
  }

  // 6. QR & Barcode Tools
  if (tool.slug === 'qr-code-generator') {
    return <QrCodeGeneratorWorkspace />;
  }
  if (tool.slug === 'qr-code-scanner') {
    return <QrCodeScannerWorkspace />;
  }
  if (tool.slug === 'barcode-generator') {
    return <BarcodeGeneratorWorkspace />;
  }
  if (tool.slug === 'barcode-scanner') {
    return <BarcodeScannerWorkspace />;
  }

  // 7. Calculators & Converters
  if (tool.slug === 'age-calculator') {
    return <AgeCalculatorWorkspace />;
  }
  if (tool.slug === 'emi-calculator') {
    return <EmiCalculatorWorkspace />;
  }
  if (tool.slug === 'gst-calculator') {
    return <GstCalculatorWorkspace />;
  }
  if (tool.slug === 'unit-converter') {
    return <UnitConverterWorkspace />;
  }
  if (tool.slug === 'currency-converter') {
    return <CurrencyConverterWorkspace />;
  }

  // 8. Developer Tools
  if (tool.slug === 'json-formatter') {
    return <JsonFormatterWorkspace />;
  }

  // 9. Voice & Speech Tools
  if (tool.slug === 'speech-to-text') {
    return <SpeechToTextWorkspace />;
  }
  if (tool.slug === 'text-to-speech') {
    return <TextToSpeechWorkspace />;
  }

  // 10. Student Tools
  if (tool.slug === 'cgpa-to-percentage') {
    return <CgpaConverterWorkspace initialMode="cgpa-to-percentage" />;
  }
  if (tool.slug === 'percentage-to-cgpa') {
    return <CgpaConverterWorkspace initialMode="percentage-to-cgpa" />;
  }
  if (tool.slug === 'typing-speed-test') {
    return <TypingSpeedTestWorkspace />;
  }

  // 11. Business & Finance Tools
  if (tool.slug === 'payslip-generator') {
    return <BusinessDocumentWorkspace initialType="payslip" />;
  }
  if (tool.slug === 'invoice-generator') {
    return <BusinessDocumentWorkspace initialType="invoice" />;
  }
  if (tool.slug === 'quotation-generator') {
    return <BusinessDocumentWorkspace initialType="quotation" />;
  }
  if (tool.slug === 'receipt-generator') {
    return <BusinessDocumentWorkspace initialType="receipt" />;
  }
  if (tool.slug === 'income-expense-tracker') {
    return <IncomeExpenseTrackerWorkspace />;
  }

  // 12. Documents & Design Tools
  if (tool.slug === 'resume-generator') {
    return <ResumeGeneratorWorkspace />;
  }
  if (tool.slug === 'collage-maker') {
    return <CollageMakerWorkspace />;
  }
  if (tool.slug === 'document-details-extractor') {
    return <DocumentDetailsExtractorWorkspace />;
  }

  // Default fallback
  return <ImageResizerWorkspace toolSlug={tool.slug} />;
};
