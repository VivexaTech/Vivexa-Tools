/**
 * Genuine ICO encoder (PNG-in-ICO format).
 * Combines 16x16, 32x32, and 48x48 PNG buffers into a valid multi-resolution Windows ICO file.
 */
export function createIcoFromPngBuffers(pngBuffers: { width: number; height: number; bytes: Uint8Array }[]): Uint8Array {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalHeaderSize = headerSize + count * dirEntrySize;

  let totalSize = totalHeaderSize;
  for (const item of pngBuffers) {
    totalSize += item.bytes.length;
  }

  const output = new Uint8Array(totalSize);
  const view = new DataView(output.buffer);

  // ICONDIR Header
  view.setUint16(0, 0, true);      // Reserved (must be 0)
  view.setUint16(2, 1, true);      // Image type: 1 = ICO
  view.setUint16(4, count, true);  // Number of images

  let currentOffset = totalHeaderSize;

  // ICONDIRENTRY Records
  for (let i = 0; i < count; i++) {
    const item = pngBuffers[i];
    const entryOffset = headerSize + i * dirEntrySize;

    const wByte = item.width >= 256 ? 0 : item.width;
    const hByte = item.height >= 256 ? 0 : item.height;

    output[entryOffset + 0] = wByte;               // Width
    output[entryOffset + 1] = hByte;               // Height
    output[entryOffset + 2] = 0;                   // Color count (0 = >=8bpp)
    output[entryOffset + 3] = 0;                   // Reserved
    view.setUint16(entryOffset + 4, 1, true);      // Color planes
    view.setUint16(entryOffset + 6, 32, true);     // Bits per pixel (32-bit RGBA)
    view.setUint32(entryOffset + 8, item.bytes.length, true); // Image data size in bytes
    view.setUint32(entryOffset + 12, currentOffset, true);    // Offset from file start

    // Write image data
    output.set(item.bytes, currentOffset);
    currentOffset += item.bytes.length;
  }

  return output;
}
