-- 1. Disable RLS on all tables (Clerk handles auth at API level)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE seats DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies to be clean
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update payments" ON payments;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Admins are viewable by everyone." ON admin_users;
DROP POLICY IF EXISTS "Seats are viewable by everyone." ON seats;
DROP POLICY IF EXISTS "Admins can update seats." ON seats;
DROP POLICY IF EXISTS "Users can insert own bookings." ON bookings;
DROP POLICY IF EXISTS "Users can insert own payments." ON payments;

-- 3. Drop admin_users table (Using Clerk Metadata instead)
-- DROP TABLE IF EXISTS admin_users; -- keeping commented out just in case user wants to migrate data first, or enable if strict follow.
-- User said "STEP 8: DELETE ADMIN_USERS TABLE (Optional)". I'll leave it for them to decide or include it as a separate command if they wish, 
-- but simpler to just ignore it in code.
