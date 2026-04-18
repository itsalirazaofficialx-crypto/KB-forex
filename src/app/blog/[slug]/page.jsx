'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, ArrowLeft, Twitter, Linkedin, Link2, CheckCircle, Eye, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import PostCard from "@/components/reader/PostCard";
import NewsletterCTA from "@/components/reader/NewsletterCTA";
import { PostService } from "@/services/posts";
import ReaderLayout from "@/components/ReaderLayout";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const found = await PostService.getBySlug(slug);
        if (found) {
          setPost(found);
          PostService.incrementViews(found.id);
          const rel = await PostService.getAll({ status: "published", limit: 4 });
          setRelated(rel.filter((p) => p.id !== found.id).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const copyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const shareUrl   = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : "";
  const shareTitle = encodeURIComponent(post?.title || "");

  if (loading) {
    return (
      <ReaderLayout>
        <div className="max-w-3xl mx-auto px-4 py-16 space-y-5 animate-pulse">
          <div className="h-5 bg-muted rounded w-1/4" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded-xl" />
          {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-muted rounded w-full" />)}
        </div>
      </ReaderLayout>
    );
  }

  if (!post) {
    return (
      <ReaderLayout>
        <div className="text-center py-32">
          <p className="text-muted-foreground mb-5">Article not found.</p>
          <Link href="/blog" className="btn-outline text-sm">← Back to blog</Link>
        </div>
      </ReaderLayout>
    );
  }

  const publishDate = post.publish_date
    ? format(new Date(post.publish_date), "MMMM d, yyyy")
    : null;

  return (
    <ReaderLayout>
      <article className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              {(post.categories?.name) && (
                <>
                  <span>/</span>
                  <Link
                    href={`/category/${(post.categories?.slug).toLowerCase()}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {post.categories?.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground/70 truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          {(post.categories?.name) && (
            <Link
              href={`/category/${(post.categories?.slug).toLowerCase()}`}
              className="tag-badge bg-accent/10 text-accent mb-5 inline-block hover:bg-accent/20 transition-colors"
            >
              {post.categories?.name}
            </Link>
          )}

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] mb-5 text-foreground">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-foreground/65 leading-relaxed mb-7 max-w-2xl">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-border">
            <div className="flex items-center gap-3">
              {post.author_avatar ? (
                <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {(post.author_name || "K")[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author_name || "KB Forex"}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  {publishDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {publishDate}
                    </span>
                  )}
                  {post.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.reading_time} min read
                    </span>
                  )}
                  {post.views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString()} views
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-border transition-colors" aria-label="Share on X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-border transition-colors" aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={copyLink}
                className="p-2 rounded-lg bg-muted hover:bg-border transition-colors relative"
                aria-label="Copy link"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-accent" /> : <Link2 className="w-3.5 h-3.5" />}
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-foreground text-background px-2 py-0.5 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full rounded-2xl object-cover max-h-[520px]"
            />
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12 xl:gap-16">

            {/* Article body */}
            <div
              className="prose-trading min-w-0"
              dangerouslySetInnerHTML={{ __html: post.content || "<p>Content coming soon.</p>" }}
            />

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24 self-start">
              {/* Author */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">About the author</p>
                <div className="flex items-center gap-3 mb-3">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{(post.author_name || "K")[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-foreground">{post.author_name || "KB Forex"}</p>
                    <p className="text-xs text-muted-foreground">Senior Trading Analyst</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  10+ years of experience in forex and macro markets. Focuses on institutional price action and risk frameworks.
                </p>
              </div>

              {/* Newsletter inline */}
              <NewsletterCTA variant="inline" />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?search=${encodeURIComponent(tag)}`}
                        className="tag-badge bg-muted text-muted-foreground hover:bg-border hover:text-foreground transition-colors text-[10px]"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk disclaimer */}
              <div className="bg-muted rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">Risk disclaimer</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trading financial instruments involves substantial risk of loss. This content is for educational purposes only and does not constitute financial advice.{" "}
                  <Link href="/disclaimer" className="underline">Full disclaimer.</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-border py-14 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="section-label mb-1.5">More to read</p>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Related articles</h2>
                </div>
                <Link href="/blog" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All articles
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          </section>
        )}

        <NewsletterCTA />
      </article>
    </ReaderLayout>
  );
}
