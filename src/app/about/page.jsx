'use client';

import Link from "next/link";
import { ArrowRight, BarChart3, Shield, Zap, BookOpen, Users, Target } from "lucide-react";
import NewsletterCTA from "@/components/reader/NewsletterCTA";
import ReaderLayout from "@/components/ReaderLayout";

const TEAM = [
  {
    name: "KB",
    role: "Founder & Lead Analyst",
    bio: "10+ years trading forex and macro markets professionally. Specialises in institutional order flow and multi-timeframe analysis.",
    initials: "KB",
  },
  {
    name: "Sarah M.",
    role: "Risk & Strategy Editor",
    bio: "Former prop trader with a focus on risk management frameworks and systematic trading approaches.",
    initials: "SM",
  },
];

const VALUES = [
  {
    icon: BookOpen,
    title: "Education first",
    desc: "Everything we publish is designed to teach, not to sell. You won't find broker promotions or 'guaranteed signals' here.",
  },
  {
    icon: Target,
    title: "Accuracy over volume",
    desc: "We'd rather publish one excellent article than ten mediocre ones. Quality is non-negotiable.",
  },
  {
    icon: Users,
    title: "Built for real traders",
    desc: "We write for people who are serious about learning — not beginners looking for shortcuts.",
  },
  {
    icon: Shield,
    title: "Transparent about risk",
    desc: "Every piece of content includes honest context about the risks involved. We never downplay how hard this is.",
  },
];

export default function About() {
  return (
    <ReaderLayout>
      <div className="min-h-screen font-body">
        {/* Hero */}
        <section className="bg-primary py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="section-label text-accent mb-4">About KBForex</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Serious trading education,<br className="hidden sm:block" /> no shortcuts
            </h1>
            <p className="text-primary-foreground/65 text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
              KBForex is an independent editorial platform built for traders who want to understand markets deeply — not just follow signals.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-14 md:py-20 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="section-label mb-4">Our mission</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Making forex education honest and actually useful
                </h2>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  Most trading content online is either too shallow to be helpful or exists to sell you something. We built KBForex to be different: independent, technically rigorous, and written by people who actually trade.
                </p>
                <p className="text-foreground/70 leading-relaxed mb-6">
                  We cover everything from basic market structure to advanced institutional concepts — always with a focus on practical application over theory.
                </p>
                <Link href="/blog" className="btn-primary h-11 px-6 text-sm inline-flex items-center gap-2">
                  Read our articles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "500+", label: "Articles" },
                  { value: "12K+", label: "Monthly readers" },
                  { value: "5+",   label: "Years publishing" },
                  { value: "Free", label: "Always" },
                ].map((s) => (
                  <div key={s.label} className="bg-secondary/50 border border-border rounded-xl p-5">
                    <p className="font-heading text-3xl font-bold text-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 md:py-20 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="section-label mb-3">What we stand for</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Our editorial values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold mb-1.5 text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-14 md:py-20 border-b border-border bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="section-label mb-3">The team</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Who writes at KBForex</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {TEAM.map((person) => (
                <div key={person.name} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">
                      {person.initials}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-base text-foreground">{person.name}</p>
                      <p className="text-sm text-accent">{person.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-10 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-muted rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Risk Disclaimer</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trading forex and other financial instruments involves significant risk and is not suitable for everyone. Past performance is not indicative of future results. All content on KBForex is for educational and informational purposes only and does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </section>

        <NewsletterCTA />
      </div>
    </ReaderLayout>
  );
}
