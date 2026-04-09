"use client";

import { useState } from "react";

const propertyTypes = ["Any", "House", "Condo", "Apartment", "Townhouse", "Villa"];

export default function SearchBar({
  onSearch,
  className = "",
  defaultValues = {
    location: "",
    purpose: "buy",
    type: "Any",
    minPrice: "",
    maxPrice: "",
    beds: "",
  },
}) {
  const [form, setForm] = useState(defaultValues);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") {
      onSearch(form);
      return;
    }
    console.log("Search submitted:", form);
  };

  return (
    <div
      className={`relative z-20 -mt-10 mx-auto max-w-5xl rounded-2xl bg-surface-container-lowest p-2 shadow-ambient-lg sm:p-3 ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:flex-row lg:items-center">
        {/* Location */}
        <div className="flex-1 px-4 py-2">
          <label className="flex items-center gap-2 text-label-sm uppercase tracking-widest text-on-surface-variant">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location
          </label>
          <input
            type="text"
            placeholder="Where are you looking?"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full bg-transparent py-1 text-label-lg font-semibold text-on-surface placeholder-outline focus:outline-none"
          />
        </div>

        {/* Property Type */}
        <div className="flex-1 rounded-xl bg-surface-container-low px-4 py-2">
          <label className="flex items-center gap-2 text-label-sm uppercase tracking-widest text-on-surface-variant">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Property Type
          </label>
          <select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-transparent py-1 text-label-lg font-semibold text-on-surface focus:outline-none cursor-pointer"
            style={{ accentColor: "#845333" }}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex-1 px-4 py-2">
          <label className="flex items-center gap-2 text-label-sm uppercase tracking-widest text-on-surface-variant">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Max Price
          </label>
          <input
            type="number"
            placeholder="Any Price"
            value={form.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="w-full bg-transparent py-1 text-label-lg font-semibold text-on-surface placeholder-outline focus:outline-none"
          />
        </div>

        {/* Search Button */}
        <div className="p-1">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-terracotta px-8 text-label-lg font-semibold text-white transition-all duration-200 hover:shadow-glow active:scale-[0.98] lg:w-auto cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="lg:hidden">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
