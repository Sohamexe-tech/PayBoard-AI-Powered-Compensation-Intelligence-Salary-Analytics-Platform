import { getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function CompaniesPage() {
    const companies = getCompanySummaries(salaryRecords);

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-3xl font-bold">Company directory</h1>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
                {companies.map((company) => (
                    <div key={company.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                        <p className="text-xl font-semibold">{company.name}</p>
                        <div className="mt-4 space-y-2 text-sm text-slate-300">
                            <p>Records: {company.recordCount}</p>
                            <p>Median base: ${Math.round(company.medianBaseSalary).toLocaleString()}</p>
                            <p>Average total: ${Math.round(company.averageTotalComp).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
