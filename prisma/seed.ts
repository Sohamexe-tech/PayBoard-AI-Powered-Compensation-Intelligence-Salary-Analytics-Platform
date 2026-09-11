import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const normalizedLevels = [
    "Intern",
    "Entry",
    "Junior",
    "Mid",
    "Senior",
    "Staff",
    "Principal",
    "Manager",
] as const;

const companies = [
    {
        name: "Google",
        industry: "Technology",
        website: "https://google.com",
        multiplier: 1.15,
    },
    {
        name: "Microsoft",
        industry: "Technology",
        website: "https://microsoft.com",
        multiplier: 1.1,
    },
    {
        name: "Amazon",
        industry: "E-Commerce & Technology",
        website: "https://amazon.com",
        multiplier: 1.05,
    },
    {
        name: "Meta",
        industry: "Technology",
        website: "https://meta.com",
        multiplier: 1.12,
    },
    {
        name: "Apple",
        industry: "Technology",
        website: "https://apple.com",
        multiplier: 1.14,
    },
    {
        name: "Netflix",
        industry: "Entertainment & Technology",
        website: "https://netflix.com",
        multiplier: 1.2,
    },
    {
        name: "Adobe",
        industry: "Software",
        website: "https://adobe.com",
        multiplier: 1.02,
    },
    {
        name: "IBM",
        industry: "Technology",
        website: "https://ibm.com",
        multiplier: 0.95,
    },
    {
        name: "TCS",
        industry: "IT Services",
        website: "https://tcs.com",
        multiplier: 0.72,
    },
    {
        name: "Infosys",
        industry: "IT Services",
        website: "https://infosys.com",
        multiplier: 0.68,
    },
];

const roles = [
    {
        title: "Software Engineer",
        normalizedTitle: "software engineer",
        department: "Engineering",
        base: 110000,
    },
    {
        title: "Backend Developer",
        normalizedTitle: "backend developer",
        department: "Engineering",
        base: 108000,
    },
    {
        title: "Frontend Developer",
        normalizedTitle: "frontend developer",
        department: "Engineering",
        base: 102000,
    },
    {
        title: "Data Scientist",
        normalizedTitle: "data scientist",
        department: "Data",
        base: 115000,
    },
    {
        title: "Machine Learning Engineer",
        normalizedTitle: "machine learning engineer",
        department: "AI",
        base: 120000,
    },
    {
        title: "DevOps Engineer",
        normalizedTitle: "devops engineer",
        department: "Infrastructure",
        base: 112000,
    },
    {
        title: "Product Manager",
        normalizedTitle: "product manager",
        department: "Product",
        base: 125000,
    },
    {
        title: "Data Engineer",
        normalizedTitle: "data engineer",
        department: "Data",
        base: 110000,
    },
];

const locations = [
    {
        city: "Mountain View",
        state: "California",
        country: "United States",
        currency: "USD",
    },
    {
        city: "Seattle",
        state: "Washington",
        country: "United States",
        currency: "USD",
    },
    {
        city: "New York",
        state: "New York",
        country: "United States",
        currency: "USD",
    },
    {
        city: "Austin",
        state: "Texas",
        country: "United States",
        currency: "USD",
    },
    {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        currency: "USD",
    },
    {
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        currency: "USD",
    },
    {
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        currency: "USD",
    },
    {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        currency: "USD",
    },
];

const levelBase = {
    Intern: 0.35,
    Entry: 0.55,
    Junior: 0.7,
    Mid: 0.85,
    Senior: 1,
    Staff: 1.25,
    Principal: 1.5,
    Manager: 1.35,
};

const levelRank = {
    Intern: 1,
    Entry: 2,
    Junior: 3,
    Mid: 4,
    Senior: 5,
    Staff: 6,
    Principal: 7,
    Manager: 8,
};

function normalize(value: string) {
    return value.toLowerCase().trim();
}

function fingerprint(
    company: string,
    role: string,
    level: string,
    city: string
) {
    return `demo-${normalize(company)}-${normalize(role)}-${normalize(
        level
    )}-${normalize(city)}`;
}

async function main() {
    console.log("Starting database seed...");

    const normalizedLevelMap = new Map<string, string>();

    for (const name of normalizedLevels) {
        const level = await prisma.normalizedLevel.upsert({
            where: { name },
            update: {},
            create: {
                name,
                description: `${name} career level`,
            },
        });

        normalizedLevelMap.set(name, level.id);
    }

    const levelMap = new Map<string, string>();

    for (const name of normalizedLevels) {
        const level = await prisma.level.upsert({
            where: {
                normalizedName: normalize(name),
            },
            update: {
                name,
                rank: levelRank[name],
                normalizedLevelId: normalizedLevelMap.get(name),
            },
            create: {
                name,
                normalizedName: normalize(name),
                rank: levelRank[name],
                normalizedLevelId: normalizedLevelMap.get(name),
            },
        });

        levelMap.set(name, level.id);
    }

    const companyMap = new Map<string, string>();

    for (const company of companies) {
        const record = await prisma.company.upsert({
            where: {
                normalizedName: normalize(company.name),
            },
            update: {
                name: company.name,
                industry: company.industry,
                website: company.website,
            },
            create: {
                name: company.name,
                normalizedName: normalize(company.name),
                industry: company.industry,
                website: company.website,
            },
        });

        companyMap.set(company.name, record.id);
    }

    const roleMap = new Map<string, string>();

    for (const role of roles) {
        const record = await prisma.role.upsert({
            where: {
                title_normalizedTitle: {
                    title: role.title,
                    normalizedTitle: role.normalizedTitle,
                },
            },
            update: {
                department: role.department,
            },
            create: {
                title: role.title,
                normalizedTitle: role.normalizedTitle,
                department: role.department,
            },
        });

        roleMap.set(role.title, record.id);
    }

    const locationMap = new Map<string, string>();

    for (const location of locations) {
        const record = await prisma.location.upsert({
            where: {
                city_state_country_currency: {
                    city: location.city,
                    state: location.state,
                    country: location.country,
                    currency: location.currency,
                },
            },
            update: {},
            create: location,
        });

        locationMap.set(location.city, record.id);
    }

    let compensationCount = 0;

    for (const company of companies) {
        for (const level of normalizedLevels) {
            for (const role of roles) {
                const location =
                    locations[roles.indexOf(role) % locations.length];

                const companyId = companyMap.get(company.name);
                const roleId = roleMap.get(role.title);
                const levelId = levelMap.get(level);
                const locationId = locationMap.get(location.city);

                if (!companyId || !roleId || !levelId || !locationId) {
                    continue;
                }

                const levelMultiplier = levelBase[level];

                const baseSalary = Math.round(
                    role.base *
                    company.multiplier *
                    levelMultiplier *
                    (location.country === "India" ? 0.55 : 1)
                );

                const bonus = Math.round(baseSalary * 0.12);
                const stock = Math.round(baseSalary * 0.2);
                const totalCompensation = baseSalary + bonus + stock;

                const yearsExperience =
                    level === "Intern"
                        ? 0
                        : level === "Entry"
                            ? 1
                            : level === "Junior"
                                ? 2
                                : level === "Mid"
                                    ? 4
                                    : level === "Senior"
                                        ? 6
                                        : level === "Staff"
                                            ? 9
                                            : level === "Principal"
                                                ? 12
                                                : 10;

                await prisma.compensation.upsert({
                    where: {
                        fingerprint: fingerprint(
                            company.name,
                            role.title,
                            level,
                            location.city
                        ),
                    },
                    update: {
                        baseSalary,
                        bonus,
                        stock,
                        totalCompensation,
                        yearsExperience,
                        status: "APPROVED",
                        source: "public",
                    },
                    create: {
                        companyId,
                        roleId,
                        levelId,
                        locationId,
                        baseSalary,
                        bonus,
                        stock,
                        totalCompensation,
                        yearsExperience,
                        currency: "USD",
                        source: "public",
                        status: "APPROVED",
                        fingerprint: fingerprint(
                            company.name,
                            role.title,
                            level,
                            location.city
                        ),
                    },
                });

                compensationCount++;
            }
        }
    }

    console.log(`Seed completed successfully.`);
    console.log(`Companies: ${companies.length}`);
    console.log(`Roles: ${roles.length}`);
    console.log(`Levels: ${normalizedLevels.length}`);
    console.log(`Locations: ${locations.length}`);
    console.log(`Compensation records: ${compensationCount}`);
}

main()
    .catch((error) => {
        console.error("Database seed failed", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });