import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

export default function PostCard({ post, variant = "default" }) {
  const publishDate = post.publish_date || post.created_date;

  /* ── Featured (large hero card) ─────────────────────────────── */
  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative rounded-xl overflow-hidden bg-card border border-border hover:border-accent/40 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5">
          <div className="aspect-[16/9] md:aspect-[21/10] overflow-hidden bg-muted">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/5 to-primary/5" />
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              {post.categories && (
                <span className="px-2.5 py-1 rounded bg-accent/10 text-accent text-[11px] font-semibold uppercase tracking-wider">
                  {post.categories.name || post.categories }
                </span>
              )}
              {publishDate && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(publishDate), "MMM d, yyyy")}
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 text-foreground group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed line-clamp-2 mb-5">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.author_avatar && (
                  <img src={post.author_avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                )}
                {post.author_name && (
                  <span className="text-sm font-medium text-foreground">{post.author_name}</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {post.reading_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.reading_time} min read
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* ── Default (compact card) ─────────────────────────────────── */
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="rounded-xl overflow-hidden bg-card border border-border hover:border-accent/40 transition-all duration-200 hover:shadow-md h-full flex flex-col">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/5 to-primary/5" />
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2.5 mb-3">
            {post.categories && (
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wider">
                {post.categories.name || post.categories}
              </span>
            )}
            {publishDate && (
              <span className="text-[11px] text-muted-foreground">
                {format(new Date(publishDate), "MMM d, yyyy")}
              </span>
            )}
          </div>
          <h3 className="font-heading text-base md:text-lg font-bold leading-snug mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-2">
              {post.author_name && (
                <span className="text-xs font-medium text-foreground">{post.author_name}</span>
              )}
            </div>
            {post.reading_time && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.reading_time} min
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}