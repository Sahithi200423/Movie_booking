-- ====================================================================
-- CineBook Supabase Connection Test Table
-- Run this in Supabase SQL Editor to test live database connection
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.connection_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert one test row
INSERT INTO public.connection_test (message)
VALUES ('Hello from Supabase! CineBook connection verified.')
ON CONFLICT DO NOTHING;

-- Enable Row-Level Security
ALTER TABLE public.connection_test ENABLE ROW LEVEL SECURITY;

-- Allow public read access for connection test
DROP POLICY IF EXISTS "Allow public read on connection_test" ON public.connection_test;
CREATE POLICY "Allow public read on connection_test"
  ON public.connection_test FOR SELECT
  USING (true);
