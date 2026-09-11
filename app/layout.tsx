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
  description:
    "CompIQ is a compensation intelligence and benchmarking platform.",
};

const navigation = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/search", label: "Salary Search", icon: "⌕" },
  { href: "/companies", label: "Companies", icon: "▦" },
  { href: "/compare", label: "Compare", icon: "⇄" },
  { href: "/analytics", label: "Analytics", icon: "◒" },
  { href: "/insights", label: "Insights", icon: "✦" },
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
        <div className="app-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <Link href="/" className="brand">
                <span className="brand-mark">
                  C
                </span>

                <span>
                  <strong>CompIQ</strong>
                  <small>
                    Compensation Intelligence
                  </small>
                </span>
              </Link>

              <nav className="desktop-nav">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="topbar-actions">
                <Link
                  href="/contribute"
                  className="contribute-button"
                >
                  + Contribute
                </Link>

                <Link
                  href="/login"
                  className="login-button"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </header>

          <main className="site-content">
            {children}
          </main>

          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <div className="footer-brand">
                  <span className="brand-mark small">
                    C
                  </span>

                  <strong>CompIQ</strong>
                </div>

                <p>
                  Compensation intelligence for smarter
                  career decisions.
                </p>
              </div>

              <div className="footer-links">
                <Link href="/search">
                  Salary Search
                </Link>

                <Link href="/companies">
                  Companies
                </Link>

                <Link href="/compare">
                  Compare
                </Link>

                <Link href="/analytics">
                  Analytics
                </Link>
              </div>
            </div>

            <div className="footer-bottom">
              © 2026 CompIQ. Built for compensation
              benchmarking.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}