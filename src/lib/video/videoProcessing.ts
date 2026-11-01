// Client-side Video Processing using HTML5 Video, Canvas, and MediaRecorder

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  aspectRatio: number;
  size: number;
}

export function loadVideoMetadata(file: File): Promise<{ video: HTMLVideoElement; metadata: VideoMetadata; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      resolve({
        video,
        metadata: {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: video.videoWidth / (video.videoHeight || 1),
          size: file.size
        },
        objectUrl
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read video file. Format may not be supported by your browser.'));
    };
  });
}

export function getSupportedVideoMimeType(): string {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4;codecs=avc1,mp4a',
    'video/mp4'
  ];

  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return 'video/webm';
}

export async function processVideoClip(
  file: File,
  options: {
    startTime: number;
    endTime: number;
    targetWidth?: number;
    targetHeight?: number;
    bitrate?: number; // bits per second
    fps?: number;
    onProgress?: (progressPercent: number) => void;
  }
): Promise<{ blob: Blob; mimeType: string }> {
  const { video, metadata, objectUrl } = await loadVideoMetadata(file);

  const duration = options.endTime - options.startTime;
  if (duration <= 0) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('End time must be greater than start time.');
  }

  const fps = options.fps || 30;
  const targetW = options.targetWidth || metadata.width;
  const targetH = options.targetHeight || metadata.height;

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Canvas 2D context not available.');
  }

  const stream = canvas.captureStream(fps);

  // If browser supports capture of audio track from video element
  if ((video as any).captureStream) {
    const videoStream = (video as any).captureStream();
    const audioTracks = videoStream.getAudioTracks();
    if (audioTracks.length > 0) {
      stream.addTrack(audioTracks[0]);
    }
  }

  const mimeType = getSupportedVideoMimeType();
  const recorderOptions: MediaRecorderOptions = {
    mimeType,
    videoBitsPerSecond: options.bitrate || 1500000
  };

  const recorder = new MediaRecorder(stream, recorderOptions);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    let animFrameId: number;

    recorder.onstop = () => {
      cancelAnimationFrame(animFrameId);
      URL.revokeObjectURL(objectUrl);
      const outputBlob = new Blob(chunks, { type: mimeType });
      resolve({ blob: outputBlob, mimeType });
    };

    recorder.onerror = (e) => {
      cancelAnimationFrame(animFrameId);
      URL.revokeObjectURL(objectUrl);
      reject(new Error('MediaRecorder encountered an encoding error.'));
    };

    video.currentTime = options.startTime;

    video.onseeked = () => {
      // Begin playback and recording once seek completes
      recorder.start(100);
      video.play().catch(reject);

      function renderFrame() {
        if (video.currentTime >= options.endTime || video.ended) {
          video.pause();
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          if (options.onProgress) options.onProgress(100);
          return;
        }

        ctx!.drawImage(video, 0, 0, targetW, targetH);

        const currentElapsed = video.currentTime - options.startTime;
        const progress = Math.min(99, Math.round((currentElapsed / duration) * 100));
        if (options.onProgress) options.onProgress(progress);

        animFrameId = requestAnimationFrame(renderFrame);
      }

      renderFrame();
    };
  });
}
