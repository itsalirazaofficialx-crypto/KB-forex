'use client';

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);
  const { resetPassword }     = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
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
          {sent ? (
            <div className="text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-3">Check your inbox</h1>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>, you'll receive a password reset link within a few minutes.
              </p>
              <Link href="/login" className="btn-primary inline-flex items-center px-6">Back to sign in</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Reset your password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter the email address on your account and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 mb-6 animate-shake">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary h-11 text-base inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending link…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
