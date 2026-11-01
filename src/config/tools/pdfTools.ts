import { ToolDefinition } from '@/types/tools';

export const PDF_TOOLS: ToolDefinition[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    category: 'pdf',
    subcategory: 'Organize PDF',
    shortDescription: 'Combine multiple PDF files into one single document in seconds.',
    fullDescription: 'Merge two or more PDF files into a single unified document directly in your browser. Reorder files before combining, verify page counts, and download the merged file with zero server uploads.',
    searchKeywords: ['merge', 'combine', 'join', 'pdf', 'bind', 'unite'],
    icon: 'Combine',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your PDF documents',
        description: 'Drag and drop two or more PDF files into the upload box or click to select them from your computer or phone.'
      },
      {
        step: 2,
        title: 'Arrange documents in order',
        description: 'Use the up and down arrows or drag the file cards to arrange the documents in the exact order you want them merged.'
      },
      {
        step: 3,
        title: 'Merge and assemble',
        description: 'Click the "Merge PDF Files" button. Our client-side engine reads each page buffer and synthesizes them into a single stream.'
      },
      {
        step: 4,
        title: 'Download the combined PDF',
        description: 'Save the new merged PDF document to your device immediately. None of your data leaves your device.'
      }
    ],
    faqs: [
      {
        question: 'Is there a limit on how many PDF files I can merge?',
        answer: 'You can merge as many files as your device memory allows. For optimal performance on mobile devices, we recommend merging up to 20-30 documents at a time.'
      },
      {
        question: 'Are my uploaded PDF files kept private?',
        answer: 'Yes, 100%. All processing is carried out entirely inside your web browser using WebAssembly and JavaScript. No files are uploaded to any server.'
      },
      {
        question: 'Can I reorder files before merging?',
        answer: 'Yes! Simply use the up and down controls on the file cards to place pages exactly where you want them.'
      }
    ],
    relatedToolSlugs: ['split-pdf', 'remove-pdf-pages', 'compress-pdf', 'rotate-pdf'],
    seoTitle: 'Merge PDF Online Free - Combine PDF Files Locally | Vivexa Tools',
    seoDescription: 'Combine multiple PDF files into a single document for free. 100% private in-browser processing with no file size limits or watermarks.'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    category: 'pdf',
    subcategory: 'Organize PDF',
    shortDescription: 'Extract specific page ranges or split a PDF into separate files.',
    fullDescription: 'Split a large PDF document into individual pages or extract custom page intervals such as "1-3, 5, 8-12". Download as a single extracted PDF or all pages archived into a ZIP file.',
    searchKeywords: ['split', 'extract', 'separate', 'divide', 'pages', 'cut'],
    icon: 'Scissors',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf', '.zip'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Select your PDF document',
        description: 'Upload the PDF document you want to split or extract pages from.'
      },
      {
        step: 2,
        title: 'Specify page ranges or extraction mode',
        description: 'Enter specific page intervals (e.g., 1-4, 7, 9-12) or choose "Extract every page as an individual file".'
      },
      {
        step: 3,
        title: 'Execute split',
        description: 'Click "Split PDF". The browser isolates the requested page trees and generates independent documents.'
      },
      {
        step: 4,
        title: 'Download extracted files',
        description: 'Download the extracted PDF or download all separated pages in a single convenient ZIP package.'
      }
    ],
    faqs: [
      {
        question: 'How do I specify multiple page ranges?',
        answer: 'Enter comma-separated numbers and ranges. For example: "1-3, 5, 8-10" will extract pages 1 through 3, page 5, and pages 8 through 10.'
      },
      {
        question: 'Does splitting affect the original formatting?',
        answer: 'No. Vector text, images, annotations, and embedded fonts in the extracted pages are preserved identically.'
      }
    ],
    relatedToolSlugs: ['merge-pdf', 'remove-pdf-pages', 'extract-pdf-pages', 'compress-pdf'],
    seoTitle: 'Split PDF Online Free - Extract PDF Pages Privately | Vivexa Tools',
    seoDescription: 'Split PDF files into individual pages or extract custom page ranges in your browser with zero data uploads.'
  },
  {
    id: 'remove-pdf-pages',
    name: 'Remove PDF Pages',
    slug: 'remove-pdf-pages',
    category: 'pdf',
    subcategory: 'Organize PDF',
    shortDescription: 'Delete unwanted pages from your PDF document easily.',
    fullDescription: 'Select and permanently remove unnecessary, blank, or confidential pages from any PDF document. View page numbers, enter page lists to delete, and get a clean PDF.',
    searchKeywords: ['remove', 'delete', 'cut', 'pages', 'unwanted', 'blank'],
    icon: 'Trash2',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload your PDF',
        description: 'Upload the PDF file containing pages you want to eliminate.'
      },
      {
        step: 2,
        title: 'Select pages to remove',
        description: 'Type page numbers or ranges to remove (e.g., 2, 4-6) or click page chips.'
      },
      {
        step: 3,
        title: 'Process page removal',
        description: 'Click "Remove Pages". The engine reconstructs the document without the discarded pages.'
      },
      {
        step: 4,
        title: 'Download modified PDF',
        description: 'Instantly download your cleaned PDF file.'
      }
    ],
    faqs: [
      {
        question: 'Can I remove the first or last page?',
        answer: 'Yes, you can remove any page as long as at least one page remains in the final document.'
      }
    ],
    relatedToolSlugs: ['extract-pdf-pages', 'split-pdf', 'merge-pdf', 'rotate-pdf'],
    seoTitle: 'Remove Pages from PDF Online - Delete Unwanted PDF Pages | Vivexa Tools',
    seoDescription: 'Delete blank or unwanted pages from PDF documents. Fast, secure, and private browser-based tool.'
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    slug: 'extract-pdf-pages',
    category: 'pdf',
    subcategory: 'Organize PDF',
    shortDescription: 'Create a new PDF containing only the pages you need.',
    fullDescription: 'Extract one or more pages from any PDF file to create a brand new concise document. Ideal for isolating invoices, certificates, or book chapters.',
    searchKeywords: ['extract', 'isolate', 'select', 'pages', 'portion'],
    icon: 'FileOutput',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload source PDF',
        description: 'Select the PDF document from which you need specific pages.'
      },
      {
        step: 2,
        title: 'Enter pages to extract',
        description: 'Type the pages you want in the new document, such as "1, 3, 5-7".'
      },
      {
        step: 3,
        title: 'Generate isolated PDF',
        description: 'Click "Extract Pages" to build a fresh PDF containing exclusively those pages.'
      },
      {
        step: 4,
        title: 'Download',
        description: 'Save your newly created document to your device.'
      }
    ],
    faqs: [
      {
        question: 'Will links and vector drawings inside the extracted pages be intact?',
        answer: 'Yes, all visual vectors, high-resolution imagery, and text styling in extracted pages are preserved.'
      }
    ],
    relatedToolSlugs: ['split-pdf', 'remove-pdf-pages', 'merge-pdf'],
    seoTitle: 'Extract PDF Pages Online - Isolate PDF Sections | Vivexa Tools',
    seoDescription: 'Extract specific pages from your PDF file into a new document. Completely private and client-side.'
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    slug: 'organize-pdf',
    category: 'pdf',
    subcategory: 'Organize PDF',
    shortDescription: 'Sort, reorder, rotate, or delete individual pages in your PDF.',
    fullDescription: 'Comprehensive PDF page management. Reorder pages arbitrarily, delete individual pages, and rotate oriented pages all in a single workspace.',
    searchKeywords: ['organize', 'sort', 'reorder', 'rearrange', 'pages', 'shuffle'],
    icon: 'Layers',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF to reorganize',
        description: 'Select your PDF document to load its page list.'
      },
      {
        step: 2,
        title: 'Rearrange page sequence',
        description: 'Specify the desired page sequence (e.g. 3, 1, 2, 4) to reorder your document.'
      },
      {
        step: 3,
        title: 'Export organized PDF',
        description: 'Click "Export Organized PDF" to rebuild the document with your new layout.'
      },
      {
        step: 4,
        title: 'Save file',
        description: 'Download the newly sequenced PDF to your device.'
      }
    ],
    faqs: [
      {
        question: 'Can I reverse the entire page order?',
        answer: 'Yes! Simply input the page numbers in reverse order (e.g. 5, 4, 3, 2, 1) and click export.'
      }
    ],
    relatedToolSlugs: ['merge-pdf', 'split-pdf', 'rotate-pdf'],
    seoTitle: 'Organize PDF Pages Online - Reorder and Sort PDF | Vivexa Tools',
    seoDescription: 'Reorder, rotate, and reorganize pages in your PDF documents with ease. 100% private.'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    category: 'pdf',
    subcategory: 'Scan & Optimize',
    shortDescription: 'Reduce PDF file size while maintaining readability.',
    fullDescription: 'Optimize PDF structure, strip redundant metadata, de-duplicate structural dictionaries, and compress stream objects directly in the client browser.',
    searchKeywords: ['compress', 'reduce', 'shrink', 'smaller', 'kb', 'optimize'],
    icon: 'Minimize2',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib & Stream Optimizer',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose PDF file',
        description: 'Upload the PDF you want to compress. Our tool inspects the structure and stream tables.'
      },
      {
        step: 2,
        title: 'Select compression intensity',
        description: 'Choose between Standard Optimization (cleans metadata, compresses object streams) or Strong.'
      },
      {
        step: 3,
        title: 'Optimize document',
        description: 'Click "Compress PDF". Our engine restructures cross-reference tables and compresses raw streams.'
      },
      {
        step: 4,
        title: 'Review savings and download',
        description: 'Compare the initial file size with the optimized size and download your lighter PDF.'
      }
    ],
    faqs: [
      {
        question: 'Will every PDF become significantly smaller?',
        answer: 'Compression effectiveness depends on what makes the PDF large. Text-heavy PDFs and unoptimized vector documents shrink substantially. PDFs already containing pre-compressed JPEG scans may see modest reduction.'
      },
      {
        question: 'Does this compress images inside the PDF?',
        answer: 'Stream deflating and object table compression are applied locally. For scanned image-only PDFs, converting pages to compressed WebP/JPG and rebuilding creates extreme reductions.'
      }
    ],
    relatedToolSlugs: ['merge-pdf', 'pdf-to-jpg', 'jpg-to-pdf', 'optimize-pdf'],
    seoTitle: 'Compress PDF Online - Reduce PDF File Size Privately | Vivexa Tools',
    seoDescription: 'Reduce PDF file size locally in your browser. Clean metadata, optimize streams, and download smaller files with complete privacy.'
  },
  {
    id: 'optimize-pdf',
    name: 'Optimize PDF',
    slug: 'optimize-pdf',
    category: 'pdf',
    subcategory: 'Scan & Optimize',
    shortDescription: 'Clean unused objects and streamline PDF structure.',
    fullDescription: 'Purge orphaned objects, clean up redundant document revisions, and rebuild the cross-reference table to streamline PDFs for faster web viewing and sharing.',
    searchKeywords: ['optimize', 'fast web view', 'clean', 'structure', 'repair'],
    icon: 'Sparkles',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF',
        description: 'Select your PDF document for structural inspection.'
      },
      {
        step: 2,
        title: 'Run optimization',
        description: 'Click "Optimize Structure" to purge orphaned references and compress streams.'
      },
      {
        step: 3,
        title: 'Download optimized PDF',
        description: 'Save the streamlined PDF document.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between optimize and compress?',
        answer: 'Optimization focuses on removing ghost data, unreferenced elements, and revision history, ensuring compatibility and faster loading.'
      }
    ],
    relatedToolSlugs: ['compress-pdf', 'repair-pdf'],
    seoTitle: 'Optimize PDF Online - Streamline PDF Documents | Vivexa Tools',
    seoDescription: 'Streamline and optimize PDF structure locally for fast loading and clean distribution.'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    category: 'pdf',
    subcategory: 'Edit PDF',
    shortDescription: 'Permanently rotate PDF pages 90, 180, or 270 degrees.',
    fullDescription: 'Fix upside-down or sideways pages in scanned documents. Rotate all pages, only odd pages, only even pages, or specific pages with a single click.',
    searchKeywords: ['rotate', 'turn', 'orientation', 'upside down', 'portrait', 'landscape'],
    icon: 'RotateCw',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your document',
        description: 'Select the PDF with pages that need orientation correction.'
      },
      {
        step: 2,
        title: 'Choose rotation angle and scope',
        description: 'Pick 90° clockwise, 180° flip, or 270° counter-clockwise. Choose "All pages", "Odd pages", or "Even pages".'
      },
      {
        step: 3,
        title: 'Apply rotation',
        description: 'Click "Rotate PDF" to rewrite the page rotation coordinate matrices.'
      },
      {
        step: 4,
        title: 'Download corrected PDF',
        description: 'Download the properly oriented PDF file immediately.'
      }
    ],
    faqs: [
      {
        question: 'Is rotation permanent?',
        answer: 'Yes! The rotation metadata is embedded directly into the PDF, so it opens correctly in every PDF viewer and printer.'
      }
    ],
    relatedToolSlugs: ['merge-pdf', 'split-pdf', 'organize-pdf'],
    seoTitle: 'Rotate PDF Online - Fix Upside Down PDF Pages | Vivexa Tools',
    seoDescription: 'Permanently rotate PDF pages 90, 180, or 270 degrees. Works on all or selected pages with 100% privacy.'
  },
  {
    id: 'add-page-numbers-to-pdf',
    name: 'Add Page Numbers',
    slug: 'add-page-numbers',
    category: 'pdf',
    subcategory: 'Edit PDF',
    shortDescription: 'Insert custom page numbers, headers, and footers into PDF pages.',
    fullDescription: 'Add sequential page numbering (e.g., "Page 1 of 12", "1 / 10", or simple "1") to the header or footer of your PDF. Customize position, font size, margins, and starting number.',
    searchKeywords: ['page numbers', 'numbering', 'footer', 'header', 'pagination'],
    icon: 'Hash',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF',
        description: 'Select the document requiring pagination.'
      },
      {
        step: 2,
        title: 'Configure number format and placement',
        description: 'Select position (Bottom Center, Bottom Right, Top Right, etc.), format (e.g., "Page X of Y"), and starting page.'
      },
      {
        step: 3,
        title: 'Embed page numbers',
        description: 'Click "Add Page Numbers" to render vector text coordinates onto each page.'
      },
      {
        step: 4,
        title: 'Download numbered PDF',
        description: 'Save your professionally paginated document.'
      }
    ],
    faqs: [
      {
        question: 'Can I exclude the first page (cover page)?',
        answer: 'Yes! You can choose to start numbering from page 2 or skip the first page completely.'
      }
    ],
    relatedToolSlugs: ['add-watermark-pdf', 'edit-pdf', 'merge-pdf'],
    seoTitle: 'Add Page Numbers to PDF Online Free | Vivexa Tools',
    seoDescription: 'Insert clean page numbers, headers, and footers into your PDF documents in seconds.'
  },
  {
    id: 'add-watermark-pdf',
    name: 'Add Watermark to PDF',
    slug: 'add-watermark',
    category: 'pdf',
    subcategory: 'Edit PDF',
    shortDescription: 'Stamp custom text or confidential watermarks across PDF pages.',
    fullDescription: 'Protect your documents by overlaying customizable watermark text such as "CONFIDENTIAL", "DRAFT", or your company name diagonally or horizontally with adjustable transparency.',
    searchKeywords: ['watermark', 'stamp', 'confidential', 'draft', 'overlay', 'protect'],
    icon: 'Stamp',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib (Client-Side)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your PDF document',
        description: 'Select the PDF document you wish to watermark.'
      },
      {
        step: 2,
        title: 'Configure watermark text and style',
        description: 'Type your custom watermark text (e.g. "CONFIDENTIAL"), adjust font size, angle (45° diagonal or horizontal), and opacity (10% - 80%).'
      },
      {
        step: 3,
        title: 'Apply watermark',
        description: 'Click "Apply Watermark". The vector text layer is drawn across all pages.'
      },
      {
        step: 4,
        title: 'Download watermarked PDF',
        description: 'Save your protected PDF document.'
      }
    ],
    faqs: [
      {
        question: 'Will the watermark obscure the text beneath it?',
        answer: 'No, because the opacity is adjustable (default 25%), the underlying text remains readable while clearly displaying the stamp.'
      }
    ],
    relatedToolSlugs: ['protect-pdf', 'sign-pdf', 'rotate-pdf'],
    seoTitle: 'Add Watermark to PDF Online - Free PDF Stamping | Vivexa Tools',
    seoDescription: 'Stamp confidential or custom text watermarks onto PDF pages with custom angle and opacity.'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    slug: 'sign-pdf',
    category: 'pdf',
    subcategory: 'PDF Security',
    shortDescription: 'Draw or upload your signature and stamp it onto your PDF.',
    fullDescription: 'Sign contracts, application forms, and agreements right in your browser. Draw your signature using touch or mouse, or upload a transparent PNG signature, and position it on any page.',
    searchKeywords: ['sign', 'signature', 'contract', 'agreement', 'e-sign', 'autograph'],
    icon: 'PenTool',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib & HTML5 Canvas',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF to sign',
        description: 'Select your PDF document requiring a signature.'
      },
      {
        step: 2,
        title: 'Create your signature',
        description: 'Draw your signature directly on the digital pad, type your name with a script font, or upload a signature image.'
      },
      {
        step: 3,
        title: 'Place signature on page',
        description: 'Select target page and adjust placement (Bottom Right, Bottom Left, or Center) and size.'
      },
      {
        step: 4,
        title: 'Embed and download',
        description: 'Click "Sign and Download PDF" to embed the signature securely into the document structure.'
      }
    ],
    faqs: [
      {
        question: 'Is my drawn signature uploaded to a server?',
        answer: 'Never. Both your PDF and your signature drawing are merged entirely inside your device browser.'
      }
    ],
    relatedToolSlugs: ['protect-pdf', 'add-watermark', 'generate-signature'],
    seoTitle: 'Sign PDF Online Free - Draw and Place Signature | Vivexa Tools',
    seoDescription: 'Sign PDF documents online for free. Draw your digital signature or upload an image without server uploads.'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    slug: 'protect-pdf',
    category: 'pdf',
    subcategory: 'PDF Security',
    shortDescription: 'Lock your PDF document with strong password protection.',
    fullDescription: 'Add password encryption to your PDF document to prevent unauthorized opening and viewing. Uses standard client-side PDF encryption.',
    searchKeywords: ['protect', 'password', 'encrypt', 'lock', 'security'],
    icon: 'Lock',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'Client-side PDF Encryption Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Choose PDF to protect',
        description: 'Upload the confidential PDF document.'
      },
      {
        step: 2,
        title: 'Set password',
        description: 'Enter a strong password and confirm it. Note: Be sure to remember your password, as files cannot be recovered without it.'
      },
      {
        step: 3,
        title: 'Encrypt document',
        description: 'Click "Protect PDF". The encryption dictionaries are configured.'
      },
      {
        step: 4,
        title: 'Download locked PDF',
        description: 'Save your password-protected PDF.'
      }
    ],
    faqs: [
      {
        question: 'What happens if I forget my password?',
        answer: 'Because processing is local and zero-knowledge, no password copies are stored anywhere. Keep your password in a safe password manager.'
      }
    ],
    relatedToolSlugs: ['unlock-pdf', 'sign-pdf', 'add-watermark'],
    seoTitle: 'Protect PDF Online - Add Password to PDF | Vivexa Tools',
    seoDescription: 'Lock and protect PDF files with strong password encryption directly in your browser.'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    slug: 'unlock-pdf',
    category: 'pdf',
    subcategory: 'PDF Security',
    shortDescription: 'Remove password and security restrictions from your PDF.',
    fullDescription: 'Enter the known password to decrypt the PDF document and export an unencrypted version for hassle-free archiving and sharing.',
    searchKeywords: ['unlock', 'decrypt', 'remove password', 'unprotect'],
    icon: 'Unlock',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib & Client Decryption',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload locked PDF',
        description: 'Select the password-protected PDF document.'
      },
      {
        step: 2,
        title: 'Enter current password',
        description: 'Type the document password to authorize decryption.'
      },
      {
        step: 3,
        title: 'Remove protection',
        description: 'Click "Unlock PDF" to strip the encryption dictionary.'
      },
      {
        step: 4,
        title: 'Download unprotected PDF',
        description: 'Download the unlocked PDF file that opens without prompting for a password.'
      }
    ],
    faqs: [
      {
        question: 'Can I unlock a PDF without knowing the password?',
        answer: 'No. To protect document privacy and security, standard decryption requires the valid password.'
      }
    ],
    relatedToolSlugs: ['protect-pdf', 'compress-pdf'],
    seoTitle: 'Unlock PDF Online - Remove PDF Password | Vivexa Tools',
    seoDescription: 'Decrypt and remove passwords from your PDF documents easily and privately.'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    category: 'pdf',
    subcategory: 'Convert from PDF',
    shortDescription: 'Convert every PDF page into crisp, high-resolution JPG images.',
    fullDescription: 'Render each page of your PDF into high-definition JPG or PNG images using client-side canvas rendering. Download individual page images or all pages bundled in a single ZIP file.',
    searchKeywords: ['pdf to jpg', 'pdf to image', 'convert', 'extract images', 'jpeg'],
    icon: 'Image',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.jpg', '.png', '.zip'],
    processingEngine: 'PDF.js & HTML5 Canvas',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF document',
        description: 'Select the PDF file whose pages you wish to convert to images.'
      },
      {
        step: 2,
        title: 'Select image format and resolution',
        description: 'Choose JPG or PNG format, and select your rendering quality scale (150 DPI or 300 DPI high-definition).'
      },
      {
        step: 3,
        title: 'Render pages',
        description: 'Click "Convert to JPG". The browser executes canvas rendering for each page in real time.'
      },
      {
        step: 4,
        title: 'Preview and download',
        description: 'Download individual page images or click "Download All as ZIP" to get every page.'
      }
    ],
    faqs: [
      {
        question: 'Are the converted JPG images clear and sharp?',
        answer: 'Yes! We render at 2x and 3x device pixel ratios to ensure crisp text and clear graphics.'
      },
      {
        question: 'Can I convert multi-page PDFs?',
        answer: 'Yes. Every page is rendered and you can download them all together in a single ZIP archive.'
      }
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-to-text', 'image-compressor'],
    seoTitle: 'PDF to JPG Online - Convert PDF Pages to Images | Vivexa Tools',
    seoDescription: 'Convert PDF pages into high-quality JPG or PNG images directly in your browser. Download individually or as ZIP.'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'pdf',
    subcategory: 'Convert to PDF',
    shortDescription: 'Turn JPG, PNG, and WebP images into a single professional PDF.',
    fullDescription: 'Convert one or more images into a unified PDF file. Configure page orientation (Portrait/Landscape/Auto), margins, and page sizes (A4, US Letter, or Fit to Image).',
    searchKeywords: ['jpg to pdf', 'image to pdf', 'photos to pdf', 'convert to pdf', 'png to pdf'],
    icon: 'FileUp',
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib & Canvas',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your photos',
        description: 'Select or drag and drop JPG, PNG, or WebP images.'
      },
      {
        step: 2,
        title: 'Reorder and adjust layout',
        description: 'Drag images into desired order, choose page size (A4, Letter, or Fit), and set orientation.'
      },
      {
        step: 3,
        title: 'Generate PDF',
        description: 'Click "Create PDF". The client engine embeds each image buffer into new PDF pages.'
      },
      {
        step: 4,
        title: 'Download new PDF',
        description: 'Save your freshly compiled PDF document.'
      }
    ],
    faqs: [
      {
        question: 'Can I combine multiple pictures into one PDF?',
        answer: 'Yes, select as many images as you need, arrange their order, and combine them into a single PDF.'
      }
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'merge-pdf', 'image-compressor'],
    seoTitle: 'JPG to PDF Online Free - Convert Images to PDF | Vivexa Tools',
    seoDescription: 'Convert JPG and PNG images into a clean PDF document for free. Choose A4 page size and margins with 100% privacy.'
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    slug: 'ocr-pdf',
    category: 'pdf',
    subcategory: 'Scan & Optimize',
    shortDescription: 'Extract editable text from scanned PDF documents using browser OCR.',
    fullDescription: 'Perform client-side optical character recognition (OCR) on scanned PDFs using Tesseract.js. Extract text, search content, and download as plain text (.txt) without sending documents to cloud APIs.',
    searchKeywords: ['ocr', 'text recognition', 'scanned pdf', 'extract text', 'tesseract'],
    icon: 'ScanText',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.txt'],
    processingEngine: 'Tesseract.js & PDF.js (Client-Side)',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload scanned PDF',
        description: 'Select the scanned PDF document you want to extract text from.'
      },
      {
        step: 2,
        title: 'Select OCR language',
        description: 'Choose your document language (English, Spanish, French, German, etc.).'
      },
      {
        step: 3,
        title: 'Run optical character recognition',
        description: 'Click "Start OCR". The WebAssembly engine analyzes character shapes on each page.'
      },
      {
        step: 4,
        title: 'Copy or download extracted text',
        description: 'Review the extracted text live, copy it to your clipboard, or save as a .txt file.'
      }
    ],
    faqs: [
      {
        question: 'Does this require uploading my scan to an external server?',
        answer: 'No! The OCR model runs directly in your browser using WebAssembly. The model weight is cached in your browser.'
      }
    ],
    relatedToolSlugs: ['image-to-text', 'pdf-to-markdown', 'pdf-to-jpg'],
    seoTitle: 'OCR PDF Online - Extract Text from Scanned PDF | Vivexa Tools',
    seoDescription: 'Extract text from scanned PDF documents with client-side OCR. 100% private in-browser recognition.'
  },
  {
    id: 'pdf-to-markdown',
    name: 'PDF to Markdown',
    slug: 'pdf-to-markdown',
    category: 'pdf',
    subcategory: 'OCR & Extraction',
    shortDescription: 'Extract text and headings from PDF and format as Markdown.',
    fullDescription: 'Convert readable PDF documents into clean, structured Markdown format (.md). Extracts text streams, detects headings and paragraphs, and outputs readable Markdown for note-taking apps and AI workflows.',
    searchKeywords: ['markdown', 'md', 'convert', 'notes', 'obsidian', 'text'],
    icon: 'FileCode',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.md', '.txt'],
    processingEngine: 'pdf-lib & Text Parser (Client-Side)',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload PDF',
        description: 'Select the text-based PDF you want to convert.'
      },
      {
        step: 2,
        title: 'Parse text and formatting',
        description: 'Click "Convert to Markdown" to extract page text and structure headings.'
      },
      {
        step: 3,
        title: 'Copy or save .md file',
        description: 'Inspect the Markdown preview, copy with one click, or download the .md document.'
      }
    ],
    faqs: [
      {
        question: 'Does this work on scanned PDFs?',
        answer: 'For scanned PDFs without selectable text, use our OCR PDF tool first to extract the text.'
      }
    ],
    relatedToolSlugs: ['ocr-pdf', 'pdf-to-jpg'],
    seoTitle: 'PDF to Markdown Online - Convert PDF to Clean Markdown | Vivexa Tools',
    seoDescription: 'Extract text from PDF documents and convert to clean Markdown format (.md) locally.'
  },
  {
    id: 'pdf-forms',
    name: 'PDF Forms',
    slug: 'pdf-forms',
    category: 'pdf',
    subcategory: 'Edit PDF',
    shortDescription: 'Inspect and fill interactive form fields in PDF documents.',
    fullDescription: 'Inspect interactive AcroForm fields (text fields, checkboxes, dropdowns) embedded in PDF documents, fill their values directly in your browser, and download the finalized PDF.',
    searchKeywords: ['forms', 'fill pdf', 'acroform', 'interactive', 'fields'],
    icon: 'CheckSquare',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib AcroForm Engine',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload interactive PDF form',
        description: 'Upload a PDF that contains fillable form fields.'
      },
      {
        step: 2,
        title: 'Fill form inputs',
        description: 'Enter your answers into the detected form field inputs.'
      },
      {
        step: 3,
        title: 'Save filled form',
        description: 'Click "Save Form" to write your inputs into the PDF and download the completed file.'
      }
    ],
    faqs: [
      {
        question: 'What if my PDF is a scanned form without digital inputs?',
        answer: 'For flat scans, use the "Sign PDF" or "Add Watermark" tools to overlay text and signatures onto the pages.'
      }
    ],
    relatedToolSlugs: ['sign-pdf', 'edit-pdf'],
    seoTitle: 'Fill PDF Forms Online - Interactive PDF Form Filler | Vivexa Tools',
    seoDescription: 'Fill and save interactive PDF forms in your browser without Adobe Acrobat.'
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF',
    slug: 'compare-pdf',
    category: 'pdf',
    subcategory: 'Organize PDF',
    shortDescription: 'Compare two PDF documents side-by-side to inspect changes.',
    fullDescription: 'Load two PDF documents side-by-side to compare page counts, structural metadata, and visual differences page-by-page directly in your browser.',
    searchKeywords: ['compare', 'diff', 'difference', 'side by side', 'verify'],
    icon: 'Columns',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'pdf-lib & Canvas Diff',
    status: 'available',
    isPopular: false,
    instructions: [
      {
        step: 1,
        title: 'Upload Document A and Document B',
        description: 'Upload the original PDF and the revised PDF document.'
      },
      {
        step: 2,
        title: 'Compare structure and metadata',
        description: 'Review page count comparisons, modification dates, and page size differences.'
      },
      {
        step: 3,
        title: 'Inspect page by page',
        description: 'Step through pages side-by-side to visually inspect text revisions.'
      }
    ],
    faqs: [
      {
        question: 'Are both documents kept confidential?',
        answer: 'Yes, both files are loaded directly into browser memory and are never uploaded to any remote server.'
      }
    ],
    relatedToolSlugs: ['merge-pdf', 'organize-pdf'],
    seoTitle: 'Compare PDF Online - Side-by-Side PDF Comparison | Vivexa Tools',
    seoDescription: 'Compare two PDF files side-by-side to detect revisions, page changes, and metadata differences.'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    slug: 'pdf-to-word',
    category: 'pdf',
    subcategory: 'Convert from PDF',
    shortDescription: 'Convert PDF documents into editable Microsoft Word (.docx) files.',
    fullDescription: 'Extract structured text, headings, paragraphs, and lists from PDF documents and export to valid Microsoft Word (.docx) format locally in your browser.',
    searchKeywords: ['word', 'docx', 'doc', 'convert', 'editable', 'pdf to docx'],
    icon: 'FileText',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.docx'],
    processingEngine: 'Pure Client-side DOCX Engine',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload your PDF',
        description: 'Select any digital or scanned PDF document from your device.'
      },
      {
        step: 2,
        title: 'Extract structured content',
        description: 'Click "Convert PDF to Word (.docx)" to parse text flow, headings, and page boundaries.'
      },
      {
        step: 3,
        title: 'Download DOCX file',
        description: 'Save the genuine Microsoft Word (.docx) file that opens in Word, Google Docs, or LibreOffice.'
      }
    ],
    faqs: [
      {
        question: 'Are my PDF documents uploaded to external servers for Word conversion?',
        answer: 'No. All PDF text parsing and Word document generation occurs 100% locally in your browser memory.'
      },
      {
        question: 'Does it support scanned PDFs?',
        answer: 'Yes! The converter includes an automated OCR fallback for pages without selectable digital text.'
      }
    ],
    relatedToolSlugs: ['pdf-to-markdown', 'ocr-pdf', 'pdf-to-jpg'],
    seoTitle: 'PDF to Word Converter Online - Free & Private | Vivexa Tools',
    seoDescription: 'Convert PDF documents into editable Microsoft Word (.docx) files locally in your browser with zero server uploads.'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    slug: 'word-to-pdf',
    category: 'pdf',
    subcategory: 'Convert to PDF',
    shortDescription: 'Convert Microsoft Word (.docx) documents into standard PDF files.',
    fullDescription: 'Convert Word documents (.docx) into standard PDF documents with preserved headings, lists, tables, typography, and page numbers.',
    searchKeywords: ['word to pdf', 'doc to pdf', 'convert', 'document', 'docx to pdf'],
    icon: 'FileType',
    supportedInputFormats: ['.docx'],
    supportedOutputFormats: ['.pdf'],
    processingEngine: 'Client-side PDF Synthesizer',
    status: 'available',
    isPopular: true,
    instructions: [
      {
        step: 1,
        title: 'Upload Word document',
        description: 'Select your Microsoft Word (.docx) file to convert.'
      },
      {
        step: 2,
        title: 'Configure page size',
        description: 'Choose A4 or US Letter page dimensions.'
      },
      {
        step: 3,
        title: 'Generate PDF',
        description: 'Click "Convert Word to PDF" to synthesize a paginated PDF document.'
      },
      {
        step: 4,
        title: 'Preview and Download',
        description: 'Inspect the live document preview and download your new PDF.'
      }
    ],
    faqs: [
      {
        question: 'Can I preview the PDF before downloading?',
        answer: 'Yes. The converter provides a built-in interactive multi-page document preview canvas.'
      },
      {
        question: 'Are my files kept private?',
        answer: 'Yes. Conversion is handled purely by in-memory browser synthesis with zero server transfers.'
      }
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'merge-pdf', 'pdf-to-word'],
    seoTitle: 'Word to PDF Online - Document to PDF Converter | Vivexa Tools',
    seoDescription: 'Convert Microsoft Word (.docx) documents to PDF format directly in your browser with complete privacy.'
  }
];
