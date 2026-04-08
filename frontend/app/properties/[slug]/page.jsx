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
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Property not found
        </h1>
        <p className="mt-2 text-slate-600">
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
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.35fr,1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img
            src={property.image}
            alt={property.title}
            className="h-72 w-full object-cover sm:h-96"
          />
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {property.listingType === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {property.type}
              </span>
              {property.featured ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {property.title}
            </h1>
            <p className="text-sm text-slate-600">{property.address}</p>

            <p className="text-3xl font-extrabold text-blue-700">
              {property.listingType === "rent"
                ? `$${Number(property.price).toLocaleString()}/mo`
                : `$${Number(property.price).toLocaleString()}`}
            </p>

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {property.beds}
                </p>
                <p className="text-xs text-slate-500">Beds</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {property.baths}
                </p>
                <p className="text-xs text-slate-500">Baths</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {property.areaSqFt}
                </p>
                <p className="text-xs text-slate-500">Sq Ft</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Description
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {property.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Amenities
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-slate-500">
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
    </main>
  );
}
