-- LoRA strength at generation (null = 1.0). Lower it for over-fit LoRAs that bake in clothes.
ALTER TABLE "Order" ADD COLUMN "loraScale" DOUBLE PRECISION;
