-- ==============================================================================
-- Ocular - Full-Stack Visual Intelligence System
-- Supabase PostgreSQL Database Initialization Script
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable pgcrypto extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Inspections Table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('medicine', 'currency', 'environment', 'document')),
    title TEXT NOT NULL,
    category TEXT,
    confidence_score FLOAT DEFAULT 0.95,
    detected_text TEXT,
    summary TEXT NOT NULL,
    anomaly_warning TEXT,
    key_attributes JSONB DEFAULT '[]'::jsonb,
    spoken_script TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_inspections_user_id ON public.inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON public.inspections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_mode ON public.inspections(mode);

-- 5. Optional Row Level Security (RLS) Configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- Allow backend service role to perform all operations
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role full access on users'
    ) THEN
        CREATE POLICY "Service role full access on users" ON public.users
            FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'inspections' AND policyname = 'Service role full access on inspections'
    ) THEN
        CREATE POLICY "Service role full access on inspections" ON public.inspections
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
