import { prisma } from "@/lib/prisma";
import { compareRecords, type ComparisonRow } from "@/lib/comparison";

export type ComparisonQuery = {
    companies: string[];
    role?: string;
    normalizedLevel: string;
    location?: string;
};

export async function findComparison(query: ComparisonQuery): Promise<{ rows: ComparisonRow[]; normalizedLevel: string; warning: string | null }> {
    const records = await prisma.compensation.findMany({
        where: {
            status: "APPROVED",
            company: { normalizedName: { in: query.companies } },
            level: { normalizedLevel: { name: query.normalizedLevel } },
            ...(query.role ? { role: { normalizedTitle: { contains: query.role.toLowerCase() } } } : {}),
            ...(query.location ? {
                location: {
                    OR: [
                        { city: { contains: query.location, mode: "insensitive" } },
                        { country: { contains: query.location, mode: "insensitive" } },
                    ],
                },
            } : {}),
        },
        include: { company: true, level: { include: { normalizedLevel: true } } },
    });

    const mapped = records.map((record) => ({
        company: record.company.normalizedName,
        companyLevel: record.level.name,
        normalizedLevel: record.level.normalizedLevel?.name ?? query.normalizedLevel,
        base: Number(record.baseSalary.toString()),
        bonus: Number(record.bonus.toString()),
        stock: Number(record.stock.toString()),
        total: Number(record.totalCompensation.toString()),
    }));
    const rows = compareRecords(mapped, query.companies);
    const warning = rows.some((row) => row.sampleSize < 3)
        ? "Some companies have fewer than 3 matching records; comparisons may be unstable."
        : null;

    return { rows, normalizedLevel: query.normalizedLevel, warning };
}
