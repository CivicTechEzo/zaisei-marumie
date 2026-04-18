-- CreateEnum
CREATE TYPE "MunicipalityType" AS ENUM ('prefecture', 'city', 'town', 'village');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "TenantRole" AS ENUM ('owner', 'admin', 'editor');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "auth_id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tenant_memberships" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "role" "TenantRole" NOT NULL DEFAULT 'editor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tenant_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "short_name" VARCHAR(20) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalities" (
    "id" BIGSERIAL NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "municipality_code" VARCHAR(6) NOT NULL,
    "municipality_type" "MunicipalityType" NOT NULL,
    "area" DOUBLE PRECISION,
    "region_id" BIGINT NOT NULL,
    "tenant_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_year_settlements" (
    "id" BIGSERIAL NOT NULL,
    "municipality_id" BIGINT NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "rev_local_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_local_transfer_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_stock_transfer_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_dividend_transfer_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_capital_gains_transfer_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_local_consumption_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_golf_course_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_environment_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_national_property_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_special_tonnage_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_local_allocation_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_local_allocation_ordinary" BIGINT NOT NULL DEFAULT 0,
    "rev_local_allocation_special" BIGINT NOT NULL DEFAULT 0,
    "rev_traffic_safety_tax" BIGINT NOT NULL DEFAULT 0,
    "rev_shared_burden" BIGINT NOT NULL DEFAULT 0,
    "rev_usage_fees" BIGINT NOT NULL DEFAULT 0,
    "rev_service_fees" BIGINT NOT NULL DEFAULT 0,
    "rev_national_subsidy" BIGINT NOT NULL DEFAULT 0,
    "rev_prefecture_subsidy" BIGINT NOT NULL DEFAULT 0,
    "rev_property_income" BIGINT NOT NULL DEFAULT 0,
    "rev_donations" BIGINT NOT NULL DEFAULT 0,
    "rev_transfers_in" BIGINT NOT NULL DEFAULT 0,
    "rev_carryover" BIGINT NOT NULL DEFAULT 0,
    "rev_miscellaneous" BIGINT NOT NULL DEFAULT 0,
    "rev_local_bond" BIGINT NOT NULL DEFAULT 0,
    "rev_total" BIGINT NOT NULL DEFAULT 0,
    "exp_assembly" BIGINT NOT NULL DEFAULT 0,
    "exp_general_admin" BIGINT NOT NULL DEFAULT 0,
    "exp_welfare" BIGINT NOT NULL DEFAULT 0,
    "exp_health" BIGINT NOT NULL DEFAULT 0,
    "exp_labor" BIGINT NOT NULL DEFAULT 0,
    "exp_agriculture" BIGINT NOT NULL DEFAULT 0,
    "exp_commerce" BIGINT NOT NULL DEFAULT 0,
    "exp_civil_engineering" BIGINT NOT NULL DEFAULT 0,
    "exp_firefighting" BIGINT NOT NULL DEFAULT 0,
    "exp_education" BIGINT NOT NULL DEFAULT 0,
    "exp_disaster_recovery" BIGINT NOT NULL DEFAULT 0,
    "exp_debt_service" BIGINT NOT NULL DEFAULT 0,
    "exp_purpose_other" BIGINT NOT NULL DEFAULT 0,
    "exp_purpose_total" BIGINT NOT NULL DEFAULT 0,
    "exp_personnel" BIGINT NOT NULL DEFAULT 0,
    "exp_personnel_salary" BIGINT NOT NULL DEFAULT 0,
    "exp_assistance" BIGINT NOT NULL DEFAULT 0,
    "exp_debt_service_nature" BIGINT NOT NULL DEFAULT 0,
    "exp_mandatory_total" BIGINT NOT NULL DEFAULT 0,
    "exp_materials" BIGINT NOT NULL DEFAULT 0,
    "exp_maintenance" BIGINT NOT NULL DEFAULT 0,
    "exp_subsidies" BIGINT NOT NULL DEFAULT 0,
    "exp_reserves" BIGINT NOT NULL DEFAULT 0,
    "exp_investment_loans" BIGINT NOT NULL DEFAULT 0,
    "exp_transfers_out" BIGINT NOT NULL DEFAULT 0,
    "exp_construction_subsidy" BIGINT NOT NULL DEFAULT 0,
    "exp_construction_independent" BIGINT NOT NULL DEFAULT 0,
    "exp_construction_total" BIGINT NOT NULL DEFAULT 0,
    "exp_disaster_recovery_nature" BIGINT NOT NULL DEFAULT 0,
    "exp_nature_other" BIGINT NOT NULL DEFAULT 0,
    "exp_nature_total" BIGINT NOT NULL DEFAULT 0,
    "fiscal_power_index" DECIMAL(5,3) NOT NULL DEFAULT 0,
    "current_balance_ratio" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "real_balance_ratio" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "real_debt_service_ratio" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "debt_burden_ratio" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "standard_fiscal_scale" BIGINT NOT NULL DEFAULT 0,
    "basic_fiscal_revenue" BIGINT NOT NULL DEFAULT 0,
    "basic_fiscal_demand" BIGINT NOT NULL DEFAULT 0,
    "reserve_fund_total" BIGINT NOT NULL DEFAULT 0,
    "reserve_fund_fiscal" BIGINT NOT NULL DEFAULT 0,
    "reserve_fund_debt" BIGINT NOT NULL DEFAULT 0,
    "reserve_fund_other" BIGINT NOT NULL DEFAULT 0,
    "local_bond_balance" BIGINT NOT NULL DEFAULT 0,
    "population" INTEGER NOT NULL DEFAULT 0,
    "similar_group_code" VARCHAR(20) NOT NULL DEFAULT '',
    "data_source" VARCHAR(50) NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_year_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "user_tenant_memberships_user_id_idx" ON "user_tenant_memberships"("user_id");

-- CreateIndex
CREATE INDEX "user_tenant_memberships_tenant_id_idx" ON "user_tenant_memberships"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_tenant_memberships_user_id_tenant_id_key" ON "user_tenant_memberships"("user_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_slug_key" ON "municipalities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_municipality_code_key" ON "municipalities"("municipality_code");

-- CreateIndex
CREATE INDEX "municipalities_region_id_idx" ON "municipalities"("region_id");

-- CreateIndex
CREATE INDEX "municipalities_tenant_id_idx" ON "municipalities"("tenant_id");

-- CreateIndex
CREATE INDEX "fiscal_year_settlements_municipality_id_idx" ON "fiscal_year_settlements"("municipality_id");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_year_settlements_municipality_id_fiscal_year_key" ON "fiscal_year_settlements"("municipality_id", "fiscal_year");

-- AddForeignKey
ALTER TABLE "user_tenant_memberships" ADD CONSTRAINT "user_tenant_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenant_memberships" ADD CONSTRAINT "user_tenant_memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiscal_year_settlements" ADD CONSTRAINT "fiscal_year_settlements_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
