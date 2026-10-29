"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FileArchive,
  Maximize2,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  ImageIcon,
} from "lucide-react";
import { NAV_TOOLS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/compress": FileArchive,
  "/resize": Maximize2,
  "/convert": RefreshCw,
};

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground hover:opacity-90 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold tracking-tight">PixelKit</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Image Tools</span>
            </div>
          </Link>

          {/* Privacy badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Client-Side</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_TOOLS.map((tool) => {
            const Icon = toolIcons[tool.href] || ImageIcon;
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tool.name}</span>
              </Link>
            );
          })}
          <div className="mx-2 h-4 w-px bg-border" />
          <Link
            href="/about"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/about"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/contact"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Files never leave your browser</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
              Image Tools
            </p>
            {NAV_TOOLS.map((tool) => {
              const Icon = toolIcons[tool.href] || ImageIcon;
              const isActive = pathname === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-base font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tool.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
              General
            </p>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              About PixelKit
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Contact Support
            </Link>
            <Link
              href="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

