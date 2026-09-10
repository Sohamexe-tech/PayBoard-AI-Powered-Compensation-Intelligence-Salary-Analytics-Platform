import Link from "next/link";
import { getAnalyticsDashboard, type AnalyticsDashboard } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";

const money = (value: number | null, currency: string) => value === null ? "Not available" : `${currency} ${Math.round(value).toLocaleString()}`;

function BarList({ items, label, currency }: { items: Array<{ name: string; median: number; sampleSize: number }>; label: string; currency: string }) {
    const max = Math.max(...items.map((item) => item.median), 1);
    return <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">{label}</h2><p className="mt-1 text-sm text-gray-500">Median total compensation · currency: {currency}</p><div className="mt-5 space-y-4">{items.length ? items.map((item) => <div key={item.name} className="text-sm"><div className="mb-1 flex justify-between gap-3"><span className="truncate">{item.name}</span><span className="whitespace-nowrap text-gray-600">{money(item.median, currency)} · n={item.sampleSize}</span></div><div className="h-4 rounded bg-gray-100"><div className="h-4 rounded bg-blue-600" style={{ width: `${(item.median / max) * 100}%` }} /></div></div>) : <p className="text-sm text-gray-500">No records available.</p>}</div></section>;
}

export default async function AnalyticsPage() {
    let dashboard: AnalyticsDashboard;
    try {
        dashboard = await getAnalyticsDashboard();
    } catch {
        return <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6"><div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"><h1 className="text-xl font-semibold">Analytics unavailable</h1><p className="mt-2 text-sm">We could not reach the compensation database. Please try again when the database is available.</p></div></main>;
    }
    const maxDistribution = Math.max(...dashboard.distribution.map((item) => item.count), 1);
    return <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-blue-700">CompIQ Analytics</p><h1 className="text-3xl font-bold">Compensation analytics</h1><p className="mt-1 text-sm text-gray-600">Every metric is calculated from {dashboard.sampleSize} database record{dashboard.sampleSize === 1 ? "" : "s"}.</p></div><Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">Back home</Link></div>
        {dashboard.sampleSize === 0 && <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center"><h2 className="font-semibold">No compensation data yet</h2><p className="mt-1 text-sm text-gray-600">Analytics will appear after records are submitted.</p></div>}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Average base", money(dashboard.summary.averageBase, dashboard.currency)], ["Average bonus", money(dashboard.summary.averageBonus, dashboard.currency)], ["Average stock", money(dashboard.summary.averageStock, dashboard.currency)], ["Average TC", money(dashboard.summary.averageTotal, dashboard.currency)], ["Median TC", money(dashboard.summary.medianTotal, dashboard.currency)]].map(([label, value]) => <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p><p className="mt-1 text-xs text-gray-500">n={dashboard.sampleSize} · {dashboard.currency}</p></div>)}</section>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Compensation distribution</h2><p className="mt-1 text-sm text-gray-500">Number of records by total compensation range · n={dashboard.sampleSize} · {dashboard.currency}</p><div className="mt-5 space-y-4">{dashboard.distribution.map((item) => <div key={item.bucket} className="flex items-center gap-3 text-sm"><span className="w-28">{item.bucket}</span><div className="h-5 flex-1 rounded bg-gray-100"><div className="h-5 rounded bg-indigo-600" style={{ width: `${(item.count / maxDistribution) * 100}%` }} /></div><span className="w-8 text-right">{item.count}</span></div>)}</div></section>
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Base / bonus / stock composition</h2><p className="mt-1 text-sm text-gray-500">Average component values · {dashboard.currency}</p><div className="mt-5 space-y-4">{dashboard.composition.map((item) => <div key={item.component} className="flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm"><span>{item.component}</span><span className="font-semibold">{money(item.average, dashboard.currency)} · n={item.sampleSize}</span></div>)}</div></section>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2"><BarList items={dashboard.medianByCompany} label="Median TC by company" currency={dashboard.currency} /><BarList items={dashboard.medianByLevel} label="Median TC by normalized level" currency={dashboard.currency} /><BarList items={dashboard.locationComparison} label="Location comparison" currency={dashboard.currency} /><BarList items={dashboard.roleComparison} label="Role comparison" currency={dashboard.currency} /></div>
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-semibold">Experience vs compensation</h2><p className="mt-1 text-sm text-gray-500">Median total compensation by reported years of experience · n shown per point.</p>{dashboard.experience.length < 2 ? <p className="mt-5 text-sm text-gray-500">At least two experience groups are needed for a useful comparison.</p> : <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{dashboard.experience.map((item) => <div key={item.years} className="rounded-md bg-gray-50 p-3 text-sm"><p className="text-gray-500">{item.years} years</p><p className="mt-1 font-semibold">{money(item.median, dashboard.currency)}</p><p className="mt-1 text-xs text-gray-500">n={item.sampleSize}</p></div>)}</div>}</section>
    </main>;
}
