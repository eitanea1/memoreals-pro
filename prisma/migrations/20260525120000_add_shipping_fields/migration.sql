-- Add shipping address fields to Order, collected at the new /shipping step
-- Defaults to empty string so existing orders are not broken.

ALTER TABLE "Order" ADD COLUMN "recipientName"      TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "shippingStreet"     TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "shippingApartment"  TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "shippingCity"       TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "shippingPostalCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "shippingNotes"      TEXT NOT NULL DEFAULT '';
