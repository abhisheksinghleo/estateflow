import PropertyDetailContent from "@/components/PropertyDetailContent";
import { propertyApi } from "@/lib/api";

/**
 * All property slugs are now sourced from Supabase.
 * dynamicParams = true allows on-demand rendering for any slug.
 */
export const dynamicParams = true;
export const revalidate = 3600; // Re-fetch static params every 1 hour

export async function generateStaticParams() {
  try {
    const properties = await propertyApi.getProperties({});
    return (properties || []).map((p) => ({ slug: p.slug || p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const property = await propertyApi.getPropertyBySlug(params.slug);
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
  } catch {
    return {
      title: "Property Details | EstateFlow",
      description: "View property details on EstateFlow.",
    };
  }
}

export default function PropertyDetailsPage({ params }) {
  return <PropertyDetailContent slug={params.slug} />;
}
