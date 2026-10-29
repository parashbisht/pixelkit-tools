import Link from "next/link";
import {
  FileArchive,
  Maximize2,
  RefreshCw,
  ShieldCheck,
  Zap,
  ArrowRight,
  UploadCloud,
  Sliders,
  Download,
  Lock,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AdPlaceholder } from "@/components/layout/ad-placeholder";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    title: "Image Compressor",
    href: "/compress",
    icon: FileArchive,
    badge: "Most Popular",
    description:
      "Shrink file sizes significantly while keeping visual quality crisp. Customize lossy compression quality with instant byte calculations.",
    supported: "JPEG, PNG, WebP",
    cta: "Launch Compressor",
  },
  {
    title: "Image Resizer",
    href: "/resize",
    icon: Maximize2,
    badge: "Precise",
    description:
      "Resize image dimensions to exact target pixels with aspect ratio preservation lock or percentage presets (25%, 50%, 75%).",
    supported: "Any standard image",
    cta: "Launch Resizer",
  },
  {
    title: "Image Converter",
    href: "/convert",
    icon: RefreshCw,
    badge: "Versatile",
    description:
      "Convert seamlessly between JPEG, PNG, and WebP. Smart background color handling for transparent images converted to JPEG.",
    supported: "JPEG, PNG, WebP",
    cta: "Launch Converter",
  },
];

const STEPS = [
  {
    step: "01",
    icon: UploadCloud,
    title: "Upload Image",
    description:
      "Drag and drop any standard image from your device or select via the file picker.",
  },
  {
    step: "02",
    icon: Sliders,
    title: "Adjust Settings",
    description:
      "Tweak compression quality, target dimensions, or target format with real-time feedback.",
  },
  {
    step: "03",
    icon: Download,
    title: "Instant Download",
    description:
      "Download your optimized result immediately. No waiting in upload queues.",
  },
];

export default function HomePage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Client-Side • Your Images Never Leave Your Browser</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Fast, Free, & Private <br className="hidden sm:inline" />
            <span className="text-primary">Image Utility Micro-Tools</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Compress file sizes, adjust dimensions, and switch formats in seconds.
            All processing happens locally on your computer via HTML5 Canvas—zero
            server uploads, zero waiting queues, complete privacy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/compress"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              <FileArchive className="h-4 w-4" />
              <span>Compress an Image</span>
            </Link>
            <Link
              href="/convert"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Convert Formats</span>
            </Link>
          </div>
        </section>

        {/* 3 Core Tool Cards */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Choose a Tool
            </h2>
            <p className="text-sm text-muted-foreground">
              Pick a micro-tool to optimize or transform your images instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.href}
                  className="flex flex-col justify-between hover:shadow-md transition-shadow border-border"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {tool.badge}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed mt-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Supports:</span>{" "}
                      {tool.supported}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link
                      href={tool.href}
                      className={cn(buttonVariants({ variant: "default" }), "w-full gap-2")}
                    >
                      <span>{tool.cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Ad Placeholder readiness */}
        <AdPlaceholder format="horizontal" slotId="home-mid" />

        {/* How It Works Section */}
        <section className="rounded-2xl border border-border bg-card p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              How PixelKit Works
            </h2>
            <p className="text-sm text-muted-foreground">
              No registration, no API keys, and no waiting. Three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="space-y-3 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-mono text-sm font-bold text-primary">
                      {step.step}
                    </span>
                    <div className="h-px flex-1 bg-border hidden sm:block" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Privacy & Security Guarantee */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
            <Lock className="h-6 w-6 shrink-0" />
            <h2 className="text-xl font-bold tracking-tight">
              Our Privacy Promise: 100% Client-Side Processing
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unlike many online converters that upload your personal photos and documents to remote cloud
            servers, <strong className="text-foreground">PixelKit Tools never uploads your files</strong>.
            All image decoding, canvas manipulation, compression, and encoding happen strictly inside
            your web browser using the native HTML5 Canvas API and JavaScript.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Zero server latency; processing speed depends only on your device.</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Your sensitive graphics, receipts, or personal photos remain strictly private.</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Object URLs are revoked immediately after completion to keep memory free.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
