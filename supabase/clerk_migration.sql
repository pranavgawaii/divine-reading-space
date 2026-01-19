-- Migration to support Clerk Authentication
-- 1. Drop the dependency on Supabase Auth (auth.users)
ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;

-- 2. Add clerk_user_id column to link Clerk Users
ALTER TABLE public.profiles ADD COLUMN clerk_user_id text UNIQUE;

-- 3. Allow id to be auto-generated if we create profiles manually
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 4. Drop the trigger that auto-created profiles on Supabase Auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
