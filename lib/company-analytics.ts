export type CompanyRecordForAnalytics = {
    totalCompensation: number;
    baseSalary: number;
    bonus: number;
    stock: number;
    role: string;
    level: string;
    location: string;
    city: string;
    country: string;
};

export type CompanyIntelligence = {
    recordCount: number;
    sampleLabel: string;
    medianTotalCompensation: number | null;
    averageTotalCompensation: number | null;
    highestTotalCompensation: number | null;
    lowestTotalCompensation: number | null;
    medianBaseSalary: number | null;
    averageBaseSalary: number | null;
    averageBonus: number | null;
    averageStock: number | null;
    commonRoles: Array<{ name: string; count: number }>;
    commonLevels: Array<{ name: string; count: number }>;
    locations: Array<{ name: string; count: number }>;
    distribution: Array<{ bucket: string; count: number }>;
    percentiles: { p25: number; p50: number; p75: number } | null;
};

function percentile(values: number[], percentileValue: number): number {
    const index = (values.length - 1) * percentileValue;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return values[lower] + (values[upper] - values[lower]) * weight;
}

function counts(values: string[]) {
    const grouped = new Map<string, number>();
    values.forEach((value) => grouped.set(value, (grouped.get(value) ?? 0) + 1));
    return [...grouped.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, 5);
}

export function getCompanyIntelligence(records: CompanyRecordForAnalytics[]): CompanyIntelligence {
    const count = records.length;
    const totals = records.map((record) => record.totalCompensation).sort((a, b) => a - b);
    const enoughForPercentiles = totals.length >= 5;
    const average = (key: keyof Pick<CompanyRecordForAnalytics, "totalCompensation" | "baseSalary" | "bonus" | "stock">) =>
        count ? records.reduce((sum, record) => sum + record[key], 0) / count : null;

    return {
        recordCount: count,
        sampleLabel: count === 0 ? "No compensation records" : `${count} compensation record${count === 1 ? "" : "s"}`,
        medianTotalCompensation: count ? percentile(totals, 0.5) : null,
        averageTotalCompensation: average("totalCompensation"),
        highestTotalCompensation: count ? totals[totals.length - 1] : null,
        lowestTotalCompensation: count ? totals[0] : null,
        medianBaseSalary: count ? percentile(records.map((record) => record.baseSalary).sort((a, b) => a - b), 0.5) : null,
        averageBaseSalary: average("baseSalary"),
        averageBonus: average("bonus"),
        averageStock: average("stock"),
        commonRoles: counts(records.map((record) => record.role)),
        commonLevels: counts(records.map((record) => record.level)),
        locations: counts(records.map((record) => record.location)),
        distribution: [
            { bucket: "<$150k", count: totals.filter((value) => value < 150000).length },
            { bucket: "$150k-$200k", count: totals.filter((value) => value >= 150000 && value < 200000).length },
            { bucket: "$200k-$250k", count: totals.filter((value) => value >= 200000 && value < 250000).length },
            { bucket: "$250k+", count: totals.filter((value) => value >= 250000).length },
        ],
        percentiles: enoughForPercentiles ? { p25: percentile(totals, 0.25), p50: percentile(totals, 0.5), p75: percentile(totals, 0.75) } : null,
    };
}
