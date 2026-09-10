import { NextResponse } from "next/server";
import { findCompanies } from "@/lib/company-repository";

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams.get("search") ?? undefined;
    try {
        return NextResponse.json({ companies: await findCompanies(search) });
    } catch {
        return NextResponse.json({ error: "Unable to load companies" }, { status: 500 });
    }
}
