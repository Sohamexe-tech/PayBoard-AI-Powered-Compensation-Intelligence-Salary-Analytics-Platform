import Link from "next/link";
import { compareCompanies } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function ComparePage() {
    const result = compareCompanies(salaryRecords, "Google", "Microsoft");

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Company comparison</h1>
                <Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
                    Back home
                </Link>
            </div>
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Benchmark</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Link href={`/company/${encodeURIComponent(result.companyA)}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100">
                        <p className="text-sm text-gray-500">{result.companyA}</p>
                        <p className="mt-2 text-2xl font-semibold">${Math.round(result.companyAAvg).toLocaleString()}</p>
                    </Link>
                    <Link href={`/company/${encodeURIComponent(result.companyB)}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100">
                        <p className="text-sm text-gray-500">{result.companyB}</p>
                        <p className="mt-2 text-2xl font-semibold">${Math.round(result.companyBAvg).toLocaleString()}</p>
                    </Link>
                </div>
                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Delta</p>
                    <p className="mt-2 text-xl font-semibold">${Math.round(result.delta).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-gray-700">Winner: {result.winner}</p>
                </div>
            </div>
        </main>
    );
}
