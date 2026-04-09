"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

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

/* ── Role badge color mapping ── */
function roleBadgeStyle(role) {
  const map = {
    buyer: "bg-blue-100 text-blue-700",
    seller: "bg-emerald-100 text-emerald-700",
    agent: "bg-violet-100 text-violet-700",
    admin: "bg-rose-100 text-rose-700",
    admin_head: "bg-rose-100 text-rose-700",
    admin_co: "bg-amber-100 text-amber-700",
    admin_co_head: "bg-amber-100 text-amber-700",
  };
  return map[role] || "bg-surface-container-low text-on-surface";
}

function roleLabel(role) {
  const map = {
    buyer: "Buyer",
    seller: "Seller",
    agent: "Agent",
    admin: "Admin",
    admin_head: "Head Admin",
    admin_co: "Co-Admin",
    admin_co_head: "Co-Admin",
  };
  return map[role] || "User";
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, getDashboardPath, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

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

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            /* Skeleton while checking auth */
            <div className="h-9 w-24 animate-pulse rounded-lg bg-surface-container-low" />
          ) : isAuthenticated && user ? (
            /* ── Logged-in User Menu ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-surface-container-low"
                aria-label="User menu"
              >
                {/* Avatar */}
                <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-terracotta text-xs font-bold text-white shadow-md">
                  {initials}
                </span>
                {/* Name + role */}
                <span className="hidden flex-col items-start sm:flex">
                  <span className="text-label-md font-semibold text-on-surface leading-tight">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider rounded-sm px-1 ${roleBadgeStyle(user.role)}`}>
                    {roleLabel(user.role)}
                  </span>
                </span>
                {/* Chevron */}
                <svg
                  className={`h-4 w-4 text-on-surface-variant transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl bg-surface-container-lowest p-2 shadow-ambient-lg"
                  >
                    {/* User info header */}
                    <div className="px-3 py-2.5 mb-1">
                      <p className="text-label-md font-semibold text-on-surface">{user.name}</p>
                      <p className="text-label-sm text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <div className="h-px bg-outline-variant/20 mx-2 mb-1" />

                    {/* Menu items */}
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-on-surface transition-colors duration-150 hover:bg-surface-container-low"
                    >
                      <svg className="h-4 w-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                      Dashboard
                    </Link>

                    <Link
                      href={getDashboardPath() + "?tab=profile"}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-on-surface transition-colors duration-150 hover:bg-surface-container-low"
                    >
                      <svg className="h-4 w-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      My Profile
                    </Link>

                    {(user.role === "buyer") && (
                      <Link
                        href={getDashboardPath() + "?tab=favorites"}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-on-surface transition-colors duration-150 hover:bg-surface-container-low"
                      >
                        <svg className="h-4 w-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Favorites
                      </Link>
                    )}

                    <div className="h-px bg-outline-variant/20 mx-2 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-rose-600 transition-colors duration-150 hover:bg-rose-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Not Logged In ── */
            <>
              <Link href="/auth/login" className="btn-tertiary hidden sm:inline-flex">
                Log in
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}

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

              {/* Mobile auth section */}
              {isAuthenticated && user && (
                <>
                  <li className="h-px bg-outline-variant/20 my-2" />
                  <li>
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-4 py-2.5 text-label-lg font-semibold text-primary transition-colors duration-200 hover:bg-primary-fixed"
                    >
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="block w-full text-left rounded-lg px-4 py-2.5 text-label-lg font-semibold text-rose-600 transition-colors duration-200 hover:bg-rose-50"
                    >
                      🚪 Log out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
