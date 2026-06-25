-- Seed events. Recurring rows auto-generate their future dates in lib/events.ts.
-- DOW: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat.
-- Day/time for the men's group and the camp dates are best guesses — Jeff can
-- fix them in the admin in seconds.
insert into public.events
  (title, description, start_date, start_time, end_time, location, price, recurrence, recurrence_dow, is_published, sort)
values
  ('Monthly Play Day',
   'Unlimited golf on the 9-hole par-3 course — no tee times, just ride up and play. Open to everyone.',
   '2026-06-26', '8:00 AM', 'Dark', 'Christie''s Golf Ranch', '$25 / golfer',
   'monthly-last', 5, true, 10),

  ('Weekly Men''s Group',
   'Our weekly men''s golf group. New faces always welcome — call ahead for this week''s details.',
   '2026-06-27', '8:00 AM', null, 'Christie''s Golf Ranch', null,
   'weekly', 6, true, 20),

  ('Summer Junior Camp',
   'A 4-day camp for ages 8–12 — etiquette, rules, and swing basics in small groups. Two hours a day.',
   '2026-07-13', '9:00 AM', '11:00 AM', 'Christie''s Golf Ranch', null,
   'none', null, true, 30)
on conflict do nothing;
