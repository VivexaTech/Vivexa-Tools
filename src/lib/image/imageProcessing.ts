export interface ResizeOptions {
  width?: number;
  height?: number;
  unit?: 'px' | 'cm' | 'mm' | 'in';
  dpi?: number;
  maintainAspectRatio?: boolean;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let url = '';
    if (typeof source === 'string') {
      url = source;
    } else {
      url = URL.createObjectURL(source);
    }

    img.onload = () => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(url);
      }
      resolve(img);
    };

    img.onerror = (e) => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(url);
      }
      reject(new Error('Failed to load image. The format may be corrupted or unsupported.'));
    };

    img.src = url;
  });
}

export function convertUnitsToPixels(val: number, unit: 'px' | 'cm' | 'mm' | 'in', dpi: number = 300): number {
  if (unit === 'px') return Math.round(val);
  if (unit === 'in') return Math.round(val * dpi);
  if (unit === 'cm') return Math.round((val / 2.54) * dpi);
  if (unit === 'mm') return Math.round((val / 25.4) * dpi);
  return Math.round(val);
}

export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<{ blob: Blob; width: number; height: number; size: number }> {
  const img = await loadImage(file);
  const dpi = options.dpi ?? 300;
  const unit = options.unit ?? 'px';

  let targetWidth = options.width ? convertUnitsToPixels(options.width, unit, dpi) : img.width;
  let targetHeight = options.height ? convertUnitsToPixels(options.height, unit, dpi) : img.height;

  if (options.maintainAspectRatio) {
    const aspect = img.width / img.height;
    if (options.width && !options.height) {
      targetHeight = Math.round(targetWidth / aspect);
    } else if (options.height && !options.width) {
      targetWidth = Math.round(targetHeight * aspect);
    } else if (options.width && options.height) {
      // Fit within bounding box
      const targetAspect = targetWidth / targetHeight;
      if (aspect > targetAspect) {
        targetHeight = Math.round(targetWidth / aspect);
      } else {
        targetWidth = Math.round(targetHeight * aspect);
      }
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, targetWidth);
  canvas.height = Math.max(1, targetHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const format = options.format ?? (file.type === 'image/png' ? 'image/png' : 'image/jpeg');
  const quality = options.quality ?? 0.92;

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas export failed'));
      },
      format,
      quality
    );
  });

  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    size: blob.size
  };
}

export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  shape: 'rect' | 'circle' = 'rect'
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(cropArea.width));
  canvas.height = Math.max(1, Math.round(cropArea.height));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  if (shape === 'circle') {
    ctx.beginPath();
    const radius = Math.min(canvas.width, canvas.height) / 2;
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to crop'))), shape === 'circle' ? 'image/png' : 'image/jpeg', 0.95);
  });
}

export async function compressImageToTarget(
  file: File,
  targetSizeBytes: number,
  format: 'image/jpeg' | 'image/webp' = 'image/jpeg'
): Promise<{ blob: Blob; actualSize: number; qualityUsed: number; achieved: boolean }> {
  const img = await loadImage(file);
  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(img, 0, 0);

  // Helper to test quality
  const testQuality = (c: HTMLCanvasElement, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Encode failed'))), format, q);
    });
  };

  let minQ = 0.05;
  let maxQ = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;

  // Binary search for optimal quality
  for (let i = 0; i < 7; i++) {
    const midQ = (minQ + maxQ) / 2;
    const blob = await testQuality(canvas, midQ);
    bestBlob = blob;
    bestQuality = midQ;

    if (blob.size <= targetSizeBytes) {
      minQ = midQ; // Can we get higher quality under target?
    } else {
      maxQ = midQ; // Exceeds target, need lower quality
    }
  }

  // If even at lowest quality it exceeds target size, downscale dimensions
  let currentScale = 0.9;
  while (bestBlob && bestBlob.size > targetSizeBytes && currentScale > 0.15) {
    const scaledWidth = Math.max(40, Math.round(img.width * currentScale));
    const scaledHeight = Math.max(40, Math.round(img.height * currentScale));

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = scaledWidth;
    scaledCanvas.height = scaledHeight;
    const sCtx = scaledCanvas.getContext('2d');
    if (!sCtx) break;

    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    const testBlob = await testQuality(scaledCanvas, 0.4);
    bestBlob = testBlob;
    canvas = scaledCanvas;
    currentScale -= 0.15;
  }

  if (!bestBlob) {
    bestBlob = await testQuality(canvas, 0.8);
  }

  return {
    blob: bestBlob,
    actualSize: bestBlob.size,
    qualityUsed: Math.round(bestQuality * 100) / 100,
    achieved: bestBlob.size <= targetSizeBytes * 1.05
  };
}

export async function generatePassportPhoto(
  file: File,
  options: {
    widthMm: number;
    heightMm: number;
    dpi: number;
    bgColor?: string;
    generateSheet?: boolean;
    crop?: { x: number; y: number; width: number; height: number };
  }
): Promise<{ singleBlob: Blob; sheetBlob?: Blob; widthPx: number; heightPx: number }> {
  const img = await loadImage(file);
  const dpi = options.dpi || 300;
  const widthPx = convertUnitsToPixels(options.widthMm, 'mm', dpi);
  const heightPx = convertUnitsToPixels(options.heightMm, 'mm', dpi);

  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Fill background
  if (options.bgColor && options.bgColor !== 'transparent') {
    ctx.fillStyle = options.bgColor;
    ctx.fillRect(0, 0, widthPx, heightPx);
  }

  if (options.crop) {
    ctx.drawImage(
      img,
      options.crop.x,
      options.crop.y,
      options.crop.width,
      options.crop.height,
      0,
      0,
      widthPx,
      heightPx
    );
  } else {
    // Center fit
    const aspect = img.width / img.height;
    const targetAspect = widthPx / heightPx;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;

    if (aspect > targetAspect) {
      sw = img.height * targetAspect;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / targetAspect;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, widthPx, heightPx);
  }

  const singleBlob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
  );

  let sheetBlob: Blob | undefined;
  if (options.generateSheet) {
    // 4x6 inch print sheet @ 300 DPI = 1200 x 1800 px (or 1800 x 1200)
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800;
    sheetCanvas.height = 1200;
    const sCtx = sheetCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#FFFFFF';
      sCtx.fillRect(0, 0, 1800, 1200);

      // Arrange 2 rows of 4 (8 photos) or 2 rows of 3 (6 photos)
      const cols = 4;
      const rows = 2;
      const photoW = Math.min(widthPx, 380);
      const photoH = Math.min(heightPx, 490);
      const gapX = (1800 - cols * photoW) / (cols + 1);
      const gapY = (1200 - rows * photoH) / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = gapX + c * (photoW + gapX);
          const posY = gapY + r * (photoH + gapY);

          // Draw photo
          sCtx.drawImage(canvas, posX, posY, photoW, photoH);

          // Thin cutting border
          sCtx.strokeStyle = '#D1D5DB';
          sCtx.lineWidth = 1;
          sCtx.strokeRect(posX, posY, photoW, photoH);
        }
      }

      sheetBlob = await new Promise((resolve) =>
        sheetCanvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
      );
    }
  }

  return { singleBlob, sheetBlob, widthPx, heightPx };
}

export async function addNameAndDobToPhoto(
  file: File,
  name: string,
  dateText: string
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.drawImage(img, 0, 0);

  // Height of bottom banner is ~20% of image height
  const bannerHeight = Math.max(48, Math.round(canvas.height * 0.2));
  const bannerY = canvas.height - bannerHeight;

  // Draw solid white banner
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, bannerY, canvas.width, bannerHeight);

  // Top border line for banner
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, bannerY, canvas.width, 2);

  // Text formatting
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = Math.max(14, Math.round(bannerHeight * 0.32));
  ctx.font = `bold ${fontSize}px sans-serif`;

  const line1Y = bannerY + bannerHeight * 0.33;
  const line2Y = bannerY + bannerHeight * 0.72;

  ctx.fillText(name.toUpperCase(), canvas.width / 2, line1Y);
  ctx.fillText(dateText.toUpperCase(), canvas.width / 2, line2Y);

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
  );
}

export async function applyImageFilters(
  file: File,
  filters: {
    grayscale?: boolean;
    blackWhite?: boolean;
    blur?: number;
    pixelate?: number;
    borderWidth?: number;
    borderColor?: string;
  }
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const border = filters.borderWidth || 0;

  canvas.width = img.width + border * 2;
  canvas.height = img.height + border * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  if (border > 0) {
    ctx.fillStyle = filters.borderColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw image
  ctx.drawImage(img, border, border, img.width, img.height);

  const imgData = ctx.getImageData(border, border, img.width, img.height);
  const data = imgData.data;

  // Grayscale & Black/White
  if (filters.grayscale || filters.blackWhite) {
    for (let i = 0; i < data.length; i += 4) {
      const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      if (filters.blackWhite) {
        const bw = avg > 128 ? 255 : 0;
        data[i] = bw;
        data[i + 1] = bw;
        data[i + 2] = bw;
      } else {
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
    }
    ctx.putImageData(imgData, border, border);
  }

  // Pixelate effect
  if (filters.pixelate && filters.pixelate > 1) {
    const size = Math.max(2, Math.round(filters.pixelate));
    const pCanvas = document.createElement('canvas');
    pCanvas.width = Math.max(1, Math.floor(img.width / size));
    pCanvas.height = Math.max(1, Math.floor(img.height / size));
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      pCtx.drawImage(img, 0, 0, pCanvas.width, pCanvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pCanvas, 0, 0, pCanvas.width, pCanvas.height, border, border, img.width, img.height);
      ctx.imageSmoothingEnabled = true;
    }
  }

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92)
  );
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
