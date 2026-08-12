-- CampusRide Row Level Security policies.
-- Run after schema.sql and functions.sql.

alter table profiles enable row level security;
alter table buses enable row level security;
alter table routes enable row level security;
alter table counters enable row level security;
alter table schedules enable row level security;
alter table bookings enable row level security;
alter table events enable row level security;
alter table event_bookings enable row level security;
alter table notifications enable row level security;

-- ---------------------------------------------------------------------------
-- Reference data: publicly readable by any authenticated student, writable
-- only by the service role (seed scripts / Supabase dashboard) — no policy
-- grants client-side insert/update/delete.
-- ---------------------------------------------------------------------------
create policy "public read buses" on buses for select using (true);
create policy "public read routes" on routes for select using (true);
create policy "public read counters" on counters for select using (true);
create policy "public read schedules" on schedules for select using (true);
create policy "public read events" on events for select using (true);

-- ---------------------------------------------------------------------------
-- profiles: a student can see and edit only their own row. Row creation is
-- handled by the handle_new_user trigger (SECURITY DEFINER), not a client
-- insert policy.
-- ---------------------------------------------------------------------------
create policy "select own profile" on profiles
  for select using (auth.uid() = id);

create policy "update own profile" on profiles
  for update using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- bookings / event_bookings: owner-only read. Deliberately NO insert/update
-- policy — every write goes through the create_bus_booking / create_event_
-- booking / cancel_booking / cancel_event_booking RPCs, which run as
-- SECURITY DEFINER (bypassing RLS) but check auth.uid() internally. This
-- closes off any path to forging another user's booking or an arbitrary
-- seats_allocated value directly from the client.
-- ---------------------------------------------------------------------------
create policy "select own bookings" on bookings
  for select using (auth.uid() = user_id);

create policy "select own event bookings" on event_bookings
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- notifications: owner-only read, and owner can mark their own as read.
-- ---------------------------------------------------------------------------
create policy "select own notifications" on notifications
  for select using (auth.uid() = user_id);

create policy "update own notifications" on notifications
  for update using (auth.uid() = user_id);
