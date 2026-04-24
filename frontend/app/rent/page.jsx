"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import SearchBar from "@/components/SearchBar";
import Skeleton from "@/components/Skeleton";
import FadeIn from "@/components/animations/FadeIn";
import { propertyApi } from "@/lib/api";
import useApi from "@/lib/useApi";

/* ── helper: apply any combination of filters to the property list ── */
function applyFilters(list, filters) {
  if (!filters) return list;

  const locFilter = filters.location ? filters.location.toLowerCase() : null;
  const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
  const minBeds = filters.bedrooms && filters.bedrooms !== "Any" ? parseInt(filters.bedrooms) : null;
  const minBaths = filters.bathrooms && filters.bathrooms !== "Any" ? parseInt(filters.bathrooms) : null;
  const minArea = filters.minArea ? Number(filters.minArea) : null;
  const maxArea = filters.maxArea ? Number(filters.maxArea) : null;
  const filterPropType = filters.propertyType && filters.propertyType !== "Any" ? filters.propertyType : null;
  const filterType = filters.type && filters.type !== "Any" ? filters.type : null;

  return list.filter((p) => {
    if (
      locFilter &&
      !`${p.city} ${p.state} ${p.address}`
        .toLowerCase()
        .includes(locFilter)
    )
      return false;

    if (filterPropType && p.type !== filterPropType) return false;

    if (filterType && p.type !== filterType) return false;

    if (minPrice !== null && p.price < minPrice) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;

    if (minBeds !== null && p.beds < minBeds) return false;

    if (minBaths !== null && p.baths < minBaths) return false;

    if (minArea !== null && p.areaSqFt < minArea) return false;
    if (maxArea !== null && p.areaSqFt > maxArea) return false;

    return true;
  });
}

function RentPageContent() {
  const [sort, setSort] = useState("newest");
  const [activeFilters, setActiveFilters] = useState(null);
  const searchParams = useSearchParams();

  // Fetch all rental properties from API
  const { data: rentProperties, loading } = useApi(
    () => propertyApi.getPropertiesByType("rent"),
    [],
    [],
  );

  /* Read URL query params on mount (from homepage search) */
  useEffect(() => {
    const loc = searchParams.get("location");
    const type = searchParams.get("type");
    const maxPrice = searchParams.get("maxPrice");
    if (loc || type || maxPrice) {
      setActiveFilters({
        location: loc || "",
        type: type || "Any",
        maxPrice: maxPrice || "",
      });
    }
  }, [searchParams]);

  /* SearchBar submit → filters listing */
  const handleSearch = (searchForm) => {
    setActiveFilters({
      location: searchForm.location,
      type: searchForm.type,
      maxPrice: searchForm.maxPrice,
    });
  };

  /* Sidebar filter apply */
  const handleApply = (filters) => {
    setActiveFilters(filters);
  };

  /* Reset */
  const handleReset = () => {
    setActiveFilters(null);
  };

  const filtered = useMemo(() => {
    return applyFilters(rentProperties || [], activeFilters);
  }, [rentProperties, activeFilters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "priceLowHigh") return a.price - b.price;
      if (sort === "priceHighLow") return b.price - a.price;
      if (sort === "beds") return b.beds - a.beds;
      return 0; // newest — already ordered
    });
  }, [filtered, sort]);

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
          onSearch={handleSearch}
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
                {loading ? (
                  <span className="text-outline">Loading rentals…</span>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-on-surface">
                      {sorted.length}
                    </span>{" "}
                    rental listing{sorted.length !== 1 ? "s" : ""}
                    {activeFilters && (
                      <button
                        onClick={handleReset}
                        className="ml-3 text-label-sm font-medium text-primary hover:text-primary/80 underline transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </>
                )}
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

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton variant="card" count={4} />
              </div>
            ) : sorted.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {sorted.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={{
                      id: property.id,
                      slug: property.slug,
                      title: property.title,
                      city: `${property.city}, ${property.state}`,
                      price: property.price,
                      currency: property.currency || "USD",
                      beds: property.beds,
                      baths: property.baths,
                      area: property.areaSqFt,
                      image: property.image,
                      type: "Rent",
                      featured: property.featured,
                      listedByAgent: property.listedByAgent || false,
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

export default function RentPage() {
  return (
    <Suspense>
      <RentPageContent />
    </Suspense>
  );
}
