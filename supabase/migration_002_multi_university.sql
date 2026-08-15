-- CampusRide migration 002 — run this ONCE against an existing CampusRide
-- Supabase project that already has schema.sql / functions.sql /
-- rls_policies.sql / seed.sql applied from the original single-university
-- version. Run the whole file in one go in the SQL Editor.
--
-- What this does:
--   1. Adds a `universities` table (5 partner universities).
--   2. Adds `counters.university_id` and repoints the 5 existing counters
--      (Uttara/Mirpur/Dhanmondi/Mohammadpur/Motijheel) to the 5 new
--      counters (Aftabnagar/Badda/Bashundhara/Tejgaon/Kuratoli), each tied
--      to its university. Existing schedules/bookings keep working
--      unchanged since they reference counters by id, not name.
--   3. Adds a `bus_requests` table (replaces the old Events feature).
--   4. Drops the old `events` / `event_bookings` tables and their RPCs.

-- ---------------------------------------------------------------------------
-- 1. universities
-- ---------------------------------------------------------------------------
create table if not exists universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table universities enable row level security;

drop policy if exists "public read universities" on universities;
create policy "public read universities" on universities for select using (true);

insert into universities (id, name) values
  ('60000000-0000-0000-0000-000000000001', 'Harvard Aftabnagar'),
  ('60000000-0000-0000-0000-000000000002', 'MIT Badda'),
  ('60000000-0000-0000-0000-000000000003', 'Oxford Bashundhara'),
  ('60000000-0000-0000-0000-000000000004', 'Stanford Kuratoli'),
  ('60000000-0000-0000-0000-000000000005', 'BUET Tejgaon')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. counters: add university_id, repoint the 5 existing counters
-- ---------------------------------------------------------------------------
alter table counters add column if not exists university_id uuid references universities(id) on delete set null;

update routes set name = 'Aftabnagar - Harvard Aftabnagar', description = 'Sample route connecting Aftabnagar to Harvard Aftabnagar.'
  where id = '20000000-0000-0000-0000-000000000001';
update routes set name = 'Badda - MIT Badda', description = 'Sample route connecting Badda to MIT Badda.'
  where id = '20000000-0000-0000-0000-000000000002';
update routes set name = 'Bashundhara - Oxford Bashundhara', description = 'Sample route connecting Bashundhara to Oxford Bashundhara.'
  where id = '20000000-0000-0000-0000-000000000003';
update routes set name = 'Tejgaon - BUET Tejgaon', description = 'Sample route connecting Tejgaon to BUET Tejgaon.'
  where id = '20000000-0000-0000-0000-000000000004';
update routes set name = 'Kuratoli - Stanford Kuratoli', description = 'Sample route connecting Kuratoli to Stanford Kuratoli.'
  where id = '20000000-0000-0000-0000-000000000005';

update counters set name = 'Aftabnagar Counter', pickup_location = 'Aftabnagar, near main gate', university_id = '60000000-0000-0000-0000-000000000001'
  where id = '30000000-0000-0000-0000-000000000001';
update counters set name = 'Badda Counter', pickup_location = 'Badda Link Road', university_id = '60000000-0000-0000-0000-000000000002'
  where id = '30000000-0000-0000-0000-000000000002';
update counters set name = 'Bashundhara Counter', pickup_location = 'Bashundhara R/A, Block C', university_id = '60000000-0000-0000-0000-000000000003'
  where id = '30000000-0000-0000-0000-000000000003';
update counters set name = 'Tejgaon Counter', pickup_location = 'Tejgaon Industrial Area', university_id = '60000000-0000-0000-0000-000000000005'
  where id = '30000000-0000-0000-0000-000000000004';
update counters set name = 'Kuratoli Counter', pickup_location = 'Kuratoli, Khilkhet', university_id = '60000000-0000-0000-0000-000000000004'
  where id = '30000000-0000-0000-0000-000000000005';

-- ---------------------------------------------------------------------------
-- 3. bus_requests (replaces Events)
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

alter table bus_requests enable row level security;

drop policy if exists "select own bus requests" on bus_requests;
create policy "select own bus requests" on bus_requests
  for select using (auth.uid() = user_id);

drop policy if exists "insert own bus requests" on bus_requests;
create policy "insert own bus requests" on bus_requests
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Drop the old Events feature entirely
-- ---------------------------------------------------------------------------
drop function if exists create_event_booking(uuid, int);
drop function if exists cancel_event_booking(uuid);
drop table if exists event_bookings;
drop table if exists events;

-- notifications.type no longer needs the event-specific values
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in (
    'booking_confirmed', 'seat_updated', 'schedule_changed',
    'counter_changed', 'cancellation', 'bus_request_submitted'
  ));
