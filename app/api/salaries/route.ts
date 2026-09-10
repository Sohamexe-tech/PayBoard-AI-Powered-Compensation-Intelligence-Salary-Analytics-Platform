import { NextResponse } from "next/server";
import { z } from "zod";
import { findSalaries, type SalarySort } from "@/lib/salary-repository";

const querySchema = z.object({
    search: z.string().optional(),
    company: z.string().optional(),
    role: z.string().optional(),
    level: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    minTotalCompensation: z.coerce.number().finite().nonnegative().optional(),
    maxTotalCompensation: z.coerce.number().finite().nonnegative().optional(),
    sort: z.enum(["total-asc", "total-desc", "base-asc", "base-desc", "experience", "company", "level"]).default("total-desc"),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export async function GET(request: Request) {
    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return NextResponse.json({ error: "Invalid search parameters", details: parsed.error.flatten() }, { status: 400 });

    try {
        const result = await findSalaries(parsed.data as { sort: SalarySort });
        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: "Unable to load salary records" }, { status: 500 });
    }
}
