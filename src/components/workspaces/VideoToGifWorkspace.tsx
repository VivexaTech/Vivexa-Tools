'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '@/components/common/Dropzone';
import { convertVideoToGif, VideoToGifResult } from '@/lib/video/videoToGif';
import { downloadBlob, formatBytes, formatSecondsToTime } from '@/lib/downloads';
import {
  Film,
  Play,
  Pause,
  Download,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Clock,
  Maximize2,
  Zap,
  Copy,
  Check,
  Video,
} from 'lucide-react';

interface VideoInfo {
  file: File;
  objectUrl: string;
  duration: number;
  width: number;
  height: number;
  aspectRatio: number;
  size: number;
}

export const VideoToGifWorkspace: React.FC = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Trimming State
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // GIF Settings
  const [targetWidth, setTargetWidth] = useState<number>(480);
  const [fps, setFps] = useState<number>(10);
  const [speed, setSpeed] = useState<number>(1.0);
  const [maxColors, setMaxColors] = useState<number>(256);

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [result, setResult] = useState<VideoToGifResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Load video metadata
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const dur = video.duration || 10;
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;

      setVideoInfo({
        file,
        objectUrl,
        duration: dur,
        width: w,
        height: h,
        aspectRatio: w / (h || 1),
        size: file.size,
      });

      setStartTime(0);
      setEndTime(Math.min(dur, 6)); // Default 6 seconds clip
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMessage(
        'Unable to open this video format. Please upload a standard MP4, WebM, or MOV file.'
      );
    };

    video.src = objectUrl;
  };

  // Video time tracking
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);
      if (curr >= endTime && isPlaying) {
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

  // Convert execution
  const handleConvert = async () => {
    if (!videoInfo) return;

    setIsProcessing(true);
    setProgressPercent(0);
    setProgressStatus('Preparing video frames for GIF conversion...');
    setErrorMessage(null);
    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const res = await convertVideoToGif(videoInfo.file, {
        startTime,
        endTime,
        width: targetWidth,
        fps,
        speed,
        maxColors,
        loop: 0,
        onProgress: (p) => {
          setProgressPercent(p.percent);
          setProgressStatus(p.status);
          setCurrentFrame(p.currentFrame);
          setTotalFrames(p.totalFrames);
        },
      });

      const url = URL.createObjectURL(res.blob);
      setResult(res);
      setResultUrl(url);
    } catch (err: any) {
      console.error('Video to GIF error', err);
      setErrorMessage(err.message || 'Failed to convert video to GIF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !videoInfo) return;
    const base = videoInfo.file.name.substring(0, videoInfo.file.name.lastIndexOf('.')) || 'animation';
    downloadBlob(result.blob, `${base}.gif`);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      if (navigator.clipboard && (window as any).ClipboardItem) {
        const item = new (window as any).ClipboardItem({ 'image/gif': result.blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  const resetAll = () => {
    if (videoInfo?.objectUrl) URL.revokeObjectURL(videoInfo.objectUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setVideoInfo(null);
    setResult(null);
    setResultUrl(null);
    setIsProcessing(false);
    setProgressPercent(0);
    setErrorMessage(null);
  };

  const clipDuration = Math.max(0.1, endTime - startTime);
  const estimatedFrames = Math.round(clipDuration * fps);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ERROR MESSAGE BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-xs text-rose-600 dark:text-rose-300">
              Try choosing a shorter segment or lower resolution if browser memory is constrained.
            </p>
          </div>
        </div>
      )}

      {/* STEP 1: UPLOAD DROPZONE */}
      {!videoInfo && (
        <div className="space-y-4">
          <Dropzone
            accept="video/mp4,video/webm,video/quicktime,video/ogg,.mp4,.webm,.mov,.ogg"
            maxSizeMb={100}
            onFilesSelected={handleFilesSelected}
            label="Drop your video here to convert to GIF"
            sublabel="Supports MP4, WebM, and MOV up to 100 MB. Processed 100% locally."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <Zap className="w-4 h-4 mx-auto text-amber-500 mb-1" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">100% In-Browser</p>
              <p className="text-[11px] text-slate-500">Zero server uploads or latency</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <Sliders className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Custom FPS & Speed</p>
              <p className="text-[11px] text-slate-500">5 to 20 FPS, slow-mo & speed up</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <Sparkles className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Crisp Color Palette</p>
              <p className="text-[11px] text-slate-500">Adaptive quantization & LZW engine</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: VIDEO WORKSPACE & CONTROLS */}
      {videoInfo && !result && (
        <div className="space-y-6">
          {/* Video Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">
                  {videoInfo.file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {videoInfo.width}×{videoInfo.height} px • {formatSecondsToTime(videoInfo.duration)} •{' '}
                  {formatBytes(videoInfo.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetAll}
              disabled={isProcessing}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Choose Another Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Video Preview & Clip Boundaries */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center group shadow-md">
                <video
                  ref={videoRef}
                  src={videoInfo.objectUrl}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                  playsInline
                />

                {/* Big Center Play/Pause button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900/70 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-lg group-hover:scale-105"
                  title={isPlaying ? 'Pause' : 'Play Clip Preview'}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                {/* Bottom Timeline Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 flex items-center justify-between text-xs text-white">
                  <span className="font-mono">{formatSecondsToTime(currentTime)}</span>
                  <span className="font-mono text-slate-300">
                    Clip: {clipDuration.toFixed(1)}s ({formatSecondsToTime(startTime)} –{' '}
                    {formatSecondsToTime(endTime)})
                  </span>
                </div>
              </div>

              {/* Time Boundary Sliders Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Select Clip Interval</span>
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setStartTime(0);
                        setEndTime(Math.min(videoInfo.duration, 5));
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
                    >
                      First 5s
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStartTime(0);
                        setEndTime(Math.min(videoInfo.duration, 10));
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
                    >
                      First 10s
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Start Time</span>
                      <span className="font-mono text-indigo-600">{startTime.toFixed(1)}s</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, videoInfo.duration - 0.5)}
                      step={0.1}
                      value={startTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setStartTime(val);
                        if (val >= endTime) setEndTime(Math.min(videoInfo.duration, val + 1));
                        if (videoRef.current) videoRef.current.currentTime = val;
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>End Time</span>
                      <span className="font-mono text-indigo-600">{endTime.toFixed(1)}s</span>
                    </div>
                    <input
                      type="range"
                      min={Math.min(videoInfo.duration, startTime + 0.2)}
                      max={videoInfo.duration}
                      step={0.1}
                      value={endTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEndTime(val);
                        if (videoRef.current) videoRef.current.currentTime = val;
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: GIF Optimization Settings */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>GIF Quality & Settings</span>
                </h4>

                {/* Resolution Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Output Width</span>
                    <span className="font-mono text-indigo-600 font-semibold">{targetWidth}px</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { label: '320p', w: 320 },
                      { label: '480p', w: 480 },
                      { label: '640p', w: 640 },
                      { label: 'Original', w: Math.min(800, videoInfo.width) },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setTargetWidth(item.w)}
                        className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                          targetWidth === item.w
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Rate (FPS) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Frame Rate (FPS)</span>
                    <span className="font-mono text-indigo-600 font-semibold">{fps} FPS</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { label: '5 FPS', val: 5 },
                      { label: '10 FPS', val: 10 },
                      { label: '15 FPS', val: 15 },
                      { label: '20 FPS', val: 20 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setFps(item.val)}
                        className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                          fps === item.val
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    10 FPS is recommended for optimal balance between smoothness and GIF file size.
                  </p>
                </div>

                {/* Playback Speed */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Speed Multiplier</span>
                    <span className="font-mono text-indigo-600 font-semibold">{speed}x</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { label: '0.5x', s: 0.5 },
                      { label: '1.0x', s: 1.0 },
                      { label: '1.5x', s: 1.5 },
                      { label: '2.0x', s: 2.0 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSpeed(item.s)}
                        className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all ${
                          speed === item.s
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Depth */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Color Palette Depth</span>
                    <span className="font-mono text-indigo-600 font-semibold">{maxColors} Colors</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { label: '256 Colors', c: 256 },
                      { label: '128 Colors', c: 128 },
                      { label: '64 Colors', c: 64 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setMaxColors(item.c)}
                        className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all ${
                          maxColors === item.c
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame & Size Estimator */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Estimated Output</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ~{estimatedFrames} Frames • {(clipDuration / speed).toFixed(1)}s loop
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                    Fast Render
                  </span>
                </div>

                {/* Progress bar during conversion */}
                {isProcessing && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        <span>{progressStatus || 'Converting...'}</span>
                      </span>
                      <span className="font-mono text-indigo-600">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-150"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {totalFrames > 0 && (
                      <p className="text-[11px] text-slate-400 text-right font-mono">
                        Frame {currentFrame} / {totalFrames}
                      </p>
                    )}
                  </div>
                )}

                {/* Convert Button */}
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Animated GIF...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Convert to Animated GIF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT PREVIEW & DOWNLOAD */}
      {result && resultUrl && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>GIF Generation Complete!</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {formatBytes(result.size)}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {result.width}×{result.height} px • {result.frameCount} frames • {result.fps} FPS
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied GIF!' : 'Copy GIF'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Animated GIF</span>
              </button>
            </div>
          </div>

          {/* Large Animated GIF Viewer Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[500px] flex items-center justify-center p-2 shadow-inner">
              <img
                src={resultUrl}
                alt="Converted Animated GIF"
                className="max-h-[460px] max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  if (resultUrl) URL.revokeObjectURL(resultUrl);
                  setResultUrl(null);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                ← Adjust settings & convert again
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium"
              >
                Convert another video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
