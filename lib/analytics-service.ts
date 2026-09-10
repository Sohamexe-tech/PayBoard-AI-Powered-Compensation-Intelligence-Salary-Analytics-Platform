import { prisma } from "@/lib/prisma";

type AnalyticsRecord = {
    total: number;
    base: number;
    bonus: number;
    stock: number;
    experience: number;
    company: string;
    role: string;
    level: string;
    location: string;
    normalizedLevel: string;
};

export type AnalyticsDashboard = {
    sampleSize: number;
    currency: string;
    summary: {
        averageBase: number | null;
        averageBonus: number | null;
        averageStock: number | null;
        averageTotal: number | null;
        medianTotal: number | null;
    };
    distribution: Array<{ bucket: string; count: number }>;
    medianByCompany: Array<{ name: string; median: number; sampleSize: number }>;
    medianByLevel: Array<{ name: string; median: number; sampleSize: number }>;
    composition: Array<{ component: string; average: number; sampleSize: number }>;
    locationComparison: Array<{ name: string; median: number; sampleSize: number }>;
    roleComparison: Array<{ name: string; median: number; sampleSize: number }>;
    experience: Array<{ years: number; median: number; sampleSize: number }>;
};

function median(values: number[]): number | null {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function average(values: number[]): number | null {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function groupedMedian(records: AnalyticsRecord[], key: keyof AnalyticsRecord) {
    const groups = new Map<string, number[]>();
    records.forEach((record) => {
        const name = String(record[key]);
        groups.set(name, [...(groups.get(name) ?? []), record.total]);
    });
    return [...groups.entries()]
        .map(([name, values]) => ({ name, median: median(values) ?? 0, sampleSize: values.length }))
        .sort((a, b) => b.median - a.median);
}

export function calculateAnalyticsDashboard(records: AnalyticsRecord[], currency = "USD"): AnalyticsDashboard {
    const totals = records.map((record) => record.total);
    return {
        sampleSize: records.length,
        currency,
        summary: {
            averageBase: average(records.map((record) => record.base)),
            averageBonus: average(records.map((record) => record.bonus)),
            averageStock: average(records.map((record) => record.stock)),
            averageTotal: average(totals),
            medianTotal: median(totals),
        },
        distribution: [
            { bucket: "<$150k", count: totals.filter((value) => value < 150000).length },
            { bucket: "$150k-$200k", count: totals.filter((value) => value >= 150000 && value < 200000).length },
            { bucket: "$200k-$250k", count: totals.filter((value) => value >= 200000 && value < 250000).length },
            { bucket: "$250k+", count: totals.filter((value) => value >= 250000).length },
        ],
        medianByCompany: groupedMedian(records, "company"),
        medianByLevel: groupedMedian(records, "normalizedLevel"),
        composition: [
            { component: "Base", average: average(records.map((record) => record.base)) ?? 0, sampleSize: records.filter((record) => record.base >= 0).length },
            { component: "Bonus", average: average(records.map((record) => record.bonus)) ?? 0, sampleSize: records.filter((record) => record.bonus >= 0).length },
            { component: "Stock", average: average(records.map((record) => record.stock)) ?? 0, sampleSize: records.filter((record) => record.stock >= 0).length },
        ],
        locationComparison: groupedMedian(records, "location"),
        roleComparison: groupedMedian(records, "role"),
        experience: [...new Map(records.map((record) => [record.experience, records.filter((item) => item.experience === record.experience)])).entries()]
            .map(([years, items]) => ({ years, median: median(items.map((item) => item.total)) ?? 0, sampleSize: items.length }))
            .sort((a, b) => a.years - b.years),
    };
}

export async function getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
    const records = await prisma.compensation.findMany({
        select: {
            totalCompensation: true,
            baseSalary: true,
            bonus: true,
            stock: true,
            yearsExperience: true,
            company: { select: { normalizedName: true } },
            role: { select: { title: true } },
            level: { select: { name: true, normalizedLevel: { select: { name: true } } } },
            location: { select: { city: true, state: true, country: true, currency: true } },
        },
    });

    const currency = records[0]?.location.currency ?? "USD";
    return calculateAnalyticsDashboard(records.map((record) => ({
        total: Number(record.totalCompensation.toString()),
        base: Number(record.baseSalary.toString()),
        bonus: Number(record.bonus.toString()),
        stock: Number(record.stock.toString()),
        experience: record.yearsExperience,
        company: record.company.normalizedName,
        role: record.role.title,
        level: record.level.name,
        normalizedLevel: record.level.normalizedLevel?.name ?? "Unmapped",
        location: [record.location.city, record.location.state, record.location.country].filter(Boolean).join(", "),
    })), currency);
}
