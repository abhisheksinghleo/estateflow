import Link from "next/link";

const values = [
  {
    title: "Trust & Transparency",
    description:
      "We prioritize verified listings, clear pricing, and honest communication so you can make confident decisions.",
  },
  {
    title: "Customer-First Experience",
    description:
      "Whether you are buying, renting, or selling, we design every step to be simple, fast, and human-centered.",
  },
  {
    title: "Local Expertise at Scale",
    description:
      "We combine market data with experienced local agents to help you find the right property in the right neighborhood.",
  },
];

const highlights = [
  "Smart property discovery with practical filters",
  "Dedicated spaces for buyers, sellers, agents, and admins",
  "Fast inquiry flow to connect with professionals",
  "MVP-ready architecture with clear API integration points",
];

export const metadata = {
  title: "About | EstateFlow",
  description: "Learn about EstateFlow’s mission, vision, and core platform values.",
};

export default function AboutPage() {
  return (
    <section className="space-y-12">
      <header className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-14 text-white shadow-lg sm:px-10">
        <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-white/30">
          About EstateFlow
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          Building a Better Real Estate Experience
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-blue-100 sm:text-base">
          EstateFlow is a modern real estate platform focused on helping people
          buy, rent, and manage properties with clarity. Our goal is to remove
          friction from property discovery and connect you with the right
          opportunities faster.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {values.map((value) => (
          <article
            key={value.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {value.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{value.description}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We help people make smarter real estate decisions by providing an
            intuitive platform, relevant property insights, and trusted expert
            support. From first-time buyers to seasoned investors, we aim to
            simplify every interaction.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            What this MVP demonstrates
          </h3>
          <ul className="mt-3 space-y-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Looking Ahead</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          We are continuously improving search relevance, personalization, and
          operational workflows for all user roles. As backend APIs mature, this
          frontend can be wired to live listing, user, and inquiry data with
          minimal changes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/buy" className="btn-primary text-sm">
            Explore Properties
          </Link>
          <Link href="/contact" className="btn-secondary text-sm">
            Contact Our Team
          </Link>
        </div>
      </section>
    </section>
  );
}
