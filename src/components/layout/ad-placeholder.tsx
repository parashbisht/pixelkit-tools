interface AdPlaceholderProps {
  slotId?: string;
  format?: "horizontal" | "rectangle" | "auto";
  className?: string;
}

/**
 * Advertising slot component prepared for future Google AdSense or advertising network integration.
 * In development or when no ad publisher ID is configured, renders a subtle, clean container
 * without throwing errors or running unapproved external scripts.
 */
export function AdPlaceholder({
  slotId,
  format = "auto",
  className = "",
}: AdPlaceholderProps) {
  // Only render container if designated for ad placement architecture
  return (
    <aside
      aria-label="Sponsor Advertisement"
      className={`my-6 mx-auto w-full max-w-4xl overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-center transition-colors ${className}`}
    >
      <div className="flex flex-col items-center justify-center py-2 text-xs text-muted-foreground/60">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/40">
          Advertisement Placement
        </span>
        <p className="mt-1 text-[11px] text-muted-foreground/50">
          Future AdSense responsive placement zone ({format} format
          {slotId ? ` • Slot: ${slotId}` : ""})
        </p>
      </div>
    </aside>
  );
}

