"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Maximize2,
  Lock,
  Unlock,
  Sliders,
  RotateCcw,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ImageFileDetails, ProcessedImageResult, SupportedImageFormat } from "@/types";
import {
  loadImageDetails,
  processCanvasImage,
  revokeObjectUrl,
} from "@/lib/image-processing";
import { ToolHeader } from "@/components/tools/tool-header";
import { DropzoneUpload } from "@/components/tools/dropzone-upload";
import { ImageComparisonPreview } from "@/components/tools/image-comparison-preview";
import { AdPlaceholder } from "@/components/layout/ad-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCALE_PRESETS = [
  { label: "25%", factor: 0.25 },
  { label: "50%", factor: 0.5 },
  { label: "75%", factor: 0.75 },
  { label: "100% (Original)", factor: 1.0 },
];

export default function ResizePage() {
  const [originalImage, setOriginalImage] = useState<ImageFileDetails | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dimension controls
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [activePreset, setActivePreset] = useState<number | null>(1.0);

  // References for memory cleanup
  const activeOriginalUrlRef = useRef<string | null>(null);
  const activeProcessedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      revokeObjectUrl(activeOriginalUrlRef.current);
      revokeObjectUrl(activeProcessedUrlRef.current);
    };
  }, []);

  // Perform canvas resize
  const performResize = useCallback(
    async (
      image: ImageFileDetails,
      w: number,
      h: number,
    ) => {
      if (w <= 0 || h <= 0) return;

      setIsProcessing(true);
      setErrorMessage(null);

      try {
        const format = (image.type as SupportedImageFormat) || "image/jpeg";
        const baseName = image.name.substring(0, image.name.lastIndexOf(".")) || image.name;
        const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
        const outputFileName = `${baseName}-resized-${w}x${h}.${ext}`;

        const result = await processCanvasImage({
          imageSource: image,
          targetWidth: w,
          targetHeight: h,
          format,
          quality: 0.9,
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
          err instanceof Error ? err.message : "An error occurred while resizing the image."
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

      const ratio = details.width / details.height;
      setAspectRatio(ratio);
      setTargetWidth(details.width);
      setTargetHeight(details.height);
      setActivePreset(1.0);

      await performResize(details, details.width, details.height);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load the selected image."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Width change
  function handleWidthChange(newWidth: number) {
    setActivePreset(null);
    setTargetWidth(newWidth);

    let newHeight = targetHeight;
    if (maintainAspectRatio && aspectRatio > 0) {
      newHeight = Math.max(1, Math.round(newWidth / aspectRatio));
      setTargetHeight(newHeight);
    }

    if (originalImage && newWidth > 0 && newHeight > 0) {
      performResize(originalImage, newWidth, newHeight);
    }
  }

  // Handle Height change
  function handleHeightChange(newHeight: number) {
    setActivePreset(null);
    setTargetHeight(newHeight);

    let newWidth = targetWidth;
    if (maintainAspectRatio && aspectRatio > 0) {
      newWidth = Math.max(1, Math.round(newHeight * aspectRatio));
      setTargetWidth(newWidth);
    }

    if (originalImage && newWidth > 0 && newHeight > 0) {
      performResize(originalImage, newWidth, newHeight);
    }
  }

  // Apply percentage scale preset
  function handleScalePreset(factor: number) {
    if (!originalImage) return;

    setActivePreset(factor);
    const newWidth = Math.max(1, Math.round(originalImage.width * factor));
    const newHeight = Math.max(1, Math.round(originalImage.height * factor));

    setTargetWidth(newWidth);
    setTargetHeight(newHeight);
    performResize(originalImage, newWidth, newHeight);
  }

  // Toggle Aspect Ratio Lock
  function toggleAspectRatio() {
    const nextState = !maintainAspectRatio;
    setMaintainAspectRatio(nextState);

    // If re-enabling aspect ratio lock, re-synchronize height to width
    if (nextState && originalImage) {
      const syncedHeight = Math.max(1, Math.round(targetWidth / aspectRatio));
      setTargetHeight(syncedHeight);
      performResize(originalImage, targetWidth, syncedHeight);
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
    setTargetWidth(0);
    setTargetHeight(0);
    setActivePreset(1.0);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Tool Header */}
      <ToolHeader
        title="Image Resizer"
        description="Scale your image to exact pixel dimensions with an aspect ratio lock or quick scaling presets. Uses high-quality canvas bicubic interpolation directly in your browser."
        icon={Maximize2}
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

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Aspect Ratio Lock</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keep your image proportions intact automatically, or unlock to set custom dimensions freely.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">High-Quality Scaling</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Applies browser-accelerated bicubic image smoothing to prevent jagged pixel artifacts.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Zero Cloud Latency</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your images are never sent across the internet. Resizing runs instantly on your device hardware.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Dimension Controls Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold text-foreground">
                    Resize Controls
                  </h2>
                </div>

                <div className="text-xs text-muted-foreground">
                  Original Dimensions:{" "}
                  <span className="font-semibold text-foreground">
                    {originalImage.width} × {originalImage.height} px
                  </span>
                </div>
              </div>

              {/* Target Width and Height inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-5 space-y-2">
                  <Label htmlFor="width-input" className="text-xs font-semibold text-foreground">
                    Target Width (px)
                  </Label>
                  <Input
                    id="width-input"
                    type="number"
                    min="1"
                    max="10000"
                    value={targetWidth || ""}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Aspect ratio toggle button */}
                <div className="sm:col-span-2 flex justify-center pb-0.5">
                  <Button
                    type="button"
                    variant={maintainAspectRatio ? "default" : "outline"}
                    size="sm"
                    onClick={toggleAspectRatio}
                    className="w-full sm:w-auto gap-1.5 text-xs"
                    title={maintainAspectRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  >
                    {maintainAspectRatio ? (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        <span>Unlocked</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="sm:col-span-5 space-y-2">
                  <Label htmlFor="height-input" className="text-xs font-semibold text-foreground">
                    Target Height (px)
                  </Label>
                  <Input
                    id="height-input"
                    type="number"
                    min="1"
                    max="10000"
                    value={targetHeight || ""}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {/* Scale Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  Quick Scale Presets:
                </span>
                {SCALE_PRESETS.map((preset) => (
                  <button
                    key={preset.factor}
                    type="button"
                    onClick={() => handleScalePreset(preset.factor)}
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                      activePreset === preset.factor
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    handleWidthChange(originalImage.width);
                    setActivePreset(1.0);
                  }}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ml-auto flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to Original</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Preview with stats & download */}
          <ImageComparisonPreview
            original={originalImage}
            processed={processedResult}
            isProcessing={isProcessing}
            onReset={handleReset}
            downloadLabel="Download Resized Image"
          />
        </div>
      )}

      {/* Ad Placement zone */}
      <AdPlaceholder format="horizontal" slotId="resize-bottom" />

      {/* Explanatory Guide */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span>Understanding Aspect Ratio and Canvas Resizing</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Maintaining aspect ratio ensures that the horizontal and vertical proportion of your image
            is preserved during scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">Proportional Scaling</h3>
            <p>
              When locked, entering a new width automatically computes the matching height using the formula
              <code className="text-primary font-mono ml-1">height = width / ratio</code> to prevent distortion.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">Bicubic Resampling</h3>
            <p>
              PixelKit utilizes high-precision 2D context smoothing algorithms, ensuring downscaled photos remain crisp and clear.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">Memory Safety</h3>
            <p>
              Target sizes are clamped to 10,000 pixels maximum to ensure your browser tab remains responsive and stable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
