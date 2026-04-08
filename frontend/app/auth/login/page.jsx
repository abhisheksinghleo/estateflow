"use client";

import Link from "next/link";
import { useState } from "react";

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
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
      <div className="card w-full p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Log in to EstateFlow</h1>
          <p className="mt-2 text-sm text-slate-600">
            Access saved properties, inquiries, and your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
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
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
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
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          {status.message ? (
            <p
              className={`text-sm ${
                status.type === "success" ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
