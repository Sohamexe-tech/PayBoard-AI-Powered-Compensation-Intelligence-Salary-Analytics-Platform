import { createHash } from "node:crypto";
import { normalizeCompanyName } from "@/lib/company";

export type DuplicateFingerprintInput = {
    company: string;
    role: string;
    level: string;
    location: string;
    experience: number;
    baseSalary: number | string;
    bonus?: number | string;
    stock?: number | string;
    equity?: number | string;
    currency: string;
};

function normalizeText(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function toSafeNumber(value: number | string | undefined): number {
    const numeric = Number(value ?? 0);
    if (!Number.isFinite(numeric)) {
        return 0;
    }
    return numeric;
}

export function createDuplicateFingerprint(input: DuplicateFingerprintInput): string {
    const company = normalizeCompanyName(input.company);
    const role = normalizeText(input.role);
    const level = normalizeText(input.level);
    const location = normalizeText(input.location);
    const resolvedStock = toSafeNumber(input.stock ?? input.equity ?? 0);
    const resolvedBonus = toSafeNumber(input.bonus ?? 0);
    const payload = [
        company,
        role,
        level,
        location,
        String(Number(input.experience) || 0),
        String(Math.round(Number(input.baseSalary) || 0)),
        String(Math.round(resolvedBonus)),
        String(Math.round(resolvedStock)),
        String(input.currency || "USD").toUpperCase(),
    ].join("|");

    return createHash("sha256").update(payload).digest("hex");
}

export function normalizeCompensationInput(input: DuplicateFingerprintInput) {
    const baseSalary = Math.max(0, Number(input.baseSalary) || 0);
    const bonus = Math.max(0, toSafeNumber(input.bonus));
    const stock = Math.max(0, toSafeNumber(input.stock ?? input.equity));

    if (!input.company || !input.role || !input.level || !input.location || baseSalary <= 0) {
        throw new Error("invalid compensation payload");
    }

    return {
        company: normalizeCompanyName(input.company),
        role: input.role.trim(),
        level: input.level.trim(),
        location: input.location.trim(),
        baseSalary,
        bonus,
        stock,
        totalCompensation: baseSalary + bonus + stock,
        fingerprint: createDuplicateFingerprint(input),
    };
}
