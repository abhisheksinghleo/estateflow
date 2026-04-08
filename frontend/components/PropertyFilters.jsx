"use client";

import { useState } from "react";

const propertyTypes = ["Any", "Apartment", "Villa", "Townhouse", "Plot", "Studio"];
const listingTypes = ["Any", "Buy", "Rent"];
const bedrooms = ["Any", "1+", "2+", "3+", "4+"];
const bathrooms = ["Any", "1+", "2+", "3+"];

const defaultFilters = {
  listingType: "Any",
  propertyType: "Any",
  minPrice: "",
  maxPrice: "",
  bedrooms: "Any",
  bathrooms: "Any",
  minArea: "",
  maxArea: "",
  location: "",
  furnished: false,
  petFriendly: false,
};

export default function PropertyFilters({ onApply, onReset, className = "" }) {
  const [filters, setFilters] = useState(defaultFilters);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    // TODO: Wire this to API query params once backend filtering endpoints are ready.
    if (onApply) onApply(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    // TODO: Sync reset state with URL search params if/when routing-based filters are added.
    if (onReset) onReset(defaultFilters);
  };

  return (
    <aside
      className={`card w-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}
      aria-label="Property filters"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Reset all
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <label htmlFor="listingType" className="mb-1 block text-sm font-medium text-slate-700">
            Listing type
          </label>
          <select
            id="listingType"
            value={filters.listingType}
            onChange={(e) => handleChange("listingType", e.target.value)}
            className="input-base"
          >
            {listingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="propertyType" className="mb-1 block text-sm font-medium text-slate-700">
            Property type
          </label>
          <select
            id="propertyType"
            value={filters.propertyType}
            onChange={(e) => handleChange("propertyType", e.target.value)}
            className="input-base"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="minPrice" className="mb-1 block text-sm font-medium text-slate-700">
              Min price
            </label>
            <input
              id="minPrice"
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="mb-1 block text-sm font-medium text-slate-700">
              Max price
            </label>
            <input
              id="maxPrice"
              type="number"
              min="0"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              className="input-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="bedrooms" className="mb-1 block text-sm font-medium text-slate-700">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              value={filters.bedrooms}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
              className="input-base"
            >
              {bedrooms.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bathrooms" className="mb-1 block text-sm font-medium text-slate-700">
              Bathrooms
            </label>
            <select
              id="bathrooms"
              value={filters.bathrooms}
              onChange={(e) => handleChange("bathrooms", e.target.value)}
              className="input-base"
            >
              {bathrooms.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="minArea" className="mb-1 block text-sm font-medium text-slate-700">
              Min area (sqft)
            </label>
            <input
              id="minArea"
              type="number"
              min="0"
              placeholder="0"
              value={filters.minArea}
              onChange={(e) => handleChange("minArea", e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="maxArea" className="mb-1 block text-sm font-medium text-slate-700">
              Max area (sqft)
            </label>
            <input
              id="maxArea"
              type="number"
              min="0"
              placeholder="Any"
              value={filters.maxArea}
              onChange={(e) => handleChange("maxArea", e.target.value)}
              className="input-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="City, area, or ZIP"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="input-base"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 p-3">
          <label className="flex cursor-pointer items-center justify-between text-sm text-slate-700">
            <span>Furnished</span>
            <input
              type="checkbox"
              checked={filters.furnished}
              onChange={(e) => handleChange("furnished", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between text-sm text-slate-700">
            <span>Pet friendly</span>
            <input
              type="checkbox"
              checked={filters.petFriendly}
              onChange={(e) => handleChange("petFriendly", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <button type="submit" className="btn-primary w-full">
          Apply filters
        </button>
      </form>
    </aside>
  );
}
