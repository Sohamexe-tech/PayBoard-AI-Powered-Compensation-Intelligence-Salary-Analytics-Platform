import { AnalyticsSummary, CompanySummary, ComparisonResult, CompensationRecord, SalaryFilters } from "@/lib/types";
import { normalizeCompanyName } from "@/lib/company";

export function applyFilters(records: CompensationRecord[], filters: SalaryFilters = {}) {
    return records.filter((record) => {
        const matchesCompany = !filters.company || record.normalizedCompany === normalizeCompanyName(filters.company);
        const matchesRole = !filters.role || record.role.toLowerCase() === filters.role.toLowerCase();
        const matchesLevel = !filters.level || record.level.toLowerCase() === filters.level.toLowerCase();
        const matchesLocation = !filters.location || record.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesMinBase = !filters.minBaseSalary || record.baseSalary >= filters.minBaseSalary;
        const matchesMaxBase = !filters.maxBaseSalary || record.baseSalary <= filters.maxBaseSalary;
        const matchesCurrency = !filters.currency || record.currency === filters.currency;

        return matchesCompany && matchesRole && matchesLevel && matchesLocation && matchesMinBase && matchesMaxBase && matchesCurrency;
    });
}

export function paginateRecords<T>(items: T[], page = 1, pageSize = 10) {
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 10);
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const start = (safePage - 1) * safePageSize;
    const end = start + safePageSize;

    return {
        items: items.slice(start, end),
        total,
        totalPages,
        page: Math.min(safePage, totalPages),
        pageSize: safePageSize,
    };
}

export function getAnalytics(records: CompensationRecord[]): AnalyticsSummary {
    const totalRecords = records.length;
    const averageBaseSalary = totalRecords ? records.reduce((sum, item) => sum + item.baseSalary, 0) / totalRecords : 0;
    const averageBonus = totalRecords ? records.reduce((sum, item) => sum + item.bonus, 0) / totalRecords : 0;
    const averageEquity = totalRecords ? records.reduce((sum, item) => sum + item.equity, 0) / totalRecords : 0;
    const averageTotalCompensation = totalRecords ? records.reduce((sum, item) => sum + item.totalCompensation, 0) / totalRecords : 0;

    const sortedSalaries = [...records].map((item) => item.baseSalary).sort((a, b) => a - b);
    const medianBaseSalary = sortedSalaries.length ? sortedSalaries[Math.floor(sortedSalaries.length / 2)] ?? 0 : 0;

    const companyCounts = new Map<string, number>();
    records.forEach((record) => {
        companyCounts.set(record.normalizedCompany, (companyCounts.get(record.normalizedCompany) ?? 0) + 1);
    });

    const topCompany = [...companyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    const uniqueRoles = new Set(records.map((record) => record.role));

    return {
        averageBaseSalary,
        averageBonus,
        averageEquity,
        averageTotalCompensation,
        medianBaseSalary,
        totalRecords,
        topCompany,
        companyCount: new Set(records.map((record) => record.normalizedCompany)).size,
        roleCount: uniqueRoles.size,
    };
}

export function getCompanySummaries(records: CompensationRecord[]): CompanySummary[] {
    const map = new Map<string, CompensationRecord[]>();

    records.forEach((record) => {
        const key = record.normalizedCompany;
        const bucket = map.get(key) ?? [];
        bucket.push(record);
        map.set(key, bucket);
    });

    return [...map.entries()]
        .map(([name, companyRecords]) => {
            const avgTotal = companyRecords.reduce((sum, record) => sum + record.totalCompensation, 0) / companyRecords.length;
            const salaryValues = companyRecords.map((record) => record.baseSalary).sort((a, b) => a - b);
            const medianBase = salaryValues[Math.floor(salaryValues.length / 2)] ?? 0;

            return {
                name,
                normalizedName: name,
                recordCount: companyRecords.length,
                averageTotalComp: avgTotal,
                medianBaseSalary: medianBase,
            };
        })
        .sort((a, b) => b.averageTotalComp - a.averageTotalComp);
}

export function compareCompanies(records: CompensationRecord[], companyA: string, companyB: string): ComparisonResult {
    const companyARecords = records.filter((record) => record.normalizedCompany === normalizeCompanyName(companyA));
    const companyBRecords = records.filter((record) => record.normalizedCompany === normalizeCompanyName(companyB));

    const avgA = companyARecords.length ? companyARecords.reduce((sum, record) => sum + record.totalCompensation, 0) / companyARecords.length : 0;
    const avgB = companyBRecords.length ? companyBRecords.reduce((sum, record) => sum + record.totalCompensation, 0) / companyBRecords.length : 0;

    const delta = Math.abs(avgA - avgB);
    const winner = avgA >= avgB ? companyA : companyB;

    return {
        companyA: normalizeCompanyName(companyA),
        companyB: normalizeCompanyName(companyB),
        companyAAvg: avgA,
        companyBAvg: avgB,
        delta,
        winner,
    };
}
