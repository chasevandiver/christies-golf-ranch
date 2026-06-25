-- Clover lesson payment links (admin-editable — paste a Clover Payment Link and
-- that lesson shows a "Book & Pay" button; empty falls back to calling). And a
-- facts-based FAQ section with FAQPage schema.
insert into public.content_blocks (key, section, label, type, value, sort, help) values
('lessons.p1.checkout','Lessons','Single hour — online booking link','url','',55,'Paste the Clover Payment Link. Leave empty to just show “Call to book”.'),
('lessons.p2.checkout','Lessons','3-lesson — online booking link','url','',75,'Paste the Clover Payment Link. Leave empty to just show “Call to book”.'),
('lessons.p3.checkout','Lessons','5-lesson — online booking link','url','',95,'Paste the Clover Payment Link. Leave empty to just show “Call to book”.'),
('lessons.p4.checkout','Lessons','7-lesson — online booking link','url','',115,'Paste the Clover Payment Link. Leave empty to just show “Call to book”.'),

('faq.eyebrow','FAQ','Small heading','text','Good to Know',10,null),
('faq.heading','FAQ','Heading','text','Questions folks ask',20,null),
('faq.q1','FAQ','Question 1','text','Do I need a tee time?',30,null),
('faq.a1','FAQ','Answer 1','textarea','No. The driving range is walk-up, open every day from 8am till dark. The par-3 course opens for events and our monthly Play Day.',40,null),
('faq.q2','FAQ','Question 2','text','Do I have to be a member to hit balls?',50,null),
('faq.a2','FAQ','Answer 2','textarea','Not at all. Anybody can walk up and buy a bucket. Memberships are just there if you come out a lot and want unlimited balls.',60,null),
('faq.q3','FAQ','Question 3','text','Is it good for beginners and kids?',70,null),
('faq.a3','FAQ','Answer 3','textarea','Yes — that''s the whole idea. Beginners, families, and first-timers are welcome, and we run a junior camp every summer for ages 8 to 12.',80,null),
('faq.q4','FAQ','Question 4','text','How much does it cost?',90,null),
('faq.a4','FAQ','Answer 4','textarea','A small bucket of 75 balls is $17, and a large bucket of 150 is $25. Prices are posted and current.',100,null),
('faq.q5','FAQ','Question 5','text','Where are you?',110,null),
('faq.a5','FAQ','Answer 5','textarea','920 US Highway 377 in Pilot Point, out in the horse country. Give us a call at (214) 317-1488 if you need directions.',120,null)
on conflict (key) do nothing;
