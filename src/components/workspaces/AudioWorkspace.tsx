'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { decodeAudioFile, audioBufferToWav, compressAndResampleAudio, AudioMetadata } from '@/lib/audio/audioProcessing';
import { downloadBlob, formatBytes, formatSecondsToTime } from '@/lib/downloads';
import { 
  Music, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  Play, 
  Pause,
  Sliders,
  Volume2
} from 'lucide-react';

interface AudioWorkspaceProps {
  toolSlug?: string;
}

export const AudioWorkspace: React.FC<AudioWorkspaceProps> = ({ toolSlug = 'audio-converter' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compression Profile
  const [targetSampleRate, setTargetSampleRate] = useState<number>(22050);
  const [monoMix, setMonoMix] = useState<boolean>(true);

  // Audio Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultStats, setResultStats] = useState<{ originalSize: number; newSize: number; savings: number } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setResultBlob(null);

    const url = URL.createObjectURL(selected);
    setAudioUrl(url);

    try {
      setIsProcessing(true);
      const res = await decodeAudioFile(selected);
      setAudioBuffer(res.buffer);
      setMetadata(res.metadata);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not decode audio. Format may not be supported by browser.');
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProcess = async () => {
    if (!file || !audioBuffer) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      let blob: Blob;

      if (toolSlug === 'audio-compressor') {
        const res = await compressAndResampleAudio(file, {
          targetSampleRate,
          mono: monoMix
        });
        blob = res.blob;
        const savings = Math.max(0, file.size - res.newSize);
        const percent = Math.round((savings / file.size) * 100);
        setResultStats({
          originalSize: file.size,
          newSize: res.newSize,
          savings: percent
        });
      } else {
        // High fidelity WAV conversion
        blob = audioBufferToWav(audioBuffer);
        setResultStats({
          originalSize: file.size,
          newSize: blob.size,
          savings: 0
        });
      }

      setResultBlob(blob);
    } catch (err: any) {
      setErrorMessage(err.message || 'Audio transcoding failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted_audio';
    downloadBlob(resultBlob, `${baseName}_converted.wav`);
  };

  const resetAll = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setMetadata(null);
    setAudioBuffer(null);
    setResultBlob(null);
    setResultStats(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
          multiple={false}
          maxSizeMb={60}
          label="Upload an audio track to convert or compress"
          sublabel="Local Web Audio processing. Convert formats, downsample sample rate, and reduce file size."
        />
      ) : (
        <div className="space-y-6">
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Track Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {metadata ? (
                    <>
                      {formatSecondsToTime(metadata.duration)} • {metadata.sampleRate} Hz •{' '}
                      {metadata.numberOfChannels === 1 ? 'Mono' : 'Stereo'} • {formatBytes(file.size)}
                    </>
                  ) : (
                    'Decoding audio buffer...'
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              Change Audio
            </button>
          </div>

          {/* Settings Box */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Export &amp; Compression Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    name: 'Speech / Voice',
                    rate: 16000,
                    mono: true,
                    desc: '16 kHz Mono (~70% smaller, ideal for speech)'
                  },
                  {
                    name: 'Podcast / Audiobook',
                    rate: 22050,
                    mono: true,
                    desc: '22.05 kHz Mono (Balanced voice clarity)'
                  },
                  {
                    name: 'High Fidelity Uncompressed',
                    rate: 44100,
                    mono: false,
                    desc: '44.1 kHz 16-bit PCM WAV (CD Quality)'
                  }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setTargetSampleRate(item.rate);
                      setMonoMix(item.mono);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetSampleRate === item.rate && monoMix === item.mono
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span>Output Format: <strong className="text-slate-800">Standard WAV (16-bit PCM)</strong></span>
              <span>100% In-Browser Transcoding</span>
            </div>
          </div>

          {/* Action */}
          {!resultBlob ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleProcess}
                disabled={isProcessing || !audioBuffer}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rendering Audio in Browser...</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    <span>Process Audio</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-900">
                      Audio Processing Complete!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Final Output: {formatBytes(resultBlob.size)}
                    </p>
                  </div>
                </div>
                {resultStats && resultStats.savings > 0 && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-600 text-white">
                    {resultStats.savings}% Smaller
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultBlob(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Change Settings
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Audio File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
