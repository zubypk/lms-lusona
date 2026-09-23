-- Product identity is LMS (no vendor names in the campus UI)

insert into settings (key, value) values
  ('college_name', 'LMS'),
  ('college_short', 'LMS'),
  ('motto', 'One campus. One register.'),
  ('marquee', 'Welcome to LMS · Session 2025–26 · Mid-term week begins 22 September · Assignments, quizzes, attendance and results'),
  ('release_message', 'LMS phone layout: bottom navigation, compact header, and the product name LMS throughout.')
on conflict (key) do update set value = excluded.value;
