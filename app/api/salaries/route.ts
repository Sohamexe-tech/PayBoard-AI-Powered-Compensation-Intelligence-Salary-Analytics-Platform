import { NextResponse } from "next/server";
import { z } from "zod";
import { findSalaries, type SalarySort } from "@/lib/salary-repository";
import { apiError } from "@/lib/api-errors";

const querySchema = z.object({
    search: z.string().max(100).optional(),
    company: z.string().max(120).optional(),
    role: z.string().max(120).optional(),
    level: z.string().max(60).optional(),
    country: z.string().max(80).optional(),
    city: z.string().max(80).optional(),
    minTotalCompensation: z.coerce.number().finite().nonnegative().optional(),
    maxTotalCompensation: z.coerce.number().finite().nonnegative().optional(),
    sort: z.enum(["total-asc", "total-desc", "base-asc", "base-desc", "experience", "company", "level"]).default("total-desc"),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
}).refine((value) => value.minTotalCompensation === undefined || value.maxTotalCompensation === undefined || value.minTotalCompensation <= value.maxTotalCompensation, {
    message: "minimum compensation cannot exceed maximum compensation",
    path: ["minTotalCompensation"],
});

export async function GET(request: Request) {
    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return apiError("Invalid search parameters", 400, parsed.error.flatten());

    try {
        const result = await findSalaries(parsed.data as { sort: SalarySort });
        return NextResponse.json(result);
    } catch (error) {
        console.error("Salary search failed", error);
        return apiError("Unable to load salary records", 500);
    }
}
