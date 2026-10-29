"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Contact PixelKit Support
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Have feedback, found a bug with a specific image format, or want to suggest a new tool?
          Drop us a note below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">Direct Support</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We respond to bug reports and browser compatibility queries promptly.
            </p>
            <p className="text-xs font-mono text-primary font-medium">
              support@pixelkit.local
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">Open Feedback</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              PixelKit is an active, evolving project. We welcome suggestions for new client-side image operations.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center space-y-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Message Sent!</h2>
              <p className="text-sm text-muted-foreground">
                Thank you for reaching out. We have received your note and will review your feedback.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Topic / Tool</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Image Compressor issue or feature request"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Describe your question or feedback..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto gap-2">
                <Send className="h-4 w-4" />
                <span>Submit Message</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

