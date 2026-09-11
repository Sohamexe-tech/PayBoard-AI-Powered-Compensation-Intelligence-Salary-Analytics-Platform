import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompIQ | Compensation Intelligence",
  description: "Compensation intelligence and salary benchmarking platform",
};

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Salary Search" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/analytics", label: "Analytics" },
  { href: "/insights", label: "Insights" },
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand">
              <span className="brand-mark">C</span>

              <span>
                <strong>CompIQ</strong>
                <small>Compensation Intelligence</small>
              </span>
            </Link>

            <nav className="main-nav">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="nav-actions">
              <Link
                href="/contribute"
                className="nav-contribute"
              >
                + Contribute
              </Link>

              <Link
                href="/login"
                className="nav-login"
              >
                Sign in
              </Link>
            </div>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div>
            <strong>CompIQ</strong>

            <p>
              Compensation intelligence for better career decisions.
            </p>
          </div>

          <div className="footer-links">
            <Link href="/search">Search</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/analytics">Analytics</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}