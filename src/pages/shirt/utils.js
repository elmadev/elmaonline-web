import { nick } from 'utils/nick';

// Convert hex color to RGB (BMP format)
export const hexToRgb = hex => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

// Convert the color palette to BMP-compatible format (RGBA)
export const convertToBMPColorTable = colors => {
  const palette = new Uint8Array(256 * 4); // 256 colors * 4 bytes (Blue, Green, Red, Reserved)
  colors.forEach((hex, i) => {
    const rgb = hexToRgb(hex);
    palette[i * 4] = rgb[2]; // Blue
    palette[i * 4 + 1] = rgb[1]; // Green
    palette[i * 4 + 2] = rgb[0]; // Red
    palette[i * 4 + 3] = 0x00; // Reserved
  });

  return palette;
};

// Flood fill algorithm
export const floodFill = (canvas, x, y, targetColor, fillColor) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Convert target color to RGBA array
  const targetR = targetColor[0];
  const targetG = targetColor[1];
  const targetB = targetColor[2];
  const targetA = targetColor[3] || 255;

  // Convert fill color to RGBA array
  const fillR = fillColor[0];
  const fillG = fillColor[1];
  const fillB = fillColor[2];
  const fillA = fillColor[3] || 255;

  // Check if target and fill colors are the same
  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    return;
  }

  // Get the color at the starting point
  const startIndex = (y * width + x) * 4;
  const startR = data[startIndex];
  const startG = data[startIndex + 1];
  const startB = data[startIndex + 2];
  const startA = data[startIndex + 3];

  // If starting color doesn't match target color, return
  if (
    startR !== targetR ||
    startG !== targetG ||
    startB !== targetB ||
    startA !== targetA
  ) {
    return;
  }

  // Stack for flood fill
  const stack = [{ x, y }];
  const visited = new Set();

  while (stack.length > 0) {
    const { x: currentX, y: currentY } = stack.pop();
    const key = `${currentX},${currentY}`;

    if (
      visited.has(key) ||
      currentX < 0 ||
      currentX >= width ||
      currentY < 0 ||
      currentY >= height
    ) {
      continue;
    }

    const index = (currentY * width + currentX) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];

    if (r !== targetR || g !== targetG || b !== targetB || a !== targetA) {
      continue;
    }

    visited.add(key);

    // Set the fill color
    data[index] = fillR;
    data[index + 1] = fillG;
    data[index + 2] = fillB;
    data[index + 3] = fillA;

    // Add neighboring pixels to stack
    stack.push(
      { x: currentX + 1, y: currentY },
      { x: currentX - 1, y: currentY },
      { x: currentX, y: currentY + 1 },
      { x: currentX, y: currentY - 1 },
    );
  }

  // Put the modified image data back
  ctx.putImageData(imageData, 0, 0);
};

export const downloadBmp = canvas => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const width = 149;
  const height = 101;
  const rowSize = Math.ceil(width / 4) * 4; // Padded row size
  const pixelArraySize = rowSize * height;

  const header = new ArrayBuffer(1078 + pixelArraySize + 2); // Full BMP file
  const view = new DataView(header);

  // BMP Header
  view.setUint8(0, 'B'.charCodeAt(0));
  view.setUint8(1, 'M'.charCodeAt(0));
  view.setUint32(2, 1078 + pixelArraySize, true); // File size
  view.setUint32(10, 1078, true); // Pixel array offset

  // DIB Header
  view.setUint32(14, 40, true); // Header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true); // Planes
  view.setUint16(28, 8, true); // Bits per pixel
  view.setUint32(30, 0, true); // Compression
  view.setUint32(34, pixelArraySize, true); // Image size
  view.setUint32(38, 45074, true); // X pixels per meter
  view.setUint32(42, 45074, true); // Y pixels per meter
  view.setUint32(46, 256, true); // Colors in palette
  view.setUint32(50, 0, true); // Important colors

  // Color Table (Custom Palette)
  const bmpPalette = convertToBMPColorTable(colors);
  for (let i = 0; i < 256; i++) {
    const baseIndex = 54 + i * 4; // Start of palette in BMP header
    view.setUint8(baseIndex, bmpPalette[i * 4]); // Blue
    view.setUint8(baseIndex + 1, bmpPalette[i * 4 + 1]); // Green
    view.setUint8(baseIndex + 2, bmpPalette[i * 4 + 2]); // Red
    view.setUint8(baseIndex + 3, bmpPalette[i * 4 + 3]); // Reserved
  }

  // Pixel Array (Use palette indices)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const canvasY = height - 1 - y; // BMP is bottom-up
      const pixelIndex = canvasY * width + x;

      // Get canvas pixel data (RGB)
      const r = imageData.data[pixelIndex * 4];
      const g = imageData.data[pixelIndex * 4 + 1];
      const b = imageData.data[pixelIndex * 4 + 2];

      // Find the closest matching palette index
      let paletteIndex = -1;
      for (let i = 0; i < 256; i++) {
        const paletteR = bmpPalette[i * 4 + 2]; // Red
        const paletteG = bmpPalette[i * 4 + 1]; // Green
        const paletteB = bmpPalette[i * 4]; // Blue
        if (paletteR === r && paletteG === g && paletteB === b) {
          paletteIndex = i;
          break;
        }
      }

      // If no match, default to 0 (black)
      view.setUint8(
        1078 + y * rowSize + x,
        paletteIndex === -1 ? 0 : paletteIndex,
      );
    }
  }

  // Optional padding
  view.setUint8(1078 + pixelArraySize, 0);
  view.setUint8(1078 + pixelArraySize + 1, 0);

  // Create and download the file
  const blob = new Blob([header], { type: 'image/bmp' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nick() ? `${nick()}.bmp` : 'shirt.bmp';
  link.click();
};

// Available font options
export const fontOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
];

export const colors = [
  '#000000',
  '#782000',
  '#200000',
  '#b4c4ac',
  '#9c0000',
  '#a40000',
  '#606040',
  '#000808',
  '#080000',
  '#380000',
  '#688060',
  '#606868',
  '#9c1808',
  '#500848',
  '#f47000',
  '#500000',
  '#9c2808',
  '#b40000',
  '#9c2800',
  '#780000',
  '#880400',
  '#9c1008',
  '#280800',
  '#008000',
  '#008000',
  '#f4e416',
  '#800000',
  '#383838',
  '#202030',
  '#009600',
  '#bcccbc',
  '#000030',
  '#882800',
  '#401800',
  '#b4c4b4',
  '#380000',
  '#2800b4',
  '#c46010',
  '#000800',
  '#88b4d4',
  '#00b800',
  '#680800',
  '#9c6808',
  '#882400',
  '#9c9c48',
  '#dce4dc',
  '#009608',
  '#600000',
  '#808080',
  '#888860',
  '#7880a4',
  '#482020',
  '#00d418',
  '#606060',
  '#686060',
  '#943000',
  '#8828c4',
  '#780800',
  '#9c9c60',
  '#888c50',
  '#8884cc',
  '#003080',
  '#008000',
  '#30a030',
  '#687060',
  '#484848',
  '#687060',
  '#bcc4b4',
  '#fc7000',
  '#008018',
  '#6084c4',
  '#6084cc',
  '#608494',
  '#1060ac',
  '#a44008',
  '#94b4d4',
  '#c40000',
  '#003000',
  '#940000',
  '#ac0000',
  '#880800',
  '#002000',
  '#401000',
  '#b4bcbc',
  '#00b808',
  '#489648',
  '#00ac00',
  '#9400c4',
  '#f4d418',
  '#780028',
  '#940800',
  '#b00008',
  '#8080a4',
  '#940800',
  '#180800',
  '#502400',
  '#080000',
  '#8e08d0',
  '#080080',
  '#8a3840',
  '#240000',
  '#600000',
  '#000000',
  '#f4fcfc',
  '#fcfcfc',
  '#00a4d8',
  '#0000a4',
  '#000000',
  '#a400c4',
  '#200020',
  '#d0d0d0',
  '#c0a0d0',
  '#200000',
  '#b0a0a0',
  '#303030',
  '#a0c0c0',
  '#0000c0',
  '#f0f0f0',
  '#00c000',
  '#00c0c0',
  '#00c0c0',
  '#8000d0',
  '#00c000',
  '#b0c0c0',
  '#a000c0',
  '#000000',
  '#ff8080',
  '#ff00ff',
  '#505050',
  '#600000',
  '#8000c0',
  '#a0c0c0',
  '#700000',
  '#c000c0',
  '#0090d0',
  '#200000',
  '#908080',
  '#300000',
  '#b00000',
  '#0048a0',
  '#404080',
  '#600000',
  '#400080',
  '#c4c4c4',
  '#000c00',
  '#b0c0c0',
  '#200000',
  '#00d0d0',
  '#000000',
  '#f4f4f4',
  '#c0c0c0',
  '#00a8a8',
  '#c0c0c0',
  '#e0e0e0',
  '#c4c4c4',
  '#e0e0e0',
];
