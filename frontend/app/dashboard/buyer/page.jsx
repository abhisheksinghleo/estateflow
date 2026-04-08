import Link from "next/link";

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

export const metadata = {
  title: "Buyer Dashboard | EstateFlow",
  description:
    "Overview of buyer activity, saved searches, and property inquiries.",
};

function StatCard({ label, value, highlight = false }) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        highlight ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold ${highlight ? "text-blue-700" : "text-slate-900"}`}
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
    <section className="space-y-8">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          Buyer Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome back, Alex 👋
        </h1>
        <p className="mt-2 text-sm text-slate-600">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saved Searches" value={savedSearches.length} />
        <StatCard label="New Matches" value={totalNewMatches} highlight />
        <StatCard label="Active Inquiries" value={activeInquiries} />
        <StatCard label="Upcoming Viewings" value={1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Saved Searches
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Your latest filters and fresh listing matches.
          </p>

          <ul className="mt-4 space-y-3">
            {savedSearches.map((search) => (
              <li
                key={search.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{search.name}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {search.filters}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Last checked: {search.lastRun}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    +{search.newMatches} new
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Inquiries
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Status updates from your conversations with agents.
          </p>

          <ul className="mt-4 space-y-3">
            {recentInquiries.map((inq) => (
              <li
                key={inq.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-medium text-slate-900">{inq.property}</p>
                <p className="mt-1 text-sm text-slate-600">{inq.status}</p>
                <p className="mt-2 text-xs text-slate-500">{inq.date}</p>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-slate-500">
            TODO: Connect inquiry timeline to real API data and realtime
            notifications.
          </p>
        </div>
      </div>
    </section>
  );
}
