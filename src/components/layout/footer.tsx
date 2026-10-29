import Link from "next/link";
import { ImageIcon, ShieldCheck, Zap, Lock } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/60 text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ImageIcon className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">{SITE_NAME}</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Fast, privacy-focused image utility micro-tools. All compression,
              resizing, and format conversions happen 100% locally in your
              web browser.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                <span>Client-Side Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                <span>Instant HTML5 Canvas Processing</span>
              </div>
            </div>
          </div>

          {/* Tools links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Micro-Tools
            </h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.tools.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and About links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Resources & Legal
            </h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} {SITE_NAME}. Free and open web tools.</p>
          <p className="text-center sm:text-right">
            Browser-based processing via Web APIs. No cookies, trackers, or server storage.
          </p>
        </div>
      </div>
    </footer>
  );
}

