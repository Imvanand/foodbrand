-- Fix issue where order items might not be visible due to RLS policies
ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert order items when checking out
DO $$
BEGIN
  CREATE POLICY "Enable insert for all users on order_items" ON "public"."order_items" FOR INSERT TO public WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Allow anyone to select order items (the parent 'orders' query is already restricted by user_id in Next.js)
DO $$
BEGIN
  CREATE POLICY "Enable read access for all users on order_items" ON "public"."order_items" FOR SELECT TO public USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
