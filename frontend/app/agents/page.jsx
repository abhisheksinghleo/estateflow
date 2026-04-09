"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import Skeleton from "@/components/Skeleton";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";
import { agentApi } from "@/lib/api";
import useApi from "@/lib/useApi";

export default function AgentsPage() {
  const shouldReduceMotion = useReducedMotion();
  const { data: agents, loading } = useApi(
    () => agentApi.getAgents(),
    [],
    [],
  );

  return (
    <section className="min-h-screen bg-surface">
      {/* Editorial Hero */}
      <header className="relative overflow-hidden bg-on-surface px-6 py-16 text-white sm:px-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-on-surface/80 to-on-surface" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <FadeIn>
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary-container">
              Meet the team
            </span>
            <h1 className="mt-3 font-display text-display-md">
              Real Estate Experts You Can Trust
            </h1>
            <p className="mt-4 max-w-3xl text-body-lg text-white/70 font-light">
              Browse our agent directory. Each profile includes
              role, experience, and quick contact details.
            </p>
          </FadeIn>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton variant="card" count={4} />
          </div>
        ) : (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {(agents || []).map((agent) => (
              <StaggerItem key={agent.id}>
                <motion.article
                  className="group overflow-hidden rounded-2xl bg-surface-container-lowest shadow-ambient transition-shadow duration-300 hover:shadow-ambient-lg"
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : { y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }
                  }
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={agent.image}
                      alt={agent.name}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <h2 className="font-display text-title-md text-on-surface group-hover:text-primary transition-colors duration-200">
                        {agent.name}
                      </h2>
                      <p className="text-body-sm text-on-surface-variant">{agent.title}</p>
                    </div>

                    {/* Stats — tonal surface shift instead of border */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-container-low p-3 text-center">
                      <div>
                        <p className="text-label-lg font-bold text-on-surface">
                          {agent.experienceYears || agent.experience} {agent.experienceYears ? "yrs" : ""}
                        </p>
                        <p className="text-label-sm text-on-surface-variant">Experience</p>
                      </div>
                      <div>
                        <p className="text-label-lg font-bold text-on-surface">{agent.rating}/5</p>
                        <p className="text-label-sm text-on-surface-variant">Rating</p>
                      </div>
                    </div>

                    <p className="text-body-sm text-on-surface">{agent.phone}</p>
                    <p className="text-body-sm text-on-surface">{agent.email}</p>

                    <Link href="/contact" className="btn-primary w-full text-sm">
                      Contact Agent
                    </Link>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
