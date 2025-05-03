-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DAPP_OWNER', 'CACHE_NODE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DappOwner" (
    "id" TEXT NOT NULL,

    CONSTRAINT "DappOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dapp" (
    "id" TEXT NOT NULL,
    "dappOwnerId" TEXT NOT NULL,
    "dappName" TEXT NOT NULL,

    CONSTRAINT "Dapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CacheNode" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "CacheNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "cdnUrl" TEXT NOT NULL,
    "dataHash" TEXT NOT NULL,
    "dappId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CacheNodeAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "cacheNodeId" TEXT NOT NULL,

    CONSTRAINT "CacheNodeAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DappOwner" ADD CONSTRAINT "DappOwner_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dapp" ADD CONSTRAINT "Dapp_dappOwnerId_fkey" FOREIGN KEY ("dappOwnerId") REFERENCES "DappOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CacheNode" ADD CONSTRAINT "CacheNode_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_dappId_fkey" FOREIGN KEY ("dappId") REFERENCES "Dapp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CacheNodeAsset" ADD CONSTRAINT "CacheNodeAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CacheNodeAsset" ADD CONSTRAINT "CacheNodeAsset_cacheNodeId_fkey" FOREIGN KEY ("cacheNodeId") REFERENCES "CacheNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
