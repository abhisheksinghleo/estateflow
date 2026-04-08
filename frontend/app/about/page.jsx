import Link from "next/link";

const values = [
  {
    title: "Trust & Transparency",
    description:
      "We prioritize verified listings, clear pricing, and honest communication so you can make confident decisions.",
    icon: (
      <svg className="w-8 h-8 text-[#4BA764]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
  },
  {
    title: "Customer-First Experience",
    description:
      "Whether you are buying, renting, or selling, we design every step to be simple, fast, and human-centered.",
    icon: (
      <svg className="w-8 h-8 text-[#4BA764]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
  {
    title: "Local Expertise at Scale",
    description:
      "We combine market data with experienced local agents to help you find the right property in the right neighborhood.",
    icon: (
      <svg className="w-8 h-8 text-[#4BA764]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ),
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
    <div className="bg-[#FCFAF8] min-h-screen pb-20 font-sans text-neutral-800">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#222222] pt-24 pb-32 text-center">
        {/* Decorative background image with overlay */}
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop" 
            alt="Real Estate Exterior"
            className="h-full w-full object-cover opacity-30"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 mt-10">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D08B5B] backdrop-blur-sm">
            About EstateFlow
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Finding The Home That Truly <br className="hidden sm:block" /> Fits Your Life and Future
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-300 sm:text-lg font-light">
            A modern real estate platform focused on helping people buy, rent, and manage properties with clarity and zero friction.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 mt-20 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">The Smarter Way to Find <br/> Your Next Home</h2>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto text-sm">We are committed to making your real estate journey effortless through our core principles.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="group flex flex-col items-start rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-6 rounded-2xl bg-[#EAF5EC] p-4 text-[#4BA764]">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Mission & Highlights Split */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="pr-0 md:pr-10">
            <h2 className="text-3xl font-semibold text-neutral-900 leading-tight sm:text-4xl">Building Trust Through Every Property Journey</h2>
            <p className="mt-5 text-sm leading-relaxed text-neutral-500">
              We help people make smarter real estate decisions by providing an intuitive platform, relevant property insights, and trusted expert support. From first-time buyers to seasoned investors, we aim to simplify every interaction.
            </p>
            <div className="mt-10">
               <Link href="/buy" className="inline-flex items-center justify-center rounded-lg bg-[#D08B5B] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b57345]">
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            {/* Main image representing home journey */}
            <div className="rounded-[2rem] overflow-hidden shadow-lg h-[400px] md:h-[450px]">
              <img src="https://images.unsplash.com/photo-1510627489930-0c1b0bfeb9b9?q=80&w=2070&auto=format&fit=crop" alt="Home Exterior" className="w-full h-full object-cover" />
            </div>
            {/* Highlights floating card */}
            <div className="absolute -bottom-10 -left-6 bg-white rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-neutral-100 max-w-sm hidden lg:block">
              <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF5EC] text-[#4BA764]">
                   <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                 </span>
                 What this platform delivers
              </h3>
              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D08B5B]" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section matching 'Frequently Asked Questions' base style */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-10">
        <div className="rounded-[2.5rem] bg-white p-10 sm:p-16 text-center border border-neutral-100 shadow-sm relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FCFAF8] to-white z-0 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl text-balance">Frequently Asked Questions <br className="hidden sm:block"/> & Looking Ahead</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500 max-w-2xl mx-auto">
                We are continuously improving search relevance, personalization, and operational workflows for all user roles. As backend APIs mature, this frontend can be wired to live listing, user, and inquiry data with minimal changes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/buy" className="inline-flex items-center justify-center rounded-lg bg-[#D08B5B] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b57345]">
                  Explore Properties
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-neutral-100 px-8 py-3.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200">
                  Contact Our Team
                </Link>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}
