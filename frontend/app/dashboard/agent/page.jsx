export const metadata = {
  title: "Agent Dashboard | EstateFlow",
  description: "Manage leads, appointments, and listing performance.",
};

const leadStats = [
  { label: "New Leads", value: 14, tone: "bg-blue-50 text-blue-700" },
  { label: "Contacted", value: 28, tone: "bg-amber-50 text-amber-700" },
  { label: "Qualified", value: 12, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Closed This Month", value: 5, tone: "bg-violet-50 text-violet-700" },
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
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-amber-100 text-amber-700",
    Qualified: "bg-emerald-100 text-emerald-700",
    "Follow-up": "bg-violet-100 text-violet-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
}

export default function AgentDashboardPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Agent Workspace</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Track leads, upcoming appointments, and day-to-day activity.
            </p>
          </div>
          <button className="btn-primary w-full sm:w-auto">
            + Add New Lead
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {leadStats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                Live
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
            <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2 font-medium">Lead</th>
                  <th className="px-3 py-2 font-medium">Interest</th>
                  <th className="px-3 py-2 font-medium">Budget</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.id}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{lead.interest}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.budget}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.source}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{lead.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Today’s Agenda</h2>
            <ul className="mt-4 space-y-3">
              {appointments.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="font-medium text-slate-900">{item.client}</p>
                  <p className="text-sm text-slate-600">{item.property}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.date} • {item.time} • {item.type}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid gap-2">
              <button className="btn-secondary justify-center">Schedule Appointment</button>
              <button className="btn-secondary justify-center">Send Follow-up Email</button>
              <button className="btn-secondary justify-center">Create Property Match</button>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              TODO: Connect actions to CRM/workflow APIs.
            </p>
          </article>
        </aside>
      </section>
    </main>
  );
}
