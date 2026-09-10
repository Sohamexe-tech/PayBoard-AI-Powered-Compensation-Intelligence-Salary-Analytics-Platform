import { prisma } from "@/lib/prisma";
import { getCompanyIntelligence, type CompanyRecordForAnalytics } from "@/lib/company-analytics";

const companyInclude = {
    compensations: {
        where: { status: "APPROVED" },
        include: { role: true, level: true, location: true },
    },
} as const;

function mapRecords(records: Array<{
    totalCompensation: { toString(): string };
    baseSalary: { toString(): string };
    bonus: { toString(): string };
    stock: { toString(): string };
    role: { title: string };
    level: { name: string };
    location: { city: string; state: string | null; country: string };
}>): CompanyRecordForAnalytics[] {
    return records.map((record) => ({
        totalCompensation: Number(record.totalCompensation.toString()),
        baseSalary: Number(record.baseSalary.toString()),
        bonus: Number(record.bonus.toString()),
        stock: Number(record.stock.toString()),
        role: record.role.title,
        level: record.level.name,
        location: [record.location.city, record.location.state, record.location.country].filter(Boolean).join(", "),
        city: record.location.city,
        country: record.location.country,
    }));
}

export async function findCompanies(search?: string) {
    const companies = await prisma.company.findMany({
        where: search ? { name: { contains: search.trim(), mode: "insensitive" } } : undefined,
        orderBy: { normalizedName: "asc" },
        include: companyInclude,
    });

    return companies.map((company) => ({
        id: company.id,
        name: company.name,
        normalizedName: company.normalizedName,
        industry: company.industry,
        website: company.website,
        intelligence: getCompanyIntelligence(mapRecords(company.compensations)),
    }));
}

export async function findCompanyById(id: string) {
    const company = await prisma.company.findUnique({ where: { id }, include: companyInclude });
    if (!company) return null;

    return {
        id: company.id,
        name: company.name,
        normalizedName: company.normalizedName,
        industry: company.industry,
        website: company.website,
        intelligence: getCompanyIntelligence(mapRecords(company.compensations)),
    };
}
