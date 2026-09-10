import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeLevelName, normalizeRoleTitle } from "@/lib/company";
import { createDuplicateFingerprint } from "@/lib/db";
import { validateCompensationInput } from "@/lib/validation";

function parseLocation(location: string) {
    const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) throw new Error("location must include city and country");
    if (parts[0].length < 2 || parts[parts.length - 1].length < 2) throw new Error("invalid location");
    return { city: parts[0], state: parts.length > 2 ? parts[1] : null, country: parts[parts.length - 1] };
}

export async function ingestCompensation(rawInput: unknown) {
    const validation = validateCompensationInput(rawInput);
    if (!validation.success) throw Object.assign(new Error("invalid compensation payload"), { status: 400, details: validation.error });

    const input = validation.data;
    const location = parseLocation(input.location);
    const fingerprint = createDuplicateFingerprint({
        company: input.company,
        role: input.role,
        level: input.level,
        location: input.location,
        experience: input.experience,
        baseSalary: input.baseSalary,
        bonus: input.bonus,
        stock: input.stock,
        currency: input.currency,
    });

    try {
        return await prisma.$transaction(async (tx) => {
            const company = await tx.company.upsert({
                where: { normalizedName: input.company },
                update: {},
                create: { name: input.company, normalizedName: input.company },
            });
            const normalizedTitle = normalizeRoleTitle(input.role).toLowerCase();
            const role = await tx.role.upsert({
                where: { title_normalizedTitle: { title: input.role, normalizedTitle } },
                update: {},
                create: { title: input.role, normalizedTitle },
            });
            const normalizedLevelName = normalizeLevelName(input.level);
            const normalizedLevel = await tx.normalizedLevel.upsert({
                where: { name: normalizedLevelName },
                update: {},
                create: { name: normalizedLevelName },
            });
            const level = await tx.level.upsert({
                where: { normalizedName: input.level.toLowerCase() },
                update: { normalizedLevelId: normalizedLevel.id },
                create: { name: input.level, normalizedName: input.level.toLowerCase(), rank: 0, normalizedLevelId: normalizedLevel.id },
            });
            const locationRecord = await tx.location.upsert({
                where: { city_state_country_currency: { city: location.city, state: location.state ?? "", country: location.country, currency: input.currency } },
                update: {},
                create: { ...location, state: location.state ?? "", currency: input.currency },
            });
            const existing = await tx.compensation.findUnique({ where: { fingerprint } });
            if (existing) throw Object.assign(new Error("duplicate compensation record"), { status: 409 });
            return tx.compensation.create({
                data: {
                    companyId: company.id, roleId: role.id, levelId: level.id, locationId: locationRecord.id,
                    baseSalary: new Prisma.Decimal(input.baseSalary), bonus: new Prisma.Decimal(input.bonus),
                    stock: new Prisma.Decimal(input.stock), totalCompensation: new Prisma.Decimal(input.totalCompensation),
                    yearsExperience: input.experience, currency: input.currency, source: input.source, fingerprint,
                },
            });
        });
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
            throw Object.assign(new Error("duplicate compensation record"), { status: 409 });
        }
        throw error;
    }
}
