"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Row = { company: string; companyLevel: string; normalizedLevel: string; medianBase: number | null; medianBonus: number | null; medianStock: number | null; medianTotal: number | null; sampleSize: number };
const levels = ["Intern", "Entry", "Junior", "Mid", "Senior", "Staff", "Principal", "Manager"];
const money = (value: number | null) => value === null ? "Not available" : `$${Math.round(value).toLocaleString()}`;

export default function ComparePage() {
    const [companies, setCompanies] = useState<string[]>(["Google", "Microsoft"]);
    const [role, setRole] = useState("");
    const [level, setLevel] = useState("Senior");
    const [location, setLocation] = useState("");
    const [rows, setRows] = useState<Row[]>([]);
    const [warning, setWarning] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const query = new URLSearchParams({ companies: companies.join(","), normalizedLevel: level });
        if (role) query.set("role", role);
        if (location) query.set("location", location);
        const timer = window.setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/compare?${query}`, { cache: "no-store" });
                if (!response.ok) throw new Error();
                const result = await response.json();
                setRows(result.rows as Row[]);
                setWarning(result.warning as string | null);
                setError("");
            } catch {
                setError("Could not load comparison data. Check that the selected level has an explicit project mapping.");
            } finally {
                setLoading(false);
            }
        }, 250);
        return () => window.clearTimeout(timer);
    }, [companies, level, role, location]);

    function updateCompany(index: number, value: string) {
        setCompanies((current) => current.map((company, itemIndex) => itemIndex === index ? value : company));
    }

    const highest = rows.filter((row) => row.medianTotal !== null).sort((a, b) => (b.medianTotal ?? 0) - (a.medianTotal ?? 0))[0];
    const baseLeader = rows.filter((row) => row.medianBase !== null).sort((a, b) => (b.medianBase ?? 0) - (a.medianBase ?? 0))[0];
    const stockLeader = rows.filter((row) => row.medianStock !== null).sort((a, b) => (b.medianStock ?? 0) - (a.medianStock ?? 0))[0];
    const maxTotal = Math.max(...rows.map((row) => row.medianTotal ?? 0), 1);

    return <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-blue-700">CompIQ Benchmarking</p><h1 className="text-3xl font-bold">Compare compensation</h1><p className="mt-1 text-sm text-gray-600">Comparisons use the explicit project-defined normalized-level mapping.</p></div><Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">Back home</Link></div>
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{companies.map((company, index) => <label key={index} className="text-sm font-medium">Company {index + 1}<input value={company} onChange={(event) => updateCompany(index, event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>)}<label className="text-sm font-medium">Role<input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Optional role filter" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label><label className="text-sm font-medium">Normalized level<select value={level} onChange={(event) => setLevel(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">{levels.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-medium">Location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Optional city or country" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label></div></section>
        {warning && <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">{warning}</div>}
        {error && <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        <div className="mt-6 text-sm text-gray-600" aria-live="polite">{loading ? "Loading comparison..." : `Normalized group: ${level}`}</div>
        {!loading && !error && rows.every((row) => row.sampleSize === 0) && <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center"><h2 className="font-semibold">No equivalent records found</h2><p className="mt-1 text-sm text-gray-600">Try another normalized level, role, or location.</p></div>}
        {!error && rows.some((row) => row.sampleSize > 0) && <><div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-gray-100"><tr>{["Company", "Company level", "Normalized level", "Median base", "Median bonus", "Median stock", "Median TC", "Sample size"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-200">{rows.map((row) => <tr key={row.company}><td className="px-4 py-3 font-medium">{row.company}</td><td className="px-4 py-3">{row.companyLevel}</td><td className="px-4 py-3">{row.normalizedLevel}</td><td className="px-4 py-3">{money(row.medianBase)}</td><td className="px-4 py-3">{money(row.medianBonus)}</td><td className="px-4 py-3">{money(row.medianStock)}</td><td className="px-4 py-3 font-semibold">{money(row.medianTotal)}</td><td className="px-4 py-3">{row.sampleSize}</td></tr>)}</tbody></table></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Median total compensation</h2><div className="mt-5 space-y-4">{rows.map((row) => <div key={row.company} className="flex items-center gap-3 text-sm"><span className="w-24 truncate">{row.company}</span><div className="h-6 flex-1 rounded bg-gray-100"><div className="h-6 rounded bg-blue-600" style={{ width: `${((row.medianTotal ?? 0) / maxTotal) * 100}%` }} /></div><span className="w-28 text-right">{money(row.medianTotal)}</span></div>)}</div></section><section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Comparison highlights</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Highest median TC</dt><dd className="font-semibold">{highest ? `${highest.company} (${money(highest.medianTotal)})` : "Not available"}</dd></div><div className="flex justify-between gap-4"><dt>Highest median base</dt><dd className="font-semibold">{baseLeader ? `${baseLeader.company} (${money(baseLeader.medianBase)})` : "Not available"}</dd></div><div className="flex justify-between gap-4"><dt>Highest median equity</dt><dd className="font-semibold">{stockLeader ? `${stockLeader.company} (${money(stockLeader.medianStock)})` : "Not available"}</dd></div>{highest && rows.filter((row) => row.medianTotal !== null && row.company !== highest.company).map((row) => <div key={row.company} className="flex justify-between gap-4"><dt>{row.company} vs {highest.company}</dt><dd className="font-semibold">{(((row.medianTotal! - highest.medianTotal!) / highest.medianTotal!) * 100).toFixed(1)}%</dd></div>)}</dl></section></div></>}
    </main>;
}
