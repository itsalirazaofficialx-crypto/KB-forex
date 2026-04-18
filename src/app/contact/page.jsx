'use client';

import { useState } from "react";
import { Mail, Twitter, Linkedin, CheckCircle, Loader2, MessageSquare } from "lucide-react";
import NewsletterCTA from "@/components/reader/NewsletterCTA";
import ReaderLayout from "@/components/ReaderLayout";

export default function Contact() {
  const [form,      setForm]      = useState({ name: "", email: "", subject: "", message: "" });
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    
    // Simulate API call
    console.log("Sending message:", form);
    await new Promise(r => setTimeout(r, 1000));
    
    setSending(false);
    setSent(true);
  };

  return (
    <ReaderLayout>
      <div className="min-h-screen font-body">
        {/* Header */}
        <section className="bg-primary py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="section-label text-accent mb-4">Get in Touch</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              We'd love to hear from you
            </h1>
            <p className="text-primary-foreground/65 text-base max-w-xl mx-auto">
              Questions, feedback, or a trading topic you'd like us to cover — reach out and we'll get back to you.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14 md:py-20 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-[1fr_360px] gap-12">

              {/* Form */}
              <div>
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Message sent!</h2>
                    <p className="text-muted-foreground mb-6">We'll get back to you within 1-2 business days.</p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="btn-outline text-sm"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Your full name"
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="field-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        className="field-input"
                      >
                        <option value="">Select a topic</option>
                        <option value="Content request">Content request / topic suggestion</option>
                        <option value="General question">General question</option>
                        <option value="Partnership">Partnership / collaboration</option>
                        <option value="Technical issue">Technical issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                      <textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us what's on your mind…"
                        rows={6}
                        className="field-input resize-none"
                      />
                    </div>

                    {error && <p className="text-destructive text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-primary h-11 px-7 text-sm inline-flex items-center gap-2"
                    >
                      {sending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      ) : (
                        <><MessageSquare className="w-4 h-4" /> Send message</>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="font-heading text-base font-bold text-foreground mb-4">Other ways to connect</h3>
                  <div className="space-y-4">
                    <a href="mailto:hello@kbforex.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <Mail className="w-4 h-4 group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-xs">hello@kbforex.com</p>
                      </div>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <Twitter className="w-4 h-4 group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Twitter / X</p>
                        <p className="text-xs">@KBForex</p>
                      </div>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <Linkedin className="w-4 h-4 group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">LinkedIn</p>
                        <p className="text-xs">KBForex</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-secondary/50 border border-border rounded-xl p-6">
                  <h3 className="font-heading text-base font-bold text-foreground mb-2">Response time</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We aim to respond to all messages within 1-2 business days. For urgent matters, reaching out on Twitter is usually faster.
                  </p>
                </div>

                <div className="bg-muted rounded-xl p-5 border border-border">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Note</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We don't offer personal trading advice, broker recommendations, or signal services. Please keep questions related to our content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <NewsletterCTA />
      </div>
    </ReaderLayout>
  );
}
