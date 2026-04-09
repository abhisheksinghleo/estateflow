"use client";

import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

const listingSummary = [
  { label: "Active Listings", value: 8, hint: "Currently visible to buyers" },
  { label: "Pending Offers", value: 3, hint: "Offers awaiting your response" },
  { label: "Sold This Quarter", value: 5, hint: "Closed in last 90 days" },
];

const leadSummary = [
  { label: "New Leads", value: 14, hint: "Last 7 days" },
  { label: "Scheduled Visits", value: 6, hint: "Upcoming property tours" },
  { label: "Avg. Response Time", value: "< 2h", hint: "Based on recent inquiries" },
];

const recentListings = [
  {
    id: "L-1024",
    title: "Modern Family Home in Greenwood",
    location: "Austin, TX",
    price: "$485,000",
    status: "Active",
    inquiries: 12,
  },
  {
    id: "L-1091",
    title: "Suburban Townhouse in Maple District",
    location: "Raleigh, NC",
    price: "$375,000",
    status: "Pending Offer",
    inquiries: 8,
  },
  {
    id: "L-1110",
    title: "Cozy Lakeside Cottage",
    location: "Madison, WI",
    price: "$315,000",
    status: "Draft",
    inquiries: 0,
  },
];

const recentLeads = [
  {
    name: "Olivia Carter",
    interest: "Modern Family Home in Greenwood",
    contact: "olivia.carter@email.com",
    budget: "$450k - $520k",
    stage: "Follow-up",
  },
  {
    name: "Liam Nguyen",
    interest: "Suburban Townhouse in Maple District",
    contact: "liam.nguyen@email.com",
    budget: "$340k - $390k",
    stage: "Viewing Scheduled",
  },
  {
    name: "Mia Robinson",
    interest: "Cozy Lakeside Cottage",
    contact: "mia.robinson@email.com",
    budget: "$280k - $340k",
    stage: "New",
  },
];

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-1">
      <p className="text-label-sm font-medium text-on-surface-variant">{title}</p>
      <p className="mt-2 font-display text-headline-md tracking-tight text-on-surface">{value}</p>
      <p className="mt-1 text-label-sm text-outline">{hint}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending Offer"
      ? "bg-amber-100 text-amber-700"
      : "bg-surface-container-low text-on-surface";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-label-sm font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
        {/* Hero Header */}
        <FadeIn>
          <section className="rounded-2xl bg-on-surface p-6 text-white shadow-ambient-lg sm:p-8">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between relative z-10">
              <div>
                <span className="text-label-sm uppercase tracking-widest text-primary-container">Seller Dashboard</span>
                <h1 className="mt-2 font-display text-headline-lg">Welcome back, Seller</h1>
                <p className="mt-2 max-w-2xl text-body-md text-white/70">
                  Track listing performance, monitor incoming leads, and keep your sales pipeline moving.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/contact" className="btn-secondary text-sm">
                  Contact Support
                </Link>
                <button className="btn-primary text-sm">
                  + Add New Listing
                </button>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Listing Stats */}
        <section>
          <h2 className="mb-4 font-display text-title-lg text-on-surface">Listing Overview</h2>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listingSummary.map((item) => (
              <StaggerItem key={item.label}>
                <StatCard title={item.label} value={item.value} hint={item.hint} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Lead Stats */}
        <section>
          <h2 className="mb-4 font-display text-title-lg text-on-surface">Lead Overview</h2>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leadSummary.map((item) => (
              <StaggerItem key={item.label}>
                <StatCard title={item.label} value={item.value} hint={item.hint} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Tables */}
        <section className="grid gap-6 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="rounded-2xl bg-surface-container-lowest shadow-ambient">
              <div className="px-5 py-4">
                <h3 className="font-display text-title-md text-on-surface">Recent Listings</h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">A quick view of your latest property entries.</p>
              </div>
              <div className="space-y-1 p-2">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="space-y-2 rounded-xl bg-surface-container-low px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-on-surface">{listing.title}</p>
                        <p className="text-body-sm text-on-surface-variant">{listing.location}</p>
                      </div>
                      <StatusBadge status={listing.status} />
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-semibold text-primary">{listing.price}</span>
                      <span className="text-on-surface-variant">{listing.inquiries} inquiries</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div className="rounded-2xl bg-surface-container-lowest shadow-ambient">
              <div className="px-5 py-4">
                <h3 className="font-display text-title-md text-on-surface">Recent Leads</h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">Prioritize lead follow-ups to increase conversions.</p>
              </div>
              <div className="space-y-1 p-2">
                {recentLeads.map((lead, index) => (
                  <div key={`${lead.name}-${index}`} className="space-y-2 rounded-xl bg-surface-container-low px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-on-surface">{lead.name}</p>
                      <span className="rounded-full bg-secondary-container px-2.5 py-1 text-label-sm font-semibold text-primary">
                        {lead.stage}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">{lead.interest}</p>
                    <div className="flex items-center justify-between text-label-sm text-outline">
                      <span>{lead.contact}</span>
                      <span>{lead.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* TODO */}
        <section className="rounded-2xl bg-surface-container-low p-5">
          <h3 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface">TODO: API Integration</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
            <li>Fetch seller-specific listings, lead metrics, and statuses from backend.</li>
            <li>Connect "Add New Listing" to create listing flow.</li>
            <li>Add live notifications for new inquiries and offer updates.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
