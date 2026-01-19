-- Allow Admins to see all payments
create policy "Admins can view all payments"
on public.payments
for select
to authenticated
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- Allow Admins to see all bookings
create policy "Admins can view all bookings"
on public.bookings
for select
to authenticated
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- Allow Admins to see all profiles (needed for names)
create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);
