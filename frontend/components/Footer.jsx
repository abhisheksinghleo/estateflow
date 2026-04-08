import Link from "next/link";

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Buy", href: "/buy" },
      { label: "Rent", href: "/rent" },
      { label: "Agents", href: "/agents" },
      { label: "Featured Properties", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Login", href: "/auth/login" },
      { label: "Register", href: "/auth/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block">
            <h2 className="text-xl font-bold text-slate-900">
              Estate<span className="text-blue-600">Flow</span>
            </h2>
          </Link>
          <p className="mt-3 max-w-md text-sm text-slate-600">
            A modern real estate experience for buyers, renters, sellers, and
            agents. Discover homes, compare options, and connect with
            experts—all in one place.
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              {section.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EstateFlow. All rights reserved.</p>
          <p>Built for an MVP real estate platform UI.</p>
        </div>
      </div>
    </footer>
  );
}
