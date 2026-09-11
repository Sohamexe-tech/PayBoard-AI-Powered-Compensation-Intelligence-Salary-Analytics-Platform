"use client";

import { useState } from "react";

type Row = {
    company: string;
    companyLevel: string;
    normalizedLevel: string;
    medianBase: number | null;
    medianBonus: number | null;
    medianStock: number | null;
    medianTotal: number | null;
    sampleSize: number;
};

const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Adobe",
    "IBM",
    "TCS",
    "Infosys",
];

const levels = [
    "Intern",
    "Entry",
    "Junior",
    "Mid",
    "Senior",
    "Staff",
    "Principal",
    "Manager",
];

const roles = [
    "",
    "Software Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Product Manager",
    "Data Engineer",
];

const money = (value: number | null) =>
    value === null
        ? "N/A"
        : `$${Math.round(value).toLocaleString()}`;

export default function ComparePage() {
    const [company1, setCompany1] = useState("Google");
    const [company2, setCompany2] = useState("Microsoft");
    const [level, setLevel] = useState("Senior");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");

    const [rows, setRows] = useState<Row[]>([]);
    const [warning, setWarning] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function runComparison() {
        setLoading(true);
        setError("");
        setWarning("");
        setSearched(true);

        try {
            const selectedCompanies = [company1, company2];

            const params = new URLSearchParams({
                companies: selectedCompanies.join(","),
                normalizedLevel: level,
            });

            if (role) {
                params.set("role", role);
            }

            if (location.trim()) {
                params.set("location", location.trim());
            }

            const response = await fetch(`/api/compare?${params.toString()}`, {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error?.message ||
                    data?.error ||
                    "Unable to load comparison"
                );
            }

            setRows(data.rows ?? []);
            setWarning(data.warning ?? "");
        } catch (err) {
            setRows([]);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load comparison data"
            );
        } finally {
            setLoading(false);
        }
    }

    const maxTotal = Math.max(
        ...rows.map((row) => row.medianTotal ?? 0),
        1
    );

    const highest = rows
        .filter((row) => row.medianTotal !== null)
        .sort(
            (a, b) =>
                (b.medianTotal ?? 0) - (a.medianTotal ?? 0)
        )[0];

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    CompIQ Benchmarking
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    Compare Compensation
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-600">
                    Compare compensation between companies using the same
                    normalized career level.
                </p>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <label className="text-sm font-semibold">
                        Company 1

                        <select
                            value={company1}
                            onChange={(e) => setCompany1(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
                        >
                            {companies.map((company) => (
                                <option key={company}>{company}</option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm font-semibold">
                        Company 2

                        <select
                            value={company2}
                            onChange={(e) => setCompany2(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
                        >
                            {companies
                                .filter((company) => company !== company1)
                                .map((company) => (
                                    <option key={company}>{company}</option>
                                ))}
                        </select>
                    </label>

                    <label className="text-sm font-semibold">
                        Career Level

                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
                        >
                            {levels.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm font-semibold">
                        Role

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
                        >
                            {roles.map((item) => (
                                <option key={item} value={item}>
                                    {item || "All Roles"}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto]">
                    <label className="text-sm font-semibold">
                        Location

                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Optional: Mumbai, India, Seattle..."
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm"
                        />
                    </label>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={runComparison}
                            disabled={loading || company1 === company2}
                            className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                        >
                            {loading ? "Comparing..." : "Run Comparison"}
                        </button>
                    </div>
                </div>
            </section>

            {company1 === company2 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Select two different companies.
                </div>
            )}

            {warning && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    {warning}
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!searched && (
                <section className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <h2 className="text-xl font-semibold">
                        Ready to compare
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Select two companies and click Run Comparison.
                    </p>
                </section>
            )}

            {searched && !loading && !error && rows.length > 0 && (
                <>
                    <section className="mt-8 grid gap-5 md:grid-cols-2">
                        {rows.map((row) => (
                            <div
                                key={row.company}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold capitalize">
                                            {row.company}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {row.companyLevel} · {row.normalizedLevel}
                                        </p>
                                    </div>

                                    <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {row.sampleSize} record
                                        {row.sampleSize === 1 ? "" : "s"}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm text-gray-500">
                                        Median Total Compensation
                                    </p>

                                    <p className="mt-1 text-3xl font-bold">
                                        {money(row.medianTotal)}
                                    </p>
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-3">
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Base
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {money(row.medianBase)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Bonus
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {money(row.medianBonus)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Stock
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {money(row.medianStock)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {highest && (
                        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">
                                Compensation Comparison
                            </h2>

                            <div className="mt-6 space-y-5">
                                {rows.map((row) => {
                                    const value = row.medianTotal ?? 0;
                                    const width = `${(value / maxTotal) * 100}%`;

                                    return (
                                        <div key={row.company}>
                                            <div className="mb-2 flex justify-between text-sm">
                                                <span className="font-semibold capitalize">
                                                    {row.company}
                                                </span>

                                                <span className="font-semibold">
                                                    {money(row.medianTotal)}
                                                </span>
                                            </div>

                                            <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{ width }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="font-bold">
                                Detailed Comparison
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            Company
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Level
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Base
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Bonus
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {rows.map((row) => (
                                        <tr
                                            key={row.company}
                                            className="border-t border-gray-100"
                                        >
                                            <td className="px-6 py-4 font-semibold capitalize">
                                                {row.company}
                                            </td>

                                            <td className="px-6 py-4">
                                                {row.companyLevel}
                                            </td>

                                            <td className="px-6 py-4">
                                                {money(row.medianBase)}
                                            </td>

                                            <td className="px-6 py-4">
                                                {money(row.medianBonus)}
                                            </td>

                                            <td className="px-6 py-4">
                                                {money(row.medianStock)}
                                            </td>

                                            <td className="px-6 py-4 font-bold">
                                                {money(row.medianTotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}

            {searched && !loading && !error && rows.length === 0 && (
                <section className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <h2 className="text-xl font-semibold">
                        No comparison data found
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Try another level, role, or location.
                    </p>
                </section>
            )}

            <p className="mt-8 text-center text-xs text-gray-500">
                Demo dataset for the CompIQ prototype.
            </p>
        </main>
    );
}