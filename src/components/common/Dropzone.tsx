'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UploadCloud, File as FileIcon, AlertCircle, Clipboard, CheckCircle2 } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  label?: string;
  sublabel?: string;
  className?: string;
  enablePaste?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  accept = '*/*',
  multiple = false,
  maxSizeMb = 100,
  label = 'Choose files or drag & drop them here',
  sublabel = 'Processed locally in your browser. 100% private.',
  className = '',
  enablePaste = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  // Validate format against accept string
  const isFormatAccepted = useCallback((file: File, acceptPattern: string): boolean => {
    if (!acceptPattern || acceptPattern === '*/*') return true;

    const tokens = acceptPattern.split(',').map((t) => t.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    for (const token of tokens) {
      if (token.startsWith('.')) {
        // Extension match (e.g., .pdf, .docx, .png)
        if (fileName.endsWith(token)) return true;
      } else if (token.endsWith('/*')) {
        // Wildcard MIME match (e.g., image/*, audio/*, video/*)
        const typePrefix = token.slice(0, -2);
        if (fileType.startsWith(typePrefix)) return true;
      } else if (token === fileType) {
        // Exact MIME match (e.g., application/pdf)
        return true;
      }
    }
    return false;
  }, []);

  const validateAndEmit = useCallback(
    (fileList: FileList | File[] | null) => {
      if (!fileList || fileList.length === 0) return;
      setErrorMessage(null);
      setPasteNotice(null);

      const rawFiles = Array.isArray(fileList) ? fileList : Array.from(fileList);
      const validFiles: File[] = [];
      const maxSizeBytes = maxSizeMb * 1024 * 1024;

      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];

        // Format check
        if (!isFormatAccepted(file, accept)) {
          setErrorMessage(
            `File "${file.name}" is not a supported format. Please upload files matching: ${accept.replace(/,/g, ', ')}`
          );
          return;
        }

        // Size check
        if (file.size > maxSizeBytes) {
          setErrorMessage(`File "${file.name}" exceeds the ${maxSizeMb} MB processing limit.`);
          return;
        }

        validFiles.push(file);
        if (!multiple) break;
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [accept, isFormatAccepted, maxSizeMb, multiple, onFilesSelected]
  );

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndEmit(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndEmit(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  // Global window drop prevention & Clipboard paste support
  useEffect(() => {
    // Prevent accidental window navigation when dropping outside dropzone
    const handleWindowDragOver = (e: DragEvent) => e.preventDefault();
    const handleWindowDrop = (e: DragEvent) => e.preventDefault();

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    // Clipboard paste listener
    const handlePaste = (e: ClipboardEvent) => {
      if (!enablePaste) return;

      // Do NOT intercept pasting into inputs, textareas, or contenteditables
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable ||
          activeEl.closest('input, textarea, [contenteditable="true"]'))
      ) {
        return;
      }

      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const pastedFiles: File[] = [];

      // Check items for image blobs or files
      if (clipboardData.items && clipboardData.items.length > 0) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.kind === 'file') {
            const blobFile = item.getAsFile();
            if (blobFile) {
              // Ensure proper filename for clipboard images
              let fileName = blobFile.name;
              if (!fileName || fileName === 'image.png') {
                const ext = blobFile.type.split('/')[1] || 'png';
                fileName = `clipboard-${Date.now()}.${ext}`;
              }
              const finalFile = new File([blobFile], fileName, {
                type: blobFile.type || 'image/png',
                lastModified: Date.now(),
              });
              pastedFiles.push(finalFile);
            }
          }
        }
      }

      // Fallback check on clipboardData.files
      if (pastedFiles.length === 0 && clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          pastedFiles.push(clipboardData.files[i]);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        setPasteNotice(`Pasted ${pastedFiles.length} item${pastedFiles.length > 1 ? 's' : ''} from clipboard.`);
        validateAndEmit(pastedFiles);
        setTimeout(() => setPasteNotice(null), 4000);
      }
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, [enablePaste, validateAndEmit]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={dropzoneRef}
        tabIndex={0}
        role="button"
        aria-label={`${label}. Click to browse files, drag and drop, or press Ctrl+V to paste.`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 scale-[1.01] shadow-lg shadow-indigo-500/10'
            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
        />

        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
              isDragging
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100/70 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {isDragging ? 'Drop your files here now' : label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {sublabel}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
              <FileIcon className="w-3.5 h-3.5" />
              <span>Browse {multiple ? 'Files' : 'File'}</span>
            </span>

            {enablePaste && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Clipboard className="w-3 h-3 text-indigo-500" />
                <span>or Paste (Ctrl+V)</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1">
            Supported: {accept === '*/*' ? 'All formats' : accept.replace(/,/g, ', ')} (Max {maxSizeMb} MB)
          </div>
        </div>
      </div>

      {pasteNotice && (
        <div className="mt-3 flex items-center gap-2 p-3 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{pasteNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 p-3 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
