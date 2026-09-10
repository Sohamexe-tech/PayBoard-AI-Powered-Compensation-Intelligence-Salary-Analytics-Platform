export type Currency = "USD" | "INR" | "EUR" | "GBP";
export type CompensationSource = "public" | "internal" | "partner" | "estimated";

export interface CompensationRecord {
    id: string;
    company: string;
    normalizedCompany: string;
    role: string;
    level: string;
    location: string;
    experience: number;
    baseSalary: number;
    bonus: number;
    equity: number;
    totalCompensation: number;
    currency: Currency;
    source: CompensationSource;
    createdAt: string;
}

export interface SalaryFilters {
    company?: string;
    role?: string;
    level?: string;
    location?: string;
    minBaseSalary?: number;
    maxBaseSalary?: number;
    currency?: Currency;
    page?: number;
    pageSize?: number;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface CompanySummary {
    name: string;
    normalizedName: string;
    recordCount: number;
    averageTotalComp: number;
    medianBaseSalary: number;
}

export interface AnalyticsSummary {
    averageBaseSalary: number;
    averageBonus: number;
    averageEquity: number;
    averageTotalCompensation: number;
    medianBaseSalary: number;
    totalRecords: number;
    topCompany: string;
    companyCount: number;
    roleCount: number;
}

export interface ComparisonResult {
    companyA: string;
    companyB: string;
    companyAAvg: number;
    companyBAvg: number;
    delta: number;
    winner: string;
}
