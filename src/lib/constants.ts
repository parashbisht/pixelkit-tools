import type { SupportedImageFormat } from "@/types";

export const SITE_NAME = "PixelKit Tools";
export const SITE_TAGLINE = "Fast, Free, & 100% Client-Side Image Micro-Tools";
export const SITE_DESCRIPTION =
  "Compress, resize, and convert your images directly in your browser. No files are ever uploaded to any server.";

export const SUPPORTED_MIME_TYPES: SupportedImageFormat[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const FORMAT_LABELS: Record<SupportedImageFormat, string> = {
  "image/jpeg": "JPEG (.jpg)",
  "image/png": "PNG (.png)",
  "image/webp": "WebP (.webp)",
};

export const FORMAT_EXTENSIONS: Record<SupportedImageFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const NAV_TOOLS = [
  {
    name: "Image Compressor",
    href: "/compress",
    description: "Reduce image file size while retaining visual quality.",
  },
  {
    name: "Image Resizer",
    href: "/resize",
    description: "Adjust pixel dimensions with aspect ratio lock.",
  },
  {
    name: "Image Converter",
    href: "/convert",
    description: "Switch seamlessly between JPEG, PNG, and WebP formats.",
  },
];

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  ...NAV_TOOLS,
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  tools: NAV_TOOLS,
  company: [
    { name: "About PixelKit", href: "/about" },
    { name: "Contact Support", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Use", href: "/terms-of-use" },
  ],
};
