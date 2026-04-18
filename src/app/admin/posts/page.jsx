'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Pencil, Trash2, Eye, EyeOff, X, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { PostService } from "@/services/posts";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUS_STYLE = {
  published: "bg-emerald-100 text-emerald-700",
  draft:     "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

export default function PostsList() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [deleting, setDeleting] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await PostService.getAll({});
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    const catName = p.categories?.name || p.category;
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || catName?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm("Delete this post permanently? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await PostService.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await PostService.update(post.id, { status: newStatus });
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error("Failed to update post status:", err);
    }
  };

  const counts = {
    all:       posts.length,
    published: posts.filter(p => p.status === "published").length,
    draft:     posts.filter(p => p.status === "draft").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">All Posts</h1>
            <p className="text-muted-foreground text-sm mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""} total</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadPosts} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link href="/admin/posts/new" className="btn-accent text-sm h-10 px-5 inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, slug…"
              className="w-full pl-9 pr-8 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              { key: "all",       label: "All" },
              { key: "published", label: "Published" },
              { key: "draft",     label: "Drafts" },
              { key: "scheduled", label: "Scheduled" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.5 ${
                  filter === key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-border text-muted-foreground"
                }`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-sm">
                {search || filter !== "all" ? "No posts match your filters." : "No posts yet."}
              </p>
              {!search && filter === "all" && (
                <Link href="/admin/posts/new" className="btn-accent text-sm h-9 px-5 inline-flex items-center gap-2 mt-4">
                  <PlusCircle className="w-4 h-4" /> Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Views</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.featured_image ? (
                            <img src={post.featured_image} alt="" className="w-10 h-8 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
                          ) : (
                            <div className="w-10 h-8 rounded-lg bg-muted flex-shrink-0 hidden sm:block" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-[200px] md:max-w-xs">{post.title}</p>
                            <p className="text-[11px] text-muted-foreground truncate">/blog/{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{post.categories?.name || post.category || "—"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`tag-badge text-[10px] ${STATUS_STYLE[post.status] || "bg-muted text-muted-foreground"}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-xs text-muted-foreground">
                        {post.updated_at ? format(new Date(post.updated_at), "MMM d, yyyy") : "—"}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-sm text-muted-foreground">
                        {(post.views || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="View live"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => togglePublish(post)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title={post.status === "published" ? "Unpublish" : "Publish"}
                          >
                            {post.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-accent" />}
                          </button>
                          <Link
                            href={`/admin/posts/edit/${post.id}`}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-accent"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-right">
            Showing {filtered.length} of {posts.length} posts
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
