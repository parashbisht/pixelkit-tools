"use client";

import { useState } from "react";
import {
  Download,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  FileCheck,
  Columns2,
  Eye,
  Loader2,
} from "lucide-react";
import { ImageFileDetails, ProcessedImageResult } from "@/types";
import { formatBytes, formatDimensions, calculateSavings } from "@/lib/format";
import { downloadFile } from "@/lib/image-processing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageComparisonPreviewProps {
  original: ImageFileDetails;
  processed: ProcessedImageResult | null;
  isProcessing: boolean;
  onReset: () => void;
  downloadLabel?: string;
  className?: string;
}

export function ImageComparisonPreview({
  original,
  processed,
  isProcessing,
  onReset,
  downloadLabel = "Download Processed Image",
  className,
}: ImageComparisonPreviewProps) {
  const [viewMode, setViewMode] = useState<"split" | "processed" | "original">("split");

  const savings = processed
    ? calculateSavings(original.size, processed.size)
    : null;

  function handleDownload() {
    if (!processed) return;
    downloadFile(processed.blob, processed.fileName);
  }

  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Top action / summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start Over</span>
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="truncate max-w-[200px] sm:max-w-xs text-xs font-medium text-foreground">
            {original.name}
          </span>
        </div>

        {/* View toggles for desktop */}
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors",
              viewMode === "split"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("processed")}
            className={cn(
              "flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors",
              viewMode === "processed"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Output</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("original")}
            className={cn(
              "flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors",
              viewMode === "original"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Original</span>
          </button>
        </div>
      </div>

      {/* Stats KPI comparison card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Original stat */}
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Original File
          </p>
          <p className="text-xl font-bold text-foreground">
            {formatBytes(original.size)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDimensions(original.width, original.height)}
          </p>
        </div>

        {/* Output stat */}
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Output Result
          </p>
          {isProcessing ? (
            <div className="flex items-center gap-2 py-1 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          ) : processed ? (
            <>
              <p className="text-xl font-bold text-foreground">
                {formatBytes(processed.size)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDimensions(processed.width, processed.height)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-1">Pending adjustment</p>
          )}
        </div>

        {/* Savings stat */}
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Savings / Difference
          </p>
          {isProcessing ? (
            <p className="text-sm text-muted-foreground py-1">Calculating...</p>
          ) : savings ? (
            <>
              <div className="flex items-center gap-1.5">
                {savings.isSaved ? (
                  <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
                <p
                  className={cn(
                    "text-xl font-bold",
                    savings.isSaved
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  )}
                >
                  {savings.text}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {savings.isSaved
                  ? `Reduced by ${formatBytes(original.size - (processed?.size || 0))}`
                  : "Size increased due to format / resolution"}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-1">—</p>
          )}
        </div>
      </div>

      {/* Image Preview Panels */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* Original preview */}
        {(viewMode === "split" || viewMode === "original") && (
          <Card className="overflow-hidden border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/30 text-xs font-semibold">
              <span className="text-muted-foreground uppercase tracking-wider text-[11px]">
                Original Preview
              </span>
              <span className="text-muted-foreground">
                {formatBytes(original.size)}
              </span>
            </div>
            <CardContent className="p-4 flex items-center justify-center min-h-[300px] max-h-[460px] bg-[repeating-conic-gradient(#0000000a_0_25%,transparent_0_50%)] bg-[size:16px_16px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={original.objectUrl}
                alt="Original uploaded image"
                className="max-h-[420px] max-w-full object-contain rounded shadow-xs"
              />
            </CardContent>
          </Card>
        )}

        {/* Processed preview */}
        {(viewMode === "split" || viewMode === "processed") && (
          <Card className="overflow-hidden border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/30 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground uppercase tracking-wider text-[11px]">
                  Output Result
                </span>
                {savings?.isSaved && (
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    {savings.percentage}% Saved
                  </span>
                )}
              </div>
              <span className="text-muted-foreground">
                {processed ? formatBytes(processed.size) : "—"}
              </span>
            </div>
            <CardContent className="relative p-4 flex items-center justify-center min-h-[300px] max-h-[460px] bg-[repeating-conic-gradient(#0000000a_0_25%,transparent_0_50%)] bg-[size:16px_16px]">
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs gap-3 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Rendering in canvas...
                  </p>
                </div>
              )}

              {processed ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={processed.objectUrl}
                  alt="Processed output image"
                  className="max-h-[420px] max-w-full object-contain rounded shadow-xs"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">Adjust controls to generate preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Download Bar */}
      {processed && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                {processed.fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDimensions(processed.width, processed.height)} •{" "}
                {formatBytes(processed.size)}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleDownload}
            disabled={isProcessing}
            className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <Download className="h-4 w-4" />
            <span>{downloadLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
