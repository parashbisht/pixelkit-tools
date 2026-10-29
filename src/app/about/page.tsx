import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About PixelKit Tools",
  description:
    "Learn about PixelKit Tools, a fast, client-side suite of image micro-utilities designed for speed and privacy.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          About PixelKit Tools
        </h1>
        <p className="text-lg text-muted-foreground">
          A lightweight, privacy-respecting toolkit for everyday image tasks.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Our Philosophy</h2>
          <p>
            Most modern web image converters and compression sites require you to
            upload your files to remote servers. This introduces waiting times, privacy
            concerns, bandwidth limits, and unnecessary cloud computing overhead.
          </p>
          <p>
            PixelKit Tools was built with a fundamentally different premise: modern web
            browsers have powerful graphics hardware acceleration and robust native APIs
            (such as HTML5 Canvas, OffscreenCanvas, and modern blob serialization). We
            believe that simple image utilities should run locally in your browser.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 not-prose">
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Zero Server Uploads</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your images are never sent over the network to any backend server or third-party API.
              Everything stays inside your browser memory.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Instant Performance</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              With no upload or download network bottleneck, processing takes only a fraction of a
              second on standard desktop and mobile browsers.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Supported Formats</h2>
          <p>
            PixelKit Tools supports the web&apos;s standard image formats:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-foreground">JPEG (.jpg, .jpeg):</strong> Ideal for photographs
              and images with complex gradients where lossy compression achieves massive file reductions.
            </li>
            <li>
              <strong className="text-foreground">PNG (.png):</strong> Lossless format with full alpha
              transparency support, perfect for graphics, logos, and screenshots.
            </li>
            <li>
              <strong className="text-foreground">WebP (.webp):</strong> Modern web format providing
              superior lossy and lossless compression with transparency support.
            </li>
          </ul>
        </section>

        <div className="pt-6 border-t border-border flex flex-wrap gap-4">
          <Link
            href="/compress"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <span>Try Image Compressor</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

