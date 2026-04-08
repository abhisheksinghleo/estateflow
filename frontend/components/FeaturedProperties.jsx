import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

const featuredProperties = [
  {
    id: "fp-1",
    slug: "modern-family-home-austin",
    title: "Modern Family Home",
    city: "Austin, TX",
    price: 620000,
    beds: 4,
    baths: 3,
    area: 2450,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    type: "Sale",
    featured: true,
  },
  {
    id: "fp-2",
    slug: "downtown-luxury-apartment-nyc",
    title: "Downtown Luxury Apartment",
    city: "New York, NY",
    price: 4200,
    beds: 2,
    baths: 2,
    area: 1050,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    type: "Rent",
    featured: true,
  },
  {
    id: "fp-3",
    slug: "coastal-villa-miami",
    title: "Coastal Villa",
    city: "Miami, FL",
    price: 1450000,
    beds: 5,
    baths: 4,
    area: 3900,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    type: "Sale",
    featured: true,
  },
];

export default function FeaturedProperties({ hideTitle = false }) {
  return (
    <div className={hideTitle ? "" : "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"}>
      {!hideTitle && (
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Curated picks
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Featured Properties
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Handpicked listings chosen for location, value, and lifestyle fit.
            </p>
          </div>

          <Link
            href="/buy"
            className="hidden rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            View all listings
          </Link>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
