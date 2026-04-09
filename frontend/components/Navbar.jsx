"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-warm shadow-ambient"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-terracotta text-xs font-bold tracking-wide text-white">
            EF
          </span>
          <span className="font-display text-base font-bold tracking-tight text-on-surface transition-colors duration-200 group-hover:text-primary">
            EstateFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-lg px-3.5 py-2 text-label-lg transition-colors duration-200 ${
                    active
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary-fixed"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-tertiary hidden sm:inline-flex">
            Log in
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Get Started
          </Link>

          {/* Mobile toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-surface-container-low md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {primaryLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={`mobile-${link.href}`}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-4 py-2.5 text-label-lg transition-colors duration-200 ${
                        active
                          ? "bg-primary-fixed text-primary font-semibold"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
