'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, PlusCircle, Tag, BarChart3,
  Menu, X, TrendingUp, LogOut, ExternalLink, ChevronRight, Users
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/admin" },
  { icon: FileText,        label: "All Posts",   href: "/admin/posts" },
  { icon: PlusCircle,      label: "New Post",    href: "/admin/posts/new" },
  { icon: Tag,             label: "Categories",  href: "/admin/categories" },
  { icon: BarChart3,       label: "Subscribers", href: "/admin/newsletters" },
  { icon: Users,           label: "Team",        href: "/admin/users" },
];

function SidebarContent({ onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-foreground">KBForex</span>
            <span className="block text-[10px] text-muted-foreground leading-none mt-0.5">Admin Panel</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">Content</p>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const exact = href === "/admin";
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View live site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin, isLoadingAuth, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isLoadingAuth, router]);

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <X className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          You are signed in as <span className="font-semibold text-foreground">{user?.email}</span>, but this account does not have administrative privileges.
        </p>
        <div className="flex gap-4">
           <button onClick={() => logout()} className="btn-outline">Sign Out</button>
           <Link href="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }


  const currentLabel = NAV_ITEMS.find((n) => {
    const exact = n.href === "/admin";
    return exact ? pathname === n.href : pathname.startsWith(n.href);
  })?.label || "Admin";

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-card border-r border-border flex flex-col z-10 shadow-2xl">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-card flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-heading font-bold text-base">{currentLabel}</span>
          <Link href="/" target="_blank" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}