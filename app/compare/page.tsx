import { compareCompanies } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function ComparePage() {
    const result = compareCompanies(salaryRecords, "Google", "Microsoft");

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-3xl font-bold">Company comparison</h1>
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Benchmark</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-800 p-4">
                        <p className="text-sm text-slate-400">{result.companyA}</p>
                        <p className="mt-2 text-2xl font-semibold">${Math.round(result.companyAAvg).toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-4">
                        <p className="text-sm text-slate-400">{result.companyB}</p>
                        <p className="mt-2 text-2xl font-semibold">${Math.round(result.companyBAvg).toLocaleString()}</p>
                    </div>
                </div>
                <div className="mt-6 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
                    <p className="text-sm text-cyan-300">Delta</p>
                    <p className="mt-2 text-xl font-semibold">${Math.round(result.delta).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-slate-300">Winner: {result.winner}</p>
                </div>
            </div>
        </main>
    );
}
