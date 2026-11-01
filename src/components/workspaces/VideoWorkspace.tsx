'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { loadVideoMetadata, processVideoClip, VideoMetadata } from '@/lib/video/videoProcessing';
import { downloadBlob, formatBytes, formatSecondsToTime } from '@/lib/downloads';
import { 
  Video, 
  Scissors, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  Play, 
  Pause,
  Sliders,
  Sparkles
} from 'lucide-react';

interface VideoWorkspaceProps {
  toolSlug?: string;
}

export const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({ toolSlug = 'video-trimmer' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Trimming State
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compression State
  const [targetRes, setTargetRes] = useState<'1080' | '720' | '480' | '360'>('720');
  const [bitrateKbps, setBitrateKbps] = useState<number>(1200);

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultMime, setResultMime] = useState<string>('video/webm');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setResultBlob(null);

    try {
      setIsProcessing(true);
      const res = await loadVideoMetadata(selected);
      setMetadata(res.metadata);
      setVideoUrl(res.objectUrl);
      setStartTime(0);
      setEndTime(Math.min(res.metadata.duration, 30));
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load video. Codec may be unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= endTime && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleStartProcess = async () => {
    if (!file || !metadata) return;

    try {
      setIsProcessing(true);
      setProgressPercent(0);
      setErrorMessage(null);

      // Determine dimensions
      let targetW = metadata.width;
      let targetH = metadata.height;

      if (toolSlug === 'video-compressor' || targetRes !== '1080') {
        const heightMap = { '1080': 1080, '720': 720, '480': 480, '360': 360 };
        targetH = Math.min(metadata.height, heightMap[targetRes] || 720);
        targetW = Math.round(targetH * metadata.aspectRatio);
        // Ensure even dimensions for video codecs
        if (targetW % 2 !== 0) targetW += 1;
        if (targetH % 2 !== 0) targetH += 1;
      }

      const res = await processVideoClip(file, {
        startTime,
        endTime,
        targetWidth: targetW,
        targetHeight: targetH,
        bitrate: bitrateKbps * 1000,
        fps: 30,
        onProgress: (p) => setProgressPercent(p)
      });

      setResultBlob(res.blob);
      setResultMime(res.mimeType);
    } catch (err: any) {
      setErrorMessage(err.message || 'Video encoding failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const ext = resultMime.includes('mp4') ? '.mp4' : '.webm';
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || 'video';
    downloadBlob(resultBlob, `${base}_processed${ext}`);
  };

  const resetAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setMetadata(null);
    setResultBlob(null);
    setProgressPercent(0);
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
          accept="video/*,.mp4,.webm,.mov"
          multiple={false}
          maxSizeMb={100}
          label="Upload a video to trim or compress"
          sublabel="Client-side hardware accelerated video processing without cloud uploads."
        />
      ) : (
        <div className="space-y-6">
          {/* Video Preview Player */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center">
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                playsInline
                className="max-h-[380px] w-auto object-contain"
              />
            )}
            <div className="w-full bg-slate-950/80 backdrop-blur-md p-3.5 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <span className="font-mono">
                  {formatSecondsToTime(currentTime)} / {formatSecondsToTime(metadata?.duration || 0)}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                {metadata?.width} × {metadata?.height} px • {formatBytes(file.size)}
              </div>
            </div>
          </div>

          {/* Timeline & Controls */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trim Interval: {formatSecondsToTime(startTime)} to {formatSecondsToTime(endTime)}
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Duration: {Math.max(0, endTime - startTime).toFixed(1)}s
                </span>
              </div>

              {/* Slider Controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-16">Start Time:</span>
                  <input
                    type="range"
                    min="0"
                    max={metadata?.duration || 10}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val < endTime) setStartTime(val);
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="flex-1"
                  />
                  <span className="font-mono text-xs text-slate-700 w-12 text-right">
                    {formatSecondsToTime(startTime)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-16">End Time:</span>
                  <input
                    type="range"
                    min="0"
                    max={metadata?.duration || 10}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val > startTime) setEndTime(val);
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="flex-1"
                  />
                  <span className="font-mono text-xs text-slate-700 w-12 text-right">
                    {formatSecondsToTime(endTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Compressor resolution options */}
            {toolSlug === 'video-compressor' && (
              <div className="pt-3 border-t border-slate-200/60 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Resolution
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '1080', label: '1080p (Full HD)' },
                    { id: '720', label: '720p (HD, Recommended)' },
                    { id: '480', label: '480p (Compact)' },
                    { id: '360', label: '360p (Smallest)' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setTargetRes(res.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        targetRes === res.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 text-xs'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action & Progress */}
          {!resultBlob ? (
            <div className="space-y-3">
              {isProcessing && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Encoding frames locally...</span>
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleStartProcess}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Process Video Clip</span>
                </button>
              </div>
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
                      Video Processed Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Output Size: {formatBytes(resultBlob.size)} • Duration: {(endTime - startTime).toFixed(1)}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultBlob(null)}
                  className="px-4 py-2 rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Re-trim
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
