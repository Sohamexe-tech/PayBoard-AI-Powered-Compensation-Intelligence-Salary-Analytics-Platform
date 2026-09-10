import Link from "next/link";
import { getAnalytics, getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function InsightsPage() {
    const summary = getAnalytics(salaryRecords);
    const companies = getCompanySummaries(salaryRecords);

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Insights</h1>
                <Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
                    Back home
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Market leader</p>
                    <p className="mt-2 text-2xl font-semibold">{summary.topCompany}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Highest total</p>
                    <p className="mt-2 text-2xl font-semibold">${Math.round(Math.max(...companies.map((c) => c.averageTotalComp))).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Role count</p>
                    <p className="mt-2 text-2xl font-semibold">{summary.roleCount}</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold">Quick takes</h2>
                <ul className="mt-4 space-y-3 text-gray-700">
                    <li>• Average base pay is ${Math.round(summary.averageBaseSalary).toLocaleString()}.</li>
                    <li>• Top company is {summary.topCompany} based on record volume.</li>
                    <li>• The strongest total comp belongs to {companies[0]?.name ?? "N/A"}.</li>
                </ul>
            </div>
        </main>
    );
}
