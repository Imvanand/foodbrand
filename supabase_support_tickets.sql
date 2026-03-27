-- Create support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' NOT NULL, -- 'open', 'in-progress', 'resolved', 'closed'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional if logged in
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a ticket (guests or logged in)
DO $$ BEGIN
  CREATE POLICY "Anyone can create a ticket" ON public.support_tickets 
  FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Only admins and the creator can view the ticket
DO $$ BEGIN
  CREATE POLICY "Users can view own tickets" ON public.support_tickets 
  FOR SELECT TO public USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Admin can see all tickets (using the same pattern as before, or service_role handles it)
DO $$ BEGIN
  CREATE POLICY "Admins can view all tickets" ON public.support_tickets 
  FOR SELECT TO public USING (
    auth.jwt() ->> 'email' = 'imvanand1@gmail.com'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Admins can update tickets (status)
DO $$ BEGIN
  CREATE POLICY "Admins can update tickets" ON public.support_tickets 
  FOR UPDATE TO public USING (
    auth.jwt() ->> 'email' = 'imvanand1@gmail.com'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;
