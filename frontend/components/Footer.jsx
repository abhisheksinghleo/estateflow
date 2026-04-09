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
    // Tonal surface shift for footer separation — no border per "No-Line" rule
    <footer className="mt-16 bg-surface-container-low">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-terracotta text-xs font-bold tracking-wide text-white">
              EF
            </span>
            <span className="font-display text-base font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors duration-200">
              EstateFlow
            </span>
          </Link>
          <p className="mt-4 max-w-md text-body-md text-on-surface-variant leading-relaxed">
            A modern real estate experience for buyers, renters, sellers, and
            agents. Discover homes, compare options, and connect with
            experts—all in one place.
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface">
              {section.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-md text-on-surface-variant transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar — using tonal bg shift instead of border */}
      <div className="bg-surface-container">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5 text-label-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} EstateFlow. All rights reserved.</p>
          <p>Built for a premium real estate experience.</p>
        </div>
      </div>
    </footer>
  );
}
