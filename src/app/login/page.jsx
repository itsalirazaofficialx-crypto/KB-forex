'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { login }               = useAuth();
  const router                  = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please enter your credentials."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      router.push("/admin");
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <div className="px-6 py-5 border-b border-border">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-foreground">
            KB<span className="text-accent">Forex</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Admin Sign In</h1>
            <p className="text-muted-foreground text-sm">
              Secured access for authorized personnel only.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" name="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/forgot-password" name="forgot-link" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="field-input"
              />
            </div>

            <button
              type="submit"
              name="submit-button"
              disabled={loading}
              className="w-full btn-primary h-11 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
             <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
               ← Return to homepage
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
