import { ToolDefinition } from '@/types/tools';

export const IMAGE_TOOLS: ToolDefinition[] = [
  // --- Photo & Signature Tools ---
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    slug: 'passport-photo-maker',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Create standard passport and visa photos with custom background colors and print sheets.',
    fullDescription: 'Generate compliant passport, visa, and ID photos directly in your browser. Choose official dimensions (US 2x2 inch, Schengen 35x45mm, India 3.5x4.5cm), crop the face, replace or select background color (white, light blue, off-white, light red), and export individual photos or a ready-to-print 4x6 inch photo grid.',
    searchKeywords: ['passport', 'visa', 'id photo', 'passport size photo', 'print sheet', '35x45', '2x2'],
    icon: 'UserCheck',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'HTML5 Canvas High-DPI Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your portrait photo',
        description: 'Upload a well-lit front-facing portrait photo from your computer or smartphone.'
      },
      {
        step: 2,
        title: 'Choose country or preset format',
        description: 'Select your target preset: Standard 35x45mm (Schengen/UK/India), US Visa 2x2 inch (51x51mm), or custom dimensions.'
      },
      {
        step: 3,
        title: 'Align face and pick background color',
        description: 'Adjust the crop box to center your eyes and head, and select a background color (White, Off-White, Light Blue, or Red).'
      },
      {
        step: 4,
        title: 'Download individual photo or print sheet',
        description: 'Download the single high-resolution 300 DPI photo or generate a 4x6 inch printable sheet with 6 or 8 photos.'
      }
    ],
    faqs: [
      {
        question: 'What is the standard resolution used for passport photos?',
        answer: 'All passport photos are exported at 300 DPI (Dots Per Inch) to guarantee sharp, clear prints at physical photo print kiosks.'
      },
      {
        question: 'Can I print multiple copies on a single 4x6 inch photo paper?',
        answer: 'Yes! Select the "Print Sheet (4x6 inch)" option to automatically arrange 6 or 8 copies with cutting guides.'
      }
    ],
    relatedToolSlugs: ['white-background-passport', 'red-background-passport', 'resize-image-3-5x4-5cm', 'image-compressor'],
    seoTitle: 'Passport Photo Maker Online Free - 35x45mm & 2x2 Inch | Vivexa Tools',
    seoDescription: 'Create compliant passport and visa photos online for free. Custom background colors, 300 DPI resolution, and printable 4x6 sheets.'
  },
  {
    id: 'generate-signature',
    name: 'Generate Signature',
    slug: 'generate-signature',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Draw a digital signature or type your name with handwriting fonts.',
    fullDescription: 'Create a clean, digital signature online. Draw your signature using a touchscreen or mouse, or type your name in artistic cursive styles. Export as a crisp, transparent PNG.',
    searchKeywords: ['signature', 'e-sign', 'draw signature', 'transparent signature', 'cursive'],
    icon: 'PenTool',
    supportedInputFormats: [],
    supportedOutputFormats: ['.png', '.jpg'],
    processingEngine: 'HTML5 Vector Canvas',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose draw or type mode',
        description: 'Select "Draw" to draw freely with your finger or mouse, or "Type" to generate from handwriting fonts.'
      },
      {
        step: 2,
        title: 'Customize ink color and stroke thickness',
        description: 'Pick ink color (Dark Blue, Black, or Custom) and stroke width.'
      },
      {
        step: 3,
        title: 'Download transparent PNG',
        description: 'Save your signature as a transparent PNG ready to be placed on contracts and application forms.'
      }
    ],
    faqs: [
      {
        question: 'Does the exported signature have a transparent background?',
        answer: 'Yes! Exporting as PNG provides a completely transparent background so you can overlay it on any document without white boxes.'
      }
    ],
    relatedToolSlugs: ['resize-signature-6x2cm-300dpi', 'resize-signature-50x20mm', 'sign-pdf'],
    seoTitle: 'Online Signature Generator - Draw or Type Digital Signature | Vivexa Tools',
    seoDescription: 'Create transparent digital signatures for free. Draw or type your signature and download as a clean PNG.'
  },
  {
    id: 'resize-signature-6x2cm-300dpi',
    name: 'Resize Signature to 6 cm × 2 cm at 300 DPI',
    slug: 'resize-signature-6x2cm-300dpi',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Resize signature to exactly 6x2 cm at 300 DPI (709 × 236 pixels).',
    fullDescription: 'Specifically formulated for government portals, exam applications (SSC, UPSC, Banking, IBPS, Railways), and official forms that require signatures resized to 6 cm × 2 cm at 300 DPI (709 × 236 pixels) under specific KB limits.',
    searchKeywords: ['6x2 cm', '300 dpi', 'signature 709x236', 'exam signature', 'ibps signature', 'ssc signature'],
    icon: 'Maximize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas DPI Resampling',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload signature photo or scan',
        description: 'Upload the photo of your paper signature.'
      },
      {
        step: 2,
        title: 'Auto crop and enhance contrast',
        description: 'The tool centers the signature, adjusts contrast to whiten paper background, and fits the 6x2 cm aspect ratio.'
      },
      {
        step: 3,
        title: 'Check size and download',
        description: 'Download the exact 709 × 236 px signature image at 300 DPI, optimized between 10 KB and 50 KB.'
      }
    ],
    faqs: [
      {
        question: 'Why 709 × 236 pixels?',
        answer: 'At 300 DPI, 1 inch equals 2.54 cm. Therefore, 6 cm = (6 / 2.54) * 300 = 709 pixels, and 2 cm = (2 / 2.54) * 300 = 236 pixels.'
      }
    ],
    relatedToolSlugs: ['resize-signature-50x20mm', 'passport-photo-maker', 'image-compressor'],
    seoTitle: 'Resize Signature to 6 cm x 2 cm at 300 DPI Online | Vivexa Tools',
    seoDescription: 'Resize your signature image to 6 cm x 2 cm at 300 DPI (709x236 px) for official exam portals. Fast & free.'
  },
  {
    id: 'resize-signature-50x20mm',
    name: 'Resize Signature to 50 mm × 20 mm',
    slug: 'resize-signature-50x20mm',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Resize signature to 50 mm × 20 mm (591 × 236 px at 300 DPI).',
    fullDescription: 'Format your signature image for online admissions and job portals that specify 50mm x 20mm dimensions. Clean paper background noise and optimize file weight under 50 KB.',
    searchKeywords: ['50x20 mm', 'signature', 'resize signature', 'exam portal'],
    icon: 'Maximize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas DPI Resampling',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload signature',
        description: 'Upload your signature image or scan.'
      },
      {
        step: 2,
        title: 'Verify dimensions',
        description: 'Image is mapped to 50 mm × 20 mm (591 × 236 px).'
      },
      {
        step: 3,
        title: 'Download file',
        description: 'Save the optimized signature.'
      }
    ],
    faqs: [
      {
        question: 'Will this fit official requirements?',
        answer: 'Yes, it meets standard 50x20mm physical specifications and complies with portal file size caps.'
      }
    ],
    relatedToolSlugs: ['resize-signature-6x2cm-300dpi', 'generate-signature'],
    seoTitle: 'Resize Signature to 50 mm x 20 mm Online | Vivexa Tools',
    seoDescription: 'Resize signature to 50 mm x 20 mm for government and college application forms.'
  },
  {
    id: 'resize-signature-35x45mm',
    name: 'Resize Signature to 35 mm × 45 mm',
    slug: 'resize-signature-35x45mm',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Resize signature or certificate photo to 35 mm × 45 mm.',
    fullDescription: 'Resize images and scanned signatures to standard 35 mm × 45 mm (413 × 531 pixels at 300 DPI).',
    searchKeywords: ['35x45 mm', 'signature', 'dimension', '35x45'],
    icon: 'Maximize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas Resampling',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload file',
        description: 'Upload your image or signature scan.'
      },
      {
        step: 2,
        title: 'Position and crop',
        description: 'Align the content within the 35x45mm ratio box.'
      },
      {
        step: 3,
        title: 'Export',
        description: 'Download the exact 35x45mm image.'
      }
    ],
    faqs: [
      {
        question: 'What is the pixel count for 35x45mm?',
        answer: 'At 300 DPI it is 413 × 531 pixels, and at 200 DPI it is 276 × 354 pixels.'
      }
    ],
    relatedToolSlugs: ['resize-image-3-5x4-5cm', 'passport-photo-maker'],
    seoTitle: 'Resize Signature to 35 mm x 45 mm Online | Vivexa Tools',
    seoDescription: 'Resize signature scans to 35 mm x 45 mm with high DPI precision.'
  },
  {
    id: 'white-background-passport',
    name: 'White Background Passport Photo',
    slug: 'white-background-passport',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Create a passport photo with a clean, solid white background.',
    fullDescription: 'Meets the strict requirements of US Visa, Schengen Visa, Canadian passport, and UK applications that mandate an untextured, pure white or off-white background.',
    searchKeywords: ['white background', 'passport photo white background', 'us visa photo', 'clean white'],
    icon: 'User',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas Portrait Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload portrait photo',
        description: 'Select your photo taken against any plain wall.'
      },
      {
        step: 2,
        title: 'Select White Background mode',
        description: 'Our engine applies contrast thresholding and replaces the backdrop with pure white (#FFFFFF).'
      },
      {
        step: 3,
        title: 'Crop and download',
        description: 'Align the face guide and download your white background photo.'
      }
    ],
    faqs: [
      {
        question: 'Is pure white background accepted for US Visa?',
        answer: 'Yes, the US Department of State requires a plain white or off-white background.'
      }
    ],
    relatedToolSlugs: ['red-background-passport', 'passport-photo-maker'],
    seoTitle: 'White Background Passport Photo Online | Vivexa Tools',
    seoDescription: 'Convert your portrait into a compliant white background passport photo online.'
  },
  {
    id: 'red-background-passport',
    name: 'Red Background Passport Photo',
    slug: 'red-background-passport',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Create a passport photo with an official red background.',
    fullDescription: 'Required for Indonesian, Vietnamese, and specific Southeast Asian official documents requiring a solid red background.',
    searchKeywords: ['red background', 'indonesia passport', 'red backdrop', 'id photo'],
    icon: 'User',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas Portrait Engine',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Select your front-facing portrait photo.'
      },
      {
        step: 2,
        title: 'Select red backdrop',
        description: 'Choose standard official red shade (#D32F2F).'
      },
      {
        step: 3,
        title: 'Download photo',
        description: 'Save the red-background ID photo.'
      }
    ],
    faqs: [
      {
        question: 'Which countries require red background photos?',
        answer: 'Indonesia (for odd birth years), Vietnam visas, and certain student IDs.'
      }
    ],
    relatedToolSlugs: ['white-background-passport', 'passport-photo-maker'],
    seoTitle: 'Red Background Passport Photo Online | Vivexa Tools',
    seoDescription: 'Create official red background ID and passport photos directly in your browser.'
  },
  {
    id: 'resize-image-3-5x4-5cm',
    name: 'Resize Image to 3.5 cm × 4.5 cm',
    slug: 'resize-image-3-5x4-5cm',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Resize image to 3.5 cm × 4.5 cm (standard passport dimensions).',
    fullDescription: 'Crop and resize any picture to 3.5 cm × 4.5 cm with configurable DPI (200 DPI = 276 × 354 px, 300 DPI = 413 × 531 px). Perfect for government forms and exams.',
    searchKeywords: ['3.5x4.5 cm', 'passport size', 'ssc photo size', 'upsc photo size'],
    icon: 'Maximize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas Resampling',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Select the photo you want to resize to 3.5x4.5 cm.'
      },
      {
        step: 2,
        title: 'Choose DPI',
        description: 'Select 300 DPI (high resolution print) or 200 DPI (web portals).'
      },
      {
        step: 3,
        title: 'Adjust crop and download',
        description: 'Center the image and download the resized file.'
      }
    ],
    faqs: [
      {
        question: 'Does this match Indian and European passport sizes?',
        answer: 'Yes, 3.5 cm x 4.5 cm is the standard physical size for Indian passports, Schengen visas, and UK driving licenses.'
      }
    ],
    relatedToolSlugs: ['passport-photo-maker', 'ssc-photo', 'upsc-photo'],
    seoTitle: 'Resize Image to 3.5 cm x 4.5 cm Online | Vivexa Tools',
    seoDescription: 'Resize your photo to exactly 3.5 cm x 4.5 cm at 300 or 200 DPI for free.'
  },
  {
    id: 'resize-image-2x2-inch',
    name: 'Resize Image to 2 × 2 Inch',
    slug: 'resize-image-2x2-inch',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Resize image to 2 × 2 Inch (600 × 600 px at 300 DPI for US Visa).',
    fullDescription: 'Format your photo to exactly 2 x 2 inches (51 x 51 mm or 600 x 600 pixels). Compliant with US Department of State visa and passport online portal requirements.',
    searchKeywords: ['2x2 inch', 'us visa photo', '600x600', '2 inch photo'],
    icon: 'Maximize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Canvas Resampling',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Upload your square or rectangular portrait photo.'
      },
      {
        step: 2,
        title: 'Crop to 1:1 aspect ratio',
        description: 'Position the crop box to center your head and shoulders.'
      },
      {
        step: 3,
        title: 'Export 600x600 px image',
        description: 'Download the exact 2x2 inch 600x600 px photo under 240 KB.'
      }
    ],
    faqs: [
      {
        question: 'Does this meet US Visa DS-160 upload specs?',
        answer: 'Yes! It generates 600x600 pixels JPEG with file size under 240 KB, meeting all DS-160 criteria.'
      }
    ],
    relatedToolSlugs: ['resize-image-600x600-pixels', 'passport-photo-maker'],
    seoTitle: 'Resize Image to 2x2 Inch Online (600x600 px) | Vivexa Tools',
    seoDescription: 'Resize photos to 2x2 inch (600x600 pixels) for US Visa and passport requirements.'
  },
  {
    id: 'resize-image-600x600-pixels',
    name: 'Resize Image to 600 × 600 Pixels',
    slug: 'resize-image-600x600-pixels',
    category: 'image',
    subcategory: 'Photo & Signature',
    shortDescription: 'Resize image to exact 600 × 600 pixels square.',
    fullDescription: 'Crop and scale any picture to a crisp 600 by 600 pixels. Ideal for US Visa submissions, profile avatars, and social platforms.',
    searchKeywords: ['600x600', 'square photo', 'avatar size', 'us visa 600x600'],
    icon: 'Square',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas Resampling',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Select your photo.'
      },
      {
        step: 2,
        title: 'Align square box',
        description: 'Center the desired area.'
      },
      {
        step: 3,
        title: 'Download 600x600 px image',
        description: 'Save the resized square file.'
      }
    ],
    faqs: [
      {
        question: 'Will image distortion occur?',
        answer: 'No, cropping preserves native aspect ratio without stretching.'
      }
    ],
    relatedToolSlugs: ['resize-image-2x2-inch', 'image-resizer'],
    seoTitle: 'Resize Image to 600x600 Pixels Online Free | Vivexa Tools',
    seoDescription: 'Resize any photo to exact 600x600 pixels square online without quality loss.'
  },
  {
    id: 'add-name-and-dob-on-photo',
    name: 'Add Name and DOB on Photo',
    slug: 'add-name-and-dob-on-photo',
    category: 'image',
    subcategory: 'General Editing',
    shortDescription: 'Stamp candidate name and date of photo/birth onto passport photos.',
    fullDescription: 'Mandatory requirement for SSC, UPSC, and Indian state recruitment portals. Add a clean white strip at the bottom of your passport photo containing your full name and Date of Photo (DOP) or Date of Birth (DOB) in clear black capital typography.',
    searchKeywords: ['name on photo', 'dob on photo', 'dop on photo', 'ssc photo name', 'upsc photo name'],
    icon: 'Type',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Canvas Overlay Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload passport photo',
        description: 'Upload your 3.5x4.5cm or standard portrait photo.'
      },
      {
        step: 2,
        title: 'Enter Name and Date',
        description: 'Type your Full Name (e.g., JOHN DOE) and Date (e.g., DOP: 15/10/2026).'
      },
      {
        step: 3,
        title: 'Preview and generate',
        description: 'Review the formatted text banner positioned at the bottom of the photo.'
      },
      {
        step: 4,
        title: 'Download compliant photo',
        description: 'Download the finalized photo with name and date embedded.'
      }
    ],
    faqs: [
      {
        question: 'Is this format accepted by SSC and UPSC?',
        answer: 'Yes! It creates the standard white banner with legible uppercase black lettering as specified in exam notifications.'
      }
    ],
    relatedToolSlugs: ['ssc-photo', 'upsc-photo', 'passport-photo-maker'],
    seoTitle: 'Add Name and DOB on Photo Online - SSC & UPSC Photo Maker | Vivexa Tools',
    seoDescription: 'Add candidate name and date of birth/photo at the bottom of your passport photo for exam portals.'
  },

  // --- Official Photo Sizes ---
  {
    id: 'ssc-photo',
    name: 'SSC Photo Maker & Resizer',
    slug: 'ssc-photo',
    category: 'image',
    subcategory: 'Official Photo Sizes',
    shortDescription: 'Resize and compress photo to 3.5x4.5cm between 20 KB and 50 KB.',
    fullDescription: 'Tailored for Staff Selection Commission (SSC CGL, CHSL, MTS, GD) portal specifications: 3.5 cm width × 4.5 cm height, file size between 20 KB and 50 KB, JPEG format.',
    searchKeywords: ['ssc photo', 'ssc cgl photo', 'ssc 20kb 50kb', 'ssc photo resizer'],
    icon: 'Award',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Canvas & Iterative Binary Compressor',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Select your recent front-facing photo.'
      },
      {
        step: 2,
        title: 'Verify SSC specifications',
        description: 'Dimensions are automatically locked to 3.5x4.5 cm and target weight to ~35 KB (within 20-50 KB range).'
      },
      {
        step: 3,
        title: 'Download SSC ready photo',
        description: 'Download your guaranteed compliant photo.'
      }
    ],
    faqs: [
      {
        question: 'Will the SSC portal accept this file?',
        answer: 'Yes, our iterative compressor ensures the exported JPEG is strictly within the 20 KB to 50 KB limit.'
      }
    ],
    relatedToolSlugs: ['add-name-and-dob-on-photo', 'resize-signature-6x2cm-300dpi', 'compress-20-50-kb'],
    seoTitle: 'SSC Photo Resizer Online - 20 KB to 50 KB (3.5x4.5cm) | Vivexa Tools',
    seoDescription: 'Resize and compress photo for SSC portal between 20 KB and 50 KB in 3.5x4.5 cm. Free and private.'
  },
  {
    id: 'pan-card-photo',
    name: 'PAN Card Photo & Signature Resizer',
    slug: 'pan-card-photo',
    category: 'image',
    subcategory: 'Official Photo Sizes',
    shortDescription: 'Resize photo to 2.5 × 3.5 cm (under 50 KB) and signature under 30 KB.',
    fullDescription: 'Complies with NSDL and UTIITSL PAN card application standards: Photo 2.5 cm × 3.5 cm at 200/300 DPI (under 50 KB), Signature 4.5 cm × 2.0 cm (under 30 KB).',
    searchKeywords: ['pan card photo', 'nsdl photo', 'utiitsl signature', 'pan photo resize'],
    icon: 'CreditCard',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Canvas & Iterative Binary Compressor',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload photo or signature',
        description: 'Upload your file.'
      },
      {
        step: 2,
        title: 'Select PAN Card Photo or Signature preset',
        description: 'Photo preset sets 2.5x3.5 cm under 50 KB; Signature sets under 30 KB.'
      },
      {
        step: 3,
        title: 'Download compliant image',
        description: 'Save the optimized image.'
      }
    ],
    faqs: [
      {
        question: 'Are NSDL and UTIITSL requirements identical?',
        answer: 'Both require 200 DPI resolution with photo under 50 KB and signature under 30 KB.'
      }
    ],
    relatedToolSlugs: ['ssc-photo', 'resize-signature-6x2cm-300dpi'],
    seoTitle: 'PAN Card Photo and Signature Resizer Online | Vivexa Tools',
    seoDescription: 'Resize photo and signature for NSDL / UTIITSL PAN card applications under 50 KB and 30 KB.'
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Photo & Signature Resizer',
    slug: 'upsc-photo',
    category: 'image',
    subcategory: 'Official Photo Sizes',
    shortDescription: 'Format photo (3.5x4.5cm, 20-300 KB) and signature for UPSC portal.',
    fullDescription: 'Format photos and signatures for the UPSC OTR (One Time Registration) portal with 350x350 to 1000x1000 pixels resolution, between 20 KB and 300 KB.',
    searchKeywords: ['upsc photo', 'upsc otr photo', 'upsc signature size', 'upsc photo 350x350'],
    icon: 'Award',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Canvas & Iterative Binary Compressor',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Select your photo.'
      },
      {
        step: 2,
        title: 'Add candidate name and date (if required)',
        description: 'UPSC guidelines require recent photos with candidate name and date of photo.'
      },
      {
        step: 3,
        title: 'Export UPSC compliant file',
        description: 'Download the optimized photo.'
      }
    ],
    faqs: [
      {
        question: 'Does UPSC require name and date on the photo?',
        answer: 'Yes, recent UPSC notifications specify the candidate name and date on which the photograph was taken.'
      }
    ],
    relatedToolSlugs: ['add-name-and-dob-on-photo', 'ssc-photo'],
    seoTitle: 'UPSC Photo and Signature Resizer Online | Vivexa Tools',
    seoDescription: 'Format and resize photo and signature for UPSC OTR portal. Compliant with 20-300 KB file requirements.'
  },

  // --- Compression Tools ---
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'image',
    subcategory: 'Compression',
    shortDescription: 'Compress JPG, PNG, and WebP images to exact target file sizes in KB or MB.',
    fullDescription: 'Powerful client-side image compression engine. Select a target size in KB (e.g. 20 KB, 50 KB, 100 KB, 200 KB) or use a percentage slider. Uses iterative binary search canvas encoding to hit your desired file weight without uploading files to remote servers.',
    searchKeywords: ['compress', 'shrink image', 'reduce image size', 'kb compressor', 'optimize image'],
    icon: 'Minimize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.webp'],
    processingEngine: 'Iterative Binary Search Canvas Encoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your image',
        description: 'Drag and drop your image or click to select a file from your device.'
      },
      {
        step: 2,
        title: 'Set target file size or quality',
        description: 'Click a preset (e.g. 20 KB, 50 KB, 100 KB, 200 KB) or enter a custom target size in KB.'
      },
      {
        step: 3,
        title: 'Run local compression',
        description: 'Our engine performs binary search iterations to find the exact balance between clarity and file weight.'
      },
      {
        step: 4,
        title: 'Download compressed image',
        description: 'Review the file size reduction percentage and download your optimized image.'
      }
    ],
    faqs: [
      {
        question: 'How does target size compression work in the browser?',
        answer: 'Our algorithm performs iterative binary-search encoding across quantization matrices and scale factors until the resulting file buffer matches your target KB.'
      },
      {
        question: 'Can any high-resolution photo be compressed to 10 KB without blurring?',
        answer: 'Very low targets like 10 KB require downsampling dimensions in addition to quality compression. Our tool intelligently adjusts dimensions when needed to prevent excessive artifacting.'
      }
    ],
    relatedToolSlugs: ['compress-to-50-kb', 'compress-to-100-kb', 'compress-to-20-kb', 'image-resizer'],
    seoTitle: 'Image Compressor Online - Compress Images to Exact KB | Vivexa Tools',
    seoDescription: 'Compress JPG, PNG, and WebP images to exact target sizes (20KB, 50KB, 100KB, etc.) in your browser. 100% private.'
  },
  {
    id: 'compress-to-20-kb',
    name: 'Compress Image to 20 KB',
    slug: 'compress-to-20-kb',
    category: 'image',
    subcategory: 'Compression',
    shortDescription: 'Compress image file size to exactly under 20 KB.',
    fullDescription: 'Compress signatures and profile photos to under 20 KB for admission forms and government job portals that enforce strict 20 KB ceilings.',
    searchKeywords: ['20 kb', 'compress to 20kb', 'under 20kb', 'photo 20kb'],
    icon: 'Minimize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Iterative Binary Search Canvas Encoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Select your image file.'
      },
      {
        step: 2,
        title: 'Apply 20 KB target',
        description: 'Engine optimizes quality to hit under 20 KB.'
      },
      {
        step: 3,
        title: 'Download',
        description: 'Save the compressed file.'
      }
    ],
    faqs: [
      {
        question: 'Will the file be strictly under 20 KB?',
        answer: 'Yes, our algorithm guarantees the output file does not exceed 20,480 bytes.'
      }
    ],
    relatedToolSlugs: ['compress-20-50-kb', 'compress-to-50-kb', 'image-compressor'],
    seoTitle: 'Compress Image to 20 KB Online Free | Vivexa Tools',
    seoDescription: 'Reduce image file size to under 20 KB online with binary-search compression. Free & fast.'
  },
  {
    id: 'compress-20-50-kb',
    name: 'Compress Image 20 KB – 50 KB',
    slug: 'compress-20-50-kb',
    category: 'image',
    subcategory: 'Compression',
    shortDescription: 'Optimize image to fall strictly between 20 KB and 50 KB.',
    fullDescription: 'The standard requirement for SSC, IBPS, and state government portals that reject files smaller than 20 KB or larger than 50 KB.',
    searchKeywords: ['20 to 50 kb', '20-50 kb', 'ssc photo 20 50 kb', 'compress 50kb'],
    icon: 'Minimize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Iterative Binary Search Canvas Encoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Upload your photo.'
      },
      {
        step: 2,
        title: 'Auto-calibrate to ~35 KB',
        description: 'The engine balances quality right in the center of the 20-50 KB range.'
      },
      {
        step: 3,
        title: 'Download file',
        description: 'Save the verified compliant photo.'
      }
    ],
    faqs: [
      {
        question: 'Why do portals reject files under 20 KB?',
        answer: 'Recruitment portals set lower limits to ensure uploaded photos are not so heavily compressed that facial details become unidentifiable.'
      }
    ],
    relatedToolSlugs: ['ssc-photo', 'compress-to-50-kb'],
    seoTitle: 'Compress Image to 20 KB - 50 KB Online | Vivexa Tools',
    seoDescription: 'Compress your image to strictly between 20 KB and 50 KB for official exams and portals.'
  },
  {
    id: 'compress-to-50-kb',
    name: 'Compress Image to 50 KB',
    slug: 'compress-to-50-kb',
    category: 'image',
    subcategory: 'Compression',
    shortDescription: 'Compress JPG and PNG images to under 50 KB.',
    fullDescription: 'Reduce image file size to 50 KB for online portals, email attachments, and web applications.',
    searchKeywords: ['50 kb', 'compress 50kb', 'under 50 kb', 'reduce to 50kb'],
    icon: 'Minimize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Iterative Binary Search Canvas Encoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Upload your image.'
      },
      {
        step: 2,
        title: 'Compress to 50 KB',
        description: 'The engine encodes the image to under 50 KB.'
      },
      {
        step: 3,
        title: 'Download',
        description: 'Save the compressed image.'
      }
    ],
    faqs: [
      {
        question: 'Is quality preserved?',
        answer: 'Yes, our encoder uses smooth downsampling to preserve edge sharpness.'
      }
    ],
    relatedToolSlugs: ['compress-to-100-kb', 'compress-to-20-kb', 'image-compressor'],
    seoTitle: 'Compress Image to 50 KB Online Free | Vivexa Tools',
    seoDescription: 'Compress images to under 50 KB online for free with instant client-side processing.'
  },
  {
    id: 'compress-to-100-kb',
    name: 'Compress Image to 100 KB',
    slug: 'compress-to-100-kb',
    category: 'image',
    subcategory: 'Compression',
    shortDescription: 'Reduce image file size to under 100 KB.',
    fullDescription: 'Compress photos, certificate scans, and documents to under 100 KB without significant visual loss.',
    searchKeywords: ['100 kb', 'compress 100kb', 'under 100 kb', 'reduce to 100kb'],
    icon: 'Minimize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Iterative Binary Search Canvas Encoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Select your photo or scan.'
      },
      {
        step: 2,
        title: 'Process to 100 KB',
        description: 'Click compress to reduce the file.'
      },
      {
        step: 3,
        title: 'Download',
        description: 'Save the 100 KB image.'
      }
    ],
    faqs: [
      {
        question: 'What types of images work best?',
        answer: 'JPG photos, certificates, ID cards, and scanned documents compress cleanly to 100 KB.'
      }
    ],
    relatedToolSlugs: ['compress-to-200-kb', 'compress-to-50-kb'],
    seoTitle: 'Compress Image to 100 KB Online Free | Vivexa Tools',
    seoDescription: 'Compress JPG and PNG images to under 100 KB online with zero server uploads.'
  },
  {
    id: 'compress-to-200-kb',
    name: 'Compress Image to 200 KB',
    slug: 'compress-to-200-kb',
    category: 'image',
    subcategory: 'Compression',
    shortDescription: 'Compress images and scans to under 200 KB.',
    fullDescription: 'Quickly compress large camera photos and certificate scans under 200 KB for online submissions and email.',
    searchKeywords: ['200 kb', 'compress 200kb', 'under 200 kb'],
    icon: 'Minimize2',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg'],
    processingEngine: 'Iterative Binary Search Canvas Encoder',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Select your file.'
      },
      {
        step: 2,
        title: 'Compress',
        description: 'Target 200 KB is applied.'
      },
      {
        step: 3,
        title: 'Download',
        description: 'Save your file.'
      }
    ],
    faqs: [
      {
        question: 'Does 200 KB maintain high clarity?',
        answer: 'Yes! 200 KB retains high visual fidelity for full-size photographs.'
      }
    ],
    relatedToolSlugs: ['compress-to-100-kb', 'image-compressor'],
    seoTitle: 'Compress Image to 200 KB Online Free | Vivexa Tools',
    seoDescription: 'Compress images to under 200 KB online with complete privacy.'
  },

  // --- General Resizing & Editing ---
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'image',
    subcategory: 'General Resizing',
    shortDescription: 'Resize images by pixels, percentage, centimeters, millimeters, or inches.',
    fullDescription: 'Comprehensive image resizing engine. Switch units easily between Pixels (px), Percentage (%), Centimeters (cm), Millimeters (mm), and Inches (in) with configurable DPI (72, 150, 300). Lock or unlock aspect ratio, and select output format.',
    searchKeywords: ['resize', 'scale', 'dimensions', 'cm to pixels', 'dpi', 'inches'],
    icon: 'Scaling',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png', '.webp'],
    processingEngine: 'High-Fidelity Canvas Bicubic Resampler',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your image',
        description: 'Select the image file you want to resize.'
      },
      {
        step: 2,
        title: 'Choose unit and enter dimensions',
        description: 'Select your unit (Pixels, Centimeters, Millimeters, or Inches) and enter width or height. Toggle "Lock Aspect Ratio" as needed.'
      },
      {
        step: 3,
        title: 'Configure DPI and Quality',
        description: 'Select DPI (300 for high resolution print, 72 for web screens) and output quality.'
      },
      {
        step: 4,
        title: 'Download resized image',
        description: 'Download your perfectly scaled image.'
      }
    ],
    faqs: [
      {
        question: 'How does DPI conversion to pixels work?',
        answer: 'Pixels = (Dimension in Inches) × DPI. For metric units, 1 inch = 2.54 cm = 25.4 mm.'
      },
      {
        question: 'Will resizing make my image blurry?',
        answer: 'Downscaling preserves sharpness with our bicubic canvas filter. Upscaling significantly beyond original dimensions will have inherent resolution limits.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'passport-photo-maker', 'crop-image'],
    seoTitle: 'Image Resizer Online - Resize by Pixels, CM, MM, Inches | Vivexa Tools',
    seoDescription: 'Resize images by pixels, centimeters, millimeters, or inches with custom DPI. Fast, high-quality, and 100% private.'
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    slug: 'crop-image',
    category: 'image',
    subcategory: 'General Editing',
    shortDescription: 'Crop photos with custom aspect ratios, circle crop, or freehand crop.',
    fullDescription: 'Crop images easily. Choose from standard aspect ratios (1:1 Square, 4:3, 16:9, 3:2, 9:16 Story), create circular profile avatars, or crop to rounded corners.',
    searchKeywords: ['crop', 'cut', 'circle crop', 'square crop', 'aspect ratio'],
    icon: 'Crop',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'HTML5 Canvas Cropper',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Select the image you want to crop.'
      },
      {
        step: 2,
        title: 'Select shape and aspect ratio',
        description: 'Choose Rectangle, 1:1 Square, 16:9 Widescreen, or Circle crop shape.'
      },
      {
        step: 3,
        title: 'Adjust crop boundary',
        description: 'Drag the crop handles to frame the exact area you want to keep.'
      },
      {
        step: 4,
        title: 'Export cropped image',
        description: 'Download the cropped image.'
      }
    ],
    faqs: [
      {
        question: 'Can I export a circular profile picture with a transparent background?',
        answer: 'Yes! When choosing Circle Crop and downloading as PNG, the area outside the circle is transparent.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'passport-photo-maker'],
    seoTitle: 'Crop Image Online Free - Square, Circle, & Custom Aspect Ratio | Vivexa Tools',
    seoDescription: 'Crop images online for free. Support for 1:1, 16:9, circle crop, and custom bounding boxes.'
  },
  {
    id: 'rotate-flip-image',
    name: 'Rotate & Flip Image',
    slug: 'rotate-image',
    category: 'image',
    subcategory: 'General Editing',
    shortDescription: 'Rotate images 90, 180, 270 degrees or flip horizontally/vertically.',
    fullDescription: 'Correct upside-down or sideways photos. Rotate clockwise or counter-clockwise, or flip horizontally (mirror effect) and vertically.',
    searchKeywords: ['rotate', 'flip', 'mirror', 'orientation', 'turn'],
    icon: 'RotateCw',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'HTML5 Canvas Matrix Transform',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Select the image requiring orientation adjustment.'
      },
      {
        step: 2,
        title: 'Click Rotate or Flip',
        description: 'Click Rotate 90° CW, 90° CCW, Flip Horizontal, or Flip Vertical.'
      },
      {
        step: 3,
        title: 'Save updated image',
        description: 'Download your corrected image.'
      }
    ],
    faqs: [
      {
        question: 'Does rotating reduce quality?',
        answer: 'No, matrix rotations of 90°, 180°, and flips are lossless re-mappings.'
      }
    ],
    relatedToolSlugs: ['crop-image', 'image-resizer'],
    seoTitle: 'Rotate and Flip Image Online Free | Vivexa Tools',
    seoDescription: 'Rotate photos 90, 180, 270 degrees or flip horizontally and vertically in your browser.'
  },
  {
    id: 'watermark-images',
    name: 'Watermark Images',
    slug: 'watermark-images',
    category: 'image',
    subcategory: 'General Editing',
    shortDescription: 'Protect photos with custom text or logo watermarks.',
    fullDescription: 'Add copyright notices, company names, or photography watermarks across your photos with customizable font, size, opacity, rotation angle, and placement.',
    searchKeywords: ['watermark', 'copyright', 'stamp', 'logo overlay'],
    icon: 'Stamp',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'HTML5 Canvas Text & Image Overlay',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload photo',
        description: 'Select the image you want to protect.'
      },
      {
        step: 2,
        title: 'Configure watermark text',
        description: 'Type your watermark (e.g. © 2026 YourBrand), set opacity (20%-80%), angle, and position.'
      },
      {
        step: 3,
        title: 'Download watermarked image',
        description: 'Save the protected image.'
      }
    ],
    faqs: [
      {
        question: 'Can I add watermark diagonally across the whole photo?',
        answer: 'Yes! Select "Diagonal Center" to overlay across the main subject to prevent unauthorized use.'
      }
    ],
    relatedToolSlugs: ['add-watermark-pdf', 'crop-image'],
    seoTitle: 'Watermark Images Online Free - Add Text & Logo Watermarks | Vivexa Tools',
    seoDescription: 'Add custom text watermarks to your photos online. Adjust opacity, font size, and diagonal angles.'
  },

  // --- Effects, Blur & Filters ---
  {
    id: 'image-effects-and-filters',
    name: 'Image Effects & Filters',
    slug: 'image-effects',
    category: 'image',
    subcategory: 'Effects & Filters',
    shortDescription: 'Apply Blur, Pixelate, Grayscale, Black & White, and Borders.',
    fullDescription: 'Client-side photo effects processor. Apply box or gaussian blur, pixelate sensitive areas, convert to vintage black & white or high-contrast grayscale, and add stylish solid borders.',
    searchKeywords: ['effects', 'filters', 'grayscale', 'black and white', 'blur', 'pixelate', 'border'],
    icon: 'Sparkles',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png'],
    processingEngine: 'Canvas Pixel Manipulation Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload image',
        description: 'Select your photo.'
      },
      {
        step: 2,
        title: 'Select effect',
        description: 'Choose Grayscale, Black & White, Blur, Pixelate, or Add Border.'
      },
      {
        step: 3,
        title: 'Adjust effect strength',
        description: 'Use the slider to calibrate blur radius, pixelate block size, or border width.'
      },
      {
        step: 4,
        title: 'Download result',
        description: 'Save your transformed image.'
      }
    ],
    faqs: [
      {
        question: 'Can I use this to blur or pixelate sensitive numbers or faces?',
        answer: 'Yes, adjusting the blur and pixelate sliders allows you to censor confidential details.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'crop-image', 'image-compressor'],
    seoTitle: 'Image Effects and Filters Online - Grayscale, Blur, Pixelate | Vivexa Tools',
    seoDescription: 'Apply blur, pixelate, black & white, grayscale, and borders to images online for free.'
  },

  // --- OCR & Text ---
  {
    id: 'image-to-text',
    name: 'Image to Text (OCR)',
    slug: 'image-to-text',
    category: 'image',
    subcategory: 'OCR & Text',
    shortDescription: 'Extract editable text from pictures and screenshots using browser OCR.',
    fullDescription: 'Extract text from photos, receipts, documents, book pages, and screenshots using client-side Tesseract.js OCR. Works 100% offline once the language model is loaded in your browser.',
    searchKeywords: ['ocr', 'image to text', 'extract text', 'jpg to text', 'png to text', 'tesseract'],
    icon: 'ScanText',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.txt'],
    processingEngine: 'Tesseract.js (Client-Side WASM)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload photo with text',
        description: 'Upload a clear photo, screenshot, or scan containing text.'
      },
      {
        step: 2,
        title: 'Select language',
        description: 'Select English (or other supported languages) to optimize character recognition.'
      },
      {
        step: 3,
        title: 'Extract text',
        description: 'Click "Start OCR Extraction". The neural net parses text characters on your device.'
      },
      {
        step: 4,
        title: 'Copy or download text',
        description: 'Copy the extracted text to clipboard with one click or save as a .txt file.'
      }
    ],
    faqs: [
      {
        question: 'Are my document images sent to any server for OCR?',
        answer: 'No. The Tesseract OCR engine runs completely inside your browser via WebAssembly.'
      },
      {
        question: 'How can I get the highest OCR accuracy?',
        answer: 'Ensure high contrast between text and background, good lighting, and avoid blurry or angled photos.'
      }
    ],
    relatedToolSlugs: ['ocr-pdf', 'pdf-to-markdown'],
    seoTitle: 'Image to Text Online (OCR) - Extract Text from Images Free | Vivexa Tools',
    seoDescription: 'Extract text from images, screenshots, and scans with 100% private client-side OCR. No server uploads.'
  },

  // --- Format Conversion ---
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    slug: 'image-converter',
    category: 'image',
    subcategory: 'Format Conversion',
    shortDescription: 'Convert between JPG, PNG, WebP, ICO, and AVIF formats.',
    fullDescription: 'Fast, high-fidelity image format conversion. Convert JPG to PNG (with transparency support), PNG to JPG (for smaller file size), WebP to PNG, or create .ico favicons.',
    searchKeywords: ['convert image', 'jpg to png', 'png to jpg', 'webp to png', 'favicon', 'ico'],
    icon: 'ArrowRightLeft',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.ico'],
    supportedOutputFormats: ['.jpg', '.png', '.webp', '.ico'],
    processingEngine: 'HTML5 Canvas Format Transcoder',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your image',
        description: 'Select any image file.'
      },
      {
        step: 2,
        title: 'Select target format',
        description: 'Choose JPG, PNG, WebP, or ICO (Favicon).'
      },
      {
        step: 3,
        title: 'Download converted image',
        description: 'Download the newly formatted file immediately.'
      }
    ],
    faqs: [
      {
        question: 'What happens to transparency when converting PNG to JPG?',
        answer: 'Because JPG does not support transparency, transparent areas are smoothly filled with a clean white background.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'favicon-generator'],
    seoTitle: 'Image Converter Online - Convert JPG, PNG, WebP, ICO | Vivexa Tools',
    seoDescription: 'Convert images between JPG, PNG, WebP, and ICO formats online for free with complete privacy.'
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    slug: 'favicon-generator',
    category: 'image',
    subcategory: 'Format Conversion',
    shortDescription: 'Generate a complete website favicon package with multi-size PNGs, apple-touch-icon, genuine ICO, and webmanifest.',
    fullDescription: 'Create a complete, production-ready favicon package from any image or logo. Generates all standard sizes (16x16 up to 512x512), iOS Apple Touch Icon (180x180), genuine multi-resolution favicon.ico with embedded 16/32/48px streams, site.webmanifest, and ready-to-copy HTML tags in a single downloadable ZIP.',
    searchKeywords: ['favicon', 'favicon generator', 'ico', 'apple touch icon', 'webmanifest', 'website icon', 'convert to ico'],
    icon: 'Globe',
    supportedInputFormats: ['.png', '.jpg', '.jpeg', '.webp', '.svg'],
    supportedOutputFormats: ['.zip', '.ico', '.png', '.webmanifest'],
    processingEngine: 'HTML5 Canvas & Pure Binary ICO Packager',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your logo or icon',
        description: 'Upload a square or rectangular PNG, JPG, WebP, or SVG logo.'
      },
      {
        step: 2,
        title: 'Customize fit and appearance',
        description: 'Choose Contain (no crop) or Cover (square crop), adjust inner margin padding slider, and set transparent or solid background color.'
      },
      {
        step: 3,
        title: 'Review live contextual previews',
        description: 'Inspect how your favicon will look in a real simulated browser tab, dark theme, and mobile iOS home screen.'
      },
      {
        step: 4,
        title: 'Download complete ZIP package',
        description: 'Click "Download ZIP Package" to get all 12 assets plus an instructional README.txt ready to drop into your website public folder.'
      }
    ],
    faqs: [
      {
        question: 'Does this generate a genuine Windows .ICO file or just a renamed PNG?',
        answer: 'It generates a genuine, authentic binary ICO file containing valid ICONDIR headers, directory entries, and embedded 16x16, 32x32, and 48x48 pixel streams compatible with all browsers and operating systems.'
      },
      {
        question: 'What files are included in the downloaded ZIP?',
        answer: 'The package contains favicon.ico, 9 standard PNG sizes (16, 32, 48, 64, 96, 128, 192, 256, 512 px), apple-touch-icon.png (180x180), site.webmanifest, and README.txt with HTML head tags.'
      },
      {
        question: 'Are my logos or brand assets uploaded to any server?',
        answer: 'Never. All canvas resizing, binary ICO encoding, and ZIP archiving take place 100% locally in your web browser.'
      }
    ],
    relatedToolSlugs: ['image-converter', 'image-resizer', 'crop-image', 'image-compressor'],
    seoTitle: 'Favicon Generator Online - Free Favicon Package & ICO Maker | Vivexa Tools',
    seoDescription: 'Generate complete website favicon packages online. Creates standard PNGs (16px to 512px), genuine favicon.ico, apple-touch-icon, and site.webmanifest in a free ZIP.'
  }
];
