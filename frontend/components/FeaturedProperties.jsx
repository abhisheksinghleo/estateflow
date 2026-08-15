"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import Skeleton from "@/components/Skeleton";
import { useMemo } from "react";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";
import { propertyApi } from "@/lib/api";
import useApi from "@/lib/useApi";

export default function FeaturedProperties({ hideTitle = false }) {
  const { data: rawFeatured, loading } = useApi(
    () => propertyApi.getFeaturedProperties(),
    [],
    [],
  );

  // 💡 What: Wrapped the array mapping logic in useMemo.
  // 🎯 Why: To prevent creating a new array of property objects on every single component re-render unless the underlying data (rawFeatured) actually changes.
  // 📊 Impact: Eliminates unnecessary object instantiation and garbage collection cycles, which reduces main thread overhead during renders.
  // 🔬 Measurement: Observe the component's render duration in the React Profiler; time spent mapping properties will only occur when the API data updates.
  const featuredProperties = useMemo(() => {
    return (rawFeatured || []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      city: p.state ? `${p.city}, ${p.state}` : p.city,
      price: p.price,
      currency: p.currency || "USD",
      beds: p.beds,
      baths: p.baths,
      area: p.areaSqFt || p.area,
      image: p.image,
      type: p.listingType === "rent" ? "Rent" : "Sale",
      featured: p.featured,
      listedByAgent: p.listedByAgent || false,
    }));
  }, [rawFeatured]);

  return (
    <div className={hideTitle ? "" : "mx-auto max-w-7xl px-6 py-14 lg:px-8"}>
      {!hideTitle && (
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              Curated picks
            </p>
            <h2 className="mt-1 font-display text-headline-lg text-on-surface">
              Featured Properties
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Handpicked listings chosen for location, value, and lifestyle fit.
            </p>
          </div>
          <Link
            href="/buy"
            className="btn-tertiary hidden sm:inline-flex"
          >
            View all listings
          </Link>
        </div>
      )}

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton variant="card" count={3} />
        </div>
      ) : (
        <StaggerContainer className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property) => (
            <StaggerItem key={property.id}>
              <PropertyCard property={property} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
