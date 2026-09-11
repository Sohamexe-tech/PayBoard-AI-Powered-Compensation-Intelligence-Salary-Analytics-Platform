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
  title: "CompIQ",
  description: "Compensation Intelligence Platform",
};

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <Link
              href="/"
              className="shrink-0 text-xl font-bold tracking-tight"
            >
              CompIQ
            </Link>

            <nav className="hidden items-center gap-1 text-sm md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Sign up
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}