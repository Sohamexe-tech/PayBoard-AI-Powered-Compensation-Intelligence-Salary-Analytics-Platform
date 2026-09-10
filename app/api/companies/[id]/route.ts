import { NextResponse } from "next/server";
import { findCompanyById } from "@/lib/company-repository";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const company = await findCompanyById((await params).id);
        if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
        return NextResponse.json({ company });
    } catch {
        return NextResponse.json({ error: "Unable to load company" }, { status: 500 });
    }
}
