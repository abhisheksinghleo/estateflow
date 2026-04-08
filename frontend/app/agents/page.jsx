import Link from "next/link";

const agents = [
  {
    id: "agent-1",
    name: "Sophia Martinez",
    title: "Senior Buyer Specialist",
    experience: "9 years",
    rating: 4.9,
    phone: "+1 (555) 201-8890",
    email: "sophia@estateflow.com",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "agent-2",
    name: "Daniel Kim",
    title: "Rental & Relocation Advisor",
    experience: "6 years",
    rating: 4.8,
    phone: "+1 (555) 332-1147",
    email: "daniel@estateflow.com",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "agent-3",
    name: "Ava Johnson",
    title: "Luxury Property Consultant",
    experience: "11 years",
    rating: 5.0,
    phone: "+1 (555) 440-7752",
    email: "ava@estateflow.com",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "agent-4",
    name: "Noah Patel",
    title: "Seller Success Manager",
    experience: "8 years",
    rating: 4.7,
    phone: "+1 (555) 567-9901",
    email: "noah@estateflow.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  },
];

export const metadata = {
  title: "Agents | EstateFlow",
  description: "Meet our experienced real estate agents.",
};

export default function AgentsPage() {
  return (
    <section className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Meet the team
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Real Estate Experts You Can Trust
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Browse our mock agent directory for the MVP. Each profile includes
            role, experience, and quick contact details.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => (
            <article
              key={agent.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src={agent.image}
                alt={agent.name}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-3 p-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {agent.name}
                  </h2>
                  <p className="text-sm text-slate-600">{agent.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900">
                      {agent.experience}
                    </p>
                    <p className="text-slate-500">Experience</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{agent.rating}/5</p>
                    <p className="text-slate-500">Rating</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700">{agent.phone}</p>
                <p className="text-sm text-slate-700">{agent.email}</p>

                <Link href="/contact" className="btn-primary w-full text-sm">
                  Contact Agent
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-500">
          TODO: Replace this static list with `/agents` API data and individual
          agent profile pages.
        </p>
      </div>
    </section>
  );
}
