-- CampusRide migration 004 — run this ONCE against your live Supabase
-- project. Renames the "Aftabnagar" counter/route to "Dhanmondi" — it keeps
-- serving the same university (Harvard Aftabnagar), only the pickup area
-- name changes.

update counters set name = 'Dhanmondi Counter', pickup_location = 'Dhanmondi 27, near Star Kabab'
  where id = '30000000-0000-0000-0000-000000000001';

update routes set name = 'Dhanmondi - Harvard Aftabnagar', description = 'Sample route connecting Dhanmondi to Harvard Aftabnagar.'
  where id = '20000000-0000-0000-0000-000000000001';
