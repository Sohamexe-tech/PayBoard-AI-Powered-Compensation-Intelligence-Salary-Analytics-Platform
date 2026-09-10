import { getAnalytics } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function AnalyticsPage() {
    const summary = getAnalytics(salaryRecords);

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-3xl font-bold">Compensation analytics</h1>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                    ["Average base", `$${Math.round(summary.averageBaseSalary).toLocaleString()}`],
                    ["Average bonus", `$${Math.round(summary.averageBonus).toLocaleString()}`],
                    ["Average equity", `$${Math.round(summary.averageEquity).toLocaleString()}`],
                    ["Average total", `$${Math.round(summary.averageTotalCompensation).toLocaleString()}`],
                    ["Companies", summary.companyCount.toString()],
                    ["Roles", summary.roleCount.toString()],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-sm text-slate-400">{label}</p>
                        <p className="mt-3 text-2xl font-semibold">{value}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
