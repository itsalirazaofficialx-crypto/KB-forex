'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Shield, Zap, Clock, TrendingUp, BookOpen } from "lucide-react";
import PostCard from "@/components/reader/PostCard";
import NewsletterCTA from "@/components/reader/NewsletterCTA";
import { PostService } from "@/services/posts";
import ReaderLayout from "@/components/ReaderLayout";

const STATS = [
  { value: "500+", label: "Articles published" },
  { value: "12K+", label: "Monthly readers" },
  { value: "Weekly", label: "Analysis updates" },
  { value: "Free", label: "Forever" },
];

const TOPICS = [
  { icon: BarChart3, title: "Market Analysis", desc: "In-depth technical and fundamental breakdowns of major currency pairs and macro trends.", path: "/category/analysis" },
  { icon: Shield,    title: "Risk Management", desc: "Practical frameworks for protecting capital, sizing positions, and surviving drawdowns.", path: "/category/risk" },
  { icon: Zap,       title: "Trading Strategy", desc: "Tested setups, entry and exit rules, and step-by-step trade planning guides.", path: "/category/strategy" },
  { icon: TrendingUp, title: "Forex Deep Dives", desc: "Currency pair breakdowns, session analysis, and pair-specific strategies.", path: "/category/forex" },
  { icon: BookOpen,  title: "Education", desc: "Concepts explained clearly — from order flow to ICT and price action fundamentals.", path: "/blog" },
  { icon: Clock,     title: "Market News", desc: "Key macro events, central bank decisions, and data releases that move the market.", path: "/category/news" },
];

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts,   setRecentPosts]   = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featured, recent] = await Promise.all([
          PostService.getAll({ status: "published", featured: true, limit: 3 }),
          PostService.getAll({ status: "published", limit: 6 }),
        ]);
        setFeaturedPosts(featured);
        setRecentPosts(recent);
      } catch (err) {
        console.error("Failed to load home page content:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const heroPost  = featuredPosts[0];
  const sidePosts = featuredPosts.slice(1, 3);

  return (
    <ReaderLayout>
      <div className="min-h-screen">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="py-14 md:py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="lg:col-span-2 bg-muted rounded-2xl aspect-[16/9]" />
                <div className="flex flex-col gap-6">
                  <div className="bg-muted rounded-xl aspect-[16/10]" />
                  <div className="bg-muted rounded-xl aspect-[16/10]" />
                </div>
              </div>
            ) : heroPost ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PostCard post={heroPost} variant="featured" />
                </div>
                <div className="flex flex-col gap-6">
                  {sidePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {sidePosts.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-8 flex items-center justify-center text-muted-foreground text-sm h-full">
                      More posts coming soon
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty-state hero */
              <div className="max-w-3xl">
                <p className="section-label mb-5">Market Analysis &amp; Trading Strategy</p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.6rem] font-bold leading-[1.08] mb-6 text-foreground">
                  Understand the markets.<br />
                  <span className="text-accent">Trade with confidence.</span>
                </h1>
                <p className="text-foreground/65 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                  Weekly analysis, strategy guides, and trading insights from experienced forex professionals. No hype — just clear, actionable content.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/blog" className="btn-primary h-12 px-7 text-base inline-flex items-center gap-2">
                    Start reading
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/blog" className="btn-outline h-12 px-7 text-base flex items-center">
                    Browse by topic
                  </Link>
                </div>

                {/* Stats strip */}
                <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Stats strip (when posts exist) ────────────────────────── */}
        {!loading && heroPost && (
          <section className="bg-secondary/50 border-b border-border py-7">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-8 md:gap-16 justify-center md:justify-start">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center md:text-left">
                    <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Topics grid ───────────────────────────────────────────── */}
        <section className="py-14 md:py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label mb-2">What we cover</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  Topics &amp; categories
                </h2>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                All articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOPICS.map((item) => (
                <Link
                  key={item.title}
                  href={item.path}
                  className="group flex gap-4 p-5 rounded-xl border border-border hover:border-accent/40 bg-card hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold mb-1.5 text-foreground group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Latest articles ──────────────────────────────────────── */}
        {!loading && recentPosts.length > 0 && (
          <section className="py-14 md:py-20 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="section-label mb-2">Latest</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Recent articles
                  </h2>
                </div>
                <Link href="/blog" className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                  All articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why KB Forex ──────────────────────────────────────────── */}
        <section className="py-14 md:py-20 border-b border-border bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="section-label mb-4">Why KB Forex</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Trading education done right
            </h2>
            <p className="text-foreground/65 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Every article is written by experienced traders — not content mills. We focus on clarity, accuracy, and real-world applicability. No hype, no "guaranteed profits" — just honest market analysis and practical strategy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { title: "No affiliate garbage", desc: "We don't promote brokers or signal services. Our only incentive is to be genuinely useful." },
                { title: "Clear, not clever",    desc: "We explain concepts in plain English. If you don't understand something, that's on us." },
                { title: "Updated regularly",    desc: "Markets change. Our content evolves with them — no stale 2018 guides." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-border bg-card">
                  <div className="w-1.5 h-6 bg-accent rounded-full mb-3" />
                  <h3 className="font-heading text-base font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ────────────────────────────────────────────── */}
        <NewsletterCTA />
      </div>
    </ReaderLayout>
  );
}
