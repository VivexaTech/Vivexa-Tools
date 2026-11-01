import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import mammoth from 'mammoth';

export interface WordToPdfResult {
  pdfBytes: Uint8Array;
  pageCount: number;
  wordCount: number;
  extractedHtml: string;
}

export async function convertWordToPdf(
  file: File,
  options: {
    pageSize?: 'A4' | 'Letter';
    fontSize?: number;
    onProgress?: (status: string) => void;
  } = {}
): Promise<WordToPdfResult> {
  // 1. Basic validation of DOCX file
  if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
    throw new Error('Please upload a valid Microsoft Word (.docx) document.');
  }

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength < 100) {
    throw new Error('The uploaded file is empty or too small to be a valid Word document.');
  }

  // Check ZIP signature for docx (PK\x03\x04)
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 4));
  const isZip = headerBytes[0] === 0x50 && headerBytes[1] === 0x4b && (headerBytes[2] === 0x03 || headerBytes[2] === 0x05);
  if (!isZip) {
    throw new Error('The file is not a valid DOCX package. Legacy binary .doc format is not directly supported; please save as .docx.');
  }

  if (options.onProgress) options.onProgress('Parsing Word document structure and typography...');

  // 2. Parse Word document using Mammoth (compatible with both browser and node)
  const mammothInput: any = { arrayBuffer };
  if (typeof Buffer !== 'undefined') {
    mammothInput.buffer = Buffer.from(arrayBuffer);
  }

  let htmlResult: { value: string; messages: any[] };
  try {
    htmlResult = await mammoth.convertToHtml(mammothInput);
  } catch (err: any) {
    throw new Error(`Failed to read Word document: ${err.message || 'Corrupted or unsupported DOCX structure.'}`);
  }

  const html = htmlResult.value;
  if (!html || html.trim() === '') {
    // Try raw text fallback
    const rawTextResult = await mammoth.extractRawText(mammothInput);
    if (!rawTextResult.value || rawTextResult.value.trim() === '') {
      throw new Error('The Word document does not contain any readable text or paragraphs.');
    }
  }

  if (options.onProgress) options.onProgress('Synthesizing paginated PDF document with typography...');

  // 3. Build multi-page PDF using pdf-lib
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Page dimensions (A4 standard: 595.28 x 841.89 pt)
  const PAGE_WIDTH = options.pageSize === 'Letter' ? 612 : 595.28;
  const PAGE_HEIGHT = options.pageSize === 'Letter' ? 792 : 841.89;
  const MARGIN_LEFT = 54;
  const MARGIN_RIGHT = 54;
  const MARGIN_TOP = 64;
  const MARGIN_BOTTOM = 60;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - MARGIN_TOP;
  let totalWords = 0;

  function addNewPage() {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    currentY = PAGE_HEIGHT - MARGIN_TOP;
  }

  function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (!word) continue;
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        // Handle exceptionally long single words
        if (font.widthOfTextAtSize(word, size) > maxWidth) {
          let chunk = '';
          for (const char of word) {
            if (font.widthOfTextAtSize(chunk + char, size) <= maxWidth) {
              chunk += char;
            } else {
              lines.push(chunk);
              chunk = char;
            }
          }
          currentLine = chunk;
        } else {
          currentLine = word;
        }
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Parse HTML elements (Headings, Paragraphs, Lists, Tables)
  let elementsToProcess: any[] = [];

  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const docDom = parser.parseFromString(html, 'text/html');
    elementsToProcess = Array.from(docDom.body.children);
    if (elementsToProcess.length === 0) {
      elementsToProcess = [docDom.body];
    }
  } else {
    // Universal regex-based parser for Node / non-browser test runner
    const tagRegex = /<(h[1-6]|p|li|tr)[^>]*>(.*?)<\/\1>/gi;
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
      const tag = match[1].toLowerCase();
      const rawInner = match[2].replace(/<[^>]+>/g, '').trim();
      if (rawInner) {
        elementsToProcess.push({
          tagName: tag,
          textContent: rawInner,
          querySelectorAll: () => [],
        });
      }
    }
    if (elementsToProcess.length === 0) {
      const clean = html.replace(/<[^>]+>/g, ' ').trim();
      elementsToProcess = [{ tagName: 'p', textContent: clean, querySelectorAll: () => [] }];
    }
  }

  for (const node of elementsToProcess) {
    const tagName = node.tagName.toLowerCase();
    const textContent = node.textContent?.trim() || '';
    if (!textContent && tagName !== 'table') continue;

    totalWords += textContent.split(/\s+/).filter(Boolean).length;

    let font = fontRegular;
    let size = options.fontSize || 10.5;
    let lineHeight = size * 1.35;
    let spacingBefore = 8;
    let spacingAfter = 8;
    let indent = 0;
    let isHeading = false;

    if (tagName === 'h1') {
      font = fontBold;
      size = 18;
      lineHeight = 24;
      spacingBefore = 18;
      spacingAfter = 10;
      isHeading = true;
    } else if (tagName === 'h2') {
      font = fontBold;
      size = 14;
      lineHeight = 19;
      spacingBefore = 14;
      spacingAfter = 8;
      isHeading = true;
    } else if (tagName === 'h3' || tagName === 'h4') {
      font = fontBold;
      size = 12;
      lineHeight = 16;
      spacingBefore = 10;
      spacingAfter = 6;
      isHeading = true;
    } else if (tagName === 'ul' || tagName === 'ol') {
      const listItems: any[] = Array.from((node as any).querySelectorAll('li'));
      for (let idx = 0; idx < listItems.length; idx++) {
        const itemText = (listItems[idx] as any).textContent?.trim() || '';
        if (!itemText) continue;

        const bullet = tagName === 'ol' ? `${idx + 1}. ` : '• ';
        const wrapped = wrapText(itemText, fontRegular, size, CONTENT_WIDTH - 20);

        if (currentY - lineHeight * wrapped.length < MARGIN_BOTTOM) {
          addNewPage();
        }

        // Render bullet
        currentPage.drawText(bullet, {
          x: MARGIN_LEFT + 4,
          y: currentY - size,
          size,
          font: fontBold,
          color: rgb(0.2, 0.2, 0.2),
        });

        // Render lines
        for (const line of wrapped) {
          currentPage.drawText(line, {
            x: MARGIN_LEFT + 20,
            y: currentY - size,
            size,
            font: fontRegular,
            color: rgb(0.15, 0.15, 0.15),
          });
          currentY -= lineHeight;
        }
        currentY -= 4; // Space between list items
      }
      continue;
    } else if (tagName === 'table') {
      const rows: any[] = Array.from((node as any).querySelectorAll('tr'));
      if (rows.length === 0) continue;

      const colCount = Math.max(...rows.map((r: any) => ((r as any).querySelectorAll ? (r as any).querySelectorAll('td, th').length : 1)), 1);
      const colWidth = CONTENT_WIDTH / colCount;
      const cellPadding = 6;
      const tableFontSize = 9;

      for (let rIdx = 0; rIdx < rows.length; rIdx++) {
        const rowEl = rows[rIdx] as any;
        const cells: any[] = rowEl.querySelectorAll ? Array.from(rowEl.querySelectorAll('td, th')) : [];
        const isHeaderRow = rIdx === 0 && rowEl.querySelector && rowEl.querySelector('th') !== null;
        const rowFont = isHeaderRow ? fontBold : fontRegular;
        const rowHeight = 22;

        if (currentY - rowHeight < MARGIN_BOTTOM) {
          addNewPage();
        }

        // Draw row border / cells
        for (let cIdx = 0; cIdx < cells.length; cIdx++) {
          const cellX = MARGIN_LEFT + cIdx * colWidth;
          const cellText = (cells[cIdx] as any).textContent?.trim() || '';

          // Cell background for header
          if (isHeaderRow) {
            currentPage.drawRectangle({
              x: cellX,
              y: currentY - rowHeight,
              width: colWidth,
              height: rowHeight,
              color: rgb(0.93, 0.94, 0.96),
              borderColor: rgb(0.8, 0.82, 0.85),
              borderWidth: 0.5,
            });
          } else {
            currentPage.drawRectangle({
              x: cellX,
              y: currentY - rowHeight,
              width: colWidth,
              height: rowHeight,
              color: rgb(1, 1, 1),
              borderColor: rgb(0.85, 0.87, 0.9),
              borderWidth: 0.5,
            });
          }

          // Truncate cell text if needed to fit in cell
          let visibleText = cellText;
          while (visibleText.length > 0 && font.widthOfTextAtSize(visibleText, tableFontSize) > colWidth - cellPadding * 2) {
            visibleText = visibleText.slice(0, -1);
          }

          currentPage.drawText(visibleText, {
            x: cellX + cellPadding,
            y: currentY - rowHeight + 6,
            size: tableFontSize,
            font: rowFont,
            color: rgb(0.15, 0.15, 0.15),
          });
        }

        currentY -= rowHeight;
      }
      currentY -= 10;
      continue;
    }

    // Standard paragraph or heading text
    const lines = wrapText(textContent, font, size, CONTENT_WIDTH);
    const totalBlockHeight = spacingBefore + lines.length * lineHeight + spacingAfter;

    // Check pagination
    if (currentY - totalBlockHeight < MARGIN_BOTTOM) {
      addNewPage();
    } else {
      currentY -= spacingBefore;
    }

    for (const line of lines) {
      if (currentY - lineHeight < MARGIN_BOTTOM) {
        addNewPage();
      }

      currentPage.drawText(line, {
        x: MARGIN_LEFT + indent,
        y: currentY - size,
        size,
        font,
        color: isHeading ? rgb(0.08, 0.12, 0.2) : rgb(0.18, 0.2, 0.24),
      });

      currentY -= lineHeight;
    }

    currentY -= spacingAfter;
  }

  // 4. Add page numbers to all generated pages
  const totalPages = pdfDoc.getPageCount();
  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const page = pdfDoc.getPage(pIdx);
    const pageStr = `${pIdx + 1} / ${totalPages}`;
    const numWidth = fontRegular.widthOfTextAtSize(pageStr, 8.5);

    page.drawText(pageStr, {
      x: (PAGE_WIDTH - numWidth) / 2,
      y: 28,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.55, 0.58, 0.62),
    });
  }

  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes,
    pageCount: totalPages,
    wordCount: totalWords,
    extractedHtml: html,
  };
}
