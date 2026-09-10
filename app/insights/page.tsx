import Link from "next/link";
import { getAnalyticsDashboard } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
    let dashboard;
    try {
        dashboard = await getAnalyticsDashboard();
    } catch {
        dashboard = null;
    }
    if (!dashboard) return <main className="mx-auto max-w-5xl px-6 py-12"><div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">Insights are unavailable because the database could not be reached.</div></main>;
    const strongest = dashboard.medianByCompany[0];
    return <main className="mx-auto max-w-5xl px-6 py-12"><div className="mb-6 flex items-center justify-between gap-4"><h1 className="text-3xl font-bold">Insights</h1><Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">Back home</Link></div><div className="grid gap-4 md:grid-cols-3"><div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Approved records</p><p className="mt-2 text-2xl font-semibold">{dashboard.sampleSize}</p></div><div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Highest median TC</p><p className="mt-2 text-2xl font-semibold">{strongest?.name ?? "Not available"}</p></div><div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Normalized levels</p><p className="mt-2 text-2xl font-semibold">{dashboard.medianByLevel.length}</p></div></div><div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Data-aware takeaways</h2><ul className="mt-4 space-y-3 text-gray-700"><li>• Median compensation is based on {dashboard.sampleSize} approved records.</li><li>• Company comparisons use median total compensation, not a single outlier.</li><li>• Small groups should be interpreted cautiously; each chart includes its sample size.</li></ul></div></main>;
}
