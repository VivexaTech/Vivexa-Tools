import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export interface PhotoPreset {
  id: string;
  label: string;
  wMm: number;
  hMm: number;
  ratio: number;
}

export const PASSPORT_PRESETS: PhotoPreset[] = [
  { id: '35x45mm', label: '35 × 45 mm (Standard Passport / Schengen / India / UK)', wMm: 35, hMm: 45, ratio: 35 / 45 },
  { id: '2x2in', label: '2 × 2 Inch / 2:2 (US Visa / Passport 51 × 51 mm)', wMm: 50.8, hMm: 50.8, ratio: 1 },
  { id: '3x4ratio', label: '3 : 4 Universal ID (30 × 40 mm)', wMm: 30, hMm: 40, ratio: 3 / 4 },
  { id: '3x4in', label: '3 × 4 Inch (76.2 × 101.6 mm)', wMm: 76.2, hMm: 101.6, ratio: 3 / 4 },
  { id: '4x6in', label: '4 × 6 Inch (101.6 × 152.4 mm)', wMm: 101.6, hMm: 152.4, ratio: 4 / 6 },
];

export interface PaperSize {
  id: 'A4' | 'A5' | '4x6in';
  label: string;
  wMm: number;
  hMm: number;
}

export const PAPER_SIZES: Record<string, PaperSize> = {
  A4: { id: 'A4', label: 'A4 (210 × 297 mm)', wMm: 210, hMm: 297 },
  A5: { id: 'A5', label: 'A5 (148 × 210 mm)', wMm: 148, hMm: 210 },
  '4x6in': { id: '4x6in', label: '4 × 6 Inch Photo Paper (102 × 152 mm)', wMm: 101.6, hMm: 152.4 },
};

export interface CropSettings {
  zoom: number; // 1.0 to 3.0
  panX: number; // -50 to 50 percent
  panY: number; // -50 to 50 percent
}

export interface UploadedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  copies: number;
  crop: CropSettings;
  cachedCroppedCanvas?: HTMLCanvasElement;
}

export interface SheetLayout {
  sheetWidthMm: number;
  sheetHeightMm: number;
  photoWidthMm: number;
  photoHeightMm: number;
  cols: number;
  rows: number;
  capacityPerSheet: number;
  totalCopies: number;
  totalSheets: number;
  marginMm: number;
  spacingMm: number;
}

export function calculateSheetLayout(
  paperSizeId: string,
  orientation: 'portrait' | 'landscape',
  preset: PhotoPreset,
  marginMm: number,
  spacingMm: number,
  totalCopies: number
): SheetLayout {
  const paper = PAPER_SIZES[paperSizeId] || PAPER_SIZES.A4;
  let sheetW = orientation === 'portrait' ? paper.wMm : paper.hMm;
  let sheetH = orientation === 'portrait' ? paper.hMm : paper.wMm;

  const photoW = preset.wMm;
  const photoH = preset.hMm;

  const availW = sheetW - 2 * marginMm;
  const availH = sheetH - 2 * marginMm;

  const cols = Math.max(1, Math.floor((availW + spacingMm) / (photoW + spacingMm)));
  const rows = Math.max(1, Math.floor((availH + spacingMm) / (photoH + spacingMm)));
  const capacityPerSheet = cols * rows;
  const totalSheets = Math.max(1, Math.ceil(totalCopies / capacityPerSheet));

  return {
    sheetWidthMm: sheetW,
    sheetHeightMm: sheetH,
    photoWidthMm: photoW,
    photoHeightMm: photoH,
    cols,
    rows,
    capacityPerSheet,
    totalCopies,
    totalSheets,
    marginMm,
    spacingMm,
  };
}

/**
 * Render single cropped photograph on high-DPI canvas
 */
export async function renderCroppedPhotoCanvas(
  photo: UploadedPhoto,
  preset: PhotoPreset,
  dpi: number = 300,
  bgColor: string = '#FFFFFF'
): Promise<HTMLCanvasElement> {
  const mmToInch = 1 / 25.4;
  const targetWidthPx = Math.round(preset.wMm * mmToInch * dpi);
  const targetHeightPx = Math.round(preset.hMm * mmToInch * dpi);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidthPx;
  canvas.height = targetHeightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // Background
  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
  }

  // Load image
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image for cropping'));
    img.src = photo.previewUrl;
  });

  const { zoom, panX, panY } = photo.crop;

  // Calculate destination fit maintaining fixed aspect ratio
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const targetAspect = preset.ratio;

  let drawW = targetWidthPx;
  let drawH = targetHeightPx;

  if (imgAspect > targetAspect) {
    // Image is wider than crop box
    drawH = targetHeightPx * zoom;
    drawW = drawH * imgAspect;
  } else {
    // Image is taller than crop box
    drawW = targetWidthPx * zoom;
    drawH = drawW / imgAspect;
  }

  const offsetX = (targetWidthPx - drawW) / 2 + (panX / 100) * targetWidthPx;
  const offsetY = (targetHeightPx - drawH) / 2 + (panY / 100) * targetHeightPx;

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

  // Subtle border / cut line
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, targetWidthPx, targetHeightPx);

  return canvas;
}

/**
 * Render a complete printable sheet canvas for a specific sheet index (0-based)
 */
export async function renderPrintableSheetCanvas(
  photos: UploadedPhoto[],
  sheetIndex: number,
  layout: SheetLayout,
  preset: PhotoPreset,
  dpi: number = 300,
  bgColor: string = '#FFFFFF'
): Promise<HTMLCanvasElement> {
  const mmToInch = 1 / 25.4;
  const sheetWidthPx = Math.round(layout.sheetWidthMm * mmToInch * dpi);
  const sheetHeightPx = Math.round(layout.sheetHeightMm * mmToInch * dpi);

  const photoWidthPx = Math.round(layout.photoWidthMm * mmToInch * dpi);
  const photoHeightPx = Math.round(layout.photoHeightMm * mmToInch * dpi);

  const marginXPx = Math.round(layout.marginMm * mmToInch * dpi);
  const marginYPx = Math.round(layout.marginMm * mmToInch * dpi);
  const spacingXPx = Math.round(layout.spacingMm * mmToInch * dpi);
  const spacingYPx = Math.round(layout.spacingMm * mmToInch * dpi);

  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = sheetWidthPx;
  sheetCanvas.height = sheetHeightPx;
  const ctx = sheetCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize sheet canvas');

  // Sheet background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

  // Flatten copies array: [photo1, photo1, photo2, photo3, ...]
  const allInstances: UploadedPhoto[] = [];
  for (const p of photos) {
    for (let c = 0; c < p.copies; c++) {
      allInstances.push(p);
    }
  }

  const startIndex = sheetIndex * layout.capacityPerSheet;
  const sheetInstances = allInstances.slice(startIndex, startIndex + layout.capacityPerSheet);

  // Pre-render cropped photos cache
  const renderedCache = new Map<string, HTMLCanvasElement>();
  for (const p of photos) {
    if (!renderedCache.has(p.id)) {
      const cropped = await renderCroppedPhotoCanvas(p, preset, dpi, bgColor);
      renderedCache.set(p.id, cropped);
    }
  }

  // Draw grid
  for (let idx = 0; idx < sheetInstances.length; idx++) {
    const photo = sheetInstances[idx];
    const cropped = renderedCache.get(photo.id);
    if (!cropped) continue;

    const row = Math.floor(idx / layout.cols);
    const col = idx % layout.cols;

    const posX = marginXPx + col * (photoWidthPx + spacingXPx);
    const posY = marginYPx + row * (photoHeightPx + spacingYPx);

    ctx.drawImage(cropped, posX, posY, photoWidthPx, photoHeightPx);

    // Subtle corner crop guides for cutting
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(posX, posY, photoWidthPx, photoHeightPx);
    ctx.setLineDash([]);
  }

  // Sheet Header / Footer metadata
  ctx.fillStyle = '#64748B';
  ctx.font = `${Math.round(9 * (dpi / 72))}px sans-serif`;
  ctx.fillText(
    `Vivexa Tools Passport Sheet ${sheetIndex + 1} of ${layout.totalSheets} • Preset: ${preset.label} • 300 DPI Print Ready`,
    marginXPx,
    sheetHeightPx - Math.round(8 * mmToInch * dpi)
  );

  return sheetCanvas;
}

/**
 * Generate multi-page PDF printable sheets using pdf-lib
 */
export async function generatePrintablePdf(
  photos: UploadedPhoto[],
  layout: SheetLayout,
  preset: PhotoPreset,
  bgColor: string = '#FFFFFF'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const mmToPt = 72 / 25.4;

  const pdfWidthPt = layout.sheetWidthMm * mmToPt;
  const pdfHeightPt = layout.sheetHeightMm * mmToPt;

  for (let s = 0; s < layout.totalSheets; s++) {
    const sheetCanvas = await renderPrintableSheetCanvas(photos, s, layout, preset, 300, bgColor);
    const pngBlob = await new Promise<Blob>((resolve) => sheetCanvas.toBlob((b) => resolve(b!), 'image/png'));
    const pngArrayBuffer = await pngBlob.arrayBuffer();

    const embeddedImage = await pdfDoc.embedPng(pngArrayBuffer);
    const page = pdfDoc.addPage([pdfWidthPt, pdfHeightPt]);

    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pdfWidthPt,
      height: pdfHeightPt,
    });
  }

  return await pdfDoc.save();
}

/**
 * Export all cropped photos in a ZIP package
 */
export async function exportCroppedPhotosZip(
  photos: UploadedPhoto[],
  preset: PhotoPreset,
  dpi: number = 300,
  bgColor: string = '#FFFFFF'
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const canvas = await renderCroppedPhotoCanvas(photo, preset, dpi, bgColor);
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
    const arrayBuffer = await blob.arrayBuffer();
    const cleanName = photo.file.name.replace(/\.[^/.]+$/, '');
    zip.file(`photo_${i + 1}_${cleanName}_${preset.id}.png`, arrayBuffer);
  }

  return await zip.generateAsync({ type: 'blob' });
}
