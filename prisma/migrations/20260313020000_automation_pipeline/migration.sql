/*
  Warnings:

  - The values [PROCESSING,READY] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trainingStatus` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('RECEIVED', 'TRAINING', 'SAMPLING', 'PROCESSING_ALL', 'READY_FOR_PRINT', 'SHIPPED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;

-- AlterTable
ALTER TABLE "GeneratedImage" ADD COLUMN     "variation" TEXT NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "trainingStatus",
ADD COLUMN     "falRequestId" TEXT,
ADD COLUMN     "trainingFailed" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "TrainingStatus";
