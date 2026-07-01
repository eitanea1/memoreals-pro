-- Which fal model family trains/generates this order. Default keeps all existing orders on FLUX.1.
ALTER TABLE "Order" ADD COLUMN "modelVersion" TEXT NOT NULL DEFAULT 'flux1';
