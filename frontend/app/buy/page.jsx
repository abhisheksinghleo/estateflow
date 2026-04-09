"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import SearchBar from "@/components/SearchBar";
import FadeIn from "@/components/animations/FadeIn";
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
    <section className="min-h-screen bg-surface">
      {/* Editorial Hero Header */}
      <header className="relative overflow-hidden bg-on-surface px-6 py-16 text-white sm:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-on-surface/80 to-on-surface" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <FadeIn>
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary-container">
              Buying Marketplace
            </span>
            <h1 className="mt-3 font-display text-display-md">
              Find Your Next Home to Buy
            </h1>
            <p className="mt-4 max-w-2xl text-body-lg text-white/70 font-light">
              Explore verified listings, compare neighborhoods, and shortlist
              properties that match your goals and budget.
            </p>
          </FadeIn>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-6 relative z-10">
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
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <PropertyFilters onApply={handleApply} onReset={handleReset} />
          </div>

          <div className="space-y-4 lg:col-span-8 xl:col-span-9">
            {/* Toolbar — tonal surface shift, no border */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-ambient">
              <p className="text-body-sm text-on-surface-variant">
                Showing{" "}
                <span className="font-semibold text-on-surface">
                  {sorted.length}
                </span>{" "}
                buy listing{sorted.length !== 1 ? "s" : ""}
                {activeFilters && (
                  <button
                    onClick={handleReset}
                    className="ml-3 text-label-sm font-medium text-primary hover:text-primary/80 underline transition-colors duration-200"
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
              <div className="rounded-2xl bg-surface-container-low p-10 text-center">
                <h2 className="font-display text-title-lg text-on-surface">
                  No properties found
                </h2>
                <p className="mt-2 text-body-sm text-on-surface-variant">
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
      </div>
    </section>
  );
}
