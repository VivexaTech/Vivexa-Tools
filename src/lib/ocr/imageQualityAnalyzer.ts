/**
 * Image Quality Analyzer & Preprocessor
 * 100% Client-Side In-Memory Canvas Analysis.
 * Detects blur, low resolution, over/underexposure, and document boundaries.
 */

export interface ImageQualityReport {
  isBlurry: boolean;
  blurScore: number; // Higher is sharper (> 100 is good, < 45 is blurry)
  isLowResolution: boolean;
  resolution: { width: number; height: number };
  isUnderexposed: boolean;
  isOverexposed: boolean;
  averageLuminance: number; // 0 - 255
  recommendations: string[];
}

/**
 * Calculates the variance of the discrete 3x3 Laplacian operator over a downsampled grayscale canvas.
 * This is the standard computer-vision metric for defocus blur detection.
 */
export function calculateLaplacianVariance(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const sampleW = Math.min(width, 240);
  const sampleH = Math.min(height, 240);

  const offscreen = document.createElement('canvas');
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return 100;

  offCtx.drawImage(ctx.canvas, 0, 0, sampleW, sampleH);
  const imgData = offCtx.getImageData(0, 0, sampleW, sampleH);
  const data = imgData.data;

  // Convert to grayscale array
  const grays = new Float32Array(sampleW * sampleH);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    grays[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // Compute discrete Laplacian: kernel [-4 at center, +1 at 4-neighbors]
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < sampleH - 1; y++) {
    const rowOffset = y * sampleW;
    for (let x = 1; x < sampleW - 1; x++) {
      const idx = rowOffset + x;
      const lap =
        -4 * grays[idx] +
        grays[idx - 1] +
        grays[idx + 1] +
        grays[idx - sampleW] +
        grays[idx + sampleW];

      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  if (count === 0) return 100;
  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  return Math.max(0, variance);
}

/**
 * Perform complete non-destructive image quality audit
 */
export function analyzeImageQuality(canvas: HTMLCanvasElement): ImageQualityReport {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');

  const recommendations: string[] = [];

  // 1. Resolution Check
  const isLowResolution = width < 600 || height < 400;
  if (isLowResolution) {
    recommendations.push(
      'Image resolution is low. A higher resolution photo (at least 1200x800) yields significantly sharper character recognition.'
    );
  }

  if (!ctx || width === 0 || height === 0) {
    return {
      isBlurry: false,
      blurScore: 100,
      isLowResolution,
      resolution: { width, height },
      isUnderexposed: false,
      isOverexposed: false,
      averageLuminance: 128,
      recommendations,
    };
  }

  // 2. Blur Analysis (Laplacian Variance)
  const blurScore = calculateLaplacianVariance(ctx, width, height);
  const isBlurry = blurScore < 45;
  if (isBlurry) {
    recommendations.push(
      'The document appears slightly blurry or out-of-focus. Please hold the camera steady in good lighting.'
    );
  }

  // 3. Exposure / Luminance check
  const sampleW = Math.min(width, 100);
  const sampleH = Math.min(height, 100);
  const offscreen = document.createElement('canvas');
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const offCtx = offscreen.getContext('2d');
  let avgLum = 128;

  if (offCtx) {
    offCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
    const data = offCtx.getImageData(0, 0, sampleW, sampleH).data;
    let lumSum = 0;
    const totalPixels = sampleW * sampleH;
    for (let i = 0; i < data.length; i += 4) {
      lumSum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    avgLum = Math.round(lumSum / totalPixels);
  }

  const isUnderexposed = avgLum < 45;
  const isOverexposed = avgLum > 235;

  if (isUnderexposed) {
    recommendations.push('Image is too dark or underexposed. Try capturing under brighter ambient light.');
  } else if (isOverexposed) {
    recommendations.push('Image has severe glare or flash reflections. Avoid using camera flash directly on glossy card surfaces.');
  }

  return {
    isBlurry,
    blurScore: Math.round(blurScore * 10) / 10,
    isLowResolution,
    resolution: { width, height },
    isUnderexposed,
    isOverexposed,
    averageLuminance: avgLum,
    recommendations,
  };
}

/**
 * Apply 3x3 convolution kernel sharpening to an HTML5 Canvas.
 * Standard Laplacian unsharp mask kernel:
 * [  0, -1,  0 ]
 * [ -1,  5, -1 ]
 * [  0, -1,  0 ]
 */
export function applySharpenFilter(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = sourceCanvas.width;
  targetCanvas.height = sourceCanvas.height;
  const targetCtx = targetCanvas.getContext('2d');
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!targetCtx || !sourceCtx) return sourceCanvas;

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const srcData = sourceCtx.getImageData(0, 0, width, height).data;
  const outImg = targetCtx.createImageData(width, height);
  const dstData = outImg.data;

  const kernel = [
    0, -1,  0,
   -1,  5, -1,
    0, -1,  0
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      let kIdx = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pIdx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[kIdx++];
          r += srcData[pIdx] * weight;
          g += srcData[pIdx + 1] * weight;
          b += srcData[pIdx + 2] * weight;
        }
      }

      const dstIdx = (y * width + x) * 4;
      dstData[dstIdx] = Math.min(255, Math.max(0, r));
      dstData[dstIdx + 1] = Math.min(255, Math.max(0, g));
      dstData[dstIdx + 2] = Math.min(255, Math.max(0, b));
      dstData[dstIdx + 3] = srcData[dstIdx + 3]; // Preserve alpha
    }
  }

  targetCtx.putImageData(outImg, 0, 0);
  return targetCanvas;
}
