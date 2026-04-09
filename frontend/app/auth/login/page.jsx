"use client";

import Link from "next/link";
import { useState } from "react";
import FadeIn from "@/components/animations/FadeIn";

const initialForm = {
  email: "",
  password: "",
  remember: false,
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

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
      // TODO: Replace with real auth API integration
      // Example:
      // const { token, user } = await authApi.login({ email: form.email, password: form.password });
      // localStorage.setItem("authToken", token);
      // router.push(`/dashboard/${user.role}`);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setStatus({
        type: "success",
        message: "Logged in successfully (mock). Redirect logic pending API integration.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Unable to log in right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6">
      <FadeIn className="w-full">
        <div className="w-full rounded-2xl bg-surface-container-lowest p-6 shadow-ambient sm:p-8">
          <div className="mb-6">
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              Welcome back
            </span>
            <h1 className="mt-2 font-display text-headline-sm text-on-surface">Log in to EstateFlow</h1>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Access saved properties, inquiries, and your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-label-sm font-medium text-on-surface">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-base"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-label-sm font-medium text-on-surface">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-base"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant">
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
                className="text-label-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>

            {status.message ? (
              <p
                className={`text-body-sm ${
                  status.type === "success" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {status.message}
              </p>
            ) : null}
          </form>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200">
              Create one
            </Link>
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
