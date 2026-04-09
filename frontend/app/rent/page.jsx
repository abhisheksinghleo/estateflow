"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import SearchBar from "@/components/SearchBar";
import FadeIn from "@/components/animations/FadeIn";
import { properties } from "@/lib/mockData";

const rentProperties = properties.filter(
  (property) => property.listingType === "rent",
);

export default function RentPage() {
  const [sort, setSort] = useState("newest");
  const [activeFilters, setActiveFilters] = useState(null);

  const handleApply = (filters) => {
    setActiveFilters(filters);
  };

  const handleReset = () => {
    setActiveFilters(null);
  };

  const sorted = [...rentProperties].sort((a, b) => {
    if (sort === "priceLowHigh") return a.price - b.price;
    if (sort === "priceHighLow") return b.price - a.price;
    if (sort === "beds") return b.beds - a.beds;
    return 0; // newest — already ordered
  });

  const filtered = activeFilters
    ? sorted.filter((p) => {
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
        return true;
      })
    : sorted;

  return (
    <section className="min-h-screen bg-surface">
      {/* Editorial Hero Header */}
      <header className="relative overflow-hidden bg-on-surface px-6 py-16 text-white sm:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-on-surface/80 to-on-surface" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <FadeIn>
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary-container">
              Rental Marketplace
            </span>
            <h1 className="mt-3 font-display text-display-md">
              Find Your Next Rental
            </h1>
            <p className="mt-4 max-w-2xl text-body-lg text-white/70 font-light">
              Explore verified rentals, compare amenities, and connect with agents
              in minutes.
            </p>
          </FadeIn>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-6 relative z-10">
        <SearchBar
          defaultValues={{
            purpose: "rent",
            location: "",
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
            <div className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-ambient sm:flex-row sm:items-center sm:justify-between">
              <p className="text-body-sm text-on-surface-variant">
                Showing{" "}
                <span className="font-semibold text-on-surface">
                  {filtered.length}
                </span>{" "}
                rental listing{filtered.length !== 1 ? "s" : ""}
              </p>
              <select
                className="input-base max-w-xs"
                value={sort}
                aria-label="Sort rentals"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="beds">Most Bedrooms</option>
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={{
                      id: property.id,
                      slug: property.slug,
                      title: property.title,
                      location: `${property.city}, ${property.state}`,
                      price: property.price,
                      beds: property.beds,
                      baths: property.baths,
                      area: property.areaSqFt,
                      image: property.image,
                      type: "For Rent",
                      featured: property.featured,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-surface-container-low p-10 text-center">
                <h2 className="font-display text-title-lg text-on-surface">
                  No rentals found
                </h2>
                <p className="mt-2 text-body-sm text-on-surface-variant">
                  Try adjusting your filters or search criteria.
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
