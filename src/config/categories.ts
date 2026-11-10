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
      'Conversion',
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
  },
  'qr-barcode': {
    id: 'qr-barcode',
    name: 'QR & Barcode',
    slug: 'qr-barcode',
    shortDescription: 'Generate custom QR codes with colors and logos, scan QR codes, and create retail barcodes.',
    description: 'All-in-one browser QR and barcode studio. Generate scannable QR codes for links, text, Wi-Fi networks, and contact cards, scan QR codes from your webcam or saved photos, and generate retail standard Code 128, EAN-13, and UPC barcodes.',
    icon: 'QrCode',
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-600',
    badge: 'Instant Decode',
    subcategories: [
      'QR Code Generator',
      'QR Code Scanner',
      'Barcode Generator',
      'Barcode Scanner'
    ]
  },
  calculator: {
    id: 'calculator',
    name: 'Calculators',
    slug: 'calculator',
    shortDescription: 'Calculate chronological age, loan EMI schedules, GST taxes, units, and exchange rates.',
    description: 'Precision calculation utilities for finance, math, and daily conversions. Calculate exact chronological age down to the second, forecast monthly loan EMIs with amortization schedules, calculate GST inclusive and exclusive taxes, convert units, and estimate currency conversions.',
    icon: 'Calculator',
    color: 'amber',
    gradient: 'from-amber-600 to-orange-600',
    badge: 'Precision Math',
    subcategories: [
      'Age & Time',
      'Financial',
      'Tax & GST',
      'Unit Conversion',
      'Currency'
    ]
  },
  developer: {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    shortDescription: 'Format, validate, beautify, and minify JSON data with instant syntax verification.',
    description: 'Handy developer utilities running completely client-side. Beautify unreadable JSON payloads, minify payloads for transmission, detect syntax error line and column offsets, and export clean JSON files.',
    icon: 'Code2',
    color: 'cyan',
    gradient: 'from-cyan-600 to-blue-600',
    badge: 'Zero Upload',
    subcategories: [
      'JSON Tools',
      'Code Formatting'
    ]
  },
  voice: {
    id: 'voice',
    name: 'Voice & Speech',
    slug: 'voice',
    shortDescription: 'Convert voice speech into live text transcripts and synthesize natural speech from text.',
    description: 'Browser-native speech tools leveraging the Web Speech API and Speech Synthesis. Transcribe spoken words into text with punctuation, and convert written articles into clear audible speech with pitch, rate, and voice controls.',
    icon: 'Mic',
    color: 'rose',
    gradient: 'from-rose-600 to-pink-600',
    badge: 'Web Speech API',
    subcategories: [
      'Speech to Text',
      'Text to Speech'
    ]
  },
  student: {
    id: 'student',
    name: 'Student Tools',
    slug: 'student',
    shortDescription: 'Convert CGPA to percentage, percentage to CGPA, and test typing speed with live WPM tracking.',
    description: 'Academic and productivity tools designed for students and job seekers. Convert CGPA scores to percentage using standard university formulas, calculate CGPA from marks, and measure keyboard typing speed and accuracy.',
    icon: 'GraduationCap',
    color: 'indigo',
    gradient: 'from-indigo-600 to-blue-600',
    badge: 'Student Ready',
    subcategories: [
      'Grade Conversion',
      'Typing Practice'
    ]
  },
  business: {
    id: 'business',
    name: 'Business & Finance',
    slug: 'business',
    shortDescription: 'Generate professional payslips, invoices, quotations, receipts, and track personal budgets.',
    description: 'Essential billing and financial documentation tools for freelancers, small business owners, and individuals. Generate printable payslips, GST-compliant invoices, quotations, and payment receipts, and manage daily income and expenses.',
    icon: 'Briefcase',
    color: 'blue',
    gradient: 'from-blue-700 to-indigo-700',
    badge: 'Client-Side Billing',
    subcategories: [
      'Invoicing & Billing',
      'Receipts & Quotes',
      'HR & Payroll',
      'Expense Tracking'
    ]
  },
  document: {
    id: 'document',
    name: 'Documents & Design',
    slug: 'document',
    shortDescription: 'Build professional resumes, create multi-photo collages, and extract identity card details.',
    description: 'Creative and document processing utilities. Build clean modern resumes ready for PDF export, arrange photo collages with customizable borders and aspect ratios, and extract details from PAN and Aadhaar identity cards locally with privacy masking.',
    icon: 'FileSpreadsheet',
    color: 'purple',
    gradient: 'from-purple-600 to-fuchsia-600',
    badge: 'Private & Local',
    subcategories: [
      'Career & Resume',
      'Photo Collages',
      'Document OCR'
    ]
  }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
