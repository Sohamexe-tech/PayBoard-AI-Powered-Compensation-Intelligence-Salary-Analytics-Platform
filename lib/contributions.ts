import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeCompanyName, normalizeRoleTitle } from "@/lib/company";
import { createDuplicateFingerprint } from "@/lib/db";
import { validateCompensationInput } from "@/lib/validation";
import { z } from "zod";

const normalizedLevelSchema = z.enum(["Intern", "Entry", "Junior", "Mid", "Senior", "Staff", "Principal", "Manager"]);

export async function createContribution(userId: string, rawInput: unknown) {
    const validation = validateCompensationInput(rawInput);
    if (!validation.success) throw Object.assign(new Error("invalid contribution"), { status: 400, details: validation.error });
    const input = validation.data;
    const normalizedLevelResult = normalizedLevelSchema.safeParse((rawInput as { normalizedLevel?: unknown })?.normalizedLevel);
    if (!normalizedLevelResult.success) throw Object.assign(new Error("invalid normalized level"), { status: 400, details: normalizedLevelResult.error.flatten() });
    const normalizedCompany = normalizeCompanyName(input.company);
    const normalizedRole = normalizeRoleTitle(input.role);
    const normalizedLevel = normalizedLevelResult.data;
    const fingerprint = createDuplicateFingerprint({ company: normalizedCompany, role: normalizedRole, level: input.level, location: input.location, experience: input.experience, baseSalary: input.baseSalary, bonus: input.bonus, stock: input.stock, currency: input.currency });
    const duplicate = await prisma.contribution.findUnique({ where: { fingerprint } }) ?? await prisma.compensation.findUnique({ where: { fingerprint } });
    if (duplicate) throw Object.assign(new Error("duplicate contribution"), { status: 409 });
    return prisma.contribution.create({
        data: {
            userId, company: normalizedCompany, normalizedCompany, role: normalizedRole, normalizedRole: normalizedRole.toLowerCase(),
            companyLevel: input.level, normalizedLevel, location: input.location,
            baseSalary: new Prisma.Decimal(input.baseSalary), bonus: new Prisma.Decimal(input.bonus), stock: new Prisma.Decimal(input.stock),
            totalCompensation: new Prisma.Decimal(input.totalCompensation), yearsExperience: input.experience,
            currency: input.currency, source: input.source, fingerprint,
        },
        select: { id: true, status: true, submittedAt: true },
    });
}

export async function getUserContributions(userId: string) {
    return prisma.contribution.findMany({
        where: { userId },
        orderBy: { submittedAt: "desc" },
        select: { id: true, company: true, role: true, companyLevel: true, normalizedLevel: true, status: true, submittedAt: true, reviewerNote: true },
    });
}
