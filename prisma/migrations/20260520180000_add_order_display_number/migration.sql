-- Add a sequential display number to Order for friendly customer-facing IDs (MR-1001, MR-1002...)
-- Postgres SERIAL auto-creates a sequence, sets NOT NULL and default to nextval()

ALTER TABLE "Order" ADD COLUMN "displayNumber" SERIAL NOT NULL;

-- Start the sequence at 1001 so the first customer feels like number 1001, not 1
ALTER SEQUENCE "Order_displayNumber_seq" RESTART WITH 1001;

-- Unique constraint matches the @unique in schema.prisma
CREATE UNIQUE INDEX "Order_displayNumber_key" ON "Order"("displayNumber");
