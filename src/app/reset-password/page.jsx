'use client';

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function ResetPassword() {
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const { updatePassword }        = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "The reset link may have expired. Please request a new one.");
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
          {success ? (
            <div className="text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-3">Password updated</h1>
              <p className="text-muted-foreground text-sm mb-8">
                Your password has been changed. You can now sign in with your new password.
              </p>
              <Link href="/login" className="btn-primary inline-flex items-center px-6">Go to sign in</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Choose a new password</h1>
                <p className="text-muted-foreground text-sm">
                  Pick a strong password that's at least 8 characters.
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
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                    New password
                    <span className="text-muted-foreground font-normal ml-1">(min. 8 characters)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      className="field-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-foreground mb-1.5">
                    Confirm new password
                  </label>
                  <input
                    id="confirm"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat new password"
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
                      Updating…
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
