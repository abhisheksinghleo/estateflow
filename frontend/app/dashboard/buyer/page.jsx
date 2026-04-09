"use client";

import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

const savedSearches = [
  {
    id: "ss-1",
    name: "Austin homes under $700k",
    filters: "Buy • 3+ Beds • Austin, TX • Max $700,000",
    lastRun: "2 hours ago",
    newMatches: 4,
  },
  {
    id: "ss-2",
    name: "Seattle rentals near downtown",
    filters: "Rent • 2+ Beds • Seattle, WA • Max $3,500/mo",
    lastRun: "Yesterday",
    newMatches: 2,
  },
  {
    id: "ss-3",
    name: "Family homes with backyard",
    filters: "Buy • House • 4+ Beds • Pet Friendly",
    lastRun: "3 days ago",
    newMatches: 1,
  },
];

const recentInquiries = [
  {
    id: "inq-1",
    property: "Modern Family Home in Greenwood",
    status: "Awaiting agent response",
    date: "Today",
  },
  {
    id: "inq-2",
    property: "Downtown Loft with River View",
    status: "Viewing scheduled",
    date: "2 days ago",
  },
  {
    id: "inq-3",
    property: "Suburban Townhouse in Maple District",
    status: "Owner reviewing offer",
    date: "5 days ago",
  },
];

function StatCard({ label, value, highlight = false }) {
  return (
    <article
      className={`rounded-2xl p-5 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-1 ${
        highlight ? "bg-primary-fixed" : "bg-surface-container-lowest"
      }`}
    >
      <p className="text-label-sm font-medium uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-headline-md ${highlight ? "text-primary" : "text-on-surface"}`}
      >
        {value}
      </p>
    </article>
  );
}

export default function BuyerDashboardPage() {
  const totalNewMatches = savedSearches.reduce(
    (sum, item) => sum + item.newMatches,
    0,
  );
  const activeInquiries = recentInquiries.length;

  return (
    <section className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
        <FadeIn>
          <header className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient sm:p-8">
            <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              Buyer Dashboard
            </span>
            <h1 className="mt-2 font-display text-headline-lg text-on-surface">
              Welcome back, Alex 👋
            </h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Track your property search progress, review inquiries, and act quickly
              on new matches.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/buy" className="btn-primary text-sm">
                Browse Properties
              </Link>
              <Link href="/contact" className="btn-secondary text-sm">
                Contact an Agent
              </Link>
            </div>
          </header>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem><StatCard label="Saved Searches" value={savedSearches.length} /></StaggerItem>
          <StaggerItem><StatCard label="New Matches" value={totalNewMatches} highlight /></StaggerItem>
          <StaggerItem><StatCard label="Active Inquiries" value={activeInquiries} /></StaggerItem>
          <StaggerItem><StatCard label="Upcoming Viewings" value={1} /></StaggerItem>
        </StaggerContainer>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient sm:p-6">
              <h2 className="font-display text-title-lg text-on-surface">
                Saved Searches
              </h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Your latest filters and fresh listing matches.
              </p>

              <ul className="mt-4 space-y-3">
                {savedSearches.map((search) => (
                  <li
                    key={search.id}
                    className="rounded-xl bg-surface-container-low p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-on-surface">{search.name}</p>
                        <p className="mt-1 text-label-sm text-on-surface-variant">
                          {search.filters}
                        </p>
                        <p className="mt-2 text-label-sm text-outline">
                          Last checked: {search.lastRun}
                        </p>
                      </div>
                      <span className="rounded-full bg-secondary-container px-2.5 py-1 text-label-sm font-semibold text-primary">
                        +{search.newMatches} new
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient sm:p-6">
              <h2 className="font-display text-title-lg text-on-surface">
                Recent Inquiries
              </h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Status updates from your conversations with agents.
              </p>

              <ul className="mt-4 space-y-3">
                {recentInquiries.map((inq) => (
                  <li
                    key={inq.id}
                    className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
                  >
                    <p className="font-medium text-on-surface">{inq.property}</p>
                    <p className="mt-1 text-body-sm text-on-surface-variant">{inq.status}</p>
                    <p className="mt-2 text-label-sm text-outline">{inq.date}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-label-sm text-outline">
                TODO: Connect inquiry timeline to real API data and realtime
                notifications.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
