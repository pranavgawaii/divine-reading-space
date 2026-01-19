-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. ADMIN USERS (Role tracking)
create table public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  role text not null check (role in ('admin', 'super_admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SEATS
create table public.seats (
  id uuid default uuid_generate_v4() primary key,
  seat_number text not null unique,
  floor text default '1st Floor',
  section text default 'General',
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. BOOKINGS
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  seat_id uuid references public.seats(id) on delete set null,
  start_date date not null,
  end_date date not null,
  status text default 'pending' check (status in ('pending', 'active', 'expired', 'cancelled')),
  amount numeric not null,
  registration_fee_paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PAYMENTS
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  payment_type text default 'UPI',
  screenshot_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.seats enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

-- Policies for PROFILES
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Policies for ADMIN_USERS
create policy "Admins are viewable by everyone." on public.admin_users
  for select using (true);

-- Policies for SEATS
create policy "Seats are viewable by everyone." on public.seats
  for select using (true);

create policy "Admins can update seats." on public.seats
  for all using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- Policies for BOOKINGS
create policy "Users can view own bookings." on public.bookings
  for select using (auth.uid() = user_id);

create policy "Admins can view all bookings." on public.bookings
  for select using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "Users can insert own bookings." on public.bookings
  for insert with check (auth.uid() = user_id);

create policy "Admins can update bookings." on public.bookings
  for update using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- Policies for PAYMENTS
create policy "Users can view own payments." on public.payments
  for select using (auth.uid() = user_id);

create policy "Admins can view all payments." on public.payments
  for select using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "Users can insert own payments." on public.payments
  for insert with check (auth.uid() = user_id);

create policy "Admins can update payments." on public.payments
  for update using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- SEED DATA: 30 SEATS
do $$
begin
  for i in 1..30 loop
    insert into public.seats (seat_number)
    values ('A-' || to_char(i, 'FM00'))
    on conflict (seat_number) do nothing;
  end loop;
end;
$$;
