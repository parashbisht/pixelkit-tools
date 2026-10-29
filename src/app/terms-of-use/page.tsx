import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "PixelKit Tools Terms of Use. Guidelines and terms for using our free client-side image micro-tools.",
};

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Terms of Use
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing PixelKit Tools, you agree to comply with and be bound by
            these Terms of Use. If you do not agree, please discontinue use of the tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Permitted Use</h2>
          <p>
            PixelKit Tools is provided free of charge for personal, educational, and commercial
            image optimization, resizing, and format conversion. You may use our tools on any
            number of images without fees or registration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. User Responsibility & Content</h2>
          <p>
            Because all processing takes place locally on your client machine, you retain sole
            ownership and responsibility for any files and images you process through the website.
            You agree not to use the tools in connection with unlawful materials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Disclaimer of Warranties</h2>
          <p>
            PixelKit Tools is provided &quot;as is&quot; and &quot;as available&quot; without warranties
            of any kind, either express or implied. While we strive for optimal compression algorithms
            and exact dimension conversions, we do not guarantee that output files will meet every
            arbitrary software requirement or that processing will be uninterrupted on all legacy browsers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Modifications</h2>
          <p>
            We reserve the right to update or modify these Terms of Use at any time. Continued use
            of the site constitutes acceptance of updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}

