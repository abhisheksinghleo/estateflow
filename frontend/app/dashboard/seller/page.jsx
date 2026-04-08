import Link from "next/link";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending Offer"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default function SellerDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-300">Seller Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome back, Seller</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
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

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Listing Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listingSummary.map((item) => (
            <StatCard key={item.label} title={item.label} value={item.value} hint={item.hint} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Lead Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leadSummary.map((item) => (
            <StatCard key={item.label} title={item.label} value={item.value} hint={item.hint} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Recent Listings</h3>
            <p className="mt-1 text-sm text-slate-600">A quick view of your latest property entries.</p>
          </div>
          <div className="divide-y divide-slate-200">
            {recentListings.map((listing) => (
              <div key={listing.id} className="space-y-2 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{listing.title}</p>
                    <p className="text-sm text-slate-600">{listing.location}</p>
                  </div>
                  <StatusBadge status={listing.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-blue-700">{listing.price}</span>
                  <span className="text-slate-600">{listing.inquiries} inquiries</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Recent Leads</h3>
            <p className="mt-1 text-sm text-slate-600">Prioritize lead follow-ups to increase conversions.</p>
          </div>
          <div className="divide-y divide-slate-200">
            {recentLeads.map((lead, index) => (
              <div key={`${lead.name}-${index}`} className="space-y-2 px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {lead.stage}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{lead.interest}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{lead.contact}</span>
                  <span>{lead.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">TODO: API Integration</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Fetch seller-specific listings, lead metrics, and statuses from backend.</li>
          <li>Connect “Add New Listing” to create listing flow.</li>
          <li>Add live notifications for new inquiries and offer updates.</li>
        </ul>
      </section>
    </div>
  );
}
