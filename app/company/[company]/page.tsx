import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function CompanyDetailPage({ params }: { params: Promise<{ company: string }> }) {
    const loadCompany = async () => {
        const resolved = await params;
        const decoded = decodeURIComponent(resolved.company);
        const company = getCompanySummaries(salaryRecords).find((item) => item.name === decoded);

        if (!company) {
            notFound();
        }

        return {
            ...company,
            records: salaryRecords.filter((record) => record.normalizedCompany === decoded),
        };
    };

    return <CompanyDetailView promise={loadCompany()} />;
}

async function CompanyDetailView({ promise }: { promise: Promise<{ name: string; recordCount: number; averageTotalComp: number; medianBaseSalary: number; records: typeof salaryRecords }> }) {
    const company = await promise;

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <Link href="/companies" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
                    Back to companies
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Records</p>
                    <p className="mt-2 text-2xl font-semibold">{company.recordCount}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Median base</p>
                    <p className="mt-2 text-2xl font-semibold">${Math.round(company.medianBaseSalary).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Average total</p>
                    <p className="mt-2 text-2xl font-semibold">${Math.round(company.averageTotalComp).toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold">Records</h2>
                <div className="mt-4 space-y-3">
                    {company.records.map((record) => (
                        <div key={record.id} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                            <div>
                                <p className="font-medium">{record.role}</p>
                                <p className="text-sm text-gray-500">{record.level} • {record.location}</p>
                            </div>
                            <p className="font-semibold">${Math.round(record.totalCompensation).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
