import { CategoryDefinition, ToolCategory } from '@/types/tools';

export const CATEGORIES: Record<ToolCategory, CategoryDefinition> = {
  pdf: {
    id: 'pdf',
    name: 'PDF Tools',
    slug: 'pdf',
    shortDescription: 'Merge, split, compress, convert, edit, and secure PDF documents directly in your browser.',
    description: 'A complete collection of private, browser-based PDF utilities. Merge multiple files, remove pages, extract sections, add watermarks, sign documents, and convert formats without uploading your files to any remote server.',
    icon: 'FileText',
    color: 'indigo',
    gradient: 'from-indigo-600 to-violet-600',
    badge: 'Privacy First',
    subcategories: [
      'Organize PDF',
      'Scan & Optimize',
      'Convert to PDF',
      'Convert from PDF',
      'Edit PDF',
      'PDF Security',
      'OCR & Extraction'
    ]
  },
  image: {
    id: 'image',
    name: 'Image Tools',
    slug: 'image',
    shortDescription: 'Compress, resize, crop, convert formats, make passport photos, and extract text locally.',
    description: 'Fast, client-side image editing tools. Resize to exact pixels, centimeters, or DPI requirements; create official passport photos with custom background colors; compress images to exact KB targets; and apply filters without privacy risks.',
    icon: 'Image',
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
    badge: 'High Precision',
    subcategories: [
      'Photo & Signature',
      'Compression',
      'General Resizing',
      'Official Photo Sizes',
      'General Editing',
      'Format Conversion',
      'OCR & Text',
      'Effects & Filters'
    ]
  },
  audio: {
    id: 'audio',
    name: 'Audio Tools',
    slug: 'audio',
    shortDescription: 'Convert audio formats and compress sound files using browser-based Web Audio processing.',
    description: 'Process your audio files right inside your browser. Convert between formats, downsample bitrate and sample rate for smaller file sizes, and adjust audio channels without server uploads.',
    icon: 'Music',
    color: 'violet',
    gradient: 'from-violet-600 to-purple-600',
    badge: 'Web Audio API',
    subcategories: [
      'Conversion',
      'Compression'
    ]
  },
  video: {
    id: 'video',
    name: 'Video Tools',
    slug: 'video',
    shortDescription: 'Trim, split, and compress video clips in real-time with responsive browser video tools.',
    description: 'Trim unwanted video footage, cut videos into clips, and reduce video resolution and bitrate for easy web sharing, all processed on your device with no server upload limits.',
    icon: 'Video',
    color: 'sky',
    gradient: 'from-sky-600 to-blue-600',
    badge: 'Hardware Accelerated',
    subcategories: [
      'Trimming',
      'Splitting',
      'Compression'
    ]
  },
  color: {
    id: 'color',
    name: 'Color Picker',
    slug: 'color',
    shortDescription: 'Inspect and extract precise colors from any uploaded image or PDF document.',
    description: 'Extract exact color palettes from images and PDF documents. Includes high-magnification pixel loupe inspection, crosshair precision, and instant copying in HEX, RGB, RGBA, and HSL formats.',
    icon: 'Pipette',
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-600',
    badge: 'Pixel Accurate',
    subcategories: [
      'Image Color Extraction',
      'PDF Color Extraction'
    ]
  }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
