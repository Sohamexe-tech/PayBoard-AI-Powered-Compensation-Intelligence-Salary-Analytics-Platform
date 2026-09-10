export type ComparisonRecord = {
    company: string;
    companyLevel: string;
    normalizedLevel: string;
    base: number;
    bonus: number;
    stock: number;
    total: number;
};

export type ComparisonRow = {
    company: string;
    companyLevel: string;
    normalizedLevel: string;
    medianBase: number | null;
    medianBonus: number | null;
    medianStock: number | null;
    medianTotal: number | null;
    sampleSize: number;
};

function median(values: number[]): number | null {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function compareRecords(records: ComparisonRecord[], companies: string[]): ComparisonRow[] {
    return companies.map((company) => {
        const matching = records.filter((record) => record.company === company);
        return {
            company,
            companyLevel: matching[0]?.companyLevel ?? "Not available",
            normalizedLevel: matching[0]?.normalizedLevel ?? "Not available",
            medianBase: median(matching.map((record) => record.base)),
            medianBonus: median(matching.map((record) => record.bonus)),
            medianStock: median(matching.map((record) => record.stock)),
            medianTotal: median(matching.map((record) => record.total)),
            sampleSize: matching.length,
        };
    });
}

export function percentageDifference(value: number | null, baseline: number | null): number | null {
    if (value === null || baseline === null || baseline === 0) return null;
    return ((value - baseline) / baseline) * 100;
}
