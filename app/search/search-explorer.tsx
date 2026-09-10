"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CompensationRecord, PaginationMeta } from "@/lib/types";

type ApiResponse = { records: CompensationRecord[]; meta: PaginationMeta };
type Sort = "total-asc" | "total-desc" | "base-asc" | "base-desc" | "experience" | "company" | "level";

const initialParams = {
    search: "", company: "", role: "", level: "", country: "", city: "",
    minTotalCompensation: "", maxTotalCompensation: "", sort: "total-desc" as Sort, page: 1, pageSize: 10,
};

function getInitialParams() {
    if (typeof window === "undefined") return initialParams;
    const query = new URLSearchParams(window.location.search);
    return {
        ...initialParams,
        search: query.get("search") ?? "",
        company: query.get("company") ?? "",
        role: query.get("role") ?? "",
        level: query.get("level") ?? "",
        country: query.get("country") ?? "",
        city: query.get("city") ?? "",
        minTotalCompensation: query.get("minTotalCompensation") ?? "",
        maxTotalCompensation: query.get("maxTotalCompensation") ?? "",
        sort: (query.get("sort") as Sort) || initialParams.sort,
        page: Number(query.get("page") ?? "1") || 1,
        pageSize: Number(query.get("pageSize") ?? "10") || 10,
    };
}

function money(value: number, currency: string) {
    return `${currency} ${Math.round(value).toLocaleString()}`;
}

export default function SearchExplorer() {
    const [params, setParams] = useState(getInitialParams);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const query = useMemo(() => {
        const values = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== "" && value !== 1) values.set(key, String(value));
        });
        values.set("page", String(params.page));
        values.set("pageSize", String(params.pageSize));
        return values.toString();
    }, [params]);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/salaries?${query}`, { cache: "no-store" });
            if (!response.ok) throw new Error("Request failed");
            setData(await response.json() as ApiResponse);
        } catch {
            setError("Could not load compensation data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        const timer = window.setTimeout(load, params.search ? 350 : 0);
        return () => window.clearTimeout(timer);
    }, [load, params.search]);

    useEffect(() => {
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([key, value]) => value !== "" && url.searchParams.set(key, String(value)));
        window.history.replaceState(null, "", url);
    }, [params]);

    function update(key: keyof typeof initialParams, value: string) {
        setParams((current) => ({ ...current, [key]: value, page: 1 }));
    }

    function reset() {
        setParams(initialParams);
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-700">CompIQ Explorer</p>
                    <h1 className="text-3xl font-bold">Search compensation</h1>
                    <p className="mt-1 text-sm text-gray-600">Filter live compensation records without loading the whole database.</p>
                </div>
                <Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">Back home</Link>
            </div>

            <section aria-label="Compensation filters" className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {(["search", "company", "role", "level", "country", "city"] as const).map((key) => (
                        <label key={key} className="text-sm font-medium">
                            {key === "search" ? "Search" : key[0].toUpperCase() + key.slice(1)}
                            <input value={params[key]} onChange={(event) => update(key, event.target.value)} placeholder={key === "search" ? "Company, role, level, location" : `Filter by ${key}`} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
                        </label>
                    ))}
                    {(["minTotalCompensation", "maxTotalCompensation"] as const).map((key) => (
                        <label key={key} className="text-sm font-medium">
                            {key === "minTotalCompensation" ? "Minimum TC" : "Maximum TC"}
                            <input type="number" min="0" value={params[key]} onChange={(event) => update(key, event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
                        </label>
                    ))}
                    <label className="text-sm font-medium">Sort
                        <select value={params.sort} onChange={(event) => update("sort", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal">
                            <option value="total-desc">Total compensation: high to low</option><option value="total-asc">Total compensation: low to high</option><option value="base-asc">Base: low to high</option><option value="base-desc">Base: high to low</option><option value="experience">Experience</option><option value="company">Company</option><option value="level">Level</option>
                        </select>
                    </label>
                    <label className="text-sm font-medium">Page size
                        <select value={params.pageSize} onChange={(event) => update("pageSize", event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-normal"><option value="10">10</option><option value="25">25</option><option value="50">50</option></select>
                    </label>
                </div>
                <button onClick={reset} className="mt-4 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100">Clear filters</button>
            </section>

            <div className="mb-3 text-sm text-gray-600" aria-live="polite">{loading ? "Loading compensation records..." : data ? `${data.meta.total} result${data.meta.total === 1 ? "" : "s"}` : ""}</div>
            {error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={load} className="ml-2 font-semibold underline">Retry</button></div>}
            {!error && !loading && data?.records.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center"><h2 className="font-semibold">No records found</h2><p className="mt-1 text-sm text-gray-600">Try removing a filter or changing your search.</p></div>}
            {!error && (loading || Boolean(data?.records.length)) && <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-[1100px] w-full text-left text-sm">
                    <thead className="bg-gray-100"><tr>{["Company", "Role", "Level", "Location", "Base", "Bonus", "Stock", "Total compensation", "Experience", "Source"].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? Array.from({ length: 5 }, (_, index) => <tr key={index}>{Array.from({ length: 10 }, (_, cell) => <td key={cell} className="px-4 py-4"><span className="block h-4 animate-pulse rounded bg-gray-200" /></td>)}</tr>) : data?.records.map((record) => <tr key={record.id} className="hover:bg-gray-50"><td className="px-4 py-3"><Link className="font-medium text-blue-700 hover:underline" href={`/company/${encodeURIComponent(record.normalizedCompany)}`}>{record.company}</Link></td><td className="px-4 py-3">{record.role}</td><td className="px-4 py-3">{record.level}</td><td className="px-4 py-3">{record.location}</td><td className="whitespace-nowrap px-4 py-3">{money(record.baseSalary, record.currency)}</td><td className="whitespace-nowrap px-4 py-3">{money(record.bonus, record.currency)}</td><td className="whitespace-nowrap px-4 py-3">{money(record.equity, record.currency)}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{money(record.totalCompensation, record.currency)}</td><td className="px-4 py-3">{record.experience} yrs</td><td className="px-4 py-3 capitalize">{record.source}</td></tr>)}
                    </tbody>
                </table>
            </div>}
            {data && <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-3 text-sm"><span>Page {data.meta.page} of {data.meta.totalPages}</span><div className="flex gap-2"><button disabled={data.meta.page <= 1 || loading} onClick={() => setParams((current) => ({ ...current, page: current.page - 1 }))} className="rounded-md border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">Previous</button><button disabled={data.meta.page >= data.meta.totalPages || loading} onClick={() => setParams((current) => ({ ...current, page: current.page + 1 }))} className="rounded-md border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">Next</button></div></nav>}
        </main>
    );
}
