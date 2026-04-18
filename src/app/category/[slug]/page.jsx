'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";
import PostCard from "@/components/reader/PostCard";
import NewsletterCTA from "@/components/reader/NewsletterCTA";
import { PostService } from "@/services/posts";
import { CategoryService } from "@/services/categories";
import ReaderLayout from "@/components/ReaderLayout";

export default function CategoryPage() {
  const { slug } = useParams();
  const [posts, setPosts]       = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const cat = await CategoryService.getBySlug(slug);
        if (cat) {
          setCategory(cat);
          const catPosts = await PostService.getAll({ category_slug: slug, status: "published" });
          setPosts(catPosts);
        }
      } catch (err) {
        console.error("Failed to load category:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <ReaderLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-7 h-7 border-4 border-muted border-t-accent rounded-full animate-spin" />
        </div>
      </ReaderLayout>
    );
  }

  if (!category) {
    return (
      <ReaderLayout>
        <div className="pt-[68px] min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <FolderOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2 text-foreground">Category not found</h1>
          <p className="text-muted-foreground mb-6 text-sm">This category doesn't exist yet.</p>
          <Link href="/blog" className="btn-outline text-sm">Browse all articles</Link>
        </div>
      </ReaderLayout>
    );
  }

  return (
    <ReaderLayout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="bg-primary py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All articles
            </Link>
            <p className="section-label text-accent mb-3">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-primary-foreground/65 text-base max-w-2xl leading-relaxed">{category.description}</p>
            )}
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-base">No articles in this category yet.</p>
              </div>
            )}
          </div>
        </section>

        <NewsletterCTA variant="inline" />
        <div className="h-16" />
      </div>
    </ReaderLayout>
  );
}
