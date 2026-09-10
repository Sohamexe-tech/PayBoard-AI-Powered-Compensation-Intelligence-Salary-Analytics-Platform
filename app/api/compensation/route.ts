import { NextResponse } from "next/server";
import { applyFilters, paginateRecords } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";
import { validateCompensationInput } from "@/lib/validation";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filters = {
        company: searchParams.get("company") ?? undefined,
        role: searchParams.get("role") ?? undefined,
        level: searchParams.get("level") ?? undefined,
        location: searchParams.get("location") ?? undefined,
        minBaseSalary: searchParams.get("minBaseSalary") ? Number(searchParams.get("minBaseSalary")) : undefined,
        maxBaseSalary: searchParams.get("maxBaseSalary") ? Number(searchParams.get("maxBaseSalary")) : undefined,
        currency: searchParams.get("currency") ?? undefined,
        page: Number(searchParams.get("page") ?? "1"),
        pageSize: Number(searchParams.get("pageSize") ?? "10"),
    };

    const filtered = applyFilters(salaryRecords, filters);
    const paginated = paginateRecords(filtered, filters.page, filters.pageSize);

    return NextResponse.json({
        records: paginated.items,
        meta: {
            page: paginated.page,
            pageSize: paginated.pageSize,
            total: paginated.total,
            totalPages: paginated.totalPages,
        },
    });
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const validation = validateCompensationInput(payload);

        if (!validation.success) {
            return NextResponse.json(
                { error: "invalid compensation payload", details: validation.error },
                { status: 400 },
            );
        }

        const record = {
            ...validation.data,
            id: crypto.randomUUID(),
            normalizedCompany: payload.company,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ record }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "invalid json payload" }, { status: 400 });
    }
}
