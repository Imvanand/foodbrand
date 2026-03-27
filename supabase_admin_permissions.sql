-- Allow admin to Insert, Update, Delete products
-- We use a simple policy allowing full access since standard users do not have login access to the website currently,
-- except for wishlists which use simple auth. To be safe, we can enforce authenticated role.

CREATE POLICY "Allow authenticated full access on products"
    ON public.products FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
