import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import MortgageCalculator from "@/components/MortgageCalculator";
import { properties, getPropertyBySlug } from "@/lib/mockData";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }) {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    return {
      title: "Property Not Found | EstateFlow",
      description: "The requested property could not be found.",
    };
  }

  return {
    title: `${property.title} | EstateFlow`,
    description: property.description,
  };
}

export default function PropertyDetailsPage({ params }) {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    return (
      <section className="mx-auto max-w-4xl rounded-2xl bg-surface-container-low p-8 text-center">
        <h1 className="font-display text-headline-sm text-on-surface">
          Property not found
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          The property you are looking for does not exist or may have been
          removed.
        </p>
        <Link href="/buy" className="btn-primary mt-6 inline-flex">
          Browse available properties
        </Link>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.35fr,1fr]">
          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-ambient">
            <img
              src={property.image}
              alt={property.title}
              className="h-72 w-full object-cover sm:h-96"
            />
            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-fixed px-3.5 py-1 text-label-sm font-semibold text-primary">
                  {property.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
                <span className="rounded-full bg-surface-container-low px-3.5 py-1 text-label-sm font-semibold text-on-surface">
                  {property.type}
                </span>
                {property.featured ? (
                  <span className="rounded-full bg-secondary-container px-3.5 py-1 text-label-sm font-semibold text-primary">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="font-display text-headline-sm text-on-surface sm:text-headline-lg">
                {property.title}
              </h1>
              <p className="text-body-sm text-on-surface-variant">{property.address}</p>

              <p className="font-display text-display-sm text-primary">
                {property.listingType === "rent"
                  ? `$${Number(property.price).toLocaleString("en-US")}/mo`
                  : `$${Number(property.price).toLocaleString("en-US")}`}
              </p>

              {/* Stats — tonal surface shift per "No-Line" rule */}
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-surface-container-low p-4 text-center">
                <div>
                  <p className="font-display text-title-md text-on-surface">
                    {property.beds}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">Beds</p>
                </div>
                <div>
                  <p className="font-display text-title-md text-on-surface">
                    {property.baths}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">Baths</p>
                </div>
                <div>
                  <p className="font-display text-title-md text-on-surface">
                    {property.areaSqFt}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">Sq Ft</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-title-md text-on-surface">
                  Description
                </h2>
                <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface">
                  Amenities
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-full bg-surface-container-low px-3 py-1 text-label-sm text-on-surface"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-label-sm text-outline">
                TODO: Replace this mock detail page data with API-driven property
                content from your backend.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <InquiryForm propertyId={property.id} />
          </div>
        </section>

        <section>
          <MortgageCalculator />
        </section>
      </div>
    </main>
  );
}
