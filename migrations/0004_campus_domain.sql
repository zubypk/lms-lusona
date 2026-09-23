-- Domain, marquee, release notice and mail rename (ecn.edu.pk → lms.edu.pk)

insert into settings (key, value) values
  ('domain', 'lms.lusona.org'),
  ('email_domain', 'lms.edu.pk'),
  ('marquee', 'Welcome to AEC LMS · Session 2025–26 · Official portal lms.lusona.org · College mail @lms.edu.pk · Mid-term week begins 22 September · Physics practicals in Lab 2 · FBISE registration desk open in the Academic Office'),
  ('release_message', 'Campus refresh: themes, backgrounds, photo slider, welcome screen, and a full Super Admin panel to assign Admin, Teacher, Student and Incharge roles.'),
  ('default_theme', 'campus'),
  ('default_background', 'linen')
on conflict (key) do update set value = excluded.value;

update settings
  set value = 'registrar@lms.edu.pk'
  where key = 'email' and value like '%ecn.edu.pk';

update teachers
  set email = replace(email, '@ecn.edu.pk', '@lms.edu.pk')
  where email like '%@ecn.edu.pk';

update students
  set email = replace(email, '@student.ecn.edu.pk', '@student.lms.edu.pk')
  where email like '%@student.ecn.edu.pk';
