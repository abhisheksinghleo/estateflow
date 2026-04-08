"use client";

import { useState } from "react";

const officeLocations = [
  {
    city: "Austin",
    address: "124 Greenwood Ave, Austin, TX 78704",
    phone: "+1 (555) 120-4488",
    email: "austin@estateflow.com",
  },
  {
    city: "New York",
    address: "88 Riverfront St, New York, NY 10019",
    phone: "+1 (555) 889-3021",
    email: "nyc@estateflow.com",
  },
];

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

    // TODO: Integrate backend API endpoint, e.g. POST /contact
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus({
      type: "success",
      message:
        "Thanks! Your message has been sent. Our team will reach out soon.",
    });

    setFormData(initialFormState);
  };

  return (
    <main className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-12 text-white shadow-lg sm:px-10">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-100">
          Contact EstateFlow
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Let&apos;s Talk Real Estate
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
          Have questions about buying, renting, selling, or partnering with an
          agent? Send us a message and our team will get back to you quickly.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Send us a message
            </h2>
            <p className="text-sm text-slate-600">
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

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>I agree to be contacted regarding this request.</span>
            </label>

            <button type="submit" className="btn-primary w-full sm:w-auto">
              Submit Message
            </button>

            {status.message ? (
              <p
                className={
                  status.type === "success"
                    ? "text-sm text-emerald-700"
                    : "text-sm text-rose-700"
                }
              >
                {status.message}
              </p>
            ) : null}
          </form>
        </div>

        <aside className="space-y-4">
          {officeLocations.map((office) => (
            <div key={office.city} className="card p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                {office.city} Office
              </h3>
              <p className="mt-2 text-sm text-slate-600">{office.address}</p>
              <p className="mt-2 text-sm text-slate-700">📞 {office.phone}</p>
              <p className="text-sm text-slate-700">✉️ {office.email}</p>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
