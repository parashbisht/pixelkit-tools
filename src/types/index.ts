export type SupportedImageFormat = "image/jpeg" | "image/png" | "image/webp";

export type ImageFormatExtension = "jpg" | "jpeg" | "png" | "webp";

export interface ImageFileDetails {
  file: File;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  objectUrl: string;
}

export interface CompressionOptions {
  quality: number; // 0.05 to 1.0
  format?: SupportedImageFormat;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format?: SupportedImageFormat;
  quality?: number;
}

export interface ConversionOptions {
  targetFormat: SupportedImageFormat;
  quality?: number;
  backgroundColor?: string; // For transparent backgrounds when converting to JPEG (e.g. #FFFFFF)
}

export interface ProcessedImageResult {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  size: number;
  format: SupportedImageFormat;
  savingsPercentage: number;
  fileName: string;
}
