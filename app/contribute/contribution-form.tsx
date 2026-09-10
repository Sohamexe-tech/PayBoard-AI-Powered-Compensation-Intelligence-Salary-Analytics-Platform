"use client";

import { FormEvent, useEffect, useState } from "react";

type Contribution = { id: string; company: string; role: string; companyLevel: string; normalizedLevel: string; status: string; submittedAt: string; reviewerNote: string | null };
const fields = [
    ["company", "Company"], ["role", "Role"], ["companyLevel", "Company level"], ["location", "Location"], ["baseSalary", "Base salary"], ["bonus", "Bonus"], ["stock", "Stock"], ["experience", "Years of experience"],
] as const;

export default function ContributionForm() {
    const [form, setForm] = useState<Record<string, string>>({ company: "", role: "", companyLevel: "", normalizedLevel: "Senior", location: "", baseSalary: "", bonus: "0", stock: "0", experience: "", currency: "USD", source: "public" });
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
    async function load() { const response = await fetch("/api/contributions", { cache: "no-store" }); if (response.ok) setContributions((await response.json()).contributions); }
    useEffect(() => {
        let active = true;
        void fetch("/api/contributions", { cache: "no-store" }).then(async (response) => {
            if (active && response.ok) setContributions((await response.json()).contributions);
        });
        return () => { active = false; };
    }, []);
    async function submit(event: FormEvent) {
        event.preventDefault(); setLoading(true); setMessage(""); setError("");
        const response = await fetch("/api/contributions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, level: form.companyLevel }) });
        const result = await response.json();
        if (!response.ok) setError(result.error?.message ?? "Submission failed"); else { setMessage("Submitted for review. It will not appear publicly until approved."); setForm((current) => ({ ...current, company: "", role: "", companyLevel: "", location: "", baseSalary: "", bonus: "0", stock: "0", experience: "" })); void load(); }
        setLoading(false);
    }
    return <><form onSubmit={submit} className="mt-6 grid gap-4 rounded-xl border bg-white p-6 shadow-sm sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="text-sm font-medium">{label}<input required={["company", "role", "companyLevel", "location", "baseSalary", "experience"].includes(key)} type={["baseSalary", "bonus", "stock", "experience"].includes(key) ? "number" : "text"} min={["baseSalary", "bonus", "stock", "experience"].includes(key) ? "0" : undefined} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-1 w-full rounded border px-3 py-2" /></label>)}<label className="text-sm font-medium">Normalized level<select value={form.normalizedLevel} onChange={(event) => setForm({ ...form, normalizedLevel: event.target.value })} className="mt-1 w-full rounded border px-3 py-2">{["Intern", "Entry", "Junior", "Mid", "Senior", "Staff", "Principal", "Manager"].map((level) => <option key={level}>{level}</option>)}</select></label><label className="text-sm font-medium">Source<select value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} className="mt-1 w-full rounded border px-3 py-2"><option value="public">Public</option><option value="internal">Internal</option><option value="partner">Partner</option><option value="estimated">Estimated</option></select></label><div className="sm:col-span-2">{message && <p className="mb-3 text-sm text-green-700">{message}</p>}{error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">{loading ? "Submitting..." : "Submit for review"}</button></div></form><section className="mt-8"><h2 className="text-xl font-semibold">Your submissions</h2><div className="mt-3 space-y-2">{contributions.length ? contributions.map((item) => <div key={item.id} className="rounded border bg-white p-4 text-sm"><div className="flex justify-between"><span className="font-medium">{item.company} · {item.role}</span><span className="font-semibold">{item.status}</span></div><p className="mt-1 text-gray-600">{item.companyLevel} → {item.normalizedLevel} · {new Date(item.submittedAt).toLocaleDateString()}</p>{item.reviewerNote && <p className="mt-1 text-gray-600">{item.reviewerNote}</p>}</div>) : <p className="text-sm text-gray-600">No submissions yet.</p>}</div></section></>;
}
