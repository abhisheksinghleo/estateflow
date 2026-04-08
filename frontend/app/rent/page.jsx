"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import SearchBar from "@/components/SearchBar";
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
    <section className="space-y-8">
      <header className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-10 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
          Rental Marketplace
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Find Your Next Rental
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
          Explore verified rentals, compare amenities, and connect with agents
          in minutes.
        </p>
      </header>

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

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 xl:col-span-3">
          <PropertyFilters onApply={handleApply} onReset={handleReset} />
        </div>

        <div className="space-y-4 lg:col-span-8 xl:col-span-9">
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
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
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                No rentals found
              </h2>
              <p className="mt-2 text-sm text-slate-600">
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
    </section>
  );
}
