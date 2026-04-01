-- Add images column to product_reviews table to support review photos
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
