import Link from "next/link";
import { salaryRecords } from "@/lib/data";

export default function SearchPage() {
    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Compensation search</h1>
                <Link href="/" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
                    Back home
                </Link>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 font-medium">Company</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Level</th>
                            <th className="px-4 py-3 font-medium">Location</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {salaryRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <Link href={`/company/${encodeURIComponent(record.normalizedCompany)}`} className="font-medium hover:underline">
                                        {record.normalizedCompany}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">{record.role}</td>
                                <td className="px-4 py-3">{record.level}</td>
                                <td className="px-4 py-3">{record.location}</td>
                                <td className="px-4 py-3">${Math.round(record.totalCompensation).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
