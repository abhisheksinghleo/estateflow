"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/api";

export default function PropertyCard({ property }) {
  const shouldReduceMotion = useReducedMotion();

  const {
    id,
    slug,
    title = "Modern Family Home",
    city = "California",
    price = 0,
    currency = "USD",
    beds = 0,
    baths = 0,
    area = 0,
    image = "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80",
    type = "Sale",
    featured = false,
    listedByAgent = false,
  } = property || {};

  const href = `/properties/${slug || id || "sample-property"}`;

  return (
    <motion.article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-ambient transition-shadow duration-300 hover:shadow-ambient-lg"
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }
      }
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.background = "linear-gradient(135deg, #d4c4b0 0%, #a89279 50%, #8b7355 100%)";
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c]/30 via-transparent to-transparent" />

        {/* Badges — using secondary-container per design system */}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-surface-container-lowest/90 px-3.5 py-1 text-label-sm font-semibold uppercase tracking-wider text-on-surface backdrop-blur-sm">
            {type}
          </span>
          {featured && (
            <span className="rounded-full bg-secondary-container px-3.5 py-1 text-label-sm font-semibold uppercase tracking-wider text-primary">
              Featured
            </span>
          )}
          {listedByAgent && (
            <span className="rounded-full bg-violet-200/90 px-3.5 py-1 text-label-sm font-semibold uppercase tracking-wider text-violet-800 backdrop-blur-sm">
              Agent
            </span>
          )}
        </div>

        {/* Save */}
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/40 text-on-surface-variant backdrop-blur-sm transition-all duration-200 hover:bg-surface-container-lowest hover:text-primary"
          aria-label={`Save ${title}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content — generous xl (1.5rem) internal padding per design system */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="font-display text-title-md font-bold text-on-surface">
            {formatPrice(Number(price), currency)}
            {type.toLowerCase() === "rent" && (
              <span className="text-body-sm font-normal text-on-surface-variant">/mo</span>
            )}
          </p>
          <h3 className="mt-1 line-clamp-1 text-body-md font-semibold text-on-surface transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {city}
          </p>
        </div>

        {/* Stats — using tonal bg shift instead of border per "No-Line" rule */}
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-surface-container-low px-4 py-3">
          {[
            { label: `${beds} Beds` },
            { label: `${baths} Baths` },
            { label: `${area} ft²` },
          ].map((stat) => (
            <span key={stat.label} className="text-label-sm text-on-surface-variant">
              {stat.label}
            </span>
          ))}
        </div>

        {/* CTA — secondary button per design system */}
        <Link
          href={href}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-highest py-3 text-label-lg font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-on-primary"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
