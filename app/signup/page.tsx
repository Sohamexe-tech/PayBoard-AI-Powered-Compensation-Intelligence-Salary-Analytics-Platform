"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
    async function submit(event: FormEvent) {
        event.preventDefault(); setLoading(true); setError("");
        const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
        if (!response.ok) { const result = await response.json(); setError(result.error?.message ?? "Unable to sign up"); setLoading(false); return; }
        router.push("/contribute"); router.refresh();
    }
    return <main className="mx-auto max-w-md px-4 py-12"><h1 className="text-3xl font-bold">Create account</h1><form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm"><label className="block text-sm font-medium">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label><label className="block text-sm font-medium">Password<input type="password" minLength={10} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /><span className="mt-1 block text-xs text-gray-500">Use at least 10 characters.</span></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">{loading ? "Creating..." : "Create account"}</button><p className="text-sm text-gray-600">Already registered? <Link href="/login" className="text-blue-700 underline">Log in</Link></p></form></main>;
}
