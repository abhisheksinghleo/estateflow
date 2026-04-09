"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, getDashboardPath, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* Auto-redirect if already logged in */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(getDashboardPath());
    }
  }, [authLoading, isAuthenticated, router, getDashboardPath]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const userData = await login(form.email, form.password);

      setStatus({
        type: "success",
        message: "Welcome back! Redirecting...",
      });

      const role = userData?.role?.toLowerCase() || "buyer";
      const roleMap = {
        buyer: "/dashboard/buyer",
        seller: "/dashboard/seller",
        agent: "/dashboard/agent",
        admin: "/dashboard/admin",
        admin_head: "/dashboard/admin",
        admin_co: "/dashboard/admin",
        admin_co_head: "/dashboard/admin",
      };

      setTimeout(() => {
        router.push(roleMap[role] || "/dashboard/buyer");
      }, 600);
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Don't render form if already authenticated */
  if (!authLoading && isAuthenticated) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-body-md text-on-surface-variant">Redirecting to your dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Card */}
        <div className="rounded-3xl bg-surface-container-lowest/80 p-8 shadow-ambient-lg backdrop-blur-xl sm:p-10">
          {/* Logo / Brand Mark */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="font-display text-headline-md text-on-surface">
              Welcome back
            </h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Sign in to your EstateFlow account
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input-base !pl-11"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label htmlFor="password" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input-base !pl-11 !pr-12"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-on-surface-variant transition-colors hover:text-on-surface"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="inline-flex cursor-pointer items-center gap-2 text-body-sm text-on-surface-variant">
                <input
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded accent-primary"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-label-sm font-semibold text-primary transition-colors duration-200 hover:text-primary/70"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary relative w-full overflow-hidden py-3 text-base font-semibold shadow-lg shadow-primary/20 disabled:opacity-60"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>

            {/* Status Message */}
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl px-4 py-3 text-body-sm font-medium ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-900/20"
                }`}
              >
                {status.type === "success" ? "✓ " : "✕ "}
                {status.message}
              </motion.div>
            )}
          </motion.form>

          {/* Register CTA */}
          <p className="mt-8 text-center text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-primary transition-colors duration-200 hover:text-primary/70"
            >
              Create one free →
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-4 text-label-sm text-outline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            SSL Secured
          </span>
          <span>•</span>
          <span>256-bit encryption</span>
          <span>•</span>
          <span>SOC 2 Compliant</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
