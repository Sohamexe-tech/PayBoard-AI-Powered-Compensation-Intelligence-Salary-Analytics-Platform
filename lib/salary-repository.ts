import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { SalaryFilters } from "@/lib/types";

export type SalarySort =
    | "total-asc"
    | "total-desc"
    | "base-asc"
    | "base-desc"
    | "experience"
    | "company"
    | "level";

export type SalaryQuery = SalaryFilters & {
    search?: string;
    country?: string;
    city?: string;
    minTotalCompensation?: number;
    maxTotalCompensation?: number;
    sort?: SalarySort;
};

function decimalToNumber(value: Prisma.Decimal): number {
    return Number(value.toString());
}

function buildWhere(filters: SalaryQuery): Prisma.CompensationWhereInput {
    const search = filters.search?.trim();
    const where: Prisma.CompensationWhereInput = {};
    where.status = "APPROVED";

    if (search) {
        where.OR = [
            { company: { name: { contains: search, mode: "insensitive" } } },
            { role: { title: { contains: search, mode: "insensitive" } } },
            { level: { name: { contains: search, mode: "insensitive" } } },
            { location: { city: { contains: search, mode: "insensitive" } } },
            { location: { country: { contains: search, mode: "insensitive" } } },
        ];
    }
    if (filters.company) where.company = { name: { contains: filters.company, mode: "insensitive" } };
    if (filters.role) where.role = { title: { contains: filters.role, mode: "insensitive" } };
    if (filters.level) where.level = { name: { contains: filters.level, mode: "insensitive" } };
    if (filters.country || filters.city) {
        where.location = {
            ...(filters.country ? { country: { equals: filters.country, mode: "insensitive" } } : {}),
            ...(filters.city ? { city: { contains: filters.city, mode: "insensitive" } } : {}),
        };
    }

    const totalCompensation: Prisma.DecimalFilter = {};
    if (filters.minTotalCompensation !== undefined) totalCompensation.gte = filters.minTotalCompensation;
    if (filters.maxTotalCompensation !== undefined) totalCompensation.lte = filters.maxTotalCompensation;
    if (Object.keys(totalCompensation).length) where.totalCompensation = totalCompensation;

    return where;
}

function orderBy(sort: SalarySort | undefined): Prisma.CompensationOrderByWithRelationInput {
    switch (sort) {
        case "total-asc": return { totalCompensation: "asc" };
        case "base-asc": return { baseSalary: "asc" };
        case "base-desc": return { baseSalary: "desc" };
        case "experience": return { yearsExperience: "desc" };
        case "company": return { company: { normalizedName: "asc" } };
        case "level": return { level: { rank: "asc" } };
        case "total-desc":
        default: return { totalCompensation: "desc" };
    }
}

export async function findSalaries(filters: SalaryQuery = {}) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 10));
    const where = buildWhere(filters);

    const [total, records] = await prisma.$transaction([
        prisma.compensation.count({ where }),
        prisma.compensation.findMany({
            where,
            orderBy: orderBy(filters.sort),
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { company: true, role: true, level: true, location: true },
        }),
    ]);

    return {
        records: records.map((record) => ({
            id: record.id,
            company: record.company.name,
            normalizedCompany: record.company.normalizedName,
            role: record.role.title,
            level: record.level.name,
            location: [record.location.city, record.location.state, record.location.country].filter(Boolean).join(", "),
            country: record.location.country,
            city: record.location.city,
            experience: record.yearsExperience,
            baseSalary: decimalToNumber(record.baseSalary),
            bonus: decimalToNumber(record.bonus),
            equity: decimalToNumber(record.stock),
            totalCompensation: decimalToNumber(record.totalCompensation),
            currency: record.location.currency as "USD" | "INR" | "EUR" | "GBP",
            source: record.source,
            createdAt: record.createdAt.toISOString(),
        })),
        meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    };
}
