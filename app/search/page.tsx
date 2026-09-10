import { salaryRecords } from "@/lib/data";

export default function SearchPage() {
    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <h1 className="text-3xl font-bold">Compensation search</h1>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <table className="min-w-full divide-y divide-slate-800 text-left">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-4 py-3 font-medium">Company</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Level</th>
                            <th className="px-4 py-3 font-medium">Location</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {salaryRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-800/60">
                                <td className="px-4 py-3">{record.normalizedCompany}</td>
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
