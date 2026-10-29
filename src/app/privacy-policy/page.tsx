import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "PixelKit Tools Privacy Policy. Learn why your files remain 100% private and are never uploaded to any server.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Local Processing Guarantee</h2>
          <p>
            At PixelKit Tools, user privacy is not an afterthought—it is the core architecture
            of our tools. All image compression, resizing, and format conversion utilities operate
            <strong className="text-foreground"> entirely within your web browser</strong> using the
            HTML5 Canvas API, WebP/JPEG encoding interfaces, and Blob object URLs.
          </p>
          <p>
            When you select or drag-and-drop an image onto PixelKit Tools, the image file is read
            directly from your local disk into browser RAM. The image is never transmitted over
            the internet, never stored on any cloud database, and never inspected by our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Information We Do Not Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We do not collect or view your images or graphics.</li>
            <li>We do not extract, store, or log image EXIF metadata on external servers.</li>
            <li>We do not maintain user accounts, require logins, or store passwords.</li>
            <li>We do not sell, rent, or trade user data to third parties.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Browser Memory & Object URLs</h2>
          <p>
            Temporary Object URLs (<code>blob:</code> URLs) generated to display previews on your
            screen are stored temporarily in your local browser runtime. PixelKit Tools actively
            calls <code>URL.revokeObjectURL()</code> when files are reset or when new files are loaded,
            ensuring your device memory is released promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Advertising and Analytics</h2>
          <p>
            PixelKit Tools may display non-intrusive advertisements in designated areas to support
            free development and hosting. Any future advertising providers (such as Google AdSense)
            must adhere to strict web privacy guidelines and cannot access image files processed in
            your browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or browser-side execution details,
            you can reach out via our contact page.
          </p>
        </section>
      </div>
    </div>
  );
}

