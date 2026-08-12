-- CampusRide demo/sample data.
-- Run after schema.sql, functions.sql, and rls_policies.sql.
--
-- Everything here is fictional/representative sample data for demo purposes
-- (is_demo = true by default) — it does not describe a real university's
-- actual routes, counters, or schedule.

-- ---------------------------------------------------------------------------
-- Buses (5)
-- ---------------------------------------------------------------------------
insert into buses (id, bus_number, capacity) values
  ('10000000-0000-0000-0000-000000000001', 'Bus 01', 40),
  ('10000000-0000-0000-0000-000000000002', 'Bus 02', 40),
  ('10000000-0000-0000-0000-000000000003', 'Bus 03', 40),
  ('10000000-0000-0000-0000-000000000004', 'Bus 04', 40),
  ('10000000-0000-0000-0000-000000000005', 'Bus 05', 40)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Routes (5)
-- ---------------------------------------------------------------------------
insert into routes (id, name, description) values
  ('20000000-0000-0000-0000-000000000001', 'Uttara - University', 'Sample route connecting Uttara to campus.'),
  ('20000000-0000-0000-0000-000000000002', 'Mirpur - University', 'Sample route connecting Mirpur to campus.'),
  ('20000000-0000-0000-0000-000000000003', 'Dhanmondi - University', 'Sample route connecting Dhanmondi to campus.'),
  ('20000000-0000-0000-0000-000000000004', 'Mohammadpur - University', 'Sample route connecting Mohammadpur to campus.'),
  ('20000000-0000-0000-0000-000000000005', 'Motijheel - University', 'Sample route connecting Motijheel to campus.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Counters (5) — map_x / map_y are percentage positions on the stylized
-- Dhaka map illustration (public/images/dhaka-map.svg), north at the top.
-- ---------------------------------------------------------------------------
insert into counters (id, name, pickup_location, map_x, map_y, route_id) values
  ('30000000-0000-0000-0000-000000000001', 'Uttara Counter', 'Uttara Sector 7, near House Building', 52, 10, '20000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000002', 'Mirpur Counter', 'Mirpur 10 Circle', 34, 27, '20000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000003', 'Dhanmondi Counter', 'Dhanmondi 27, near Star Kabab', 37, 56, '20000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000004', 'Mohammadpur Counter', 'Mohammadpur Town Hall', 24, 46, '20000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000005', 'Motijheel Counter', 'Motijheel C/A, Shapla Chattar', 66, 58, '20000000-0000-0000-0000-000000000005')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Schedules (10) — two runs per bus.
-- ---------------------------------------------------------------------------
insert into schedules (id, bus_id, route_id, counter_id, departure_time, arrival_time, capacity) values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '07:30', '08:15', 40),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '07:45', '08:30', 40),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '07:15', '08:00', 40),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '07:30', '08:20', 40),
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '07:00', '08:00', 40),
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '09:30', '10:15', 40),
  ('40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '09:45', '10:30', 40),
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '09:15', '10:00', 40),
  ('40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '09:30', '10:20', 40),
  ('40000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '09:00', '10:00', 40)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- University events (5) — dates are relative-future sample dates, not real
-- university announcements.
-- ---------------------------------------------------------------------------
insert into events (id, name, description, event_date, destination, departure_time, return_time, total_seats) values
  ('50000000-0000-0000-0000-000000000001', 'CSE Industrial Visit', 'Sample educational trip to a technology park for CSE students.', current_date + interval '13 days', 'Gazipur', '07:00', '18:00', 35),
  ('50000000-0000-0000-0000-000000000002', 'Inter-University Sports Meet', 'Sample transport for the annual inter-university sports competition.', current_date + interval '18 days', 'Savar', '06:30', '20:00', 45),
  ('50000000-0000-0000-0000-000000000003', 'Cultural Fest Field Trip', 'Sample cultural program excursion.', current_date + interval '24 days', 'Sonargaon', '08:00', '17:00', 40),
  ('50000000-0000-0000-0000-000000000004', 'Business Seminar', 'Sample transport for a department seminar at a convention center.', current_date + interval '8 days', 'Dhaka Convention Center', '09:00', '15:00', 30),
  ('50000000-0000-0000-0000-000000000005', 'Department Study Tour', 'Sample multi-day study tour departure.', current_date + interval '27 days', 'Cox''s Bazar', '05:00', null, 50)
on conflict (id) do nothing;
