"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";
import { featuredProperties as rawFeatured } from "@/lib/mockData";

// Map mockData shape → PropertyCard shape so slugs are always in sync
const featuredProperties = rawFeatured.map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  city: `${p.city}, ${p.state}`,
  price: p.price,
  beds: p.beds,
  baths: p.baths,
  area: p.areaSqFt,
  image: p.image,
  type: p.listingType === "rent" ? "Rent" : "Sale",
  featured: p.featured,
}));

export default function FeaturedProperties({ hideTitle = false }) {
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

      <StaggerContainer className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {featuredProperties.map((property) => (
          <StaggerItem key={property.id}>
            <PropertyCard property={property} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
