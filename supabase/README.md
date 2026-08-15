# CampusRide — Supabase setup

CampusRide uses [Supabase](https://supabase.com) for its database (Postgres) and authentication. Follow these steps once to get a working backend.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in / create an account.
2. Click **New project**. Pick any name (e.g. `campusride`), a database password (save it somewhere safe), and a region close to you.
3. Wait for the project to finish provisioning (~2 minutes).

## 2. Get your API keys

In the Supabase dashboard: **Project Settings → API**.

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed to the browser — not currently used by the app but kept available for future admin scripts)

Copy `.env.example` at the project root to `.env.local` and fill in these three values.

## 3. Run the SQL scripts

**Brand-new project?** In the Supabase dashboard, open **SQL Editor → New query**, and run the following files **in this exact order**, each as its own run:

1. `supabase/schema.sql` — creates all tables, constraints, and indexes.
2. `supabase/functions.sql` — creates the `handle_new_user` trigger and the `create_bus_booking` / `cancel_booking` RPC functions.
3. `supabase/rls_policies.sql` — enables Row Level Security and creates all policies. **The app will not work correctly (or securely) without this.**
4. `supabase/seed.sql` — inserts demo buses, universities, routes, counters, and schedules so the app has data to show immediately.

**Already ran those on an earlier version of CampusRide?** Don't re-run them (they'll error on tables that already exist). Instead run, in order:

1. `supabase/migration_002_multi_university.sql` — adds the `universities` and `bus_requests` tables, repoints the 5 counters to the new counter/university pairs, and drops the old Events tables.
2. `supabase/migration_003_swap_university_pairs.sql` — only needed if you already ran migration 002 before the Tejgaon/Kuratoli and Badda/Bashundhara university pairings were corrected. Safe to skip on a fresh setup, since `seed.sql` already has the corrected pairing.

You can paste each file's contents into the SQL editor and click **Run**.

## 4. Disable email confirmation (for easy local demo signup)

By default, Supabase requires new users to confirm their email before they can sign in. For a local demo, this is inconvenient since there's no real inbox for `@university.edu`-style demo emails.

Go to **Authentication → Providers → Email** and turn **Confirm email** off. (You can turn this back on later if you connect a real email provider and want production-grade signup.)

## 5. Run the app

From the project root:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, register a student account, and you should see the seeded buses/universities/routes/counters/schedules throughout the app.

## Notes

- All reference data seeded by `seed.sql` is marked `is_demo = true` and is clearly labeled "Sample data" in the UI — it is not real university routing/scheduling information.
- Every booking write (create or cancel) goes through a `SECURITY DEFINER` Postgres function (see `functions.sql`), not a direct table insert. This is what makes it safe for `rls_policies.sql` to grant no client-side insert/update policy on `bookings` — see the comments in that file for details.
- `bus_requests` (the University Bus Request system) has no such RPC since there's no capacity to check atomically — a student can insert/read only their own rows. There is also no admin UI in this version, so moving a request from **Pending** to **Approved**/**Rejected** is done by editing the row directly in the Supabase Table Editor.
