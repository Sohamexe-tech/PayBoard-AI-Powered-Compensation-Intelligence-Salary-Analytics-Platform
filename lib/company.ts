const COMPANY_ALIASES = new Map<string, string>([
    ["google llc", "Google"],
    ["google inc", "Google"],
    ["google inc.", "Google"],
    ["google", "Google"],
    ["microsoft", "Microsoft"],
    ["microsoft corporation", "Microsoft"],
    ["meta", "Meta"],
    ["meta platforms", "Meta"],
    ["amazon", "Amazon"],
    ["amazon.com", "Amazon"],
    ["apple", "Apple"],
    ["apple inc", "Apple"],
    ["netflix", "Netflix"],
    ["stripe", "Stripe"],
    ["airbnb", "Airbnb"],
]);

const STRIPPED_TOKENS = new Set([
    "inc",
    "inc.",
    "llc",
    "ltd",
    "limited",
    "corp",
    "corporation",
    "company",
    "co",
    "technologies",
    "technology",
    "systems",
    "labs",
]);

export function normalizeCompanyName(company: string): string {
    const trimmed = company.trim();
    if (!trimmed) {
        return "Unknown";
    }

    const normalizedKey = trimmed
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (COMPANY_ALIASES.has(normalizedKey)) {
        return COMPANY_ALIASES.get(normalizedKey) ?? trimmed;
    }

    const tokens = normalizedKey
        .split(" ")
        .filter((token) => !STRIPPED_TOKENS.has(token));

    const titleCase = tokens
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
        .join(" ");

    return titleCase || trimmed;
}

export function getNormalizedCompanyKey(company: string): string {
    return normalizeCompanyName(company).toLowerCase();
}

export function normalizeRoleTitle(role: string): string {
    const normalized = role.trim().replace(/\s+/g, " ");
    if (normalized.length < 2 || normalized.length > 120 || !/[a-z]/i.test(normalized)) {
        throw new Error("invalid role");
    }
    return normalized;
}

const LEVEL_ALIASES: Record<string, string> = {
    "sde ii": "SDE II",
    "software engineer ii": "SDE II",
    "senior software engineer": "Senior",
    senior: "Senior",
    staff: "Staff",
    principal: "Principal",
    manager: "Manager",
};

export function normalizeLevelName(level: string): string {
    const normalized = level.trim().replace(/\s+/g, " ");
    if (normalized.length < 1 || normalized.length > 60 || !/[a-z0-9]/i.test(normalized)) {
        throw new Error("invalid level");
    }
    const alias = LEVEL_ALIASES[normalized.toLowerCase()];
    return alias ?? normalized;
}
