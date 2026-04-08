const stats = [
  { label: "Active Listings", value: "12,480+" },
  { label: "Cities Covered", value: "85+" },
  { label: "Verified Agents", value: "1,250+" },
  { label: "Avg. Response Time", value: "< 2 hrs" },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Trusted by Buyers, Renters, and Sellers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
            A quick snapshot of our marketplace performance.
            {/* TODO: Replace static numbers with live analytics API data */}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-5 text-center"
              >
                <p className="text-2xl font-extrabold text-blue-600 sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
