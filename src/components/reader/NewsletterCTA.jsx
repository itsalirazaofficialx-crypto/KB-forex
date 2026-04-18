'use client';

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { NewsletterService } from "@/services/newsletter";

export default function NewsletterCTA({ variant = "default" }) {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await NewsletterService.subscribe(email.trim());
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Inline (compact version for sidebars / articles) ───────── */
  if (variant === "inline") {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">
          Get weekly updates
        </h3>
        <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
          Market analysis, trade ideas, and strategy guides—delivered every Monday.
        </p>
        {submitted ? (
          <div className="flex items-center gap-2 text-accent text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            You're subscribed. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="field-input h-11 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent h-10 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </button>
            {error && <p className="text-destructive text-xs">{error}</p>}
          </form>
        )}
      </div>
    );
  }

  /* ── Default (full-width section) ───────────────────────────── */
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4">
          Newsletter
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
          Stay on top of the markets
        </h2>
        <p className="text-primary-foreground/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Get weekly analysis, trade setups, and strategy tips—directly in your inbox. No spam, ever.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-accent text-base font-medium">
            <CheckCircle className="w-5 h-5" />
            You're in! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 h-12 px-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground border border-border outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
        {error && <p className="text-destructive/80 text-sm mt-3">{error}</p>}
        <p className="text-primary-foreground/40 text-xs mt-5">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}