const MAX_DIMENSION = 1400;
const JPEG_QUALITY = 0.82;
const MAX_BYTES = 2_200_000;

export type ProcessedProductImage = {
  imageUrl: string;
  imageLabel: string;
};

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image"));
    };
    img.src = objectUrl;
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL("image/jpeg", quality);
}

async function compressToDataUrl(file: File): Promise<string> {
  const img = await loadImageFromFile(file);
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let dataUrl = canvasToJpeg(canvas, quality);
  while (dataUrl.length > MAX_BYTES && quality > 0.5) {
    quality -= 0.08;
    dataUrl = canvasToJpeg(canvas, quality);
  }

  return dataUrl;
}

export async function processProductImageFile(file: File): Promise<ProcessedProductImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a photo (JPG, PNG, WebP…)");
  }

  const imageUrl = await compressToDataUrl(file);
  return {
    imageUrl,
    imageLabel: file.name,
  };
}

export function isDataImageUrl(src: string | undefined | null): boolean {
  return Boolean(src?.startsWith("data:"));
}
