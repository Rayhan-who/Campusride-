-- CampusRide migration 003 — run this ONCE if you already ran
-- migration_002_multi_university.sql on your Supabase project.
--
-- Swaps which university each of the Tejgaon/Kuratoli and Badda/Bashundhara
-- counters serves:
--   Tejgaon Counter:      BUET Tejgaon      -> Stanford Kuratoli
--   Kuratoli Counter:     Stanford Kuratoli -> BUET Tejgaon
--   Badda Counter:        MIT Badda         -> Oxford Bashundhara
--   Bashundhara Counter:  Oxford Bashundhara -> MIT Badda
-- Aftabnagar Counter / Harvard Aftabnagar is unchanged.

update counters set university_id = '60000000-0000-0000-0000-000000000004' -- Stanford Kuratoli
  where id = '30000000-0000-0000-0000-000000000004'; -- Tejgaon Counter
update counters set university_id = '60000000-0000-0000-0000-000000000005' -- BUET Tejgaon
  where id = '30000000-0000-0000-0000-000000000005'; -- Kuratoli Counter
update counters set university_id = '60000000-0000-0000-0000-000000000003' -- Oxford Bashundhara
  where id = '30000000-0000-0000-0000-000000000002'; -- Badda Counter
update counters set university_id = '60000000-0000-0000-0000-000000000002' -- MIT Badda
  where id = '30000000-0000-0000-0000-000000000003'; -- Bashundhara Counter

update routes set name = 'Tejgaon - Stanford Kuratoli', description = 'Sample route connecting Tejgaon to Stanford Kuratoli.'
  where id = '20000000-0000-0000-0000-000000000004';
update routes set name = 'Kuratoli - BUET Tejgaon', description = 'Sample route connecting Kuratoli to BUET Tejgaon.'
  where id = '20000000-0000-0000-0000-000000000005';
update routes set name = 'Badda - Oxford Bashundhara', description = 'Sample route connecting Badda to Oxford Bashundhara.'
  where id = '20000000-0000-0000-0000-000000000002';
update routes set name = 'Bashundhara - MIT Badda', description = 'Sample route connecting Bashundhara to MIT Badda.'
  where id = '20000000-0000-0000-0000-000000000003';
