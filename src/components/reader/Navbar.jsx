'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, TrendingUp, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const NAV = [
  { label: "Home",       path: "/" },
  { label: "Articles",   path: "/blog" },
  {
    label: "Topics",
    children: [
      { label: "Forex",              path: "/category/forex" },
      { label: "Technical Analysis", path: "/category/analysis" },
      { label: "Trading Strategy",   path: "/category/strategy" },
      { label: "Risk Management",    path: "/category/risk" },
      { label: "Market News",        path: "/category/news" },
    ],
  },
  { label: "About",    path: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicsOpen, setTopicsOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const { user, isAdmin, logout }     = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setTopicsOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border"
            : "bg-background border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                KB<span className="text-accent">Forex</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV.map((item) =>
                item.children ? (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setTopicsOpen((v) => !v)}
                      onBlur={() => setTimeout(() => setTopicsOpen(false), 180)}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        topicsOpen
                          ? "text-foreground bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${topicsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {topicsOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-52 bg-card border border-border rounded-xl shadow-lg py-1.5 animate-fade-in">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles…"
                    className="w-52 h-9 px-3 text-sm bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Admin
                </Link>
              )}

              {user ? (
                <button
                  onClick={async () => { await logout(); router.push('/'); }}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/blog"
                className="btn-accent h-9 px-5 text-sm"
              >
                Subscribe
              </Link>
            </div>

            {/* Mobile: search + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="w-full h-10 px-4 text-sm bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-accent/50"
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              {NAV.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mt-2">
                      {item.label}
                    </p>
                    {item.children.map((sub) => (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 border-t border-border mt-3">
                {isAdmin && (
                  <Link href="/admin" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link href="/blog" className="block mt-2 w-full btn-accent text-sm text-center h-11">
                  Subscribe to newsletter
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="h-16 md:h-[68px]" />
    </>
  );
}