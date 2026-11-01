import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageOrientation,
  AlignmentType,
  PageBreak,
} from 'docx';
import { getPdfJs } from './pdfOcrHelper';

export interface PdfToWordOptions {
  ocrFallback?: boolean;
  preserveImages?: boolean;
  onProgress?: (progress: { page: number; totalPages: number; status: string }) => void;
}

export interface PdfToWordResult {
  docxBlob: Blob;
  pageCount: number;
  wordCount: number;
  hasOcrFallback: boolean;
  warnings: string[];
}

interface ParsedWordItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  fontSizePt: number;
}

interface ParsedLine {
  y: number;
  minX: number;
  maxX: number;
  height: number;
  items: ParsedWordItem[];
  fullText: string;
  alignment: (typeof AlignmentType)[keyof typeof AlignmentType];
  isHeading: boolean;
  isSubHeading: boolean;
  isBullet: boolean;
  isNumbered: boolean;
}

/**
 * Advanced Client-side PDF to Word (.docx) converter.
 * Reconstructs layout, page geometry, paragraph reflow, typography, tables, and lists.
 */
export async function convertPdfToWord(
  file: File,
  options: PdfToWordOptions = {}
): Promise<PdfToWordResult> {
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();

  let pdfDoc;
  try {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    } as any);
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (err.name === 'PasswordException' || err.message?.includes('password')) {
      throw new Error('This PDF is password-protected. Please unlock the file before converting to Word.');
    }
    throw new Error('Could not open PDF file. The document may be corrupted or invalid.');
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error('The uploaded PDF does not contain any pages.');
  }

  const docChildren: (Paragraph | Table)[] = [];
  let totalWordCount = 0;
  let hasOcrFallback = false;
  const warnings: string[] = [];

  // Track primary page dimensions for section setup
  let firstPageWidth = 612; // default Letter/A4 pt
  let firstPageHeight = 792;
  let isLandscape = false;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (options.onProgress) {
      options.onProgress({
        page: pageNum,
        totalPages: numPages,
        status: `Analyzing geometry and text structure of page ${pageNum} of ${numPages}...`,
      });
    }

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });

    if (pageNum === 1) {
      firstPageWidth = viewport.width;
      firstPageHeight = viewport.height;
      isLandscape = viewport.width > viewport.height;
    }

    // Insert clean page break between pages (except before page 1)
    if (pageNum > 1) {
      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    const textContent = await page.getTextContent();
    const rawItems = textContent.items as any[];

    // Scanned page handling
    if (!rawItems || rawItems.length === 0) {
      if (options.ocrFallback !== false) {
        warnings.push(`Page ${pageNum} has no digital text. Applied high-accuracy OCR fallback.`);
        hasOcrFallback = true;
        try {
          const ocrViewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          canvas.width = ocrViewport.width;
          canvas.height = ocrViewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await (page.render as any)({ canvasContext: ctx, viewport: ocrViewport, canvas }).promise;
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker('eng');
            const ret = await worker.recognize(canvas);
            await worker.terminate();

            const ocrParagraphs = ret.data.text.split(/\n\s*\n/);
            for (const pText of ocrParagraphs) {
              const cleaned = pText.trim();
              if (cleaned) {
                totalWordCount += cleaned.split(/\s+/).length;
                docChildren.push(
                  new Paragraph({
                    children: [new TextRun({ text: cleaned, size: 22 })],
                    spacing: { after: 120 },
                  })
                );
              }
            }
          }
        } catch {
          warnings.push(`OCR fallback encountered an error on scanned page ${pageNum}.`);
        }
      } else {
        warnings.push(`Page ${pageNum} contains no digital text.`);
      }
      continue;
    }

    // Parse text items with styling
    const parsedItems: ParsedWordItem[] = [];
    for (const item of rawItems) {
      const text = item.str || '';
      if (!text || text.trim() === '') continue;

      const fontName = (item.fontName || '').toLowerCase();
      const isBold = /bold|black|heavy|semibold|w700|w800|w900/i.test(fontName);
      const isItalic = /italic|oblique/i.test(fontName);

      // Height from item or matrix
      const matrixHeight = item.transform ? Math.abs(item.transform[0] || item.transform[3] || 11) : 11;
      const height = item.height || matrixHeight || 11;

      parsedItems.push({
        str: text,
        x: item.transform ? item.transform[4] : 0,
        y: item.transform ? item.transform[5] : 0,
        width: item.width || 0,
        height,
        fontName,
        isBold,
        isItalic,
        fontSizePt: height,
      });
    }

    if (parsedItems.length === 0) continue;

    // Group items into visual lines (tolerance of 3.5pt)
    const Y_TOLERANCE = 3.5;
    const lineBuckets: { y: number; items: ParsedWordItem[] }[] = [];

    for (const item of parsedItems) {
      let bucket = lineBuckets.find((b) => Math.abs(b.y - item.y) <= Y_TOLERANCE);
      if (bucket) {
        bucket.items.push(item);
      } else {
        lineBuckets.push({ y: item.y, items: [item] });
      }
    }

    // Sort lines top to bottom (PDF Y coordinate is 0 at bottom)
    lineBuckets.sort((a, b) => b.y - a.y);

    // Calculate median font height for heading heuristics
    const allHeights = parsedItems.map((it) => it.height).sort((a, b) => a - b);
    const medianHeight = allHeights[Math.floor(allHeights.length / 2)] || 11;

    // Structure lines
    const parsedLines: ParsedLine[] = [];
    const pageWidth = viewport.width;

    for (const bucket of lineBuckets) {
      bucket.items.sort((a, b) => a.x - b.x);

      const minX = bucket.items[0].x;
      const lastItem = bucket.items[bucket.items.length - 1];
      const maxX = lastItem.x + lastItem.width;
      const maxLineHeight = Math.max(...bucket.items.map((it) => it.height));

      // Reconstruct text with spacing
      let lineText = '';
      for (let k = 0; k < bucket.items.length; k++) {
        const cur = bucket.items[k];
        if (k > 0) {
          const prev = bucket.items[k - 1];
          const gap = cur.x - (prev.x + prev.width);
          // If gap between words is significant, add space
          if (gap > 1.5 && !lineText.endsWith(' ') && !cur.str.startsWith(' ')) {
            lineText += ' ';
          }
        }
        lineText += cur.str;
      }
      lineText = lineText.trim();
      if (!lineText) continue;

      totalWordCount += lineText.split(/\s+/).filter(Boolean).length;

      // Alignment detection
      const lineCenter = (minX + maxX) / 2;
      const pageCenter = pageWidth / 2;
      let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;

      if (Math.abs(lineCenter - pageCenter) < pageWidth * 0.08 && minX > 50 && maxX < pageWidth - 50) {
        alignment = AlignmentType.CENTER;
      } else if (maxX > pageWidth - 60 && minX > pageWidth * 0.4) {
        alignment = AlignmentType.RIGHT;
      }

      const isHeading = maxLineHeight >= medianHeight * 1.38;
      const isSubHeading = maxLineHeight >= medianHeight * 1.18 && !isHeading;
      const isBullet = /^[•\-\*\u2022\u2023\u25E6]/.test(lineText);
      const isNumbered = /^\d+[\.\)]\s/.test(lineText);

      parsedLines.push({
        y: bucket.y,
        minX,
        maxX,
        height: maxLineHeight,
        items: bucket.items,
        fullText: lineText,
        alignment,
        isHeading,
        isSubHeading,
        isBullet,
        isNumbered,
      });
    }

    // Table Detection: check if consecutive lines have multiple matching columns
    let lineIdx = 0;
    while (lineIdx < parsedLines.length) {
      // Check if current and following lines look like a table (at least 2 columns with similar X alignment)
      let tableRowLines: ParsedLine[] = [];
      let testIdx = lineIdx;

      while (testIdx < parsedLines.length) {
        const line = parsedLines[testIdx];
        if (line.items.length >= 2 && !line.isHeading && !line.isBullet) {
          tableRowLines.push(line);
          testIdx++;
        } else {
          break;
        }
      }

      // If at least 2 consecutive multi-item lines have similar column counts
      if (tableRowLines.length >= 2) {
        const colCount = Math.min(...tableRowLines.map((r) => r.items.length));
        if (colCount >= 2 && colCount <= 8) {
          // Construct Word Table
          const tableRows: TableRow[] = [];

          for (const rowLine of tableRowLines) {
            const cells: TableCell[] = [];
            for (let c = 0; c < colCount; c++) {
              const cellItem = rowLine.items[c];
              cells.push(
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cellItem ? cellItem.str.trim() : '',
                          size: Math.round((cellItem?.fontSizePt || 10) * 2),
                          bold: cellItem?.isBold || false,
                          italics: cellItem?.isItalic || false,
                        }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 120, right: 120 },
                })
              );
            }
            tableRows.push(new TableRow({ children: cells }));
          }

          docChildren.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRows,
            })
          );

          lineIdx = testIdx;
          continue;
        }
      }

      // Non-table line processing: paragraph grouping
      const curLine = parsedLines[lineIdx];

      if (curLine.isHeading) {
        docChildren.push(
          new Paragraph({
            text: curLine.fullText,
            heading: HeadingLevel.HEADING_1,
            alignment: curLine.alignment,
            spacing: { before: 240, after: 120 },
          })
        );
        lineIdx++;
        continue;
      }

      if (curLine.isSubHeading) {
        docChildren.push(
          new Paragraph({
            text: curLine.fullText,
            heading: HeadingLevel.HEADING_2,
            alignment: curLine.alignment,
            spacing: { before: 180, after: 90 },
          })
        );
        lineIdx++;
        continue;
      }

      if (curLine.isBullet) {
        docChildren.push(
          new Paragraph({
            text: curLine.fullText.replace(/^[•\-\*\u2022\u2023\u25E6]\s*/, ''),
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        );
        lineIdx++;
        continue;
      }

      if (curLine.isNumbered) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: curLine.fullText,
                size: Math.round(curLine.height * 2) || 22,
              }),
            ],
            spacing: { after: 60 },
          })
        );
        lineIdx++;
        continue;
      }

      // Group continuous paragraph lines that belong together
      const paragraphRuns: TextRun[] = [];
      let pIdx = lineIdx;

      while (pIdx < parsedLines.length) {
        const nextLine = parsedLines[pIdx];

        // Break if next line is heading, bullet, numbered, or has different alignment
        if (
          pIdx > lineIdx &&
          (nextLine.isHeading ||
            nextLine.isSubHeading ||
            nextLine.isBullet ||
            nextLine.isNumbered ||
            nextLine.alignment !== curLine.alignment)
        ) {
          break;
        }

        // Check vertical gap to previous line
        if (pIdx > lineIdx) {
          const prevLine = parsedLines[pIdx - 1];
          const verticalGap = prevLine.y - nextLine.y;
          // Normal line height gap is roughly 1.1x - 1.5x font size
          if (verticalGap > prevLine.height * 1.85) {
            // Distinct paragraph break detected in PDF geometry
            break;
          }
        }

        // Add word runs for this line
        for (let w = 0; w < nextLine.items.length; w++) {
          const it = nextLine.items[w];
          paragraphRuns.push(
            new TextRun({
              text: it.str + (w < nextLine.items.length - 1 ? ' ' : ''),
              bold: it.isBold,
              italics: it.isItalic,
              size: Math.round((it.fontSizePt || 11) * 2),
            })
          );
        }

        // Add space between merged lines
        paragraphRuns.push(new TextRun({ text: ' ' }));
        pIdx++;
      }

      if (paragraphRuns.length > 0) {
        docChildren.push(
          new Paragraph({
            children: paragraphRuns,
            alignment: curLine.alignment,
            spacing: { after: 120 },
          })
        );
      }

      lineIdx = Math.max(pIdx, lineIdx + 1);
    }
  }

  if (docChildren.length === 0) {
    throw new Error('No readable text or content could be extracted from this PDF document.');
  }

  // Map PDF geometry to Word twips (1 pt = 20 dxa)
  const dxaWidth = Math.round(firstPageWidth * 20);
  const dxaHeight = Math.round(firstPageHeight * 20);

  const doc = new Document({
    creator: 'Vivexa Tools (https://www.vivexatech.in/)',
    title: file.name.replace(/\.[^/.]+$/, ''),
    description: 'Converted from PDF with layout preservation by Vivexa Tools',
    sections: [
      {
        properties: {
          page: {
            size: {
              width: dxaWidth,
              height: dxaHeight,
              orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
            margin: {
              top: 1440, // 1 inch standard margin
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);

  if (docxBlob.size === 0) {
    throw new Error('Failed to generate Word document: output stream is empty.');
  }

  return {
    docxBlob,
    pageCount: numPages,
    wordCount: totalWordCount,
    hasOcrFallback,
    warnings,
  };
}
