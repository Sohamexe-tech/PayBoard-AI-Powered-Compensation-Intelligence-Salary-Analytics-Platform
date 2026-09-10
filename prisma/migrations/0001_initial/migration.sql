-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."CompensationSource" AS ENUM ('public', 'internal', 'partner', 'estimated');

-- CreateEnum
CREATE TYPE "public"."ContributionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "industry" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NormalizedLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "NormalizedLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Level" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "normalizedLevelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Compensation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "baseSalary" DECIMAL(18,2) NOT NULL,
    "bonus" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "stock" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalCompensation" DECIMAL(18,2) NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "source" "public"."CompensationSource" NOT NULL DEFAULT 'public',
    "status" "public"."ContributionStatus" NOT NULL DEFAULT 'APPROVED',
    "fingerprint" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Compensation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contribution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "normalizedCompany" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "normalizedRole" TEXT NOT NULL,
    "companyLevel" TEXT NOT NULL,
    "normalizedLevel" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "baseSalary" DECIMAL(18,2) NOT NULL,
    "bonus" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "stock" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalCompensation" DECIMAL(18,2) NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "source" "public"."CompensationSource" NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "status" "public"."ContributionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "public"."Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "public"."Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "public"."Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_normalizedName_key" ON "public"."Company"("normalizedName");

-- CreateIndex
CREATE INDEX "Company_normalizedName_idx" ON "public"."Company"("normalizedName");

-- CreateIndex
CREATE INDEX "Role_normalizedTitle_idx" ON "public"."Role"("normalizedTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Role_title_normalizedTitle_key" ON "public"."Role"("title", "normalizedTitle");

-- CreateIndex
CREATE UNIQUE INDEX "NormalizedLevel_name_key" ON "public"."NormalizedLevel"("name");

-- CreateIndex
CREATE INDEX "NormalizedLevel_name_idx" ON "public"."NormalizedLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Level_normalizedName_key" ON "public"."Level"("normalizedName");

-- CreateIndex
CREATE INDEX "Level_rank_idx" ON "public"."Level"("rank");

-- CreateIndex
CREATE INDEX "Level_normalizedLevelId_idx" ON "public"."Level"("normalizedLevelId");

-- CreateIndex
CREATE INDEX "Location_country_state_city_idx" ON "public"."Location"("country", "state", "city");

-- CreateIndex
CREATE UNIQUE INDEX "Location_city_state_country_currency_key" ON "public"."Location"("city", "state", "country", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Compensation_fingerprint_key" ON "public"."Compensation"("fingerprint");

-- CreateIndex
CREATE INDEX "Compensation_companyId_roleId_levelId_locationId_idx" ON "public"."Compensation"("companyId", "roleId", "levelId", "locationId");

-- CreateIndex
CREATE INDEX "Compensation_totalCompensation_idx" ON "public"."Compensation"("totalCompensation");

-- CreateIndex
CREATE INDEX "Compensation_baseSalary_idx" ON "public"."Compensation"("baseSalary");

-- CreateIndex
CREATE INDEX "Compensation_yearsExperience_idx" ON "public"."Compensation"("yearsExperience");

-- CreateIndex
CREATE INDEX "Compensation_fingerprint_idx" ON "public"."Compensation"("fingerprint");

-- CreateIndex
CREATE INDEX "Compensation_status_idx" ON "public"."Compensation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_fingerprint_key" ON "public"."Contribution"("fingerprint");

-- CreateIndex
CREATE INDEX "Contribution_userId_status_idx" ON "public"."Contribution"("userId", "status");

-- CreateIndex
CREATE INDEX "Contribution_status_idx" ON "public"."Contribution"("status");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Level" ADD CONSTRAINT "Level_normalizedLevelId_fkey" FOREIGN KEY ("normalizedLevelId") REFERENCES "public"."NormalizedLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Compensation" ADD CONSTRAINT "Compensation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Compensation" ADD CONSTRAINT "Compensation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Compensation" ADD CONSTRAINT "Compensation_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "public"."Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Compensation" ADD CONSTRAINT "Compensation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

