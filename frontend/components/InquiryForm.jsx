"use client";

import { useState } from "react";

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
  agreeToContact: false,
};

export default function InquiryForm({ propertyId = "", onSubmitted }) {
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

    // TODO: Replace mock submit with real API integration.
    // Suggested integration:
    // 1) POST to /inquiries with { ...formData, propertyId }
    // 2) Handle validation and backend errors
    // 3) Track conversion event on success
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus({
      type: "success",
      message: "Your inquiry has been sent. An agent will contact you shortly.",
    });

    onSubmitted?.({ ...formData, propertyId });
    setFormData(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Send an Inquiry
        </h3>
        {propertyId ? (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Property #{propertyId}
          </span>
        ) : null}
      </div>

      <input
        className="input-base"
        type="text"
        name="fullName"
        value={formData.fullName}
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
      <input
        className="input-base"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone number"
        required
      />
      <textarea
        className="input-base min-h-28 resize-y"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="I’m interested in this property. Please share more details."
        required
      />

      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          name="agreeToContact"
          checked={formData.agreeToContact}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          required
        />
        <span>
          I agree to be contacted regarding this inquiry and accept the privacy
          policy.
        </span>
      </label>

      <button type="submit" className="btn-primary w-full">
        Submit Inquiry
      </button>

      {status.message ? (
        <p
          className={`text-sm ${status.type === "success" ? "text-emerald-700" : "text-rose-700"}`}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
