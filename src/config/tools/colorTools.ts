import { ToolDefinition } from '@/types/tools';

export const COLOR_TOOLS: ToolDefinition[] = [
  {
    id: 'color-picker-from-image',
    name: 'Color Picker from Image',
    slug: 'color-picker-image',
    category: 'color',
    subcategory: 'Image Color Extraction',
    shortDescription: 'Inspect pixels, extract color palettes, and copy HEX, RGB, RGBA, and HSL codes.',
    fullDescription: 'Interactive image color dropper with high-magnification pixel loupe inspection. Zoom in up to 8x around your cursor, target exact pixels with precision crosshairs, view instant HEX, RGB, RGBA, and HSL color codes, and build a color history palette with one-click clipboard copying.',
    searchKeywords: ['color picker', 'hex code', 'rgb picker', 'eyedropper', 'palette from photo', 'inspect color'],
    icon: 'Pipette',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.svg'],
    supportedOutputFormats: ['.txt', '.json'],
    processingEngine: 'HTML5 High-Precision Canvas Pixel Inspector',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your image',
        description: 'Drag and drop or upload any image, screenshot, design graphic, or photo.'
      },
      {
        step: 2,
        title: 'Hover and inspect pixels',
        description: 'Move your cursor or touch over the image. The magnifying loupe displays an 8x zoom of individual pixels under the crosshairs.'
      },
      {
        step: 3,
        title: 'Click to capture color',
        description: 'Click anywhere to capture the color. The tool automatically computes HEX, RGB, RGBA, and HSL values and adds the swatch to your palette history.'
      },
      {
        step: 4,
        title: 'Copy color codes',
        description: 'Click the "Copy" button next to HEX (#4F46E5) or RGB (rgb(79, 70, 229)) to paste directly into your CSS or design tool.'
      }
    ],
    faqs: [
      {
        question: 'Does this tool work with transparent PNG images?',
        answer: 'Yes! It accurately reads the RGBA alpha channel and reports transparency percentages.'
      },
      {
        question: 'Can I copy multiple colors in one session?',
        answer: 'Yes! Every picked color is saved into your active color palette history strip, allowing you to copy or export them whenever needed.'
      }
    ],
    relatedToolSlugs: ['color-picker-pdf', 'image-effects', 'watermark-images'],
    seoTitle: 'Color Picker from Image Online - Pixel Eyedropper & Palette | Vivexa Tools',
    seoDescription: 'Extract precise colors from any image. Magnifying loupe, crosshair pixel selector, HEX, RGB, RGBA, and HSL codes.'
  },
  {
    id: 'color-picker-from-pdf',
    name: 'Color Picker from PDF',
    slug: 'color-picker-pdf',
    category: 'color',
    subcategory: 'PDF Color Extraction',
    shortDescription: 'Render PDF pages, inspect branding colors, and copy HEX & RGB codes.',
    fullDescription: 'Extract authentic brand colors, logos, and vector fills directly from PDF documents. Renders PDF pages to high-resolution canvas with full page navigation, zoom controls, and interactive pixel sampling.',
    searchKeywords: ['pdf color picker', 'extract colors from pdf', 'pdf eyedropper', 'brand colors pdf'],
    icon: 'FileSpreadsheet',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.txt'],
    processingEngine: 'PDF.js & Canvas Pixel Inspector',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF document',
        description: 'Select the PDF document containing the colors you want to inspect.'
      },
      {
        step: 2,
        title: 'Navigate pages and zoom',
        description: 'Select the page you need and use zoom controls to inspect branding elements or illustrations.'
      },
      {
        step: 3,
        title: 'Click to sample color',
        description: 'Click on any part of the PDF page to extract the exact pixel color.'
      },
      {
        step: 4,
        title: 'Copy color codes',
        description: 'Copy HEX, RGB, or HSL color codes to your clipboard.'
      }
    ],
    faqs: [
      {
        question: 'Can I inspect colors across multi-page PDFs?',
        answer: 'Yes, use the previous and next page controls to navigate through all pages in the PDF.'
      }
    ],
    relatedToolSlugs: ['color-picker-image', 'pdf-to-jpg', 'merge-pdf'],
    seoTitle: 'Color Picker from PDF Online - Extract Colors from PDF Pages | Vivexa Tools',
    seoDescription: 'Extract exact brand and graphic colors from PDF documents online. Zoom, page navigation, and instant HEX/RGB copying.'
  }
];
