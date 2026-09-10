"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Company = {
    id: string;
    name: string;
    industry: string | null;
    intelligence: {
        recordCount: number;
        medianTotalCompensation: number | null;
        highestTotalCompensation: number | null;
        lowestTotalCompensation: number | null;
        commonRoles: Array<{ name: string; count: number }>;
        commonLevels: Array<{ name: string; count: number }>;
        locations: Array<{ name: string; count: number }>;
    };
};

const money = (value: number | null) => value === null ? "Not available" : `$${Math.round(value).toLocaleString()}`;

export default function CompaniesPage() {
    const [search, setSearch] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = window.setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/companies${search ? `?search=${encodeURIComponent(search)}` : ""}`, { cache: "no-store" });
                if (!response.ok) throw new Error();
                setCompanies((await response.json()).companies as Company[]);
                setError("");
            } catch {
                setError("Could not load companies.");
            } finally {
                setLoading(false);
            }
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search]);

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-sm font-medium text-blue-700">CompIQ Intelligence</p><h1 className="text-3xl font-bold">Companies</h1><p className="mt-1 text-sm text-gray-600">Compare normalized companies using reported compensation data.</p></div>
                <Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">Back home</Link>
            </div>
            <label className="block max-w-md text-sm font-medium">Search companies<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by company name" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            {error && <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
            {loading && <p className="mt-6 text-sm text-gray-600">Loading companies...</p>}
            {!loading && !error && companies.length === 0 && <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center"><h2 className="font-semibold">No companies found</h2><p className="mt-1 text-sm text-gray-600">Try another search.</p></div>}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {!loading && companies.map((company) => <Link key={company.id} href={`/companies/${company.id}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{company.name}</h2><p className="text-sm text-gray-500">{company.industry ?? "Industry not specified"}</p></div><span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{company.intelligence.recordCount} records</span></div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-gray-500">Median TC</p><p className="font-semibold">{money(company.intelligence.medianTotalCompensation)}</p></div><div><p className="text-gray-500">Range</p><p className="font-semibold">{money(company.intelligence.lowestTotalCompensation)} - {money(company.intelligence.highestTotalCompensation)}</p></div></div>
                    <p className="mt-4 text-sm text-gray-600"><span className="font-medium">Roles:</span> {company.intelligence.commonRoles.map((role) => `${role.name} (${role.count})`).join(", ") || "Not available"}</p>
                    <p className="mt-1 text-sm text-gray-600"><span className="font-medium">Levels:</span> {company.intelligence.commonLevels.map((level) => `${level.name} (${level.count})`).join(", ") || "Not available"}</p>
                    <p className="mt-1 text-sm text-gray-600"><span className="font-medium">Locations:</span> {company.intelligence.locations.map((location) => location.name).join(", ") || "Not available"}</p>
                </Link>)}
            </div>
        </main>
    );
}
