-- CampusRide RPC functions and triggers.
-- Run after schema.sql, before rls_policies.sql.
--
-- All booking writes go through these SECURITY DEFINER functions rather than
-- direct table inserts from the client. That's what makes the RLS policies
-- in rls_policies.sql (which grant no client insert/update on bookings /
-- event_bookings) safe: a function running as SECURITY DEFINER bypasses RLS,
-- but it checks auth.uid() itself, so a student can only ever create or
-- cancel their own bookings, and can never set an arbitrary seats_allocated.

-- ---------------------------------------------------------------------------
-- handle_new_user: populates profiles from the metadata passed to
-- supabase.auth.signUp({ options: { data: { full_name, student_id, ... } } })
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, student_id, university_email, department, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'student_id', ''),
    new.email,
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- create_bus_booking: atomically checks availability and creates a booking.
-- ---------------------------------------------------------------------------
create or replace function create_bus_booking(
  p_schedule_id uuid,
  p_travel_date date,
  p_seats int
) returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int;
  v_booked int;
  v_available int;
  v_code text;
  v_row bookings;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_seats <= 0 then
    raise exception 'Seats requested must be positive';
  end if;

  -- Lock the schedule row so concurrent bookings for the same schedule+date
  -- serialize instead of racing past each other.
  select capacity into v_capacity from schedules where id = p_schedule_id for update;
  if not found then
    raise exception 'Schedule not found';
  end if;

  select coalesce(sum(seats_allocated), 0) into v_booked
  from bookings
  where schedule_id = p_schedule_id
    and travel_date = p_travel_date
    and status in ('Confirmed', 'Pending');

  v_available := v_capacity - v_booked;
  if v_available < p_seats then
    raise exception 'Only % seat(s) available for this bus' , v_available;
  end if;

  v_code := 'CR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into bookings (booking_code, user_id, schedule_id, travel_date, seats_requested, seats_allocated, status)
  values (v_code, auth.uid(), p_schedule_id, p_travel_date, p_seats, p_seats, 'Confirmed')
  returning * into v_row;

  insert into notifications (user_id, type, message)
  values (
    auth.uid(),
    'booking_confirmed',
    'Your booking ' || v_code || ' for ' || to_char(p_travel_date, 'DD Mon') || ' is confirmed.'
  );

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- cancel_booking: owner-only cancellation. Capacity
-- is freed automatically since availability is always derived by summing
-- active rows — no separate "release seats" bookkeeping needed.
-- ---------------------------------------------------------------------------
create or replace function cancel_booking(p_booking_id uuid)
returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row bookings;
begin
  update bookings
  set status = 'Cancelled', updated_at = now()
  where id = p_booking_id
    and user_id = auth.uid()
    and status in ('Confirmed', 'Pending')
  returning * into v_row;

  if not found then
    raise exception 'Booking not found or cannot be cancelled';
  end if;

  insert into notifications (user_id, type, message)
  values (auth.uid(), 'cancellation', 'Booking ' || v_row.booking_code || ' was cancelled.');

  return v_row;
end;
$$;
