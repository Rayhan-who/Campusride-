-- CampusRide database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) before functions.sql / rls_policies.sql / seed.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: 1:1 with auth.users, created automatically by the handle_new_user
-- trigger (see functions.sql) on signup.
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  student_id text not null unique,
  university_email text not null unique,
  department text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- buses
-- ---------------------------------------------------------------------------
create table if not exists buses (
  id uuid primary key default gen_random_uuid(),
  bus_number text not null unique,
  capacity int not null check (capacity > 0),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- universities: each counter's destination campus. CampusRide serves several
-- partner universities, one per counter.
-- ---------------------------------------------------------------------------
create table if not exists universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- routes
-- ---------------------------------------------------------------------------
create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- counters (map_x / map_y are 0-100 percentage positions on the stylized
-- Dhaka map illustration used by DhakaMapView)
-- ---------------------------------------------------------------------------
create table if not exists counters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pickup_location text not null,
  map_x numeric not null check (map_x >= 0 and map_x <= 100),
  map_y numeric not null check (map_y >= 0 and map_y <= 100),
  route_id uuid references routes(id) on delete set null,
  university_id uuid references universities(id) on delete set null,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- schedules
-- ---------------------------------------------------------------------------
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  bus_id uuid not null references buses(id) on delete cascade,
  route_id uuid not null references routes(id) on delete cascade,
  counter_id uuid not null references counters(id) on delete cascade,
  departure_time time not null,
  arrival_time time not null,
  capacity int not null check (capacity > 0),
  days_of_week int[] not null default '{0,1,2,3,4,5,6}',
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- bookings (bus bookings). Availability is always derived
-- (capacity - sum of active seats_allocated for the same schedule+date),
-- never stored as a running counter, so it can never drift out of sync.
-- ---------------------------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  user_id uuid not null references profiles(id) on delete cascade,
  schedule_id uuid not null references schedules(id) on delete cascade,
  travel_date date not null,
  seats_requested int not null check (seats_requested > 0),
  seats_allocated int not null check (seats_allocated >= 0),
  status text not null default 'Confirmed'
    check (status in ('Confirmed', 'Pending', 'Cancelled', 'Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_schedule_date
  on bookings(schedule_id, travel_date)
  where status in ('Confirmed', 'Pending');

create index if not exists idx_bookings_user on bookings(user_id);

-- Blocks an exact duplicate: same user booking the same schedule+date twice
-- while an earlier booking for that combo is still active. Race-safe because
-- it's enforced by Postgres itself, not just application logic.
create unique index if not exists uq_booking_user_schedule_date_active
  on bookings(user_id, schedule_id, travel_date)
  where status in ('Confirmed', 'Pending');

-- ---------------------------------------------------------------------------
-- bus_requests: university authorities request buses for events or other
-- purposes. No capacity/atomicity concerns here (unlike bookings), so this
-- is a plain table with owner-scoped RLS rather than a RPC-only table.
-- Status changes (Approved/Rejected) are made by CampusRide staff directly
-- in the Supabase dashboard — this version has no admin interface.
-- ---------------------------------------------------------------------------
create table if not exists bus_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text not null unique
    default ('CR-REQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  user_id uuid not null references profiles(id) on delete cascade,
  university_name text not null,
  buses_required int not null check (buses_required > 0),
  required_date date not null,
  required_time time not null,
  purpose text not null,
  pickup_location text not null,
  notes text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bus_requests_user on bus_requests(user_id);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in (
    'booking_confirmed', 'seat_updated', 'schedule_changed',
    'counter_changed', 'cancellation', 'bus_request_submitted'
  )),
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on notifications(user_id, is_read);
