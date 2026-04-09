"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

const roles = [
  { value: "buyer", label: "Buyer", desc: "Search and save properties" },
  { value: "seller", label: "Seller", desc: "List and manage properties" },
  { value: "agent", label: "Agent", desc: "Connect buyers with sellers" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login: authLogin, isAuthenticated, getDashboardPath, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    agreeToTerms: false,
  });

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    if (formData.password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters long." });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setStatus({ type: "error", message: "You must agree to the terms and privacy policy." });
      setLoading(false);
      return;
    }

    try {
      // Register via API
      const { token, user } = await authApi.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      // Store token and login via context
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
      }

      setStatus({
        type: "success",
        message: "Account created! Redirecting to your dashboard...",
      });

      const role = user?.role || formData.role;
      const roleMap = {
        buyer: "/dashboard/buyer",
        seller: "/dashboard/seller",
        agent: "/dashboard/agent",
      };

      setTimeout(() => {
        // Force a page reload to pick up auth state
        window.location.href = roleMap[role] || "/dashboard/buyer";
      }, 800);
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-3xl bg-surface-container-lowest/80 p-8 shadow-ambient-lg backdrop-blur-xl sm:p-10">
          {/* Header */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h1 className="font-display text-headline-md text-on-surface">
              Create your account
            </h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Join EstateFlow to save properties, track inquiries, and manage your real estate journey.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Full name
              </label>
              <input
                id="fullName"
                className="input-base"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Email address
              </label>
              <input
                id="reg-email"
                className="input-base"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Phone number
              </label>
              <input
                id="phone"
                className="input-base"
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="mb-2 block text-label-sm font-semibold text-on-surface">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: role.value }))}
                    className={`rounded-xl px-3 py-3 text-center transition-all duration-200 ${
                      formData.role === role.value
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-primary-fixed hover:text-primary"
                    }`}
                  >
                    <span className="block text-label-md font-semibold">{role.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${
                      formData.role === role.value ? "text-white/70" : "text-outline"
                    }`}>
                      {role.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  className="input-base !pr-12"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-on-surface-variant transition-colors hover:text-on-surface"
                  tabIndex={-1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                className="input-base"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-body-sm text-on-surface-variant cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded accent-primary"
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base font-semibold shadow-lg shadow-primary/20 disabled:opacity-60"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* Status */}
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl px-4 py-3 text-body-sm font-medium ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {status.type === "success" ? "✓ " : "✕ "}
                {status.message}
              </motion.div>
            )}
          </motion.form>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
