import PropertyDetailContent from "@/components/PropertyDetailContent";
import { properties as mockProperties } from "@/lib/mockData";

/**
 * Pre-generate static params for known mock properties.
 * API-only properties (e.g. Indian listings from backend seed)
 * are rendered on-demand via dynamic routing with `dynamicParams = true`.
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return mockProperties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }) {
  // Check local mock first; if not found, return a generic title
  // (the actual data is fetched client-side in PropertyDetailContent)
  const property = mockProperties.find((p) => p.slug === params.slug);

  if (!property) {
    return {
      title: "Property Details | EstateFlow",
      description: "View property details, make offers, and connect with sellers on EstateFlow.",
    };
  }

  return {
    title: `${property.title} | EstateFlow`,
    description: property.description,
  };
}

export default function PropertyDetailsPage({ params }) {
  return <PropertyDetailContent slug={params.slug} />;
}
