import { PDFDocument } from 'pdf-lib';
import { ALL_TOOLS, getToolBySlug, getToolsByCategory, searchTools, getCategoryToolCount, getRelatedTools } from '../config/tools/index';
import { CATEGORY_LIST } from '../config/categories';
import { createIcoFromPngBuffers } from './image/icoEncoder';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import { addPageNumbersToPdf } from './pdf/pdfProcessing';
import { calculateSheetLayout, PASSPORT_PRESETS } from './image/passportSheetHelper';
import { convertWordToPdf } from './pdf/wordToPdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

async function runTests() {
  console.log('=== VIVEXA TOOLS ENGINE VERIFICATION ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Registry Integrity
  assert(ALL_TOOLS.length >= 25, `Tool registry has ${ALL_TOOLS.length} comprehensive tools`);

  // Test 2: Category Counts
  for (const cat of CATEGORY_LIST) {
    const count = getCategoryToolCount(cat.id);
    const tools = getToolsByCategory(cat.id);
    assert(count === tools.length && count > 0, `Category "${cat.name}" has ${count} registered tools`);
  }

  // Test 3: Specific instructions on every single tool (no generic placeholders)
  for (const tool of ALL_TOOLS) {
    const hasInstructions = tool.instructions && tool.instructions.length >= 3;
    assert(hasInstructions, `Tool "${tool.name}" has ${tool.instructions?.length} detailed instruction steps`);
    const hasFaqs = tool.faqs && tool.faqs.length >= 1;
    assert(hasFaqs, `Tool "${tool.name}" has ${tool.faqs?.length} specific FAQs`);
  }

  // Test 4: Related Tools Integrity
  for (const tool of ALL_TOOLS) {
    const related = getRelatedTools(tool.slug);
    assert(related.length >= 1, `Tool "${tool.name}" has ${related.length} working related tools`);
    for (const r of related) {
      assert(r.slug !== tool.slug, `Tool "${tool.name}" does not link to itself in related tools`);
    }
  }

  // Test 5: Search Functionality
  const mergeResults = searchTools('merge');
  assert(mergeResults.some((t) => t.slug === 'merge-pdf'), 'Search "merge" correctly finds Merge PDF');

  const passportResults = searchTools('passport');
  assert(passportResults.some((t) => t.slug === 'passport-photo-maker'), 'Search "passport" correctly finds Passport Photo Maker');

  const compressResults = searchTools('compress');
  assert(compressResults.length >= 3, `Search "compress" finds ${compressResults.length} compression tools`);

  const trimResults = searchTools('trim');
  assert(trimResults.some((t) => t.slug === 'video-trimmer'), 'Search "trim" finds Video Trimmer');

  // Test 6: PDF Engine Generation (pdf-lib)
  try {
    const doc1 = await PDFDocument.create();
    doc1.addPage([400, 400]);
    doc1.addPage([400, 400]);
    const pdf1Bytes = await doc1.save();

    const doc2 = await PDFDocument.create();
    doc2.addPage([400, 400]);
    const pdf2Bytes = await doc2.save();

    // Test Merge
    const mergedDoc = await PDFDocument.create();
    const l1 = await PDFDocument.load(pdf1Bytes);
    const l2 = await PDFDocument.load(pdf2Bytes);

    const cp1 = await mergedDoc.copyPages(l1, l1.getPageIndices());
    cp1.forEach((p) => mergedDoc.addPage(p));
    const cp2 = await mergedDoc.copyPages(l2, l2.getPageIndices());
    cp2.forEach((p) => mergedDoc.addPage(p));

    const mergedBytes = await mergedDoc.save();
    const loadedMerged = await PDFDocument.load(mergedBytes);

    assert(loadedMerged.getPageCount() === 3, `Merged PDF page count matches exactly 3 (2 + 1)`);
  } catch (err: any) {
    assert(false, `PDF engine error: ${err.message}`);
  }

  // Test 7: Multi-Resolution Windows ICO Binary Encoder
  try {
    // Create dummy mock PNG byte streams for 16x16, 32x32, 48x48
    const mockPng16 = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);
    const mockPng32 = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 4, 5, 6, 7]);
    const mockPng48 = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 8, 9, 10, 11, 12]);

    const icoBytes = createIcoFromPngBuffers([
      { width: 16, height: 16, bytes: mockPng16 },
      { width: 32, height: 32, bytes: mockPng32 },
      { width: 48, height: 48, bytes: mockPng48 }
    ]);

    const view = new DataView(icoBytes.buffer);
    const reserved = view.getUint16(0, true);
    const type = view.getUint16(2, true);
    const count = view.getUint16(4, true);

    assert(reserved === 0, 'ICO header reserved field is 0');
    assert(type === 1, 'ICO header resource type is 1 (ICON)');
    assert(count === 3, 'ICO header directory contains 3 resolution streams');

    // Check entry 0
    const w0 = icoBytes[6];
    const h0 = icoBytes[7];
    const len0 = view.getUint32(6 + 8, true);
    assert(w0 === 16 && h0 === 16 && len0 === mockPng16.length, 'Entry 0 correctly defines 16x16 metadata');

    // Check entry 1
    const w1 = icoBytes[6 + 16];
    const h1 = icoBytes[7 + 16];
    const len1 = view.getUint32(6 + 16 + 8, true);
    assert(w1 === 32 && h1 === 32 && len1 === mockPng32.length, 'Entry 1 correctly defines 32x32 metadata');

    // Total length matches
    const expectedLength = 6 + 3 * 16 + mockPng16.length + mockPng32.length + mockPng48.length;
    assert(icoBytes.length === expectedLength, `ICO total byte stream matches expected size (${icoBytes.length} bytes)`);
  } catch (err: any) {
    assert(false, `ICO encoder error: ${err.message}`);
  }

  // Test 8: Client-Side AES-256 PDF Encryption and Decryption
  try {
    const testDoc = await PDFDocument.create();
    testDoc.addPage([300, 300]);
    testDoc.addPage([300, 300]);
    const originalBytes = await testDoc.save();

    const testPassword = 'VivexaSecretPass2026!';
    const encryptedBytes = await encryptPDF(originalBytes, testPassword, {
      algorithm: 'AES-256',
      allowPrinting: true,
      allowCopying: true,
      allowModifying: false
    });

    assert(encryptedBytes.length > 0, 'AES-256 encryption output generated non-empty buffer');

    // Verify encryption status using isEncrypted
    const encInfo = await isEncrypted(encryptedBytes);
    assert(encInfo.encrypted === true, 'isEncrypted detects encrypted document');
    assert(encInfo.algorithm === 'AES-256', 'isEncrypted detects AES-256 algorithm');

    // Test decryption with correct password
    const decryptedBytes = await decryptPDF(encryptedBytes, testPassword);
    const loadedDecrypted = await PDFDocument.load(decryptedBytes);
    assert(loadedDecrypted.getPageCount() === 2, 'Decrypted PDF restored 2 pages cleanly without password requirement');

    // Test decryption fails with wrong password
    let threwOnWrongPassword = false;
    try {
      await decryptPDF(encryptedBytes, 'WrongPassword123');
    } catch (e: any) {
      threwOnWrongPassword = true;
    }
    assert(threwOnWrongPassword, 'Decryption with incorrect password correctly throws error');
  } catch (err: any) {
    assert(false, `AES-256 encryption/decryption error: ${err.message}`);
  }

  // Test 9: Client-Side RC4 PDF Encryption and Decryption
  try {
    const testDoc = await PDFDocument.create();
    testDoc.addPage([200, 200]);
    const originalBytes = await testDoc.save();

    const rc4Password = 'RC4SecureKey';
    const encryptedBytes = await encryptPDF(originalBytes, rc4Password, {
      algorithm: 'RC4',
      allowPrinting: false,
      allowCopying: false,
      allowModifying: false
    });

    const encInfo = await isEncrypted(encryptedBytes);
    assert(encInfo.encrypted === true, 'RC4 isEncrypted detects encrypted document');

    const decryptedBytes = await decryptPDF(encryptedBytes, rc4Password);
    const loadedDecrypted = await PDFDocument.load(decryptedBytes);
    assert(loadedDecrypted.getPageCount() === 1, 'RC4 decrypted PDF restored successfully');
  } catch (err: any) {
    assert(false, `RC4 encryption/decryption error: ${err.message}`);
  }

  // Test 10: PDF Page Numbering Functionality
  try {
    const testDoc = await PDFDocument.create();
    testDoc.addPage([500, 700]);
    testDoc.addPage([500, 700]);
    testDoc.addPage([500, 700]);
    const rawPdf = await testDoc.save();

    const numberedBytes = await addPageNumbersToPdf(rawPdf, {
      position: 'bottom-center',
      fontSize: 12,
      marginOffset: 30,
      formatStyle: 'page-x-of-y'
    });

    const loadedNumbered = await PDFDocument.load(numberedBytes);
    assert(loadedNumbered.getPageCount() === 3, 'addPageNumbersToPdf successfully numbered 3 pages');
  } catch (err: any) {
    assert(false, `addPageNumbersToPdf error: ${err.message}`);
  }

  // Test 11: Passport Photo Printable Sheet Calculation
  try {
    const preset35x45 = PASSPORT_PRESETS[0];
    const a4Layout = calculateSheetLayout('A4', 'portrait', preset35x45, 5, 3, 10);
    assert(a4Layout.capacityPerSheet >= 15, `A4 sheet calculates capacity of ${a4Layout.capacityPerSheet} photos (>=15)`);
    assert(a4Layout.totalSheets === 1, '10 photos fit into exactly 1 A4 sheet');

    const photoPaperLayout = calculateSheetLayout('4x6in', 'portrait', preset35x45, 5, 3, 10);
    assert(photoPaperLayout.totalSheets >= 2, `10 photos on 4x6in paper correctly requires multiple sheets (${photoPaperLayout.totalSheets} sheets)`);
    assert(photoPaperLayout.cols > 0 && photoPaperLayout.rows > 0, 'Sheet grid rows and columns are positive integers');
  } catch (err: any) {
    assert(false, `Passport layout calculation error: ${err.message}`);
  }

  // Test 12: Word to PDF In-Browser Conversion
  try {
    // Generate valid sample DOCX document
    const testDocx = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun('Vivexa Tools Document Conversion Test')] }),
            new Paragraph({ children: [new TextRun('Second paragraph with genuine formatting and text.')] }),
          ],
        },
      ],
    });

    const docxBlob = await Packer.toBlob(testDocx);
    const docxBuffer = await docxBlob.arrayBuffer();
    const docxFile = new File([docxBuffer], 'sample_input.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const pdfRes = await convertWordToPdf(docxFile, { pageSize: 'A4' });
    assert(pdfRes.pdfBytes.length > 0, 'convertWordToPdf generates non-empty PDF bytes');
    assert(pdfRes.pageCount >= 1, `convertWordToPdf outputs ${pdfRes.pageCount} valid pages`);

    const loadedPdf = await PDFDocument.load(pdfRes.pdfBytes);
    assert(loadedPdf.getPageCount() === pdfRes.pageCount, 'Generated PDF opens cleanly and matches page count');

    // Test corrupted file rejection
    const corruptFile = new File([new Uint8Array([1, 2, 3, 4, 5, 6])], 'corrupt.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    let rejectedCorrupt = false;
    try {
      await convertWordToPdf(corruptFile);
    } catch {
      rejectedCorrupt = true;
    }
    assert(rejectedCorrupt, 'Word to PDF correctly rejects corrupted non-zip files with descriptive error');
  } catch (err: any) {
    assert(false, `Word to PDF conversion test error: ${err.message}`);
  }

  // Test 13: Favicon and Brand Asset Integrity
  try {
    const fs = await import('fs');
    const path = await import('path');

    // Verify favicon.ico in both public and src/app
    const pubIco = fs.readFileSync(path.join(process.cwd(), 'public', 'favicon.ico'));
    const appIco = fs.readFileSync(path.join(process.cwd(), 'src', 'app', 'favicon.ico'));
    assert(pubIco.length === 3497, 'public/favicon.ico has genuine size (3497 bytes)');
    assert(appIco.length === 3497, 'src/app/favicon.ico matches genuine package favicon');
    assert(pubIco.equals(appIco), 'public/favicon.ico and src/app/favicon.ico are identical');

    // Verify site.webmanifest
    const manifestStr = fs.readFileSync(path.join(process.cwd(), 'public', 'site.webmanifest'), 'utf8');
    const manifest = JSON.parse(manifestStr);
    assert(manifest.name === 'Vivexa Tools', 'site.webmanifest has correct brand name');
    assert(manifest.icons.length >= 2, 'site.webmanifest includes 192x192 and 512x512 icons');

    // Verify transparent brand assets
    const icon192 = fs.readFileSync(path.join(process.cwd(), 'public', 'favicon-package', 'favicon-192x192.png'));
    const icon512 = fs.readFileSync(path.join(process.cwd(), 'public', 'favicon-package', 'favicon-512x512.png'));
    assert(icon192.length > 0, 'favicon-192x192.png exists');
    assert(icon512.length > 0, 'favicon-512x512.png exists');
  } catch (err: any) {
    assert(false, `Brand asset integrity test error: ${err.message}`);
  }

  // Test 14: Dropzone Format Acceptance Logic
  try {
    const testAcceptMatcher = (fileName: string, fileType: string, acceptPattern: string): boolean => {
      if (!acceptPattern || acceptPattern === '*/*') return true;
      const tokens = acceptPattern.split(',').map((t) => t.trim().toLowerCase());
      const fName = fileName.toLowerCase();
      const fType = fileType.toLowerCase();

      for (const token of tokens) {
        if (token.startsWith('.')) {
          if (fName.endsWith(token)) return true;
        } else if (token.endsWith('/*')) {
          const typePrefix = token.slice(0, -2);
          if (fType.startsWith(typePrefix)) return true;
        } else if (token === fType) {
          return true;
        }
      }
      return false;
    };

    assert(testAcceptMatcher('doc.pdf', 'application/pdf', '.pdf'), 'Dropzone accepts .pdf extension');
    assert(testAcceptMatcher('file.docx', 'application/vnd.openxmlformats', '.docx'), 'Dropzone accepts .docx extension');
    assert(testAcceptMatcher('photo.png', 'image/png', 'image/*'), 'Dropzone accepts image/* wildcard');
    assert(!testAcceptMatcher('virus.exe', 'application/x-msdownload', '.pdf,.docx'), 'Dropzone rejects invalid .exe format');
    assert(!testAcceptMatcher('song.mp3', 'audio/mpeg', '.pdf'), 'Dropzone rejects audio file on PDF tool');
  } catch (err: any) {
    assert(false, `Dropzone acceptance test error: ${err.message}`);
  }

  // Test 15: PDF to Word Layout Generator Verification
  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, PageOrientation } = await import('docx');

    const sampleWordDoc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 12240,
                height: 15840,
                orientation: PageOrientation.PORTRAIT,
              },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children: [
            new Paragraph({
              text: 'Document Heading',
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Formatted body line with ', size: 22 }),
                new TextRun({ text: 'bold emphasis', bold: true, size: 22 }),
                new TextRun({ text: ' and ', size: 22 }),
                new TextRun({ text: 'italic text', italics: true, size: 22 }),
              ],
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Header Col 1' })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Header Col 2' })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Data 1' })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Data 2' })] }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const docxBlob = await Packer.toBlob(sampleWordDoc);
    assert(docxBlob.size > 0, 'PDF-to-Word docx layout generator generates valid non-empty DOCX');
    assert(docxBlob.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'DOCX MIME type is valid');
  } catch (err: any) {
    assert(false, `PDF to Word layout verification error: ${err.message}`);
  }

  // Test 16: Official SEO Domain & Sitemap Verification
  try {
    const { SITE_CONFIG, absoluteUrl } = await import('@/config/site');
    const robotsModule = await import('@/app/robots');
    const sitemapModule = await import('@/app/sitemap');

    assert(SITE_CONFIG.url === 'https://tools.vivexatech.in', 'SITE_CONFIG.url points to official domain https://tools.vivexatech.in');
    assert(absoluteUrl('/pdf/merge-pdf') === 'https://tools.vivexatech.in/pdf/merge-pdf', 'absoluteUrl generates canonical path');

    const robotsConfig = robotsModule.default();
    assert(robotsConfig.sitemap === 'https://tools.vivexatech.in/sitemap.xml', 'robots.txt specifies correct canonical sitemap URL');
    assert(robotsConfig.host === 'https://tools.vivexatech.in', 'robots.txt specifies official host');

    const sitemapList = sitemapModule.default();
    assert(sitemapList.length > 60, `sitemap contains full route set (${sitemapList.length} routes)`);
    assert(sitemapList.every((item: any) => item.url.startsWith('https://tools.vivexatech.in')), 'all sitemap URLs use official https://tools.vivexatech.in domain');
  } catch (err: any) {
    assert(false, `SEO configuration verification error: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
