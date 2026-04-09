"use client";

import FadeIn from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerReveal";

const leadStats = [
  { label: "New Leads", value: 14, tone: "bg-primary-fixed text-primary" },
  { label: "Contacted", value: 28, tone: "bg-amber-100 text-amber-700" },
  { label: "Qualified", value: 12, tone: "bg-emerald-100 text-emerald-700" },
  { label: "Closed This Month", value: 5, tone: "bg-violet-100 text-violet-700" },
];

const recentLeads = [
  {
    id: "L-1001",
    name: "Olivia Carter",
    interest: "Modern Family Home in Austin",
    budget: "$550,000 - $700,000",
    source: "Website Inquiry",
    status: "New",
    lastContact: "Today, 10:15 AM",
  },
  {
    id: "L-1002",
    name: "Liam Johnson",
    interest: "Downtown Luxury Apartment",
    budget: "$3,500 / month",
    source: "Referral",
    status: "Contacted",
    lastContact: "Yesterday, 4:40 PM",
  },
  {
    id: "L-1003",
    name: "Sophia Turner",
    interest: "Coastal Villa in Miami",
    budget: "$1.2M - $1.6M",
    source: "Landing Page",
    status: "Qualified",
    lastContact: "2 days ago",
  },
  {
    id: "L-1004",
    name: "Noah Patel",
    interest: "Suburban Townhouse",
    budget: "$400,000 - $500,000",
    source: "Ad Campaign",
    status: "Follow-up",
    lastContact: "3 days ago",
  },
];

const appointments = [
  {
    id: "APT-501",
    client: "Olivia Carter",
    property: "Modern Family Home in Austin",
    date: "Mon, 12 Aug",
    time: "11:00 AM",
    type: "In-person Tour",
  },
  {
    id: "APT-502",
    client: "Sophia Turner",
    property: "Coastal Villa in Miami",
    date: "Tue, 13 Aug",
    time: "2:30 PM",
    type: "Virtual Tour",
  },
  {
    id: "APT-503",
    client: "Liam Johnson",
    property: "Downtown Luxury Apartment",
    date: "Wed, 14 Aug",
    time: "5:00 PM",
    type: "Consultation Call",
  },
];

function statusBadge(status) {
  const map = {
    New: "bg-primary-fixed text-primary",
    Contacted: "bg-amber-100 text-amber-700",
    Qualified: "bg-emerald-100 text-emerald-700",
    "Follow-up": "bg-violet-100 text-violet-700",
  };

  return map[status] || "bg-surface-container-low text-on-surface";
}

export default function AgentDashboardPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <FadeIn>
          <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-label-sm font-semibold uppercase tracking-widest text-primary">Agent Workspace</span>
                <h1 className="mt-2 font-display text-headline-lg text-on-surface">
                  Dashboard Overview
                </h1>
                <p className="mt-2 text-body-md text-on-surface-variant">
                  Track leads, upcoming appointments, and day-to-day activity.
                </p>
              </div>
              <button className="btn-primary w-full sm:w-auto">
                + Add New Lead
              </button>
            </div>
          </section>
        </FadeIn>

        {/* Lead Stats */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {leadStats.map((item) => (
            <StaggerItem key={item.label}>
              <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-1">
                <p className="text-body-sm text-on-surface-variant">{item.label}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-display text-headline-md text-on-surface">{item.value}</p>
                  <span className={`rounded-full px-3 py-1 text-label-sm font-semibold ${item.tone}`}>
                    Live
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Main Grid: Table + Sidebar */}
        <section className="grid gap-6 xl:grid-cols-3">
          <FadeIn direction="left">
            <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-title-lg text-on-surface">Recent Leads</h2>
                <button className="rounded-lg bg-surface-container-low px-3 py-1.5 text-label-sm font-medium text-on-surface hover:bg-surface-container transition-colors duration-200">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-body-sm">
                  <thead>
                    {/* Tonal header row instead of border */}
                    <tr className="bg-surface-container-low text-on-surface-variant">
                      <th className="px-3 py-2 font-medium rounded-l-lg">Lead</th>
                      <th className="px-3 py-2 font-medium">Interest</th>
                      <th className="px-3 py-2 font-medium">Budget</th>
                      <th className="px-3 py-2 font-medium">Source</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium rounded-r-lg">Last Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="align-top hover:bg-surface-container-low/50 transition-colors duration-150">
                        <td className="px-3 py-3">
                          <p className="font-medium text-on-surface">{lead.name}</p>
                          <p className="text-label-sm text-outline">{lead.id}</p>
                        </td>
                        <td className="px-3 py-3 text-on-surface">{lead.interest}</td>
                        <td className="px-3 py-3 text-on-surface">{lead.budget}</td>
                        <td className="px-3 py-3 text-on-surface">{lead.source}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-label-sm font-semibold ${statusBadge(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-outline">{lead.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <aside className="space-y-6">
              <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient">
                <h2 className="font-display text-title-lg text-on-surface">Today&apos;s Agenda</h2>
                <ul className="mt-4 space-y-3">
                  {appointments.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl bg-surface-container-low p-3"
                    >
                      <p className="font-medium text-on-surface">{item.client}</p>
                      <p className="text-body-sm text-on-surface-variant">{item.property}</p>
                      <p className="mt-1 text-label-sm text-outline">
                        {item.date} • {item.time} • {item.type}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient">
                <h2 className="font-display text-title-lg text-on-surface">Quick Actions</h2>
                <div className="mt-4 grid gap-2">
                  <button className="btn-secondary justify-center">Schedule Appointment</button>
                  <button className="btn-secondary justify-center">Send Follow-up Email</button>
                  <button className="btn-secondary justify-center">Create Property Match</button>
                </div>
                <p className="mt-4 text-label-sm text-outline">
                  TODO: Connect actions to CRM/workflow APIs.
                </p>
              </article>
            </aside>
          </FadeIn>
        </section>
      </div>
    </main>
  );
}
