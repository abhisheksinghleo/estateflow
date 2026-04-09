"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import FeaturedProperties from "@/components/FeaturedProperties";
import StatsSection from "@/components/StatsSection";
import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

const features = [
  {
    title: "Buy with Confidence",
    description:
      "Explore curated listings with transparent pricing and neighborhood insights. Every property is verified by our experts.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Rent Smarter",
    description:
      "Compare rental options by budget, commute, and amenities. Find the space that fits your lifestyle perfectly.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Connect with Experts",
    description:
      "Reach verified local agents and get guidance tailored to your goals. Professional support at every step.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const handleHomeSearch = (form) => {
    const params = new URLSearchParams();
    if (form.location) params.set("location", form.location);
    if (form.type && form.type !== "Any") params.set("type", form.type);
    if (form.maxPrice) params.set("maxPrice", form.maxPrice);
    const target = form.purpose === "rent" ? "/rent" : "/buy";
    router.push(`${target}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* ===== Hero + Search ===== */}
      <section>
        <HeroSection />
        <div className="px-6 lg:px-8">
          <SearchBar onSearch={handleHomeSearch} />
        </div>
      </section>

      {/* ===== Featured Properties ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <FadeIn direction="left">
              <div className="max-w-2xl">
                <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">
                  Exclusive Selection
                </span>
                <h2 className="mt-2 font-display text-display-md text-on-surface">
                  Featured Properties
                </h2>
                <p className="mt-4 text-body-lg text-on-surface-variant">
                  Handpicked premium listings curated for quality and distinction.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <Link
                href="/buy"
                className="btn-tertiary hidden lg:inline-flex"
              >
                View All Listings
              </Link>
            </FadeIn>
          </div>
          <FeaturedProperties hideTitle />
        </div>
      </section>

      {/* ===== Editorial Feature Section (2-col overlapping layout per design system) ===== */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              Why Choose Us
            </span>
            <h2 className="mt-3 font-display text-headline-lg text-on-surface sm:text-display-md">
              The Smarter Way to Find Your Next Home
            </h2>
          </FadeIn>

          {/* Editorial: 2-column with image overlap */}
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Image — overlaps the text column per "Intentional Asymmetry" */}
            <FadeIn direction="left">
              <div className="relative">
                <motion.div
                  className="overflow-hidden rounded-3xl shadow-ambient-lg"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                    alt="Beautiful exterior of a modern home"
                    className="h-[480px] w-full object-cover"
                  />
                </motion.div>
                {/* Floating accent card (Intentional Asymmetry) */}
                <motion.div
                  className="absolute -bottom-8 -right-6 rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-lg lg:-right-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <p className="font-display text-title-lg text-primary">12k+</p>
                  <p className="text-label-sm text-on-surface-variant">Properties Listed</p>
                </motion.div>
              </div>
            </FadeIn>

            {/* Feature Cards */}
            <FadeIn direction="right" delay={0.2}>
              <div className="space-y-6">
                {features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    className="group flex cursor-pointer gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg"
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            x: 6,
                            transition: { type: "spring", stiffness: 300, damping: 25 },
                          }
                    }
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-title-md text-on-surface group-hover:text-primary transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-body-sm text-on-surface-variant leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <StatsSection />

      {/* ===== CTA Section ===== */}
      <section className="bg-surface pb-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-3xl bg-surface-container-low p-12 text-center sm:p-20">
              <h2 className="font-display text-headline-lg text-on-surface sm:text-display-md">
                Ready to Find Your Dream&nbsp;Property?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-body-lg text-on-surface-variant">
                Start your tailored property search with our expert team
                and discover the home that truly fits your story.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/buy" className="btn-primary px-8 py-4 text-base">
                  Explore Properties
                </Link>
                <Link href="/contact" className="btn-secondary px-8 py-4 text-base">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
