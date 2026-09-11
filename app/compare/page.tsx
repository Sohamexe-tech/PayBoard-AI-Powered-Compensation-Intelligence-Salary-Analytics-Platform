import Link from "next/link";

import { getAnalyticsDashboard } from "@/lib/analytics-service";
import { findCompanies } from "@/lib/company-repository";

export const dynamic = "force-dynamic";

const money = (value: number | null) =>
    value === null
        ? "Not available"
        : `$${Math.round(value).toLocaleString()}`;

const companyColors: Record<string, string> = {
    Google: "bg-blue-50 text-blue-700",
    Microsoft: "bg-cyan-50 text-cyan-700",
    Amazon: "bg-orange-50 text-orange-700",
    Meta: "bg-indigo-50 text-indigo-700",
    Apple: "bg-slate-100 text-slate-700",
    Netflix: "bg-red-50 text-red-700",
    Adobe: "bg-red-50 text-red-700",
    IBM: "bg-blue-50 text-blue-700",
    TCS: "bg-sky-50 text-sky-700",
    Infosys: "bg-emerald-50 text-emerald-700",
};

export default async function HomePage() {
    let dashboard;
    let companies;

    try {
        [dashboard, companies] = await Promise.all([
            getAnalyticsDashboard(),
            findCompanies(),
        ]);
    } catch {
        dashboard = null;
        companies = [];
    }

    if (!dashboard) {
        return (
            <main className="dashboard-container">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                    <h1 className="text-xl font-bold">
                        CompIQ is unavailable
                    </h1>

                    <p className="mt-2 text-sm">
                        The database connection is unavailable. Check
                        PostgreSQL and your DATABASE_URL.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

                <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

                <div className="dashboard-container relative">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_.75fr]">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                                <span className="h-2 w-2 rounded-full bg-indigo-600" />

                                Compensation intelligence platform
                            </div>

                            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
                                Understand the market.
                                <span className="block text-indigo-600">
                                    Compare with confidence.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                                Explore compensation benchmarks across
                                companies, roles, experience levels and
                                locations using structured compensation
                                data.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/search"
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                                >
                                    Explore salaries →
                                </Link>

                                <Link
                                    href="/compare"
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                    Compare companies
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                                <span>✓ Structured compensation</span>
                                <span>✓ Normalized career levels</span>
                                <span>✓ Approved records</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Market snapshot
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                            Compensation overview
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                        Live dataset
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500">
                                            Median total
                                        </p>

                                        <p className="mt-2 text-2xl font-black text-slate-900">
                                            {money(
                                                dashboard.summary
                                                    .medianTotal
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-indigo-50 p-4">
                                        <p className="text-xs text-indigo-500">
                                            Average base
                                        </p>

                                        <p className="mt-2 text-2xl font-black text-indigo-700">
                                            {money(
                                                dashboard.summary
                                                    .averageBase
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-bold text-slate-800">
                                            Top companies
                                        </p>

                                        <Link
                                            href="/companies"
                                            className="text-xs font-bold text-indigo-600"
                                        >
                                            View all
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        {dashboard.medianByCompany
                                            .slice(0, 4)
                                            .map((company) => (
                                                <div
                                                    key={company.name}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${companyColors[
                                                                company
                                                                    .name
                                                            ] ??
                                                                "bg-indigo-50 text-indigo-700"
                                                                }`}
                                                        >
                                                            {company.name.charAt(
                                                                0
                                                            )}
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {
                                                                    company.name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {
                                                                    company.sampleSize
                                                                }{" "}
                                                                records
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm font-bold text-slate-900">
                                                        {money(
                                                            company.median
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dashboard-container">
                <div className="mb-6">
                    <p className="page-eyebrow">Overview</p>

                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                        Compensation at a glance
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Link
                        href="/analytics"
                        className="ui-card group p-6 transition hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                                Average base salary
                            </span>

                            <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                                $
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-black text-slate-900">
                            {money(dashboard.summary.averageBase)}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Across approved records
                        </p>
                    </Link>

                    <Link
                        href="/analytics"
                        className="ui-card group p-6 transition hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                                Median total compensation
                            </span>

                            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                                ↑
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-black text-slate-900">
                            {money(dashboard.summary.medianTotal)}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Base + bonus + stock
                        </p>
                    </Link>

                    <Link
                        href="/search"
                        className="ui-card group p-6 transition hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                                Approved records
                            </span>

                            <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
                                #
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-black text-slate-900">
                            {dashboard.sampleSize.toLocaleString()}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Verified benchmark records
                        </p>
                    </Link>

                    <Link
                        href="/companies"
                        className="ui-card group p-6 transition hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                                Companies
                            </span>

                            <span className="rounded-xl bg-orange-50 p-2 text-orange-600">
                                ◈
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-black text-slate-900">
                            {companies.length}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Companies in the dataset
                        </p>
                    </Link>
                </div>
            </section>

            <section className="dashboard-container pt-0">
                <div className="grid gap-6 lg:grid-cols-[1.5fr_.5fr]">
                    <div className="ui-card overflow-hidden">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Company benchmarks
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Median total compensation by
                                        company
                                    </p>
                                </div>

                                <Link
                                    href="/companies"
                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                                >
                                    View companies →
                                </Link>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {dashboard.medianByCompany
                                .slice(0, 7)
                                .map((company, index) => {
                                    const maximum =
                                        dashboard.medianByCompany[0]
                                            ?.median ?? 1;

                                    const width =
                                        ((company.median ?? 0) /
                                            maximum) *
                                        100;

                                    return (
                                        <div
                                            key={company.name}
                                            className="px-6 py-5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 text-xs font-bold text-slate-400">
                                                        0{index + 1}
                                                    </span>

                                                    <span className="font-bold text-slate-800">
                                                        {company.name}
                                                    </span>
                                                </div>

                                                <span className="font-bold text-slate-900">
                                                    {money(company.median)}
                                                </span>
                                            </div>

                                            <div className="ml-8 mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-indigo-600"
                                                    style={{
                                                        width: `${width}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-200">
                            Explore CompIQ
                        </span>

                        <h2 className="mt-5 text-2xl font-black">
                            Make better compensation decisions.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-slate-400">
                            Search the market, compare equivalent career
                            levels and understand how compensation changes
                            across companies.
                        </p>

                        <div className="mt-7 space-y-3">
                            <Link
                                href="/search"
                                className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-900 transition hover:bg-indigo-50"
                            >
                                Search salaries
                            </Link>

                            <Link
                                href="/compare"
                                className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Compare companies
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}