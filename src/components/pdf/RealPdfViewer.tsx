'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getPdfJs } from '@/lib/pdf/pdfOcrHelper';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Loader2,
  AlertCircle,
  FileText,
  Grid,
  Eye,
} from 'lucide-react';

export interface RealPdfViewerProps {
  source: File | Blob | Uint8Array | ArrayBuffer | null;
  title?: string;
  className?: string;
  initialPage?: number;
  showThumbnails?: boolean;
  onPageChange?: (page: number, totalPages: number) => void;
}

export const RealPdfViewer: React.FC<RealPdfViewerProps> = ({
  source,
  title,
  className = '',
  initialPage = 1,
  showThumbnails = true,
  onPageChange,
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderLoading, setRenderLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thumbnailList, setThumbnailList] = useState<{ pageNum: number; dataUrl?: string }[]>([]);
  const [thumbnailsVisible, setThumbnailsVisible] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load PDF Document when source changes
  useEffect(() => {
    let isCancelled = false;

    async function loadDocument() {
      if (!source) {
        setPdfDoc(null);
        setNumPages(0);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const pdfjs = await getPdfJs();
        let data: Uint8Array;

        if (source instanceof Uint8Array) {
          data = source;
        } else if (source instanceof ArrayBuffer) {
          data = new Uint8Array(source);
        } else if (source instanceof Blob) {
          const ab = await source.arrayBuffer();
          data = new Uint8Array(ab);
        } else if (source && typeof (source as any).arrayBuffer === 'function') {
          const ab = await (source as any).arrayBuffer();
          data = new Uint8Array(ab);
        } else {
          throw new Error('Unsupported PDF source type');
        }

        const loadingTask = pdfjs.getDocument({
          data,
          useWorkerFetch: false,
          useSystemFonts: true,
        } as any);

        const doc = await loadingTask.promise;

        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);

        // Pre-create thumbnail placeholders
        const thumbs = Array.from({ length: doc.numPages }, (_, i) => ({
          pageNum: i + 1,
        }));
        setThumbnailList(thumbs);
      } catch (err: any) {
        if (!isCancelled) {
          if (err.name === 'PasswordException' || err.message?.includes('password')) {
            setErrorMessage('This PDF document is encrypted or password-protected.');
          } else {
            setErrorMessage('Failed to load PDF document. Please verify the file is valid.');
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDocument();

    return () => {
      isCancelled = true;
    };
  }, [source]);

  // Render current page onto canvas
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      // Cancel previous ongoing render task if any
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Task already cancelled
        }
        renderTaskRef.current = null;
      }

      setRenderLoading(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate viewport with scale and rotation
        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const baseViewport = page.getViewport({ scale: 1.0, rotation });

        // Responsive auto-fit if container exists
        let currentScale = scale;
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth - 40;
          if (containerWidth > 200 && baseViewport.width * scale > containerWidth) {
            // Adjust to fit container width comfortably
            currentScale = (containerWidth / baseViewport.width) * scale;
          }
        }

        const viewport = page.getViewport({ scale: currentScale * dpr, rotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        const renderContext = {
          canvasContext: ctx,
          viewport,
          canvas,
        };

        const renderTask = (page.render as any)(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        renderTaskRef.current = null;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('PDF page render error:', err);
        }
      } finally {
        setRenderLoading(false);
      }
    },
    [pdfDoc, scale, rotation]
  );

  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
      if (onPageChange) {
        onPageChange(currentPage, numPages);
      }
    }
  }, [pdfDoc, currentPage, scale, rotation, renderPage, numPages, onPageChange]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!source) {
    return (
      <div className={`p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 ${className}`}>
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-xs">No PDF uploaded yet. Select or drop a document to inspect real pages.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs ${className}`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {title || (source instanceof File ? source.name : 'Document Preview')}
            </span>
          </span>

          {numPages > 0 && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {numPages} {numPages === 1 ? 'page' : 'pages'}
            </span>
          )}
        </div>

        {/* Navigation & Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {numPages > 1 && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-1 py-0.5">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1 || isLoading}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-1.5 select-none">
                {currentPage} / {numPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= numPages || isLoading}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-1 py-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.5 || isLoading}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="text-[11px] font-mono text-slate-600 dark:text-slate-400 px-1 hover:text-indigo-600"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 2.5 || isLoading}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleRotate}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Rotate 90 degrees"
              aria-label="Rotate"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {showThumbnails && numPages > 1 && (
            <button
              type="button"
              onClick={() => setThumbnailsVisible((prev) => !prev)}
              className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                thumbnailsVisible
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle page grid"
              aria-label="Toggle page thumbnails"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pages</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[300px] max-h-[600px] overflow-auto bg-slate-100/70 dark:bg-slate-950/80 p-4 sm:p-6 flex items-center justify-center"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium">Loading document pages...</span>
          </div>
        ) : errorMessage ? (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs max-w-md">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="relative shadow-md rounded-lg overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white">
            <canvas ref={canvasRef} className="block max-w-full h-auto transition-transform duration-100" />
            {renderLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page Thumbnails Drawer */}
      {thumbnailsVisible && numPages > 1 && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 max-h-44 overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-2.5">
            {thumbnailList.map((thumb) => {
              const isSelected = thumb.pageNum === currentPage;
              return (
                <button
                  key={thumb.pageNum}
                  type="button"
                  onClick={() => setCurrentPage(thumb.pageNum)}
                  className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all shrink-0 ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/50'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-16 h-20 bg-slate-50 dark:bg-slate-950 rounded flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800">
                    <FileText className="w-5 h-5 opacity-40" />
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                    Page {thumb.pageNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
