"use client";

import { useRef, useState } from "react";
import { UploadCloud, AlertCircle, X, Image as ImageIcon } from "lucide-react";
import { validateImageFile } from "@/lib/image-processing";
import { cn } from "@/lib/utils";

interface DropzoneUploadProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
  className?: string;
}

export function DropzoneUpload({
  onFileSelected,
  isLoading = false,
  className,
}: DropzoneUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setErrorMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file format.");
      return;
    }
    onFileSelected(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
      // Reset input value so the same file can be re-selected if desired
      e.target.value = "";
    }
  }

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {errorMessage && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs sm:text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="rounded p-1 hover:bg-destructive/20"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.005]"
            : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-muted/40",
          isLoading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-105">
          <UploadCloud className="h-8 w-8" />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <p className="text-base sm:text-lg font-semibold text-foreground">
            {isDragActive ? "Drop your image here" : "Click to upload or drag & drop"}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Supports JPEG, PNG, and WebP (up to 50 MB)
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <ImageIcon className="h-3 w-3" />
            JPG / JPEG
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <ImageIcon className="h-3 w-3" />
            PNG
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <ImageIcon className="h-3 w-3" />
            WebP
          </span>
        </div>
      </div>
    </div>
  );
}

