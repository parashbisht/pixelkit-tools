"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  FileArchive,
  Sliders,
  Info,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import { ImageFileDetails, ProcessedImageResult, SupportedImageFormat } from "@/types";
import {
  loadImageDetails,
  processCanvasImage,
  generateOutputFileName,
  revokeObjectUrl,
} from "@/lib/image-processing";
import { ToolHeader } from "@/components/tools/tool-header";
import { DropzoneUpload } from "@/components/tools/dropzone-upload";
import { ImageComparisonPreview } from "@/components/tools/image-comparison-preview";
import { AdPlaceholder } from "@/components/layout/ad-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const QUALITY_PRESETS = [
  { label: "Best Quality", value: 90 },
  { label: "Balanced", value: 75 },
  { label: "High Saving", value: 50 },
  { label: "Maximum", value: 30 },
];

export default function CompressPage() {
  const [originalImage, setOriginalImage] = useState<ImageFileDetails | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compression controls
  const [quality, setQuality] = useState<number>(75); // 5 to 100
  const [targetFormat, setTargetFormat] = useState<SupportedImageFormat>("image/jpeg");

  // Keep references to URLs for memory cleanup
  const activeOriginalUrlRef = useRef<string | null>(null);
  const activeProcessedUrlRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      revokeObjectUrl(activeOriginalUrlRef.current);
      revokeObjectUrl(activeProcessedUrlRef.current);
    };
  }, []);

  // Run the actual compression on canvas
  const performCompression = useCallback(
    async (image: ImageFileDetails, q: number, format: SupportedImageFormat) => {
      setIsProcessing(true);
      setErrorMessage(null);

      try {
        const outputName = generateOutputFileName(image.name, "compressed", format);
        const result = await processCanvasImage({
          imageSource: image,
          format,
          quality: q / 100,
          originalSize: image.size,
          outputFileName: outputName,
        });

        // Revoke previously generated compressed object URL before replacing
        if (activeProcessedUrlRef.current && activeProcessedUrlRef.current !== result.objectUrl) {
          revokeObjectUrl(activeProcessedUrlRef.current);
        }
        activeProcessedUrlRef.current = result.objectUrl;

        setProcessedResult(result);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "An error occurred during compression."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Handle new file upload
  async function handleFileSelected(file: File) {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Clean up previous image URLs
      revokeObjectUrl(activeOriginalUrlRef.current);
      revokeObjectUrl(activeProcessedUrlRef.current);
      setProcessedResult(null);

      const details = await loadImageDetails(file);
      activeOriginalUrlRef.current = details.objectUrl;
      setOriginalImage(details);

      // Determine default format: if original is webp or png, offer appropriate format
      let formatToUse: SupportedImageFormat = "image/jpeg";
      if (details.type === "image/webp") {
        formatToUse = "image/webp";
      } else if (details.type === "image/png") {
        // PNG can be compressed as PNG (lossless) or WebP (lossy)
        formatToUse = "image/webp"; // WebP is default for PNG to enable quality slider savings
      }
      setTargetFormat(formatToUse);

      // Perform initial compression
      await performCompression(details, quality, formatToUse);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load the selected image."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle quality slider change
  function handleQualityChange(newQuality: number) {
    setQuality(newQuality);
    if (originalImage) {
      performCompression(originalImage, newQuality, targetFormat);
    }
  }

  // Handle format toggle
  function handleFormatChange(newFormat: SupportedImageFormat) {
    setTargetFormat(newFormat);
    if (originalImage) {
      performCompression(originalImage, quality, newFormat);
    }
  }

  // Reset / Start Over
  function handleReset() {
    revokeObjectUrl(activeOriginalUrlRef.current);
    revokeObjectUrl(activeProcessedUrlRef.current);
    activeOriginalUrlRef.current = null;
    activeProcessedUrlRef.current = null;

    setOriginalImage(null);
    setProcessedResult(null);
    setErrorMessage(null);
    setQuality(75);
  }

  const isLosslessPng = targetFormat === "image/png";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Tool Header */}
      <ToolHeader
        title="Image Compressor"
        description="Reduce image file size significantly while retaining crisp visual fidelity. Adjust the quality slider to dial in the perfect balance of compression and clarity. All processing happens 100% locally in your browser."
        icon={FileArchive}
      />

      {/* Main Workspace */}
      {!originalImage ? (
        <div className="space-y-6">
          <DropzoneUpload
            onFileSelected={handleFileSelected}
            isLoading={isProcessing}
          />

          {errorMessage && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Quick feature highlights before upload */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Real Byte Savings</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No simulated numbers. Output file sizes and reduction percentages are calculated directly from the encoded binary blob.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">WebP & JPEG Lossy Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compress standard JPEGs or convert PNGs to modern WebP for dramatic size reductions without losing alpha transparency.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Complete Privacy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your images never leave your computer. Everything runs in-memory through HTML5 Canvas APIs.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Compression Settings Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold text-foreground">
                    Compression Settings
                  </h2>
                </div>

                {/* Target Format Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">Output Format:</span>
                  <div className="inline-flex rounded-lg bg-muted p-1">
                    <button
                      type="button"
                      onClick={() => handleFormatChange("image/jpeg")}
                      className={cn(
                        "rounded px-2.5 py-1 font-semibold transition-colors",
                        targetFormat === "image/jpeg"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      JPEG
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatChange("image/webp")}
                      className={cn(
                        "rounded px-2.5 py-1 font-semibold transition-colors",
                        targetFormat === "image/webp"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      WebP
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatChange("image/png")}
                      className={cn(
                        "rounded px-2.5 py-1 font-semibold transition-colors",
                        targetFormat === "image/png"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      PNG (Lossless)
                    </button>
                  </div>
                </div>
              </div>

              {/* Quality Slider Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality-slider" className="text-sm font-semibold text-foreground">
                    Compression Quality:{" "}
                    <span className="font-mono text-primary font-bold text-base">
                      {quality}%
                    </span>
                  </Label>
                  {isLosslessPng && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Note: PNG format is lossless. For lossy quality tuning, select WebP or JPEG.
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="quality-slider"
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={quality}
                    disabled={isLosslessPng || isProcessing}
                    onChange={(e) => handleQualityChange(Number(e.target.value))}
                    className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Smaller file (5%)</span>
                    <span>Balanced (70-80%)</span>
                    <span>Original quality (100%)</span>
                  </div>
                </div>

                {/* Quick Presets */}
                {!isLosslessPng && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground font-medium">Presets:</span>
                    {QUALITY_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleQualityChange(preset.value)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                          quality === preset.value
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {preset.label} ({preset.value}%)
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Preview with stats & download */}
          <ImageComparisonPreview
            original={originalImage}
            processed={processedResult}
            isProcessing={isProcessing}
            onReset={handleReset}
            downloadLabel="Download Compressed Image"
          />
        </div>
      )}

      {/* Ad Placement zone */}
      <AdPlaceholder format="horizontal" slotId="compress-bottom" />

      {/* Educational & Explanatory Guide */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span>How Client-Side Image Compression Works</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PixelKit Tools leverages browser-native graphics encoding rather than transmitting your files
            to an external server. Here is what happens under the hood:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">1. Canvas Decoding</h3>
            <p>
              Your browser reads the image file into an HTML5 Canvas bitmap using high-precision bicubic interpolation.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">2. Discrete Quantization</h3>
            <p>
              When re-encoding to JPEG or WebP, the browser applies lossy frequency quantization according to your chosen quality slider level.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">3. Blob Generation</h3>
            <p>
              The encoded bytes are packaged directly into a native browser binary Blob, providing an exact, genuine file size measurement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
