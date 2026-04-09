"use client";

import CountUp from "./animations/CountUp";
import FadeIn from "./animations/FadeIn";
import { StaggerContainer, StaggerItem } from "./animations/StaggerReveal";

const stats = [
  { label: "Active Listings", value: 12480, suffix: "+" },
  { label: "Cities Covered", value: 85, suffix: "+" },
  { label: "Verified Agents", value: 1250, suffix: "+" },
  { label: "Avg. Response Time", value: 2, prefix: "< ", suffix: " hrs" },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn direction="up">
          {/* Tonal surface shift instead of border per "No-Line" rule */}
          <div className="rounded-3xl bg-surface-container-low p-10 sm:p-14">
            <h2 className="text-center font-display text-headline-lg text-on-surface">
              Trusted by Buyers, Renters, and Sellers
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-body-md text-on-surface-variant">
              A quick snapshot of our marketplace performance.
            </p>

            <StaggerContainer className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((item) => (
                <StaggerItem key={item.label}>
                  {/* Card uses surface hierarchy: surface-container-lowest on top of surface-container-low */}
                  <div className="group cursor-pointer rounded-2xl bg-surface-container-lowest p-6 text-center shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-1">
                    <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                      <CountUp
                        target={item.value}
                        suffix={item.suffix || ""}
                        prefix={item.prefix || ""}
                        duration={2200}
                      />
                    </p>
                    <p className="mt-2 text-label-sm uppercase tracking-widest text-on-surface-variant">
                      {item.label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
