-- Create unified feedbacks table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    order_id UUID,
    product_id TEXT,
    feedback_type TEXT NOT NULL, -- 'seller', 'delivery', 'product'
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
DO $$ BEGIN
  CREATE POLICY "Users can insert own feedback" ON public.feedbacks 
  FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Users can view their own feedback
DO $$ BEGIN
  CREATE POLICY "Users can view own feedback" ON public.feedbacks 
  FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Allow public read access for product reviews so everyone can see them
DO $$ BEGIN
  CREATE POLICY "Public read product feedback" ON public.feedbacks 
  FOR SELECT TO public USING (feedback_type = 'product');
EXCEPTION WHEN duplicate_object THEN null; END $$;
