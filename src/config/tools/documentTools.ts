import { ToolDefinition } from '@/types/tools';

export const DOCUMENT_TOOLS: ToolDefinition[] = [
  {
    id: 'resume-generator',
    name: 'Professional Resume Generator',
    slug: 'resume-generator',
    category: 'document',
    subcategory: 'Career & Resume',
    shortDescription: 'Build modern, ATS-friendly resumes with real-time formatting and instant PDF download.',
    fullDescription: 'Create clean, modern, ATS-compliant resumes tailored for corporate jobs, startups, and academic roles. Enter contact details, career summary, work history, education, skills, projects, and certifications. Preview live changes in a clean A4 layout and print or save as a pixel-perfect PDF with no forced sign-ups or subscription locks.',
    searchKeywords: ['resume generator', 'cv maker', 'free resume builder', 'ats resume maker', 'download resume pdf', 'job resume creator'],
    icon: 'FileText',
    supportedInputFormats: ['Form Input', 'JSON Profile Backup'],
    supportedOutputFormats: ['Printable A4 Resume', '.pdf', '.json'],
    processingEngine: 'ATS-Optimized CSS Print Vector Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Enter Contact & Personal Information',
        description: 'Provide your full name, target job title, email, phone number, location, and LinkedIn or portfolio URLs.'
      },
      {
        step: 2,
        title: 'Add Work Experience & Education',
        description: 'Detail your past roles, company names, key achievements with bullet points, and university degrees.'
      },
      {
        step: 3,
        title: 'List Skills & Projects',
        description: 'Highlight technical and soft skills, plus standout personal or open-source projects.'
      },
      {
        step: 4,
        title: 'Export Print-Ready PDF',
        description: 'Review the live preview and download your clean, ATS-friendly PDF resume instantly.'
      }
    ],
    faqs: [
      {
        question: 'Is this resume format ATS-friendly?',
        answer: 'Yes! The resume uses standard headings, clear semantic text layout, and zero complex graphics that confuse Applicant Tracking Systems.'
      },
      {
        question: 'Can I save my resume data to edit later?',
        answer: 'Yes! You can export a JSON backup file and re-import it anytime to update your experience without re-typing.'
      }
    ],
    relatedToolSlugs: ['cgpa-to-percentage', 'document-details-extractor', 'pdf-to-word'],
    seoTitle: 'Free Resume Generator Online - ATS-Friendly CV Maker & PDF Export | Vivexa Tools',
    seoDescription: 'Build modern, ATS-friendly resumes for free. Live A4 preview, clean formatting, JSON profile backup, and instant PDF download.'
  },
  {
    id: 'collage-maker',
    name: 'Photo Collage Maker',
    slug: 'collage-maker',
    category: 'document',
    subcategory: 'Photo Collages',
    shortDescription: 'Combine multiple photos into beautiful grids with custom borders, ratios, and colors.',
    fullDescription: 'Combine multiple pictures into stunning photo grids and social collages right in your browser. Choose from 2, 3, 4, 6, and 9-photo layouts; customize aspect ratios (1:1 Square for Instagram, 4:5 Portrait, 16:9 Landscape, 9:16 Story); adjust border spacing, rounded corner radius, and background colors; and export high-resolution JPEG or PNG files.',
    searchKeywords: ['collage maker', 'photo collage', 'picture grid maker', 'combine photos', 'instagram grid collage', 'photo collage free'],
    icon: 'LayoutGrid',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.png', '.jpg'],
    processingEngine: 'High-DPI HTML5 Canvas Multi-Image Composition Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload Photos',
        description: 'Select or drag and drop 2 to 9 photos from your device.'
      },
      {
        step: 2,
        title: 'Select Grid Layout & Ratio',
        description: 'Pick an arrangement (2-split, 3-column, 2x2 grid, 3x3) and select the desired aspect ratio.'
      },
      {
        step: 3,
        title: 'Customize Spacing & Colors',
        description: 'Adjust border thickness, rounded photo corners, and frame background colors.'
      },
      {
        step: 4,
        title: 'Download High-Res Collage',
        description: 'Export your combined collage in full resolution as a PNG or JPG photo.'
      }
    ],
    faqs: [
      {
        question: 'Are my uploaded photos compressed or reduced in quality?',
        answer: 'No! The canvas renders using high-DPI scaling to preserve crisp details from your original photos.'
      },
      {
        question: 'Can I swap the position of photos in the collage?',
        answer: 'Yes! You can re-order or replace any photo slot easily before downloading.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'passport-photo-maker', 'color-picker-image'],
    seoTitle: 'Free Photo Collage Maker Online - Grid Layouts & High-Res Export | Vivexa Tools',
    seoDescription: 'Create beautiful photo collages online for free. Flexible grid layouts, customizable borders, Instagram aspect ratios, and high-res downloads.'
  },
  {
    id: 'document-details-extractor',
    name: 'Document Details Extractor (Privacy-First ID OCR)',
    slug: 'document-details-extractor',
    category: 'document',
    subcategory: 'Document OCR',
    shortDescription: 'Extract details from PAN, Aadhaar, Driving Licences, and IDs with local privacy masking.',
    fullDescription: 'A privacy-first optical character recognition tool designed to extract key fields from government and identity documents (Aadhaar cards, PAN cards, Driving Licences, Passports). All OCR preprocessing and text recognition take place 100% locally on your machine. Features automatic document type detection, Aadhaar number masking (XXXX XXXX 1234) for privacy compliance, field-by-field verification, and JSON/CSV export.',
    searchKeywords: ['document details extractor', 'pan card ocr', 'aadhaar ocr', 'id card details extractor', 'mask aadhaar number', 'privacy ocr'],
    icon: 'BadgeCheck',
    supportedInputFormats: ['.png', '.jpg', '.jpeg', '.webp', '.pdf'],
    supportedOutputFormats: ['Extracted Fields Table', '.json', '.csv', '.txt'],
    processingEngine: 'Local Preprocessed OCR with Privacy-First RegEx Rule Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload Identity Document or Photo',
        description: 'Upload a clear photo or scanned PDF of your Aadhaar card, PAN card, Driving Licence, or document.'
      },
      {
        step: 2,
        title: 'Select OCR Language & Privacy Preferences',
        description: 'Choose English or Hindi language recognition, and ensure "Mask Aadhaar Numbers" is active for privacy protection.'
      },
      {
        step: 3,
        title: 'Click Extract Details',
        description: 'The engine applies high-contrast preprocessing and extracts Name, Document Number, Date of Birth, Gender, and Address.'
      },
      {
        step: 4,
        title: 'Review and Export',
        description: 'Inspect the extracted fields, verify accuracy against the preview, and copy text or export as structured JSON/CSV.'
      }
    ],
    faqs: [
      {
        question: 'Is it safe to upload my Aadhaar or PAN card here?',
        answer: 'Yes, because you are NOT uploading them anywhere! Vivexa Tools has zero backend servers. The OCR runs entirely inside your browser memory, and the image never touches the internet.'
      },
      {
        question: 'Does this tool automatically mask Aadhaar numbers?',
        answer: 'Yes! By default, the first 8 digits of Aadhaar numbers are masked with XXXX-XXXX for regulatory compliance and identity protection.'
      }
    ],
    relatedToolSlugs: ['ocr-pdf', 'resume-generator', 'qr-code-scanner'],
    seoTitle: 'Free Document Details Extractor Online - Privacy-First ID & PAN OCR | Vivexa Tools',
    seoDescription: 'Extract fields from Aadhaar cards, PAN cards, and identity documents locally in your browser. Automatic privacy masking, zero server uploads, and JSON/CSV export.'
  }
];
