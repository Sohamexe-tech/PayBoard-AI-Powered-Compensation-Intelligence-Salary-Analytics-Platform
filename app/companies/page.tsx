import Link from "next/link";
import { getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function CompaniesPage() {
    const companies = getCompanySummaries(salaryRecords);

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Company directory</h1>
                <Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
                    Back home
                </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
                {companies.map((company) => (
                    <Link key={company.name} href={`/company/${encodeURIComponent(company.name)}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <p className="text-xl font-semibold">{company.name}</p>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>Records: {company.recordCount}</p>
                            <p>Median base: ${Math.round(company.medianBaseSalary).toLocaleString()}</p>
                            <p>Average total: ${Math.round(company.averageTotalComp).toLocaleString()}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
