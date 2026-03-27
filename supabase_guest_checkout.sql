-- Enable Guest Checkout (Allow public to insert orders and addresses without login)

-- 1. Orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Enable insert for all users on orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. User Addresses table
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Enable insert for all users on user_addresses" ON public.user_addresses FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Update existing select policies to handle quest checkouts (only owner or admin)
-- (Make sure admin imvanand1@gmail.com can see them)
DO $$ BEGIN
    CREATE POLICY "Admins can view all addresses" ON public.user_addresses FOR SELECT TO public USING (auth.jwt() ->> 'email' = 'imvanand1@gmail.com');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO public USING (auth.jwt() ->> 'email' = 'imvanand1@gmail.com');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Enable DELETE for admin
DO $$ BEGIN
    CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO public USING (auth.jwt() ->> 'email' = 'imvanand1@gmail.com');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can delete user_addresses" ON public.user_addresses FOR DELETE TO public USING (auth.jwt() ->> 'email' = 'imvanand1@gmail.com');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO public USING (auth.jwt() ->> 'email' = 'imvanand1@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'imvanand1@gmail.com');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- (Optional) If order_items doesn't have cascade delete, allow it here too:
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY "Admins can delete order_items" ON public.order_items FOR ALL TO public USING (auth.jwt() ->> 'email' = 'imvanand1@gmail.com');
EXCEPTION WHEN duplicate_object THEN null; END $$;
