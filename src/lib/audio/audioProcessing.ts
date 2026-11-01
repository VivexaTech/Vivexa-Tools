// Client-side Web Audio API processor

export interface AudioMetadata {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  formatName: string;
  size: number;
}

export async function decodeAudioFile(file: File): Promise<{ buffer: AudioBuffer; metadata: AudioMetadata }> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioCtx = new AudioContextClass();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const metadata: AudioMetadata = {
    duration: audioBuffer.duration,
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
    formatName: file.type || 'audio/wav',
    size: file.size
  };

  await audioCtx.close();
  return { buffer: audioBuffer, metadata };
}

// Convert AudioBuffer to 16-bit PCM WAV Blob
export function audioBufferToWav(buffer: AudioBuffer, targetSampleRate?: number): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = targetSampleRate || buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  let sourceBuffer = buffer;
  const numSamples = sourceBuffer.length * numChannels;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      dataView.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF identifier
  writeString(0, 'RIFF');
  // RIFF chunk length
  dataView.setUint32(4, 36 + dataSize, true);
  // RIFF type
  writeString(8, 'WAVE');
  // format chunk identifier
  writeString(12, 'fmt ');
  // format chunk length
  dataView.setUint32(16, 16, true);
  // sample format (raw PCM)
  dataView.setUint16(20, format, true);
  // channel count
  dataView.setUint16(22, numChannels, true);
  // sample rate
  dataView.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  dataView.setUint32(28, byteRate, true);
  // block align (channel count * bytes per sample)
  dataView.setUint16(32, blockAlign, true);
  // bits per sample
  dataView.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(36, 'data');
  // data chunk length
  dataView.setUint32(40, dataSize, true);

  // Interleave channels & write 16-bit PCM samples
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(sourceBuffer.getChannelData(c));
  }

  for (let i = 0; i < sourceBuffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Clamp between -1.0 and 1.0
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit signed integer
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      dataView.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export async function compressAndResampleAudio(
  file: File,
  options: {
    targetSampleRate: number; // e.g. 22050 or 16000
    mono: boolean;
  }
): Promise<{ blob: Blob; originalSize: number; newSize: number; duration: number }> {
  const { buffer: originalBuffer } = await decodeAudioFile(file);

  const targetChannels = options.mono ? 1 : Math.min(2, originalBuffer.numberOfChannels);
  const targetSampleRate = options.targetSampleRate || 22050;
  const targetDuration = originalBuffer.duration;
  const targetLength = Math.ceil(targetDuration * targetSampleRate);

  // OfflineAudioContext performs hardware-quality sinc resampling
  const offlineCtx = new OfflineAudioContext(targetChannels, targetLength, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = originalBuffer;

  if (options.mono && originalBuffer.numberOfChannels > 1) {
    // Downmix to mono via merger or gain
    const merger = offlineCtx.createChannelMerger(1);
    source.connect(merger, 0, 0);
    source.connect(merger, 1, 0);
    merger.connect(offlineCtx.destination);
  } else {
    source.connect(offlineCtx.destination);
  }

  source.start(0);
  const resampledBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(resampledBuffer, targetSampleRate);

  return {
    blob: wavBlob,
    originalSize: file.size,
    newSize: wavBlob.size,
    duration: targetDuration
  };
}
