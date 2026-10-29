import {
  ImageFileDetails,
  ProcessedImageResult,
  SupportedImageFormat,
} from "@/types";
import { FORMAT_EXTENSIONS, SUPPORTED_MIME_TYPES } from "@/lib/constants";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB guard to protect browser tab

/**
 * Validates whether an uploaded file is a supported image format and within safe limits.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file was provided." };
  }

  // Check MIME type
  const isSupportedMime = SUPPORTED_MIME_TYPES.includes(
    file.type as SupportedImageFormat,
  );

  // Fallback to extension check if browser doesn't report MIME type accurately
  const extension = file.name.split(".").pop()?.toLowerCase();
  const isSupportedExt = ["jpg", "jpeg", "png", "webp"].includes(extension || "");

  if (!isSupportedMime && !isSupportedExt) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || extension || "unknown"}). PixelKit supports JPEG, PNG, and WebP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 50 MB for browser stability.`,
    };
  }

  return { valid: true };
}

/**
 * Loads a File into browser memory and resolves with width, height, and Object URL.
 */
export function loadImageDetails(file: File): Promise<ImageFileDetails> {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        file,
        name: file.name,
        size: file.size,
        type: file.type || `image/${file.name.split(".").pop()?.toLowerCase() || "jpeg"}`,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        objectUrl,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to decode this image. The file may be corrupt or not a valid image format."));
    };

    img.src = objectUrl;
  });
}

/**
 * Safely revokes an Object URL to free up browser memory.
 */
export function revokeObjectUrl(url?: string | null): void {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore cleanup error if already revoked
    }
  }
}

/**
 * Triggers a browser download of a blob or object URL.
 */
export function downloadFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates an output filename based on original name, action suffix, and extension.
 */
export function generateOutputFileName(
  originalName: string,
  suffix: string,
  targetFormat: SupportedImageFormat,
): string {
  const baseName = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
  const extension = FORMAT_EXTENSIONS[targetFormat] || "jpg";
  return `${baseName}-${suffix}.${extension}`;
}

/**
 * Core image processing using HTML5 Canvas.
 * Handles resizing, format conversion, compression quality, and transparency background fill.
 */
export async function processCanvasImage({
  imageSource,
  targetWidth,
  targetHeight,
  format = "image/jpeg",
  quality = 0.8,
  backgroundColor = "#FFFFFF",
  originalSize = 0,
  outputFileName = "image-optimized.jpg",
}: {
  imageSource: HTMLImageElement | ImageFileDetails;
  targetWidth?: number;
  targetHeight?: number;
  format?: SupportedImageFormat;
  quality?: number;
  backgroundColor?: string;
  originalSize?: number;
  outputFileName?: string;
}): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const width = targetWidth && targetWidth > 0 ? Math.round(targetWidth) : img.naturalWidth || img.width;
        const height = targetHeight && targetHeight > 0 ? Math.round(targetHeight) : img.naturalHeight || img.height;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas 2D rendering context."));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // If converting to JPEG, JPEG does not support transparency. Fill background to avoid black box artifacts.
        if (format === "image/jpeg") {
          ctx.fillStyle = backgroundColor || "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        // Draw the image scaled to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Quality clamping for lossy formats
        const safeQuality = Math.max(0.01, Math.min(1.0, quality));

        canvas.toBlob(
          (blob) => {
            // Clean up canvas buffer to release GPU/RAM
            canvas.width = 0;
            canvas.height = 0;

            if (!blob) {
              reject(new Error("Failed to encode image to destination format."));
              return;
            }

            const objectUrl = URL.createObjectURL(blob);
            const savingsPercentage = originalSize > 0
              ? Math.round(((originalSize - blob.size) / originalSize) * 100)
              : 0;

            resolve({
              blob,
              objectUrl,
              width,
              height,
              size: blob.size,
              format,
              savingsPercentage,
              fileName: outputFileName,
            });
          },
          format,
          format === "image/png" ? undefined : safeQuality,
        );
      } catch (err) {
        reject(err instanceof Error ? err : new Error("An error occurred during canvas processing."));
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image source into canvas."));
    };

    img.crossOrigin = "anonymous";
    img.src = "objectUrl" in imageSource ? imageSource.objectUrl : imageSource.src;
  });
}
