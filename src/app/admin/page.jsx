'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Eye, PlusCircle, Clock, CheckCircle, TrendingUp, ArrowUpRight, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";
import { PostService } from "@/services/posts";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUS_STYLE = {
  published: "bg-emerald-100 text-emerald-700",
  draft:     "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

export default function AdminDashboard() {
  const [stats, setStats]       = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { user }                = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const all = await PostService.getAll({});
        const published  = all.filter((p) => p.status === "published");
        const drafts     = all.filter((p) => p.status === "draft");
        const totalViews = all.reduce((acc, p) => acc + (p.views || 0), 0);
        setStats({ total: all.length, published: published.length, drafts: drafts.length, totalViews });
        setRecentPosts(all.slice(0, 8));
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const STAT_CARDS = [
    { label: "Total Posts",   value: stats.total,                    icon: FileText,    color: "text-blue-600",  bg: "bg-blue-50" },
    { label: "Published",     value: stats.published,                icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Drafts",        value: stats.drafts,                   icon: Clock,       color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Views",   value: stats.totalViews.toLocaleString(), icon: Eye,      color: "text-violet-600",bg: "bg-violet-50" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {user?.email ? `Welcome back, ${user.email.split("@")[0]}` : "Dashboard"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your content.</p>
          </div>
          <Link href="/admin/posts/new" className="btn-accent text-sm h-10 px-5 inline-flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold font-heading text-foreground">
                {loading ? <div className="h-7 w-16 bg-muted rounded animate-pulse" /> : value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Write new post",      href: "/admin/posts/new",   icon: PlusCircle,  desc: "Start from scratch" },
            { label: "Manage posts",        href: "/admin/posts",       icon: FileText,    desc: "Edit or delete posts" },
            { label: "Manage categories",   href: "/admin/categories",  icon: TrendingUp,  desc: "Organise your topics" },
          ].map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Recent Posts Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Posts</h2>
            <Link href="/admin/posts" className="text-sm text-accent hover:underline">View all →</Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-4 text-sm">No posts yet. Create your first one.</p>
              <Link href="/admin/posts/new" className="btn-accent text-sm h-9 px-5 inline-flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt=""
                      className="w-12 h-9 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(post.categories?.name || post.category) && <span>{post.categories?.name || post.category} · </span>}
                      {post.updated_at && format(new Date(post.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <span className={`tag-badge text-[10px] flex-shrink-0 ${STATUS_STYLE[post.status] || "bg-muted text-muted-foreground"}`}>
                    {post.status}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View post"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-muted transition-colors"
                      title="Edit post"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
