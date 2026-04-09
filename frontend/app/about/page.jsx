"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

const values = [
  {
    title: "Trust & Transparency",
    description:
      "We prioritize verified listings, clear pricing, and honest communication so you can make confident decisions.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Customer-First Experience",
    description:
      "Whether you are buying, renting, or selling, we design every step to be simple, fast, and human-centered.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Local Expertise at Scale",
    description:
      "We combine market data with experienced local agents to help you find the right property in the right neighborhood.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

const highlights = [
  "Smart property discovery with practical filters",
  "Dedicated spaces for buyers, sellers, agents, and admins",
  "Fast inquiry flow to connect with professionals",
  "MVP-ready architecture with clear API integration points",
];

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-surface">
      {/* ===== Hero ===== */}
      <section className="relative w-full overflow-hidden bg-on-surface pt-28 pb-36">
        <motion.div
          className="absolute inset-0 z-0"
          initial={shouldReduceMotion ? {} : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop"
            alt="Real Estate Exterior"
            className="h-full w-full object-cover opacity-30"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/60 to-transparent z-[1]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10 mt-10">
          <FadeIn delay={0.2}>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-label-sm uppercase tracking-widest text-primary-container backdrop-blur-sm">
              About EstateFlow
            </span>
          </FadeIn>
          <FadeIn delay={0.4}>
            <h1 className="mt-8 font-display text-display-lg text-white leading-[1.08]">
              Finding The Home That Truly Fits Your&nbsp;Story
            </h1>
          </FadeIn>
          <FadeIn delay={0.6}>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg text-white/70 font-light">
              A modern real estate platform focused on helping people buy, rent, and manage properties with clarity and zero friction.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== Values (Stagger + Editorial hover) ===== */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-16 relative z-20 mb-24">
        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <motion.article
                className="group flex cursor-pointer flex-col items-start rounded-3xl bg-surface-container-lowest p-8 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg"
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : { y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }
                }
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                  {value.icon}
                </div>
                <h3 className="font-display text-title-lg text-on-surface group-hover:text-primary transition-colors duration-200">
                  {value.title}
                </h3>
                <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                  {value.description}
                </p>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ===== Mission: Editorial 2-Column with Overlap ===== */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          {/* Left: Sticky Text */}
          <div className="md:sticky md:top-32">
            <FadeIn direction="left">
              <h2 className="font-display text-display-md text-on-surface leading-tight">
                Building Trust Through Every Property&nbsp;Journey
              </h2>
              <p className="mt-6 text-body-lg leading-relaxed text-on-surface-variant">
                We help people make smarter real estate decisions by providing an intuitive platform, relevant property insights, and trusted expert support. From first-time buyers to seasoned investors, we aim to simplify every interaction.
              </p>
              <div className="mt-10">
                <Link href="/buy" className="btn-primary px-8 py-4 text-base">
                  Explore Listings
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right: Image + Highlights */}
          <div className="space-y-8">
            <FadeIn direction="right" delay={0.1}>
              <motion.div
                className="overflow-hidden rounded-3xl shadow-ambient-lg"
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1510627489930-0c1b0bfeb9b9?q=80&w=2070&auto=format&fit=crop"
                  alt="Home Exterior"
                  className="w-full h-[450px] object-cover"
                />
              </motion.div>
            </FadeIn>

            <FadeIn direction="right" delay={0.3}>
              {/* Tonal surface shift for card — no borders */}
              <div className="rounded-2xl bg-surface-container-low p-6">
                <h3 className="font-display text-title-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed text-primary">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  What this platform delivers
                </h3>
                <ul className="space-y-3">
                  {highlights.map((item, i) => (
                    <FadeIn key={item} direction="right" delay={0.4 + i * 0.1}>
                      <li className="flex items-start gap-3 text-body-md text-on-surface-variant">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    </FadeIn>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-3xl bg-surface-container-low p-12 text-center sm:p-20">
              <h2 className="font-display text-headline-lg text-on-surface sm:text-display-md text-balance">
                Ready to Find Your Dream&nbsp;Property?
              </h2>
              <p className="mt-4 text-body-lg text-on-surface-variant max-w-xl mx-auto">
                We are continuously improving search relevance, personalization, and operational workflows for all user roles.
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
