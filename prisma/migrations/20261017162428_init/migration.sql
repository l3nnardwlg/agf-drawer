-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('ROOM', 'CABINET', 'DRAWER', 'SHELF', 'BOX', 'RACK', 'COMPARTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ConnectorFamily" AS ENUM ('USB', 'VIDEO', 'NETWORKING', 'AUDIO', 'POWER', 'INTERNAL', 'SERIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ConnectorGender" AS ENUM ('MALE', 'FEMALE', 'NOT_APPLICABLE', 'UNIVERSAL');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('CABLE', 'ADAPTER', 'ELECTRONICS', 'MICROCONTROLLER', 'SENSOR', 'NETWORK', 'DEVICE', 'TOOL', 'SPARE_PART', 'GENERAL');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('STORED', 'IN_USE', 'LOANED', 'MISSING', 'RETIRED');

-- CreateEnum
CREATE TYPE "MovementAction" AS ENUM ('ITEM_CREATED', 'ITEM_UPDATED', 'ITEM_ARCHIVED', 'UNIT_ADDED', 'UNIT_MOVED', 'UNIT_ASSIGNED', 'UNIT_RETURNED', 'UNIT_LOANED', 'UNIT_MARKED_MISSING', 'UNIT_RETIRED', 'LOCATION_CREATED', 'LOCATION_MOVED', 'LOCATION_DELETED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "preferredTheme" TEXT NOT NULL DEFAULT 'dark',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "ownerId" UUID NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_invitations" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "tokenHash" TEXT NOT NULL,
    "invitedById" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "parentId" UUID,
    "description" TEXT,
    "referenceCode" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connectors" (
    "id" UUID NOT NULL,
    "workspaceId" UUID,
    "name" TEXT NOT NULL,
    "family" "ConnectorFamily" NOT NULL,
    "gender" "ConnectorGender" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "description" TEXT,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "protocols" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "connectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "InventoryCategory" NOT NULL,
    "itemType" TEXT NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "sku" TEXT,
    "internalReference" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cable_specifications" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "cableStandard" TEXT,
    "color" TEXT,
    "lengthCm" INTEGER,
    "gaugeAwg" INTEGER,
    "isShielded" BOOLEAN NOT NULL DEFAULT false,
    "isBreakout" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "specifications" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "cable_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cable_endpoints" (
    "id" UUID NOT NULL,
    "cableSpecId" UUID NOT NULL,
    "position" TEXT NOT NULL,
    "connectorId" UUID,
    "connectorName" TEXT NOT NULL,
    "gender" "ConnectorGender" NOT NULL DEFAULT 'MALE',
    "pinout" TEXT,
    "notes" TEXT,

    CONSTRAINT "cable_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_units" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "unitIdentifier" TEXT,
    "serialNumber" TEXT,
    "assetTag" TEXT,
    "status" "UnitStatus" NOT NULL DEFAULT 'STORED',
    "storageLocationId" UUID,
    "usageLocation" TEXT,
    "notes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cable_assignments" (
    "id" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "usageLocation" TEXT NOT NULL,
    "assignedDevice" TEXT,
    "purpose" TEXT,
    "notes" TEXT,
    "assignedById" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "cable_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "itemId" UUID,
    "unitId" UUID,
    "actorId" UUID,
    "action" "MovementAction" NOT NULL,
    "previousState" JSONB,
    "newState" JSONB,
    "reason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_tokenHash_idx" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_tokenHash_key" ON "email_verification_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "email_verification_tokens_userId_idx" ON "email_verification_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_ownerId_idx" ON "workspaces"("ownerId");

-- CreateIndex
CREATE INDEX "workspaces_slug_idx" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspace_members_workspaceId_idx" ON "workspace_members"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_members_userId_idx" ON "workspace_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON "workspace_members"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_invitations_tokenHash_key" ON "workspace_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "workspace_invitations_workspaceId_email_idx" ON "workspace_invitations"("workspaceId", "email");

-- CreateIndex
CREATE INDEX "workspace_invitations_tokenHash_idx" ON "workspace_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "storage_locations_workspaceId_parentId_idx" ON "storage_locations"("workspaceId", "parentId");

-- CreateIndex
CREATE INDEX "storage_locations_workspaceId_name_idx" ON "storage_locations"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "connectors_workspaceId_name_idx" ON "connectors"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "connectors_family_idx" ON "connectors"("family");

-- CreateIndex
CREATE INDEX "inventory_items_workspaceId_category_idx" ON "inventory_items"("workspaceId", "category");

-- CreateIndex
CREATE INDEX "inventory_items_workspaceId_name_idx" ON "inventory_items"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "inventory_items_workspaceId_isArchived_idx" ON "inventory_items"("workspaceId", "isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "cable_specifications_itemId_key" ON "cable_specifications"("itemId");

-- CreateIndex
CREATE INDEX "cable_specifications_itemId_idx" ON "cable_specifications"("itemId");

-- CreateIndex
CREATE INDEX "cable_specifications_color_idx" ON "cable_specifications"("color");

-- CreateIndex
CREATE INDEX "cable_specifications_lengthCm_idx" ON "cable_specifications"("lengthCm");

-- CreateIndex
CREATE INDEX "cable_endpoints_cableSpecId_idx" ON "cable_endpoints"("cableSpecId");

-- CreateIndex
CREATE INDEX "cable_endpoints_connectorName_idx" ON "cable_endpoints"("connectorName");

-- CreateIndex
CREATE INDEX "inventory_units_workspaceId_itemId_idx" ON "inventory_units"("workspaceId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_units_workspaceId_status_idx" ON "inventory_units"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "inventory_units_workspaceId_storageLocationId_idx" ON "inventory_units"("workspaceId", "storageLocationId");

-- CreateIndex
CREATE INDEX "cable_assignments_workspaceId_unitId_idx" ON "cable_assignments"("workspaceId", "unitId");

-- CreateIndex
CREATE INDEX "cable_assignments_workspaceId_returnedAt_idx" ON "cable_assignments"("workspaceId", "returnedAt");

-- CreateIndex
CREATE INDEX "inventory_movements_workspaceId_itemId_idx" ON "inventory_movements"("workspaceId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_movements_workspaceId_unitId_idx" ON "inventory_movements"("workspaceId", "unitId");

-- CreateIndex
CREATE INDEX "inventory_movements_workspaceId_timestamp_idx" ON "inventory_movements"("workspaceId", "timestamp");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "storage_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connectors" ADD CONSTRAINT "connectors_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_specifications" ADD CONSTRAINT "cable_specifications_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_endpoints" ADD CONSTRAINT "cable_endpoints_cableSpecId_fkey" FOREIGN KEY ("cableSpecId") REFERENCES "cable_specifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_endpoints" ADD CONSTRAINT "cable_endpoints_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "connectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_units" ADD CONSTRAINT "inventory_units_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_units" ADD CONSTRAINT "inventory_units_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_units" ADD CONSTRAINT "inventory_units_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_assignments" ADD CONSTRAINT "cable_assignments_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "inventory_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_assignments" ADD CONSTRAINT "cable_assignments_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cable_assignments" ADD CONSTRAINT "cable_assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "inventory_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
