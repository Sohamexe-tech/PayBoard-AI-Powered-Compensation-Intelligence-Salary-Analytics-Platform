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
    { name: "Google", industry: "Technology", website: "https://google.com" },
    { name: "Microsoft", industry: "Technology", website: "https://microsoft.com" },
    { name: "Amazon", industry: "E-Commerce", website: "https://amazon.com" },
    { name: "Meta", industry: "Technology", website: "https://meta.com" },
    { name: "Apple", industry: "Technology", website: "https://apple.com" },
    { name: "Netflix", industry: "Entertainment", website: "https://netflix.com" },
    { name: "Adobe", industry: "Software", website: "https://adobe.com" },
    { name: "IBM", industry: "Technology", website: "https://ibm.com" },
    { name: "TCS", industry: "IT Services", website: "https://tcs.com" },
    { name: "Infosys", industry: "IT Services", website: "https://infosys.com" },
];

const roles = [
    { title: "Software Engineer", department: "Engineering" },
    { title: "Backend Developer", department: "Engineering" },
    { title: "Frontend Developer", department: "Engineering" },
    { title: "Data Scientist", department: "Data Science" },
    { title: "Machine Learning Engineer", department: "Artificial Intelligence" },
    { title: "DevOps Engineer", department: "Infrastructure" },
    { title: "Product Manager", department: "Product" },
    { title: "Data Engineer", department: "Data Engineering" },
];

const locations = [
    { city: "Mountain View", state: "California", country: "United States", currency: "USD" },
    { city: "Redmond", state: "Washington", country: "United States", currency: "USD" },
    { city: "Seattle", state: "Washington", country: "United States", currency: "USD" },
    { city: "Menlo Park", state: "California", country: "United States", currency: "USD" },
    { city: "Cupertino", state: "California", country: "United States", currency: "USD" },
    { city: "New York", state: "New York", country: "United States", currency: "USD" },
    { city: "Austin", state: "Texas", country: "United States", currency: "USD" },
    { city: "Mumbai", state: "Maharashtra", country: "India", currency: "USD" },
    { city: "Bengaluru", state: "Karnataka", country: "India", currency: "USD" },
    { city: "Pune", state: "Maharashtra", country: "India", currency: "USD" },
];

const levelRank: Record<string, number> = {
    Intern: 1,
    Entry: 2,
    Junior: 3,
    Mid: 4,
    Senior: 5,
    Staff: 6,
    Principal: 7,
    Manager: 8,
};

const compensationData = [
    ["Google", "Software Engineer", "Senior", "Mountain View", 185000, 25000, 45000, 255000, 7],
    ["Google", "Software Engineer", "Staff", "Mountain View", 220000, 35000, 75000, 330000, 11],
    ["Google", "Data Scientist", "Senior", "Mountain View", 175000, 22000, 40000, 237000, 6],
    ["Google", "Machine Learning Engineer", "Senior", "Mountain View", 190000, 28000, 50000, 268000, 7],
    ["Google", "Product Manager", "Manager", "Mountain View", 200000, 30000, 60000, 290000, 9],

    ["Microsoft", "Software Engineer", "Senior", "Redmond", 175000, 20000, 35000, 230000, 7],
    ["Microsoft", "Software Engineer", "Staff", "Redmond", 205000, 28000, 55000, 288000, 10],
    ["Microsoft", "Backend Developer", "Senior", "Redmond", 170000, 19000, 32000, 221000, 6],
    ["Microsoft", "Data Scientist", "Senior", "Redmond", 165000, 20000, 30000, 215000, 6],
    ["Microsoft", "Product Manager", "Manager", "Redmond", 190000, 25000, 45000, 260000, 9],

    ["Amazon", "Software Engineer", "Senior", "Seattle", 170000, 25000, 30000, 225000, 7],
    ["Amazon", "Backend Developer", "Senior", "Seattle", 165000, 22000, 28000, 215000, 6],
    ["Amazon", "Data Engineer", "Mid", "Seattle", 140000, 15000, 18000, 173000, 4],
    ["Amazon", "Machine Learning Engineer", "Senior", "Seattle", 180000, 25000, 35000, 240000, 7],
    ["Amazon", "Product Manager", "Manager", "Seattle", 185000, 25000, 40000, 250000, 9],

    ["Meta", "Software Engineer", "Senior", "Menlo Park", 190000, 30000, 55000, 275000, 7],
    ["Meta", "Software Engineer", "Staff", "Menlo Park", 230000, 40000, 85000, 355000, 12],
    ["Meta", "Frontend Developer", "Senior", "Menlo Park", 180000, 25000, 45000, 250000, 7],
    ["Meta", "Data Scientist", "Senior", "Menlo Park", 185000, 25000, 45000, 255000, 7],
    ["Meta", "Product Manager", "Manager", "Menlo Park", 205000, 30000, 60000, 295000, 10],

    ["Apple", "Software Engineer", "Senior", "Cupertino", 180000, 22000, 40000, 242000, 7],
    ["Apple", "Backend Developer", "Senior", "Cupertino", 175000, 20000, 35000, 230000, 6],
    ["Apple", "Frontend Developer", "Mid", "Cupertino", 145000, 15000, 20000, 180000, 4],
    ["Apple", "Data Scientist", "Senior", "Cupertino", 170000, 22000, 35000, 227000, 7],

    ["Netflix", "Software Engineer", "Senior", "Los Gatos", 200000, 30000, 50000, 280000, 8],
    ["Netflix", "Backend Developer", "Senior", "Los Gatos", 195000, 28000, 45000, 268000, 7],
    ["Netflix", "Data Scientist", "Senior", "Los Gatos", 185000, 25000, 40000, 250000, 7],

    ["Adobe", "Software Engineer", "Senior", "San Jose", 165000, 18000, 30000, 213000, 7],
    ["Adobe", "Frontend Developer", "Mid", "San Jose", 140000, 15000, 20000, 175000, 4],
    ["Adobe", "Data Scientist", "Senior", "San Jose", 160000, 18000, 28000, 206000, 6],

    ["IBM", "Software Engineer", "Mid", "New York", 130000, 12000, 10000, 152000, 4],
    ["IBM", "Backend Developer", "Senior", "New York", 150000, 15000, 15000, 180000, 7],
    ["IBM", "Data Scientist", "Senior", "New York", 145000, 15000, 18000, 178000, 6],

    ["TCS", "Software Engineer", "Entry", "Mumbai", 18000, 2000, 0, 20000, 1],
    ["TCS", "Software Engineer", "Mid", "Mumbai", 28000, 3000, 2000, 33000, 4],
    ["TCS", "Backend Developer", "Senior", "Mumbai", 40000, 5000, 3000, 48000, 7],
    ["TCS", "Data Engineer", "Mid", "Pune", 30000, 4000, 2000, 36000, 4],
    ["TCS", "Data Scientist", "Senior", "Bengaluru", 45000, 6000, 4000, 55000, 7],

    ["Infosys", "Software Engineer", "Entry", "Bengaluru", 17000, 2000, 0, 19000, 1],
    ["Infosys", "Software Engineer", "Mid", "Bengaluru", 27000, 3000, 1500, 31500, 4],
    ["Infosys", "Backend Developer", "Senior", "Bengaluru", 38000, 5000, 2500, 45500, 7],
    ["Infosys", "Data Scientist", "Senior", "Bengaluru", 42000, 5000, 3000, 50000, 6],
    ["Infosys", "Frontend Developer", "Mid", "Pune", 26000, 3000, 1500, 30500, 4],
];

async function main() {
    for (const name of normalizedLevels) {
        await prisma.normalizedLevel.upsert({
            where: { name },
            update: {},
            create: {
                name,
                description: `${name} career level`,
            },
        });
    }

    const levelIds = new Map<string, string>();

    for (const name of normalizedLevels) {
        const normalizedLevel = await prisma.normalizedLevel.findUnique({
            where: { name },
        });

        if (!normalizedLevel) {
            throw new Error(`Normalized level not found: ${name}`);
        }

        const level = await prisma.level.upsert({
            where: { normalizedName: name.toLowerCase() },
            update: {
                name,
                rank: levelRank[name],
                normalizedLevelId: normalizedLevel.id,
            },
            create: {
                name,
                normalizedName: name.toLowerCase(),
                rank: levelRank[name],
                normalizedLevelId: normalizedLevel.id,
            },
        });

        levelIds.set(name, level.id);
    }

    const companyIds = new Map<string, string>();

    for (const company of companies) {
        const created = await prisma.company.upsert({
            where: {
                normalizedName: company.name.toLowerCase(),
            },
            update: {
                industry: company.industry,
                website: company.website,
            },
            create: {
                name: company.name,
                normalizedName: company.name.toLowerCase(),
                industry: company.industry,
                website: company.website,
            },
        });

        companyIds.set(company.name, created.id);
    }

    const roleIds = new Map<string, string>();

    for (const role of roles) {
        const normalizedTitle = role.title.toLowerCase();

        const created = await prisma.role.upsert({
            where: {
                title_normalizedTitle: {
                    title: role.title,
                    normalizedTitle,
                },
            },
            update: {
                department: role.department,
            },
            create: {
                title: role.title,
                normalizedTitle,
                department: role.department,
            },
        });

        roleIds.set(role.title, created.id);
    }

    const locationIds = new Map<string, string>();

    for (const location of locations) {
        const key = `${location.city}-${location.state}-${location.country}`;

        const created = await prisma.location.upsert({
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

        locationIds.set(key, created.id);
    }

    for (let i = 0; i < compensationData.length; i++) {
        const [
            companyName,
            roleName,
            levelName,
            city,
            baseSalary,
            bonus,
            stock,
            totalCompensation,
            yearsExperience,
        ] = compensationData[i];

        const companyId = companyIds.get(companyName as string);
        const roleId = roleIds.get(roleName as string);
        const levelId = levelIds.get(levelName as string);

        const location = locations.find(
            (item) => item.city === city
        );

        if (!companyId || !roleId || !levelId || !location) {
            throw new Error(`Invalid compensation data at row ${i + 1}`);
        }

        const locationKey = `${location.city}-${location.state}-${location.country}`;
        const locationId = locationIds.get(locationKey);

        if (!locationId) {
            throw new Error(`Location not found: ${location.city}`);
        }

        const fingerprint = `demo-${i + 1}-${String(companyName).toLowerCase()}-${String(roleName).toLowerCase()}-${String(levelName).toLowerCase()}`;

        await prisma.compensation.upsert({
            where: {
                fingerprint,
            },
            update: {
                baseSalary: Number(baseSalary),
                bonus: Number(bonus),
                stock: Number(stock),
                totalCompensation: Number(totalCompensation),
                yearsExperience: Number(yearsExperience),
                status: "APPROVED",
                source: "public",
            },
            create: {
                companyId,
                roleId,
                levelId,
                locationId,
                baseSalary: Number(baseSalary),
                bonus: Number(bonus),
                stock: Number(stock),
                totalCompensation: Number(totalCompensation),
                yearsExperience: Number(yearsExperience),
                currency: "USD",
                source: "public",
                status: "APPROVED",
                fingerprint,
            },
        });
    }

    console.log("Database seed completed successfully.");
    console.log(`Companies: ${companies.length}`);
    console.log(`Roles: ${roles.length}`);
    console.log(`Compensation records: ${compensationData.length}`);
}

main()
    .catch((error) => {
        console.error("Database seed failed", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });