/**
 * Client-Side Video to GIF Converter
 * Uses HTML5 Canvas, Video Element frame extraction, and gifenc LZW encoding.
 * 100% In-Browser Execution. Zero Server Uploads.
 */
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export interface VideoToGifOptions {
  startTime: number; // in seconds
  endTime: number; // in seconds
  width?: number; // target width in px (e.g. 320, 480, 640)
  fps?: number; // frames per second (e.g. 5, 10, 15, 20)
  speed?: number; // playback speed multiplier (0.5 to 2.0)
  maxColors?: number; // 64, 128, 256
  loop?: number; // 0 for infinite, 1 for once
  onProgress?: (progress: {
    percent: number;
    currentFrame: number;
    totalFrames: number;
    status: string;
  }) => void;
}

export interface VideoToGifResult {
  blob: Blob;
  size: number;
  width: number;
  height: number;
  duration: number;
  frameCount: number;
  fps: number;
}

/**
 * Seek video element to target timestamp safely with timeout fallback
 */
function seekToTime(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let timeoutId: any;

    const onSeeked = () => {
      clearTimeout(timeoutId);
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };

    // Timeout safety net (max 1.5s per frame seek)
    timeoutId = setTimeout(() => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    }, 1500);

    video.addEventListener('seeked', onSeeked);
    video.currentTime = Math.max(0, Math.min(time, Math.max(0, video.duration - 0.02)));
  });
}

/**
 * Convert a video file into an animated GIF client-side
 */
export async function convertVideoToGif(
  file: File,
  options: VideoToGifOptions
): Promise<VideoToGifResult> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = async () => {
      try {
        const videoDuration = video.duration || 1;
        const origWidth = video.videoWidth || 640;
        const origHeight = video.videoHeight || 480;
        const aspectRatio = origWidth / origHeight;

        // Calculate time bounds
        const start = Math.max(0, Math.min(options.startTime, videoDuration - 0.1));
        const end = Math.min(videoDuration, Math.max(start + 0.1, options.endTime));
        const clipDuration = end - start;

        // Settings
        const fps = Math.max(1, Math.min(30, options.fps || 10));
        const speed = Math.max(0.25, Math.min(3.0, options.speed || 1.0));
        const maxColors = options.maxColors || 256;
        const reqWidth = options.width || 480;

        // Calculate output dimensions
        let targetWidth = Math.min(origWidth, reqWidth);
        let targetHeight = Math.round(targetWidth / aspectRatio);

        // Ensure even dimensions
        if (targetWidth % 2 !== 0) targetWidth += 1;
        if (targetHeight % 2 !== 0) targetHeight += 1;

        // Calculate total frames
        const totalFrames = Math.max(1, Math.round(clipDuration * fps));
        const frameInterval = clipDuration / totalFrames;
        const delayMs = Math.round(1000 / (fps * speed));

        if (options.onProgress) {
          options.onProgress({
            percent: 5,
            currentFrame: 0,
            totalFrames,
            status: `Initializing GIF encoder (${targetWidth}×${targetHeight} @ ${fps} FPS)...`,
          });
        }

        // Setup Canvas & GIFEncoder
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D rendering context is not supported by your browser.');
        }

        const gif = GIFEncoder();

        // Frame extraction and encoding loop
        for (let i = 0; i < totalFrames; i++) {
          const frameTime = start + i * frameInterval;
          await seekToTime(video, frameTime);

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
          const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);

          // Color quantization & indexing
          const palette = quantize(imgData.data, maxColors, {
            format: 'rgba4444',
          });
          const index = applyPalette(imgData.data, palette);

          // Write GIF frame
          gif.writeFrame(index, targetWidth, targetHeight, {
            palette,
            delay: delayMs,
            repeat: options.loop !== undefined ? options.loop : 0,
          });

          // Report progress
          if (options.onProgress) {
            const pct = Math.round(10 + ((i + 1) / totalFrames) * 85);
            options.onProgress({
              percent: pct,
              currentFrame: i + 1,
              totalFrames,
              status: `Rendering & compressing frame ${i + 1} of ${totalFrames}...`,
            });
          }
        }

        if (options.onProgress) {
          options.onProgress({
            percent: 98,
            currentFrame: totalFrames,
            totalFrames,
            status: 'Finalizing GIF LZW compression...',
          });
        }

        gif.finish();
        const bytes = gif.bytes();
        const blob = new Blob([bytes as any], { type: 'image/gif' });

        URL.revokeObjectURL(objectUrl);

        resolve({
          blob,
          size: blob.size,
          width: targetWidth,
          height: targetHeight,
          duration: clipDuration / speed,
          frameCount: totalFrames,
          fps,
        });
      } catch (err: any) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          'Failed to load video file. Please check that the file is a supported MP4, WebM, or MOV video.'
        )
      );
    };
  });
}
