"use client";

import { motion } from "framer-motion";

/**
 * Animated skeleton placeholder that respects the design system.
 * Use `variant` to pick a pre-built shape, or pass custom className.
 */
export default function Skeleton({ className = "", variant = "block", count = 1 }) {
  const base =
    "animate-pulse rounded-2xl bg-surface-container-low";

  const variants = {
    block: "h-48 w-full",
    card: "h-72 w-full",
    text: "h-4 w-3/4",
    textShort: "h-4 w-1/2",
    circle: "h-14 w-14 rounded-full",
    stat: "h-28 w-full",
    hero: "h-64 w-full",
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <motion.div
          key={i}
          className={`${base} ${variants[variant] || ""} ${className}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

/**
 * Page-level loading shell with optional hero + grid skeleton.
 */
export function PageLoadingSkeleton({ showHero = true, columns = 3, rows = 2 }) {
  return (
    <div className="min-h-screen bg-surface">
      {showHero && (
        <div className="animate-pulse bg-on-surface/10 px-6 py-16">
          <div className="mx-auto max-w-7xl space-y-4">
            <div className="h-4 w-32 rounded bg-surface-container-low" />
            <div className="h-10 w-2/3 rounded-lg bg-surface-container-low" />
            <div className="h-5 w-1/2 rounded bg-surface-container-low" />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <div className={`grid gap-5 sm:grid-cols-2 ${columns >= 3 ? "xl:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""}`}>
          <Skeleton variant="card" count={columns * rows} />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard loading shell with stat cards + content blocks.
 */
export function DashboardLoadingSkeleton({ statCount = 4 }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
        <Skeleton variant="block" className="h-32" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton variant="stat" count={statCount} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton variant="card" className="h-80" />
          <Skeleton variant="card" className="h-80" />
        </div>
      </div>
    </div>
  );
}
