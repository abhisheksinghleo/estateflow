"use client";

import Link from "next/link";
import { useState } from "react";

const roles = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "agent", label: "Agent" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    agreeToTerms: false,
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

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

    if (formData.password.length < 8) {
      setStatus({
        type: "error",
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      setStatus({
        type: "error",
        message: "You must agree to the terms and privacy policy.",
      });
      return;
    }

    // TODO: Replace with API integration:
    // await authApi.register({ ...formData })
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus({
      type: "success",
      message: "Registration successful. You can now log in.",
    });

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "buyer",
      agreeToTerms: false,
    });
  };

  return (
    <section className="mx-auto max-w-lg py-8">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Join EstateFlow to save properties, track inquiries, and manage your
          real estate journey.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="input-base"
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            className="input-base"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-base"
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select
            className="input-base"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                I am a {role.label}
              </option>
            ))}
          </select>
          <input
            className="input-base"
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="input-base"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <button type="submit" className="btn-primary w-full">
            Create Account
          </button>

          {status.message ? (
            <p
              className={`text-sm ${status.type === "success" ? "text-emerald-700" : "text-rose-700"}`}
            >
              {status.message}
            </p>
          ) : null}
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
