-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('PENDING', 'TRAINING', 'TRAINED', 'FAILED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "aiOverride" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "loraUrl" TEXT,
ADD COLUMN     "trainingId" TEXT,
ADD COLUMN     "trainingStatus" "TrainingStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "GeneratedImage" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "characterIndex" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneratedImage" ADD CONSTRAINT "GeneratedImage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
