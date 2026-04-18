'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import PostCard from "@/components/reader/PostCard";
import NewsletterCTA from "@/components/reader/NewsletterCTA";
import { PostService } from "@/services/posts";
import ReaderLayout from "@/components/ReaderLayout";

const ALL_CATS = ["All", "Forex", "Analysis", "Strategy", "Risk", "News"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "popular", label: "Most viewed" },
];

function BlogContent() {
  const [posts,          setPosts]          = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort,           setSort]           = useState("newest");
  const [showSort,       setShowSort]       = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("search") || "";
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const data = await PostService.getAll({ status: "published" });
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let result = [...posts];
    if (activeCategory !== "All") {
      result = result.filter((p) => {
        const catName = p.categories?.name || p.category;
        return catName?.toLowerCase() === activeCategory.toLowerCase();
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          (p.categories?.name || p.category)?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "oldest") result.sort((a, b) => new Date(a.publish_date || a.created_at) - new Date(b.publish_date || b.created_at));
    else if (sort === "popular") result.sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (sort === "newest") result.sort((a, b) => new Date(b.publish_date || b.created_at) - new Date(a.publish_date || a.created_at));
    
    setFiltered(result);
  }, [posts, search, activeCategory, sort]);

  const clearFilters = () => { setSearch(""); setActiveCategory("All"); setSort("newest"); };
  const hasFilters = search || activeCategory !== "All" || sort !== "newest";

  return (
    <div className="min-h-screen">
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="bg-primary py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4">The Blog</p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            Trading knowledge, clearly explained
          </h1>
          <p className="text-primary-foreground/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Analysis, strategy, and market insights for traders at every level.
          </p>
          <p className="text-primary-foreground/40 text-sm mt-5">
            {loading ? "" : `${posts.length} articles published`}
          </p>
        </div>
      </section>

      {/* ── Sticky filter bar ───────────────────────────────── */}
      <div className="sticky top-[68px] z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-1 items-center gap-3 min-w-0">
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles…"
                  className="field-input pl-9 h-9 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
                {ALL_CATS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-150 ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-border"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSort((v) => !v)}
                onBlur={() => setTimeout(() => setShowSort(false), 160)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-muted text-sm text-muted-foreground hover:text-foreground hover:bg-border transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{SORT_OPTIONS.find((s) => s.value === sort)?.label}</span>
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-xl shadow-lg py-1.5 z-10 animate-fade-in">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === opt.value
                          ? "text-foreground font-medium bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile category pills */}
          <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 mt-2.5">
            {ALL_CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Post grid ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl animate-pulse" style={{ height: 320 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
              <Search className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="font-heading text-xl font-bold text-foreground mb-2">No articles found</p>
            <p className="text-muted-foreground text-sm mb-7">
              {hasFilters ? "Try adjusting your search or filters." : "No posts published yet — check back soon."}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-outline text-sm">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-7">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                article{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                {search ? ` for "${search}"` : ""}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                  Clear filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </section>

      <NewsletterCTA />
    </div>
  );
}

export default function Blog() {
  return (
    <ReaderLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
        </div>
      }>
        <BlogContent />
      </Suspense>
    </ReaderLayout>
  );
}
