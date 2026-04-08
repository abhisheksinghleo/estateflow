"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold tracking-wide text-white">
            EF
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-blue-700">
            EstateFlow
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="btn-secondary text-sm">
            Log in
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Sign up
          </Link>
        </div>
      </nav>

      <div className="border-t border-slate-200 px-4 py-2 md:hidden">
        <ul className="flex flex-wrap items-center gap-2">
          {primaryLinks.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <li key={`mobile-${link.href}`}>
                <Link
                  href={link.href}
                  className={[
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
