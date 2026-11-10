import { ToolDefinition } from '@/types/tools';

export const QR_BARCODE_TOOLS: ToolDefinition[] = [
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    category: 'qr-barcode',
    subcategory: 'QR Code Generator',
    shortDescription: 'Generate custom QR codes for URLs, text, Wi-Fi networks, emails, and phone numbers.',
    fullDescription: 'Create high-resolution, scannable QR codes instantly in your browser. Supports web URLs, plain text, email messages, phone numbers, and Wi-Fi network credentials with custom foreground and background colors, configurable error correction levels, and instant PNG and SVG downloads.',
    searchKeywords: ['qr code generator', 'make qr code', 'custom qr code', 'wifi qr code', 'free qr code maker', 'svg qr code'],
    icon: 'QrCode',
    supportedInputFormats: ['Text', 'URL', 'Credentials'],
    supportedOutputFormats: ['.png', '.svg'],
    processingEngine: 'Client-Side Canvas & SVG QR Generator Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Select QR Code Content Type',
        description: 'Choose between Website URL, Plain Text, Wi-Fi Network, Email, or Phone Number.'
      },
      {
        step: 2,
        title: 'Enter Your Information',
        description: 'Fill in the corresponding fields such as website link, Wi-Fi password, or message body.'
      },
      {
        step: 3,
        title: 'Customize Colors and Size',
        description: 'Adjust the foreground color, background color, resolution size, and margin spacing.'
      },
      {
        step: 4,
        title: 'Download or Copy',
        description: 'Download the scannable QR code as a PNG or scalable vector SVG file for web or print.'
      }
    ],
    faqs: [
      {
        question: 'Do the generated QR codes expire?',
        answer: 'No! These are standard static QR codes. They embed your text directly into the pattern and will remain scannable forever without any subscription.'
      },
      {
        question: 'Can I print these QR codes on marketing banners?',
        answer: 'Yes! Download the SVG vector format for crisp, infinite scalability on physical print media, posters, or business cards.'
      }
    ],
    relatedToolSlugs: ['qr-code-scanner', 'barcode-generator', 'document-details-extractor'],
    seoTitle: 'Free QR Code Generator Online - Custom Colors & SVG | Vivexa Tools',
    seoDescription: 'Generate free, high-resolution QR codes for websites, Wi-Fi, text, and email. 100% private and static with no expiration. Download PNG or SVG.'
  },
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    slug: 'qr-code-scanner',
    category: 'qr-barcode',
    subcategory: 'QR Code Scanner',
    shortDescription: 'Scan and decode QR codes from saved images or directly through your device webcam.',
    fullDescription: 'A secure, browser-based QR code scanner that reads QR codes from image files (PNG, JPG, WebP) or live webcam video feeds. Features instant text extraction, safe URL inspection, and one-click clipboard copying without sending your photos to any remote server.',
    searchKeywords: ['qr code scanner', 'scan qr online', 'webcam qr reader', 'read qr code image', 'decode qr code'],
    icon: 'ScanLine',
    supportedInputFormats: ['.png', '.jpg', '.jpeg', '.webp', 'Webcam Stream'],
    supportedOutputFormats: ['Text', 'URL'],
    processingEngine: 'Browser Canvas ImageData QR Decoder (jsQR)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose Scanner Input Mode',
        description: 'Select either "Upload Image" to scan a photo file or "Use Camera" to scan via webcam.'
      },
      {
        step: 2,
        title: 'Provide QR Code',
        description: 'Drop an image containing a QR code, or align the code inside the live camera viewfinder.'
      },
      {
        step: 3,
        title: 'View Decoded Result',
        description: 'The extracted text or URL is decoded immediately with timestamp and format information.'
      },
      {
        step: 4,
        title: 'Copy or Open',
        description: 'Copy the decoded content to your clipboard or open verified links safely in a new browser tab.'
      }
    ],
    faqs: [
      {
        question: 'Is my camera stream or uploaded photo sent to any server?',
        answer: 'No. All image processing and camera frame decoding happen strictly inside your browser memory using WebAssembly and HTML5 canvas APIs.'
      },
      {
        question: 'Why is my QR code not detected?',
        answer: 'Ensure the image has good contrast, adequate lighting, and that all three corner positioning squares are clearly visible.'
      }
    ],
    relatedToolSlugs: ['qr-code-generator', 'barcode-scanner', 'document-details-extractor'],
    seoTitle: 'Free QR Code Scanner Online - Camera & Image Reader | Vivexa Tools',
    seoDescription: 'Scan QR codes from images or webcam video feeds directly in your browser. 100% private, fast, and free client-side QR decoder.'
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    slug: 'barcode-generator',
    category: 'qr-barcode',
    subcategory: 'Barcode Generator',
    shortDescription: 'Create retail Code 128, EAN-13, EAN-8, and UPC-A linear barcodes with instant preview.',
    fullDescription: 'Generate industry-standard 1D linear barcodes for product packaging, warehouse inventory, retail points of sale, and books. Supports Code 128, EAN-13 with automatic checksum validation, EAN-8, UPC-A, and Code 39 with configurable dimensions, text display, and high-DPI vector SVG export.',
    searchKeywords: ['barcode generator', 'make barcode', 'code 128 generator', 'ean 13 maker', 'upc barcode generator', 'free barcode'],
    icon: 'Barcode',
    supportedInputFormats: ['Alphanumeric Text', 'Numeric GTIN'],
    supportedOutputFormats: ['.png', '.svg'],
    processingEngine: 'JsBarcode Vector & Canvas Rendering Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Select Barcode Standard',
        description: 'Choose Code 128 (general purpose), EAN-13 (global retail), EAN-8 (small items), or UPC-A (North American retail).'
      },
      {
        step: 2,
        title: 'Enter Barcode Value',
        description: 'Type the product number or text. The system automatically computes and verifies checksum digits.'
      },
      {
        step: 3,
        title: 'Adjust Styling Options',
        description: 'Customize bar height, bar width, human-readable text visibility, font size, and colors.'
      },
      {
        step: 4,
        title: 'Export Barcode',
        description: 'Download crisp PNG images or scalable SVG vectors ready for label printers and packaging.'
      }
    ],
    faqs: [
      {
        question: 'Which barcode format should I use for retail products?',
        answer: 'EAN-13 is the worldwide standard for retail goods, while UPC-A is standard in the United States and Canada. For inventory or internal tracking, Code 128 is recommended.'
      },
      {
        question: 'Does the generator validate the checksum digit?',
        answer: 'Yes! For EAN and UPC formats, the generator verifies and calculates the mandatory Modulo 10 check digit to ensure scanner compatibility.'
      }
    ],
    relatedToolSlugs: ['barcode-scanner', 'qr-code-generator', 'invoice-generator'],
    seoTitle: 'Free Barcode Generator Online - Code 128, EAN-13, UPC-A | Vivexa Tools',
    seoDescription: 'Generate professional 1D barcodes for retail and inventory. Code 128, EAN-13, EAN-8, and UPC-A with automatic checksums and SVG/PNG download.'
  },
  {
    id: 'barcode-scanner',
    name: 'Barcode Scanner',
    slug: 'barcode-scanner',
    category: 'qr-barcode',
    subcategory: 'Barcode Scanner',
    shortDescription: 'Scan 1D barcodes from product photos or camera video with automatic format detection.',
    fullDescription: 'Detect and read 1D retail barcodes (EAN-13, UPC, Code 128, Code 39) directly in your browser. Upload photos of barcodes or aim your webcam at product boxes to decode numbers and product identifiers instantly without downloading apps.',
    searchKeywords: ['barcode scanner', 'scan barcode online', 'read ean 13', 'upc reader', 'webcam barcode scanner'],
    icon: 'ScanLine',
    supportedInputFormats: ['.png', '.jpg', '.jpeg', '.webp', 'Webcam Stream'],
    supportedOutputFormats: ['Text', 'GTIN / EAN'],
    processingEngine: 'Browser BarcodeDetector API & Canvas Subsampling Engine',
    status: 'available',
    instructions: [
      {
        step: 1,
        title: 'Upload Image or Enable Camera',
        description: 'Upload a picture of a barcode or activate your device webcam.'
      },
      {
        step: 2,
        title: 'Position the Barcode',
        description: 'Keep the barcode horizontal, well-lit, and in focus so the bars and spaces are distinct.'
      },
      {
        step: 3,
        title: 'Read Detected Data',
        description: 'The scanner automatically recognizes the barcode standard and outputs the raw numeric or alphanumeric value.'
      },
      {
        step: 4,
        title: 'Copy Information',
        description: 'Copy the detected barcode number to your clipboard with one click.'
      }
    ],
    faqs: [
      {
        question: 'What types of barcodes can this scanner read?',
        answer: 'It supports common 1D barcodes including EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, and ITF.'
      },
      {
        question: 'Are my scanned product images stored?',
        answer: 'No images or barcode data ever leave your device. All parsing happens locally in browser memory.'
      }
    ],
    relatedToolSlugs: ['barcode-generator', 'qr-code-scanner', 'document-details-extractor'],
    seoTitle: 'Free Barcode Scanner Online - Scan Product Barcodes | Vivexa Tools',
    seoDescription: 'Scan retail barcodes from photos or live camera video. Fast, client-side barcode reader with zero server uploads.'
  }
];
