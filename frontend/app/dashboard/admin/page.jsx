"use client";

import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

const topMetrics = [
  { label: "Total Listings", value: "12,480", delta: "+6.2% MoM" },
  { label: "Active Users", value: "48,320", delta: "+3.9% MoM" },
  { label: "Open Inquiries", value: "1,274", delta: "-2.1% MoM" },
  { label: "Monthly Revenue", value: "$184,900", delta: "+8.5% MoM" },
];

const complianceAlerts = [
  {
    title: "Listing moderation backlog",
    detail:
      "42 listings pending manual review for image and description compliance.",
    severity: "medium",
  },
  {
    title: "Agent verification queue",
    detail: "11 new agent profiles require KYC approval.",
    severity: "high",
  },
  {
    title: "Data sync warning",
    detail: "MLS feed sync delayed by 23 minutes in 2 regions.",
    severity: "low",
  },
];

const systemHealth = [
  { name: "API Uptime", status: "99.97%", note: "Last 30 days" },
  {
    name: "Avg. Response Time",
    status: "286ms",
    note: "Across core endpoints",
  },
  {
    name: "Search Index Freshness",
    status: "4m ago",
    note: "Last successful refresh",
  },
  {
    name: "Payment Webhooks",
    status: "Operational",
    note: "No failed deliveries",
  },
];

function severityStyles(severity) {
  if (severity === "high") return "bg-rose-50 text-rose-700";
  if (severity === "medium") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

export default function AdminDashboardPage() {
  return (
    <section className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
        <FadeIn>
          <header className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              Admin Dashboard
            </span>
            <h1 className="mt-2 font-display text-headline-lg text-on-surface">
              Marketplace Overview
            </h1>
            <p className="mt-2 max-w-3xl text-body-md text-on-surface-variant">
              High-level operational visibility for listings, user activity,
              inquiries, revenue performance, and platform health.
            </p>
            <p className="mt-3 text-label-sm text-outline">
              TODO: Replace static cards with live analytics and admin API
              endpoints.
            </p>
          </header>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {topMetrics.map((metric) => (
            <StaggerItem key={metric.label}>
              <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-1">
                <p className="text-body-sm text-on-surface-variant">{metric.label}</p>
                <p className="mt-2 font-display text-headline-md text-on-surface">
                  {metric.value}
                </p>
                <p className="mt-1 text-label-sm font-medium text-emerald-700">
                  {metric.delta}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <section className="grid gap-6 lg:grid-cols-3">
          <FadeIn direction="left">
            <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient lg:col-span-2">
              <h2 className="font-display text-title-lg text-on-surface">
                Compliance & Moderation
              </h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Actionable alerts requiring admin attention.
              </p>

              <ul className="mt-5 space-y-3">
                {complianceAlerts.map((alert) => (
                  <li
                    key={alert.title}
                    className="rounded-xl bg-surface-container-low p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-label-lg font-semibold text-on-surface">
                        {alert.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-label-sm font-semibold uppercase ${severityStyles(
                          alert.severity,
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-body-sm text-on-surface-variant">{alert.detail}</p>
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
              <h2 className="font-display text-title-lg text-on-surface">
                System Health
              </h2>
              <ul className="mt-4 space-y-3">
                {systemHealth.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-xl bg-surface-container-low p-4"
                  >
                    <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">
                      {item.name}
                    </p>
                    <p className="mt-1 font-display text-title-md text-on-surface">
                      {item.status}
                    </p>
                    <p className="mt-1 text-label-sm text-outline">{item.note}</p>
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>
        </section>
      </div>
    </section>
  );
}
