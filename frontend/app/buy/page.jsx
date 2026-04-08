"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import SearchBar from "@/components/SearchBar";
import { getPropertiesByListingType } from "@/lib/mockData";

const allBuyProperties = getPropertiesByListingType("buy");

export default function BuyPage() {
  const [sort, setSort] = useState("recommended");
  const [activeFilters, setActiveFilters] = useState(null);

  const handleApply = (filters) => {
    setActiveFilters(filters);
  };

  const handleReset = () => {
    setActiveFilters(null);
  };

  const filtered = activeFilters
    ? allBuyProperties.filter((p) => {
        if (
          activeFilters.location &&
          !`${p.city} ${p.state}`
            .toLowerCase()
            .includes(activeFilters.location.toLowerCase())
        )
          return false;
        if (activeFilters.minPrice && p.price < Number(activeFilters.minPrice))
          return false;
        if (activeFilters.maxPrice && p.price > Number(activeFilters.maxPrice))
          return false;
        if (
          activeFilters.bedrooms &&
          activeFilters.bedrooms !== "Any" &&
          p.beds < parseInt(activeFilters.bedrooms)
        )
          return false;
        if (
          activeFilters.bathrooms &&
          activeFilters.bathrooms !== "Any" &&
          p.baths < parseInt(activeFilters.bathrooms)
        )
          return false;
        if (activeFilters.minArea && p.areaSqFt < Number(activeFilters.minArea))
          return false;
        if (activeFilters.maxArea && p.areaSqFt > Number(activeFilters.maxArea))
          return false;
        return true;
      })
    : allBuyProperties;

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low-high") return a.price - b.price;
    if (sort === "price-high-low") return b.price - a.price;
    if (sort === "newest") return b.id.localeCompare(a.id);
    // recommended — featured first
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-10 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
          Buying Marketplace
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Find Your Next Home to Buy
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
          Explore verified listings, compare neighborhoods, and shortlist
          properties that match your goals and budget.
        </p>
      </header>

      <SearchBar
        defaultValues={{
          location: "",
          purpose: "buy",
          type: "Any",
          minPrice: "",
          maxPrice: "",
          beds: "",
        }}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 xl:col-span-3">
          <PropertyFilters onApply={handleApply} onReset={handleReset} />
        </div>

        <div className="space-y-4 lg:col-span-8 xl:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {sorted.length}
              </span>{" "}
              buy listing{sorted.length !== 1 ? "s" : ""}
              {activeFilters && (
                <button
                  onClick={handleReset}
                  className="ml-3 text-xs font-medium text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters
                </button>
              )}
            </p>
            <select
              className="input-base max-w-[220px]"
              value={sort}
              aria-label="Sort listings"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {sorted.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sorted.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    ...property,
                    location: `${property.city}, ${property.state}`,
                    area: property.areaSqFt,
                    type: "For Sale",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                No properties found
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Try adjusting filters or search criteria to see more listings.
              </p>
              <button
                onClick={handleReset}
                className="btn-primary mt-4 text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
