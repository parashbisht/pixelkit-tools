# PixelKit Tools

Free, fast, and 100% client-side image utility micro-tools built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.

Compress, resize, and convert images directly in your browser without uploading files to any external server.

---

## ⚡ Core Features

### 1. Image Compressor (`/compress`)
- **Drag-and-Drop & File Picker**: Upload JPEG, PNG, or WebP images instantly.
- **Interactive Quality Slider**: Tune lossy compression (5% to 100%) with quick presets (90% Best, 75% Balanced, 50% High Saving, 30% Max).
- **Accurate Byte Calculations**: Genuine size reduction metrics computed directly from output binary Blobs (no simulated figures).
- **Format Toggle**: Compress as JPEG, WebP, or PNG (lossless).
- **Instant Download**: One-click download with customized filename.

### 2. Image Resizer (`/resize`)
- **Natural Dimension Probing**: Displays original pixel width and height on upload.
- **Maintain Aspect Ratio**: Proportional locking toggle; changing width recalculates height automatically and vice versa.
- **Scale Presets**: Quick shortcuts for 25%, 50%, 75%, and 100% of original dimensions.
- **Bicubic Canvas Scaling**: Smooth canvas interpolation to prevent pixelation.
- **Safety Clamping**: Upper dimension limit of 10,000 px to safeguard browser memory.

### 3. Image Format Converter (`/convert`)
- **Format Flexibility**: Seamlessly convert between JPEG (`.jpg`), PNG (`.png`), and WebP (`.webp`).
- **Transparency Background Handling**: When converting transparent PNG/WebP images to JPEG, users can configure a background fill color (White, Black, Gray, Navy, or custom Hex) to avoid black box artifacts.
- **Format Honesty**: Clear documentation on why SVG (vector) and animated GIF formats are not included, avoiding accidental rasterization or frame loss.

### 4. Informational & Legal Pages
- **Home (`/`)**: Hero, tool cards, workflow overview, privacy guarantee, and responsive ad placement zone.
- **About (`/about`)**: Architecture overview and client-side processing philosophy.
- **Contact (`/contact`)**: Support contact form and feedback channels.
- **Privacy Policy (`/privacy-policy`)**: Detailed zero-upload local processing guarantee.
- **Terms of Use (`/terms-of-use`)**: Free-to-use licensing and usage guidelines.
- **SEO Ready**: `robots.txt` and `sitemap.xml` dynamically generated for search crawlers.

---

## 🔒 Privacy & Architecture

- **100% Client-Side**: All image manipulation is executed in the browser via the HTML5 Canvas 2D API.
- **Zero Server Uploads**: No backend server, database, or cloud storage is used. Your images never leave your local device.
- **Memory Safety**: Temporary Object URLs (`blob:`) are actively revoked using `URL.revokeObjectURL()` during resets and page transitions.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3.4 (App Router)
- **UI Library**: React 19.2.8
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node v20 or v22 recommended)
- npm or pnpm

### Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```
