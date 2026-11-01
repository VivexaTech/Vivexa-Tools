import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) throw new Error('Please select at least one PDF file to merge.');
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(/[\s,]+/);

  for (const part of parts) {
    if (!part.trim()) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pages.add(page);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export async function splitPdf(file: File, ranges: string): Promise<{ name: string; bytes: Uint8Array }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const selectedPages = parsePageRanges(ranges, totalPages);
  if (selectedPages.length === 0) {
    throw new Error('Please enter valid page numbers or ranges (e.g. 1-3, 5).');
  }

  const newPdf = await PDFDocument.create();
  // 0-indexed in pdf-lib
  const pageIndices = selectedPages.map((p) => p - 1);
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((p) => newPdf.addPage(p));

  const bytes = await newPdf.save();
  return [{ name: `extracted_pages_${ranges.replace(/[\s,]+/g, '_')}.pdf`, bytes }];
}

export async function removePdfPages(file: File, pagesToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const removeSet = new Set(pagesToRemove);
  const keepIndices: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (!removeSet.has(i)) {
      keepIndices.push(i - 1);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot remove all pages. At least one page must remain in the document.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, keepIndices);
  copiedPages.forEach((p) => newPdf.addPage(p));

  return await newPdf.save();
}

export async function extractPdfPages(file: File, pagesToExtract: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const validIndices = pagesToExtract
    .filter((p) => p >= 1 && p <= totalPages)
    .map((p) => p - 1);

  if (validIndices.length === 0) {
    throw new Error('Please select at least one valid page to extract.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, validIndices);
  copiedPages.forEach((p) => newPdf.addPage(p));

  return await newPdf.save();
}

export async function rotatePdf(
  file: File,
  rotationDegrees: number,
  scope: 'all' | 'odd' | 'even' | number[] = 'all'
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    let shouldRotate = false;

    if (scope === 'all') {
      shouldRotate = true;
    } else if (scope === 'odd' && pageNum % 2 !== 0) {
      shouldRotate = true;
    } else if (scope === 'even' && pageNum % 2 === 0) {
      shouldRotate = true;
    } else if (Array.isArray(scope) && scope.includes(pageNum)) {
      shouldRotate = true;
    }

    if (shouldRotate) {
      const page = pdfDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
    }
  }

  return await pdfDoc.save();
}

export async function addWatermarkToPdf(
  file: File,
  text: string,
  options: { opacity?: number; size?: number; angle?: number; color?: { r: number; g: number; b: number } } = {}
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const totalPages = pdfDoc.getPageCount();

  const opacity = options.opacity ?? 0.25;
  const fontSize = options.size ?? 48;
  const angle = options.angle ?? 45;
  const col = options.color ?? { r: 0.5, g: 0.5, b: 0.5 };

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - (textWidth / 2) * Math.cos((angle * Math.PI) / 180),
      y: height / 2 - (textHeight / 2) * Math.sin((angle * Math.PI) / 180),
      size: fontSize,
      font,
      color: rgb(col.r, col.g, col.b),
      opacity,
      rotate: degrees(angle)
    });
  }

  return await pdfDoc.save();
}

export interface AddPageNumbersOptions {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  fontSize?: number;
  startPage?: number;
  startNumberVal?: number;
  formatStyle?: 'number' | 'page-x' | 'page-x-of-y' | 'x-slash-y' | 'dash-x-dash';
  marginOffset?: number;
  color?: { r: number; g: number; b: number };
}

export async function addPageNumbersToPdf(
  file: File | Uint8Array,
  options: AddPageNumbersOptions = {}
): Promise<Uint8Array> {
  const arrayBuffer = file instanceof Uint8Array ? file : await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = pdfDoc.getPageCount();

  const position = options.position ?? 'bottom-center';
  const startPage = options.startPage ?? 1;
  const startNumberVal = options.startNumberVal ?? 1;
  const fontSize = options.fontSize ?? 11;
  const margin = options.marginOffset ?? 25;
  const formatStyle = options.formatStyle ?? 'page-x-of-y';
  const col = options.color ?? { r: 0.2, g: 0.2, b: 0.2 };

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    if (pageNum < startPage) {
      continue; // Skip pages before startPage (e.g. cover page)
    }

    const currentNumber = startNumberVal + (pageNum - startPage);
    let text = `${currentNumber}`;
    if (formatStyle === 'page-x-of-y') {
      text = `Page ${currentNumber} of ${totalPages}`;
    } else if (formatStyle === 'page-x') {
      text = `Page ${currentNumber}`;
    } else if (formatStyle === 'x-slash-y') {
      text = `${currentNumber} / ${totalPages}`;
    } else if (formatStyle === 'dash-x-dash') {
      text = `- ${currentNumber} -`;
    }

    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = margin;

    if (position === 'top-left') {
      x = margin;
      y = height - margin - fontSize;
    } else if (position === 'top-center') {
      x = width / 2 - textWidth / 2;
      y = height - margin - fontSize;
    } else if (position === 'top-right') {
      x = width - textWidth - margin;
      y = height - margin - fontSize;
    } else if (position === 'bottom-left') {
      x = margin;
      y = margin;
    } else if (position === 'bottom-center') {
      x = width / 2 - textWidth / 2;
      y = margin;
    } else if (position === 'bottom-right') {
      x = width - textWidth - margin;
      y = margin;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(col.r, col.g, col.b)
    });
  }

  return await pdfDoc.save();
}

export async function signPdf(
  file: File,
  signaturePngDataUrl: string,
  targetPageNum: number = 1,
  placement: { xPercent: number; yPercent: number; width?: number; height?: number } = { xPercent: 0.65, yPercent: 0.1, width: 140, height: 60 }
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const pageIdx = Math.max(0, Math.min(totalPages - 1, targetPageNum - 1));
  const page = pdfDoc.getPage(pageIdx);
  const { width: pageWidth, height: pageHeight } = page.getSize();

  // Convert dataURL to Uint8Array
  const base64Data = signaturePngDataUrl.split(',')[1];
  const signatureBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  const signatureImage = await pdfDoc.embedPng(signatureBytes);

  const sigWidth = placement.width ?? 140;
  const sigHeight = placement.height ?? 60;
  const x = pageWidth * placement.xPercent;
  const y = pageHeight * placement.yPercent;

  page.drawImage(signatureImage, {
    x,
    y,
    width: sigWidth,
    height: sigHeight
  });

  return await pdfDoc.save();
}

export async function imagesToPdf(
  images: File[],
  options: { pageSize?: 'A4' | 'fit'; margin?: number } = {}
): Promise<Uint8Array> {
  if (images.length === 0) throw new Error('Please select at least one image.');
  const pdfDoc = await PDFDocument.create();
  const pageSize = options.pageSize ?? 'A4';
  const margin = options.margin ?? 20;

  for (const imgFile of images) {
    const imgBuffer = await imgFile.arrayBuffer();
    const isPng = imgFile.type === 'image/png' || imgFile.name.toLowerCase().endsWith('.png');

    let embeddedImage;
    if (isPng) {
      embeddedImage = await pdfDoc.embedPng(imgBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imgBuffer);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let page;
    let drawWidth: number;
    let drawHeight: number;
    let x: number;
    let y: number;

    if (pageSize === 'fit') {
      page = pdfDoc.addPage([imgWidth + margin * 2, imgHeight + margin * 2]);
      drawWidth = imgWidth;
      drawHeight = imgHeight;
      x = margin;
      y = margin;
    } else {
      // Standard A4: 595.28 x 841.89 points
      const a4Width = 595.28;
      const a4Height = 841.89;
      page = pdfDoc.addPage([a4Width, a4Height]);

      const availableWidth = a4Width - margin * 2;
      const availableHeight = a4Height - margin * 2;
      const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);

      drawWidth = imgWidth * scale;
      drawHeight = imgHeight * scale;
      x = (a4Width - drawWidth) / 2;
      y = (a4Height - drawHeight) / 2;
    }

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    });
  }

  return await pdfDoc.save();
}

export async function compressPdf(file: File): Promise<{ bytes: Uint8Array; originalSize: number; newSize: number }> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();
  // Load and rewrite cross-reference table and compress objects
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const bytes = await pdfDoc.save({ useObjectStreams: true });
  return {
    bytes,
    originalSize,
    newSize: bytes.byteLength
  };
}
