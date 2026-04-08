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

export const metadata = {
  title: "Admin Dashboard | EstateFlow",
  description: "Admin overview for marketplace operations and system health.",
};

function severityStyles(severity) {
  if (severity === "high") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (severity === "medium") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

export default function AdminDashboardPage() {
  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Marketplace Overview
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          High-level operational visibility for listings, user activity,
          inquiries, revenue performance, and platform health.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          TODO: Replace static cards with live analytics and admin API
          endpoints.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metric.value}
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-700">
              {metric.delta}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Compliance & Moderation
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Actionable alerts requiring admin attention.
          </p>

          <ul className="mt-5 space-y-3">
            {complianceAlerts.map((alert) => (
              <li
                key={alert.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {alert.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ring-1 ${severityStyles(
                      alert.severity,
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{alert.detail}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            System Health
          </h2>
          <ul className="mt-4 space-y-3">
            {systemHealth.map((item) => (
              <li
                key={item.name}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {item.name}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {item.status}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}
