-- Seed: all editable site copy, rewritten in Jeff Christie's plainspoken,
-- first-person, faith-forward voice. on conflict do nothing so re-running
-- never clobbers edits Jeff makes later in the admin.

insert into public.content_blocks (key, section, label, type, value, sort, help) values

-- Announcement bar -----------------------------------------------------------
('ribbon.text','Announcement Bar','Bar message','text',
 'Play Day on the par-3 — last Friday of every month · unlimited golf, $25 · just ride up, no tee times',10,
 'The thin strip across the very top of every page.'),

-- Home — Hero ----------------------------------------------------------------
('hero.kicker','Home — Hero','Small line above the headline','text','Pilot Point, Texas · Since 2008',10,null),
('hero.headline','Home — Hero','Big headline','text','All grass. All welcome.',20,null),
('hero.lede','Home — Hero','Sentence under the headline','textarea',
 'An all-grass driving range and a 9-hole par-3 course sitting on fifteen acres of Pilot Point horse country. Been playing forty years or never picked up a club — either way, come on out. We''re open every day.',30,null),
('hero.cta_primary','Home — Hero','Main button text','text','See Pricing',40,null),
('hero.cta_secondary','Home — Hero','Second button text','text','Hours & Directions',50,null),
('hero.image','Home — Hero','Background photo (optional)','image','',60,'Leave empty to keep the designed background.'),

-- Home — Stats ---------------------------------------------------------------
('stat.1.num','Home — Stats','Stat 1 — number','text','55',10,null),
('stat.1.label','Home — Stats','Stat 1 — label','text','Grass Stations',20,null),
('stat.2.num','Home — Stats','Stat 2 — number','text','9',30,null),
('stat.2.label','Home — Stats','Stat 2 — label','text','Hole Par-3',40,null),
('stat.3.num','Home — Stats','Stat 3 — number','text','15',50,null),
('stat.3.label','Home — Stats','Stat 3 — label','text','Acres',60,null),
('stat.4.num','Home — Stats','Stat 4 — number','text','Daily',70,null),
('stat.4.label','Home — Stats','Stat 4 — label','text','8am – Dark',80,null),

-- Our Story ------------------------------------------------------------------
('about.eyebrow','Our Story','Small heading','text','Our Story',10,null),
('about.heading','Our Story','Heading','text','A dream I get to live every day',20,null),
('about.body','Our Story','Story (Jeff''s words)','textarea',
 'I bought this land back in 2008 and built Christie''s Golf Ranch in honor of my dad, Jim Christie. It started as a lifelong dream of mine, and I don''t take a single day of it for granted.

What we''ve got is a one-of-a-kind, all-grass driving range and a 9-hole par-3 course right in the middle of horse country. Fifty-five stations, a pro shop, lessons, memberships, junior camps, and a men''s group that plays every week. Folks come out to practice, to play, and to spend time with family on well-kept grounds.

There are not many people living out their dream. I am.',30,
 'Write it the way Jeff talks. Separate paragraphs with a blank line.'),
('about.sig','Our Story','Signature line','text','— Jeff Christie, Owner',40,null),
('about.image','Our Story','Photo','image','',50,'A photo of the range, Jeff, or the grounds.'),

-- The Facility ---------------------------------------------------------------
('facility.eyebrow','The Facility','Small heading','text','The Facility',10,null),
('facility.heading','The Facility','Heading','text','Everything you need to work on your game',20,null),
('facility.intro','The Facility','Intro sentence','textarea',
 'Fifteen acres set up for practice — from the driver down to the short game, all on real Texas grass.',30,null),
('feat.1.title','The Facility','Feature 1 — title','text','55 grass stations',40,null),
('feat.1.body','The Facility','Feature 1 — text','textarea','All grass, never off a mat. Buckets run from 75 to 150 balls.',50,null),
('feat.2.title','The Facility','Feature 2 — title','text','9-hole par-3 course',60,null),
('feat.2.body','The Facility','Feature 2 — text','textarea','Real greens with real slope and pin variety. Open for events and our monthly Play Day.',70,null),
('feat.3.title','The Facility','Feature 3 — title','text','Chipping & putting greens',80,null),
('feat.3.body','The Facility','Feature 3 — text','textarea','Room to work on the short shots — the ones that actually take strokes off your score.',90,null),
('feat.4.title','The Facility','Feature 4 — title','text','Bunkers & water',100,null),
('feat.4.body','The Facility','Feature 4 — text','textarea','Practice out of the sand and around the water, so nothing catches you off guard on the course.',110,null),
('feat.5.title','The Facility','Feature 5 — title','text','Three 60+ yard holes',120,null),
('feat.5.body','The Facility','Feature 5 — text','textarea','A few longer practice holes to bridge the gap between the range and the course.',130,null),
('feat.6.title','The Facility','Feature 6 — title','text','Pro shop',140,null),
('feat.6.body','The Facility','Feature 6 — text','textarea','Grab what you need on your way in, and ask us about clinics, events, and parties.',150,null),

-- Pricing — Range ------------------------------------------------------------
('pricing.eyebrow','Pricing — Range','Small heading','text','Pricing & Memberships',10,null),
('pricing.heading','Pricing — Range','Heading','text','Fair prices, posted right here',20,null),
('pricing.intro','Pricing — Range','Intro sentence','textarea',
 'You don''t need a membership to walk up and hit balls. But if you''re out here a lot, it pays for itself quick. Everything below is current.',30,null),
('range.head','Pricing — Range','Section title','text','At the range',40,null),
('range.note','Pricing — Range','Section note','text','Open daily · 8am till dark',50,null),
('range.small.price','Pricing — Range','Small bucket — price','text','$17',60,null),
('range.small.desc','Pricing — Range','Small bucket — text','textarea','75 balls — a good warm-up or a quick evening session.',70,null),
('range.large.price','Pricing — Range','Large bucket — price','text','$25',80,null),
('range.large.desc','Pricing — Range','Large bucket — text','textarea','150 balls — settle in and take your time.',90,null),

-- Pricing — Memberships ------------------------------------------------------
('mem.head','Pricing — Memberships','Section title','text','Memberships',10,null),
('mem.note','Pricing — Memberships','Section note','text','3-month minimum · unlimited range balls',20,null),
('mem.practice.name','Pricing — Memberships','Practice — name','text','Practice Membership',30,null),
('mem.practice.price','Pricing — Memberships','Practice — price','text','$90',40,null),
('mem.practice.unit','Pricing — Memberships','Practice — per','text','/ month',50,null),
('mem.practice.item1','Pricing — Memberships','Practice — bullet 1','text','Unlimited use of the practice facility',60,null),
('mem.practice.item2','Pricing — Memberships','Practice — bullet 2','text','Unlimited range balls',70,null),
('mem.combo.name','Pricing — Memberships','Combo — name','text','Practice + a Monthly Lesson',80,null),
('mem.combo.price','Pricing — Memberships','Combo — price','text','$130',90,null),
('mem.combo.unit','Pricing — Memberships','Combo — per','text','/ month',100,null),
('mem.combo.flag','Pricing — Memberships','Combo — badge','text','Best value',110,null),
('mem.combo.item1','Pricing — Memberships','Combo — bullet 1','text','Everything in the practice membership',120,null),
('mem.combo.item2','Pricing — Memberships','Combo — bullet 2','text','One 30-minute lesson with Jeff each month',130,null),
('mem.cta','Pricing — Memberships','Join button text','text','Call to Join',140,null),

-- Lessons --------------------------------------------------------------------
('lessons.head','Lessons','Section title','text','Lessons with Jeff',10,null),
('lessons.note','Lessons','Section note','text','Build on what''s working',20,null),
('lessons.body','Lessons','Jeff''s pitch','textarea',
 'Golf is a mental game. I''m not here to change your swing or rebuild what''s already working — I want to take what you''ve got and make it better. I work with beginners, families, individuals, and the local high school team. Give me a call and let''s set up a time.',30,null),
('lessons.p1.name','Lessons','Price 1 — name','text','Single hour',40,null),
('lessons.p1.price','Lessons','Price 1 — amount','text','$95',50,null),
('lessons.p2.name','Lessons','Price 2 — name','text','3-lesson package',60,null),
('lessons.p2.price','Lessons','Price 2 — amount','text','$270',70,null),
('lessons.p3.name','Lessons','Price 3 — name','text','5-lesson package',80,null),
('lessons.p3.price','Lessons','Price 3 — amount','text','$425',90,null),
('lessons.p4.name','Lessons','Price 4 — name','text','7-lesson package',100,null),
('lessons.p4.price','Lessons','Price 4 — amount','text','$560',110,null),
('lessons.cta.head','Lessons','Booking card — heading','text','Set up a lesson',120,null),
('lessons.cta.desc','Lessons','Booking card — text','textarea','Call me directly to book a lesson or a package.',130,null),

-- Junior Camp ----------------------------------------------------------------
('camp.head','Junior Camp','Section title','text','Junior Camp',10,null),
('camp.note','Junior Camp','Section note','text','Ages 8–12 · 4-day camps · 2 hours a day',20,null),
('camp.heading','Junior Camp','Card heading','text','Summer Junior Camp',30,null),
('camp.desc','Junior Camp','Description','textarea',
 'We start the kids with the right foundation — etiquette, the rules, grip, posture, and the basics of the full swing. Small groups, plenty of swings, and a good time.',40,null),
('camp.item1','Junior Camp','Bullet 1','text','Small groups and real instruction',50,null),
('camp.item2','Junior Camp','Bullet 2','text','Etiquette, rules, and swing basics',60,null),
('camp.register_text','Junior Camp','Register button text','text','Register for 2026',70,null),
('camp.register_url','Junior Camp','Register link (URL)','url','https://docs.google.com/forms/d/1ZBeZ7lZ-l9Z81URQeMBAvZqUVKW-TpYJ_AMKosipxIg',80,
 'The registration form link.'),
('camp.image','Junior Camp','Photo','image','',90,'A photo of juniors on the range.'),
('pricing.editnote','Junior Camp','Extra note','textarea',
 'We also do clinics, special events, and birthday parties. Call (214) 317-1488 and we''ll set it up.',100,null),

-- Monthly Play Day -----------------------------------------------------------
('playday.eyebrow','Monthly Play Day','Small heading','text','Last Friday, every month',10,null),
('playday.heading','Monthly Play Day','Heading','text','Monthly Play Day on the par-3',20,null),
('playday.intro','Monthly Play Day','Text','textarea',
 'Unlimited golf on the 9-hole par-3 — real greens, real slopes, no tee times. Just ride up and play. The course opens for days like this; the range is open every day.',30,null),
('playday.price','Monthly Play Day','Price','text','$25',40,null),
('playday.price_sub','Monthly Play Day','Price label','text','Unlimited play · per golfer',50,null),

-- Our Mission ----------------------------------------------------------------
('mission.eyebrow','Our Mission','Small heading','text','Why We''re Here',10,null),
('mission.quote','Our Mission','Mission statement','textarea',
 'My mission is to teach young men and women self-worth through Jesus Christ. I get to live that out every day — by giving God the glory and welcoming whoever He puts in front of me.',20,null),
('mission.verse','Our Mission','Scripture line','text',
 '"Commit your works to the Lord, and your plans will be established." — Proverbs 16:3',30,null),
('mission.cite','Our Mission','Attribution','text','Jeff Christie · Owner',40,null),

-- Events ---------------------------------------------------------------------
('events.eyebrow','Events','Small heading','text','What''s Coming Up',10,null),
('events.heading','Events','Heading','text','Out at the ranch',20,null),
('events.intro','Events','Intro sentence','textarea',
 'Here''s what''s on the calendar — Play Days, the men''s group, camps, and anything else we''ve got going on.',30,null),

-- Gallery --------------------------------------------------------------------
('gallery.eyebrow','Gallery','Small heading','text','The Grounds',10,null),
('gallery.heading','Gallery','Heading','text','A look around the ranch',20,null),
('gallery.intro','Gallery','Intro sentence','textarea','A few looks around the place. Come see the rest in person.',30,null),
('gallery.1','Gallery','Photo 1','image','',40,null),
('gallery.2','Gallery','Photo 2','image','',50,null),
('gallery.3','Gallery','Photo 3 (wide)','image','',60,null),
('gallery.4','Gallery','Photo 4','image','',70,null),
('gallery.5','Gallery','Photo 5 (wide)','image','',80,null),

-- Reviews --------------------------------------------------------------------
('reviews.eyebrow','Reviews','Small heading','text','From Our Golfers',10,null),
('reviews.heading','Reviews','Heading','text','What folks say',20,null),
('review.1.text','Reviews','Review 1 — words','textarea','This is a great place to practice, and Jeff will give you some very good, experienced lessons.',30,'Use real reviews only.'),
('review.1.who','Reviews','Review 1 — name','text','Google review',40,null),
('review.2.text','Reviews','Review 2 — words','textarea','Quiet and relaxing. Beautiful, and competitively priced.',50,'Use real reviews only.'),
('review.2.who','Reviews','Review 2 — name','text','Google review',60,null),
('review.3.text','Reviews','Review 3 — words','textarea','',70,'Paste another real Google review here.'),
('review.3.who','Reviews','Review 3 — name','text','',80,null),

-- Email Signup ---------------------------------------------------------------
('signup.eyebrow','Email Signup','Small heading','text','Stay in the Loop',10,null),
('signup.heading','Email Signup','Heading','text','Tips from Jeff, and a free bucket on your birthday',20,null),
('signup.body','Email Signup','Text','textarea',
 'Leave your email and we''ll send the occasional note — practice tips, what''s coming up, and a free bucket of balls on your birthday. No spam, and you can unsubscribe anytime.',30,null),
('signup.button','Email Signup','Button text','text','Sign Me Up',40,null),

-- Visit & Contact (single source of truth for NAP) ---------------------------
('contact.eyebrow','Visit & Contact','Small heading','text','Visit',10,null),
('contact.heading','Visit & Contact','Heading','text','Ride out and see the place',20,null),
('contact.address1','Visit & Contact','Address line 1','text','920 US Highway 377',30,null),
('contact.address2','Visit & Contact','Address line 2','text','Pilot Point, Texas 76258',40,null),
('contact.phone','Visit & Contact','Phone (display)','text','(214) 317-1488',50,null),
('contact.phone_tel','Visit & Contact','Phone (digits only)','text','2143171488',60,'No spaces or dashes — used for the call button.'),
('contact.email','Visit & Contact','Email','text','christiesgolfranch@gmail.com',70,null),
('contact.hours1','Visit & Contact','Hours line 1','text','Driving range — every day, 8am till dark',80,null),
('contact.hours2','Visit & Contact','Hours line 2','text','Par-3 course — special events & Play Days',90,null)

on conflict (key) do nothing;
