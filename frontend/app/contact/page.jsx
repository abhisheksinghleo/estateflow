"use client";

import { useState } from "react";
import FadeIn from "@/components/animations/FadeIn";
import Skeleton from "@/components/Skeleton";
import { contactApi } from "@/lib/api";
import useApi from "@/lib/useApi";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  topic: "General Inquiry",
  message: "",
  consent: false,
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch office locations from API
  const { data: officeLocations, loading: loadingOffices } = useApi(
    () => contactApi.getOfficeLocations(),
    [],
    [],
  );

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
    setSubmitting(true);

    try {
      const result = await contactApi.submitContact(formData);
      setStatus({
        type: "success",
        message: result.message || "Thanks! Your message has been sent. Our team will reach out soon.",
      });
      setFormData(initialFormState);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-on-surface px-6 py-16 text-white sm:px-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-on-surface/80 to-on-surface" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <FadeIn>
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary-container">
              Contact EstateFlow
            </span>
            <h1 className="mt-3 font-display text-display-md">
              Let&apos;s Talk Real Estate
            </h1>
            <p className="mt-4 max-w-2xl text-body-lg text-white/70 font-light">
              Have questions about buying, renting, selling, or partnering with an
              agent? Send us a message and our team will get back to you quickly.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FadeIn direction="left">
              <form onSubmit={handleSubmit} className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient space-y-4 sm:p-8">
                <h2 className="font-display text-title-lg text-on-surface">
                  Send us a message
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Fill out the form and we&apos;ll route your request to the right
                  team.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className="input-base"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                  <input
                    className="input-base"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className="input-base"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                  <select
                    className="input-base"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                  >
                    <option>General Inquiry</option>
                    <option>Buying Support</option>
                    <option>Rental Assistance</option>
                    <option>Seller Services</option>
                    <option>Agent Partnership</option>
                  </select>
                </div>

                <textarea
                  className="input-base min-h-36 resize-y"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need help with..."
                  required
                />

                <label className="flex items-start gap-3 text-body-sm text-on-surface-variant">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded accent-primary"
                    required
                  />
                  <span>I agree to be contacted regarding this request.</span>
                </label>

                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Submit Message"}
                </button>

                {status.message ? (
                  <p
                    className={
                      status.type === "success"
                        ? "text-body-sm text-emerald-700"
                        : "text-body-sm text-rose-700"
                    }
                  >
                    {status.message}
                  </p>
                ) : null}
              </form>
            </FadeIn>
          </div>

          <aside className="space-y-4">
            {loadingOffices ? (
              <Skeleton variant="block" count={2} className="h-36" />
            ) : (
              (officeLocations || []).map((office, i) => (
                <FadeIn key={office.city} direction="right" delay={i * 0.15}>
                  <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient">
                    <h3 className="font-display text-title-md text-on-surface">
                      {office.city} Office
                    </h3>
                    <p className="mt-2 text-body-sm text-on-surface-variant">{office.address}</p>
                    <p className="mt-2 text-body-sm text-on-surface">📞 {office.phone}</p>
                    <p className="text-body-sm text-on-surface">✉️ {office.email}</p>
                  </div>
                </FadeIn>
              ))
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
