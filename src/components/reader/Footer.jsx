import Link from "next/link";
import { TrendingUp, Twitter, Youtube, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const TOPICS = [
  { label: "Forex Trading",       path: "/category/forex" },
  { label: "Technical Analysis",  path: "/category/analysis" },
  { label: "Trading Strategy",    path: "/category/strategy" },
  { label: "Risk Management",     path: "/category/risk" },
  { label: "Market News",         path: "/category/news" },
];

const PLATFORM = [
  { label: "All Articles",  path: "/blog" },
  { label: "About",         path: "/about" },
  { label: "Contact",       path: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy",  path: "/privacy" },
  { label: "Terms of Use",    path: "/terms" },
  { label: "Disclaimer",      path: "/disclaimer" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Top CTA strip */}
      <div className="border-b border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-xl font-bold text-primary-foreground mb-1">
              Stay informed every week
            </p>
            <p className="text-primary-foreground/60 text-sm">Market analysis and strategy, straight to your inbox.</p>
          </div>
          <Link
            href="/blog"
            className="flex-shrink-0 inline-flex items-center gap-2 h-11 px-6 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Subscribe free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-primary-foreground">
                KB<span className="text-accent">Forex</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/55 leading-relaxed mb-5 max-w-xs">
              Actionable trading insights, technical analysis, and forex strategy for disciplined traders. Published weekly.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter,  label: "Twitter" },
                { icon: Youtube,  label: "YouTube" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail,     label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-md bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/35 mb-4">Topics</h4>
            <ul className="space-y-2.5">
              {TOPICS.map((t) => (
                <li key={t.path}>
                  <Link href={t.path} className="text-sm text-primary-foreground/65 hover:text-accent transition-colors">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/35 mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {PLATFORM.map((t) => (
                <li key={t.path}>
                  <Link href={t.path} className="text-sm text-primary-foreground/65 hover:text-accent transition-colors">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/35 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL.map((t) => (
                <li key={t.path}>
                  <Link href={t.path} className="text-sm text-primary-foreground/65 hover:text-accent transition-colors">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/35">
          <p>© {year} KBForex. All rights reserved.</p>
          <p>Trading involves substantial risk of loss. Content is for educational purposes only and is not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}