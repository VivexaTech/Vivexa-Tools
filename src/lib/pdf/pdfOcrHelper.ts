import { createWorker } from 'tesseract.js';

export interface OcrProgressInfo {
  currentPage: number;
  totalPages: number;
  pageStatus: string;
  percent: number;
}

export type OcrErrorType =
  | 'PDF_LOAD_FAILED'
  | 'PDF_PASSWORD_PROTECTED'
  | 'PDF_RENDER_FAILED'
  | 'OCR_WORKER_FAILED'
  | 'NO_TEXT_DETECTED'
  | 'UNSUPPORTED_FORMAT'
  | 'MEMORY_LIMIT';

export interface OcrPageItem {
  pageNumber: number;
  text: string;
  method: 'direct_text' | 'ocr';
  hasText: boolean;
  error?: string;
}

export interface OcrResult {
  text: string;
  pages: OcrPageItem[];
  totalPages: number;
  pagesExtracted: number;
  method: 'direct_text' | 'optical_character_recognition' | 'hybrid';
}

/**
 * Configure PDF.js worker source safely in browser environment
 */
export async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '6.4.299'}/build/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

/**
 * Image preprocessing on HTML5 Canvas to dramatically improve OCR accuracy on scanned/low-contrast documents.
 * Applies grayscale transformation, contrast stretching, and thresholding.
 */
export function preprocessCanvasForOcr(
  sourceCanvas: HTMLCanvasElement,
  options: { enhanceContrast?: boolean; binarize?: boolean } = {}
): HTMLCanvasElement {
  const enhanceContrast = options.enhanceContrast ?? true;
  const binarize = options.binarize ?? false;

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = sourceCanvas.width;
  targetCanvas.height = sourceCanvas.height;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const data = imgData.data;
  const len = data.length;

  // 1. Convert to grayscale & compute histogram for contrast stretching
  let minVal = 255;
  let maxVal = 0;
  const grays = new Uint8Array(len / 4);

  for (let i = 0, j = 0; i < len; i += 4, j++) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard perceptual luminance weights
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    grays[j] = gray;
    if (gray < minVal) minVal = gray;
    if (gray > maxVal) maxVal = gray;
  }

  const range = maxVal - minVal || 1;

  // 2. Apply contrast stretching and optional binarization
  for (let i = 0, j = 0; i < len; i += 4, j++) {
    let val = grays[j];

    if (enhanceContrast && range < 200) {
      // Stretch dynamic range to maximize separation between ink and paper
      val = Math.round(((val - minVal) / range) * 255);
    }

    if (binarize) {
      // Otsu-approximated midpoint thresholding
      val = val < 140 ? 0 : 255;
    }

    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }

  ctx.putImageData(imgData, 0, 0);
  return targetCanvas;
}

/**
 * Enhanced Hybrid PDF OCR Pipeline:
 * - Checks each individual page for native selectable text.
 * - Extracts digital text instantly when available (100% fidelity).
 * - For scanned pages, renders at 2.25x high resolution, applies contrast preprocessing, and runs Tesseract OCR.
 * - Supports English, Hindi, and English + Hindi mixed models.
 */
export async function processPdfForOcr(
  file: File,
  language: string = 'eng',
  onProgress?: (info: OcrProgressInfo) => void,
  options: { enhanceContrast?: boolean } = {}
): Promise<OcrResult> {
  const pdfjs = await getPdfJs();

  let pdfDoc;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    } as any);
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (err.name === 'PasswordException' || err.message?.includes('password')) {
      const e = new Error('This PDF is password-protected. Please unlock the file before running OCR.');
      (e as any).code = 'PDF_PASSWORD_PROTECTED';
      throw e;
    }
    const e = new Error('Could not open PDF file. The file may be corrupt or invalid.');
    (e as any).code = 'PDF_LOAD_FAILED';
    throw e;
  }

  const totalPages = pdfDoc.numPages;
  if (totalPages === 0) {
    const e = new Error('PDF document has zero pages.');
    (e as any).code = 'NO_TEXT_DETECTED';
    throw e;
  }

  const pageResults: OcrPageItem[] = [];
  let worker: any = null;
  let ocrUsed = false;
  let directUsed = false;

  try {
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages,
          pageStatus: `Analyzing page ${pageNum} of ${totalPages}...`,
          percent: Math.round(((pageNum - 0.7) / totalPages) * 100),
        });
      }

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const directText = (textContent.items as any[])
        .map((it: any) => it.str)
        .join(' ')
        .trim();

      // If page contains meaningful selectable text (>= 20 characters), use direct extraction
      if (directText.length >= 20) {
        directUsed = true;
        pageResults.push({
          pageNumber: pageNum,
          text: directText,
          method: 'direct_text',
          hasText: true,
        });
        continue;
      }

      // Page is scanned or has no selectable text -> use high-resolution OCR
      ocrUsed = true;

      // Lazy-load worker if not already created
      if (!worker) {
        if (onProgress) {
          onProgress({
            currentPage: pageNum,
            totalPages,
            pageStatus: `Initializing ${language.toUpperCase()} OCR neural model...`,
            percent: Math.round(((pageNum - 0.5) / totalPages) * 100),
          });
        }
        worker = await createWorker(language);
      }

      // Render at 2.25x high resolution for optimal character recognition (approx 250-300 DPI)
      const viewport = page.getViewport({ scale: 2.25 });
      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = viewport.width;
      rawCanvas.height = viewport.height;
      const ctx = rawCanvas.getContext('2d');

      if (!ctx) {
        throw new Error(`Failed to initialize 2D canvas context for page ${pageNum}`);
      }

      await (page.render as any)({
        canvasContext: ctx,
        viewport,
        canvas: rawCanvas,
      }).promise;

      // Apply contrast enhancement & background cleanup
      const processedCanvas = preprocessCanvasForOcr(rawCanvas, {
        enhanceContrast: options.enhanceContrast ?? true,
      });

      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages,
          pageStatus: `Recognizing text on page ${pageNum} of ${totalPages} (${language.toUpperCase()})...`,
          percent: Math.round((pageNum / totalPages) * 100),
        });
      }

      const ret = await worker.recognize(processedCanvas);
      const recognized = ret.data.text?.trim() || '';

      pageResults.push({
        pageNumber: pageNum,
        text: recognized,
        method: 'ocr',
        hasText: recognized.length > 0,
      });

      // Free canvas memory
      rawCanvas.width = 1;
      rawCanvas.height = 1;
      processedCanvas.width = 1;
      processedCanvas.height = 1;
    }
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }

  // Format combined text output
  const pageSections = pageResults
    .filter((p) => p.text)
    .map((p) => `--- PAGE ${p.pageNumber} (${p.method === 'direct_text' ? 'Digital Stream' : 'OCR Recognition'}) ---\n\n${p.text}`);

  const combinedText = pageSections.join('\n\n');

  if (!combinedText.trim()) {
    const e = new Error('No readable text could be recognized. Ensure the document is sharp, right-side up, and has readable contrast.');
    (e as any).code = 'NO_TEXT_DETECTED';
    throw e;
  }

  let finalMethod: 'direct_text' | 'optical_character_recognition' | 'hybrid' = 'direct_text';
  if (ocrUsed && directUsed) finalMethod = 'hybrid';
  else if (ocrUsed) finalMethod = 'optical_character_recognition';

  return {
    text: combinedText,
    pages: pageResults,
    totalPages,
    pagesExtracted: pageResults.filter((p) => p.hasText).length,
    method: finalMethod,
  };
}

export interface ImageOcrDetailedResult {
  text: string;
  lines: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
  meanConfidence: number;
  multiPassApplied: boolean;
}

/**
 * Recognize single image with multi-pass preprocessing, card-boundary detection, and spatial layout extraction.
 */
export async function processImageForOcrDetailed(
  imageSource: File | HTMLCanvasElement,
  language: string = 'eng',
  onProgress?: (status: string, percent: number) => void,
  options: { enhanceContrast?: boolean; multiPass?: boolean } = {}
): Promise<ImageOcrDetailedResult> {
  if (onProgress) onProgress(`Loading ${language.toUpperCase()} OCR neural model...`, 15);

  const worker = await createWorker(language);

  try {
    let sourceCanvas: HTMLCanvasElement;

    if (imageSource instanceof HTMLCanvasElement) {
      sourceCanvas = imageSource;
    } else {
      const img = new Image();
      const url = URL.createObjectURL(imageSource);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image file for OCR.'));
        img.src = url;
      });
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context.');
      ctx.drawImage(img, 0, 0);
      sourceCanvas = canvas;
    }

    // Pass 1: Global Preprocessed Pass
    const processedCanvas = preprocessCanvasForOcr(sourceCanvas, options);

    if (onProgress) onProgress('Pass 1: Analyzing global document layout & character patterns...', 45);

    const ret1 = await worker.recognize(processedCanvas, {}, { blocks: true });
    let text1 = ret1.data.text?.trim() || '';

    const lines1: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> = [];
    if (ret1.data.blocks) {
      for (const b of ret1.data.blocks) {
        for (const p of b.paragraphs) {
          for (const l of p.lines) {
            if (l.text.trim()) {
              lines1.push({
                text: l.text.trim(),
                confidence: Math.round(l.confidence),
                bbox: l.bbox,
              });
            }
          }
        }
      }
    }

    // Step: Detect if card is framed by background (desk/hands)
    let minX = sourceCanvas.width;
    let minY = sourceCanvas.height;
    let maxX = 0;
    let maxY = 0;
    let keywordHits = 0;

    for (const l of lines1) {
      const upper = l.text.toUpperCase();
      if (
        upper.includes('INCOME TAX') ||
        upper.includes('GOVT') ||
        upper.includes('ACCOUNT') ||
        upper.includes('PERMANENT') ||
        upper.includes('AADHAAR') ||
        upper.includes('UNIQUE IDENTIFICATION') ||
        upper.includes('AUTHORITY') ||
        upper.includes('ELECTION COMMISSION') ||
        upper.includes('ELECTORAL') ||
        upper.includes('भारत') ||
        upper.includes('सरकार') ||
        upper.includes('विभाग') ||
        /\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(upper) ||
        /\b\d{4}\s\d{4}\s\d{4}\b/.test(l.text)
      ) {
        keywordHits++;
        minX = Math.min(minX, l.bbox.x0);
        minY = Math.min(minY, l.bbox.y0);
        maxX = Math.max(maxX, l.bbox.x1);
        maxY = Math.max(maxY, l.bbox.y1);
      }
    }

    const cardBoxWidth = maxX - minX;
    const cardBoxHeight = maxY - minY;
    const isFramedOnBackground =
      keywordHits >= 2 &&
      cardBoxWidth > 150 &&
      cardBoxHeight > 100 &&
      (cardBoxWidth < sourceCanvas.width * 0.88 || cardBoxHeight < sourceCanvas.height * 0.88);

    // Pass 2: If card is framed on background, run localized high-resolution Pass
    if (options.multiPass !== false && isFramedOnBackground) {
      if (onProgress) onProgress('Pass 2: Running high-resolution card-region enhancement...', 75);

      const padX = Math.round(cardBoxWidth * 0.12);
      const padY = Math.round(cardBoxHeight * 0.15);
      const cropX = Math.max(0, minX - padX);
      const cropY = Math.max(0, minY - padY);
      const cropW = Math.min(sourceCanvas.width - cropX, cardBoxWidth + padX * 2);
      const cropH = Math.min(sourceCanvas.height - cropY, cardBoxHeight + padY * 2);

      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = cropW * 2; // 2x upscale
      cardCanvas.height = cropH * 2;
      const cardCtx = cardCanvas.getContext('2d');
      if (cardCtx) {
        cardCtx.imageSmoothingEnabled = true;
        cardCtx.imageSmoothingQuality = 'high';
        cardCtx.drawImage(sourceCanvas, cropX, cropY, cropW, cropH, 0, 0, cardCanvas.width, cardCanvas.height);

        const cardProcessed = preprocessCanvasForOcr(cardCanvas, { enhanceContrast: true });
        const ret2 = await worker.recognize(cardProcessed, {}, { blocks: true });
        const text2 = ret2.data.text?.trim() || '';

        if (text2 && ret2.data.confidence >= ret1.data.confidence - 10) {
          const lines2: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> = [];
          if (ret2.data.blocks) {
            for (const b of ret2.data.blocks) {
              for (const p of b.paragraphs) {
                for (const l of p.lines) {
                  if (l.text.trim()) {
                    lines2.push({
                      text: l.text.trim(),
                      confidence: Math.round(l.confidence),
                      bbox: l.bbox,
                    });
                  }
                }
              }
            }
          }

          return {
            text: text2,
            lines: lines2,
            meanConfidence: Math.round(ret2.data.confidence),
            multiPassApplied: true,
          };
        }
      }
    }

    return {
      text: text1,
      lines: lines1,
      meanConfidence: Math.round(ret1.data.confidence),
      multiPassApplied: false,
    };
  } finally {
    await worker.terminate();
  }
}

/**
 * Recognize single image with preprocessing and multi-language support.
 */
export async function processImageForOcr(
  imageSource: File | HTMLCanvasElement,
  language: string = 'eng',
  onProgress?: (status: string, percent: number) => void,
  options: { enhanceContrast?: boolean } = {}
): Promise<string> {
  const result = await processImageForOcrDetailed(imageSource, language, onProgress, options);
  return result.text;
}
