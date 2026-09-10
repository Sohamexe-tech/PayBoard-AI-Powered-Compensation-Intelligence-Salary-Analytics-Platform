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
