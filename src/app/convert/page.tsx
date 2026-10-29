"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  RefreshCw,
  Sliders,
  Check,
  Palette,
  AlertTriangle,
  Info,
  Zap,
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FORMAT_OPTIONS: {
  format: SupportedImageFormat;
  label: string;
  ext: string;
  description: string;
  transparency: boolean;
}[] = [
  {
    format: "image/jpeg",
    label: "JPEG",
    ext: ".jpg",
    description: "Universal format for photographs. High compression without alpha transparency.",
    transparency: false,
  },
  {
    format: "image/png",
    label: "PNG",
    ext: ".png",
    description: "Lossless raster format. Retains sharp lines and full alpha channel transparency.",
    transparency: true,
  },
  {
    format: "image/webp",
    label: "WebP",
    ext: ".webp",
    description: "Modern web standard. Offers superior compression with full transparency support.",
    transparency: true,
  },
];

const BG_COLOR_PRESETS = [
  { label: "White", hex: "#FFFFFF" },
  { label: "Black", hex: "#000000" },
  { label: "Soft Gray", hex: "#F3F4F6" },
  { label: "Dark Navy", hex: "#0F172A" },
];

export default function ConvertPage() {
  const [originalImage, setOriginalImage] = useState<ImageFileDetails | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Conversion settings
  const [targetFormat, setTargetFormat] = useState<SupportedImageFormat>("image/jpeg");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");

  // References for memory cleanup
  const activeOriginalUrlRef = useRef<string | null>(null);
  const activeProcessedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      revokeObjectUrl(activeOriginalUrlRef.current);
      revokeObjectUrl(activeProcessedUrlRef.current);
    };
  }, []);

  // Perform canvas conversion
  const performConversion = useCallback(
    async (
      image: ImageFileDetails,
      format: SupportedImageFormat,
      bgColor: string
    ) => {
      setIsProcessing(true);
      setErrorMessage(null);

      try {
        const outputFileName = generateOutputFileName(image.name, "converted", format);
        const result = await processCanvasImage({
          imageSource: image,
          format,
          quality: 0.92,
          backgroundColor: bgColor,
          originalSize: image.size,
          outputFileName,
        });

        if (activeProcessedUrlRef.current && activeProcessedUrlRef.current !== result.objectUrl) {
          revokeObjectUrl(activeProcessedUrlRef.current);
        }
        activeProcessedUrlRef.current = result.objectUrl;

        setProcessedResult(result);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "An error occurred during format conversion."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Handle image upload
  async function handleFileSelected(file: File) {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      revokeObjectUrl(activeOriginalUrlRef.current);
      revokeObjectUrl(activeProcessedUrlRef.current);
      setProcessedResult(null);

      const details = await loadImageDetails(file);
      activeOriginalUrlRef.current = details.objectUrl;
      setOriginalImage(details);

      // Pick an alternative format by default (e.g. if original is JPEG, suggest WebP or PNG)
      let initialFormat: SupportedImageFormat = "image/webp";
      if (details.type === "image/webp") {
        initialFormat = "image/png";
      } else if (details.type === "image/jpeg") {
        initialFormat = "image/webp";
      } else if (details.type === "image/png") {
        initialFormat = "image/jpeg";
      }

      setTargetFormat(initialFormat);
      await performConversion(details, initialFormat, backgroundColor);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load the selected image."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle format change
  function handleFormatChange(newFormat: SupportedImageFormat) {
    setTargetFormat(newFormat);
    if (originalImage) {
      performConversion(originalImage, newFormat, backgroundColor);
    }
  }

  // Handle background color change (for transparent image to JPEG)
  function handleColorChange(newColor: string) {
    setBackgroundColor(newColor);
    if (originalImage && targetFormat === "image/jpeg") {
      performConversion(originalImage, targetFormat, newColor);
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
    setBackgroundColor("#FFFFFF");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Tool Header */}
      <ToolHeader
        title="Image Format Converter"
        description="Convert seamlessly between JPEG, PNG, and WebP directly in your browser. Configure background fill color for transparent images converted to JPEG so you never lose control of transparency."
        icon={RefreshCw}
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

          {/* Supported Format Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {FORMAT_OPTIONS.map((opt) => (
              <div
                key={opt.format}
                className="rounded-xl border border-border bg-card p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-foreground">
                    {opt.label}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground font-semibold">
                    {opt.ext}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {opt.description}
                </p>
                <div className="pt-2 text-[11px] font-medium text-primary">
                  {opt.transparency ? "✓ Supports Transparency" : "✕ No Transparency"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Conversion Settings Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold text-foreground">
                    Conversion Target
                  </h2>
                </div>

                <div className="text-xs text-muted-foreground">
                  Source:{" "}
                  <span className="font-semibold text-foreground uppercase">
                    {originalImage.type.replace("image/", "")}
                  </span>
                </div>
              </div>

              {/* Format selection cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FORMAT_OPTIONS.map((opt) => {
                  const isSelected = targetFormat === opt.format;
                  return (
                    <button
                      key={opt.format}
                      type="button"
                      onClick={() => handleFormatChange(opt.format)}
                      className={cn(
                        "relative flex flex-col items-start rounded-xl border p-4 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <div className="flex w-full items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-foreground">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Background Color configuration for JPEG conversion */}
              {targetFormat === "image/jpeg" && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Palette className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold">
                      Transparency Background Fill
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The JPEG format does not support transparent alpha pixels. If your original image
                    contains transparency, select the background color to fill the transparent canvas areas:
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {BG_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleColorChange(preset.hex)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          backgroundColor === preset.hex
                            ? "border-primary bg-background shadow-xs font-semibold text-foreground"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    ))}

                    {/* Custom Hex input */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Label htmlFor="custom-bg-color" className="text-xs text-muted-foreground">
                        Custom:
                      </Label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-7 w-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        title="Pick custom background color"
                      />
                      <Input
                        id="custom-bg-color"
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-7 w-20 font-mono text-xs uppercase"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comparison Preview with stats & download */}
          <ImageComparisonPreview
            original={originalImage}
            processed={processedResult}
            isProcessing={isProcessing}
            onReset={handleReset}
            downloadLabel="Download Converted Image"
          />
        </div>
      )}

      {/* Ad Placement zone */}
      <AdPlaceholder format="horizontal" slotId="convert-bottom" />

      {/* Explanatory & Format Honesty Section */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span>Supported Formats & Transparency Guidelines</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PixelKit Tools adheres strictly to honest web format standards:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Full In-Browser Compatibility</span>
            </h3>
            <p className="leading-relaxed">
              We fully support converting between JPEG, PNG, and WebP using native browser canvas codecs.
              WebP offers the best of both worlds: higher compression than JPEG while fully supporting PNG-style alpha transparency.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Why Animated & Vector Formats Are Excluded</span>
            </h3>
            <p className="leading-relaxed">
              We intentionally do not advertise support for SVG, AVIF, HEIC, or animated GIFs. We believe in genuine
              functionality: browser canvas conversion silently drops animation frames from GIFs and rasterizes
              vector paths from SVGs. PixelKit only processes formats where output fidelity is 100% reliable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
