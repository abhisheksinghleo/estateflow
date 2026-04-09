"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const textVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const lineUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring", bounce: 0.1, duration: 0.9 },
  },
};

const lineReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const v = shouldReduceMotion ? lineReduced : lineUp;

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-surface-container-low">
      {/* Ken Burns Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={shouldReduceMotion ? {} : { scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&w=1920&q=80"
          alt="Modern luxury home at golden hour"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Warm overlay — not grey, but a tinted wash */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#1b1c1c]/80 via-[#1b1c1c]/30 to-[#1b1c1c]/10" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#1b1c1c]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[92vh] flex-col items-start justify-end px-6 pb-20 sm:px-10 lg:px-16">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={v}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-label-sm uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
              Curated Homes & Living
            </span>
          </motion.div>

          <motion.h1
            variants={v}
            className="mt-8 font-display text-display-lg text-white leading-[1.05] sm:text-[4.5rem]"
          >
            Find the Home
          </motion.h1>
          <motion.h1
            variants={v}
            className="font-display text-display-lg leading-[1.05] text-primary-container sm:text-[4.5rem]"
          >
            That Tells Your Story
          </motion.h1>

          <motion.p
            variants={v}
            className="mt-8 max-w-xl text-body-lg font-light leading-relaxed text-white/70"
          >
            Every property has a narrative. We curate the most distinguished homes
            in premier locations for discerning buyers and renters.
          </motion.p>

          <motion.div variants={v} className="mt-10 flex flex-wrap gap-4">
            <Link href="/buy" className="btn-primary px-8 py-4 text-base">
              Explore Listings
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 cursor-pointer"
            >
              Contact Agent
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Strip (tonal, no borders per design system) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-14 flex gap-12 sm:gap-16"
        >
          {[
            { value: "1,200+", label: "Curated Listings" },
            { value: "450+", label: "Happy Families" },
            { value: "24/7", label: "Expert Support" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="text-label-sm uppercase tracking-widest text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
