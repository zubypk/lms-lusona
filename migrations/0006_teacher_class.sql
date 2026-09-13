-- Class teacher desk: classified parent fields only (name, father, roll).
-- Student logins are issued automatically as email + hashed password.

alter table students
  add column if not exists login_issued_at timestamptz;

alter table students
  add column if not exists login_issued_by text;

create index if not exists students_section_roll_idx on students (section_id, roll_number);

insert into settings (key, value) values
  (
    'marquee',
    'LMS · Class teachers enrol with Name, Father name and Roll no · Student login is issued automatically · Subject teachers see only their classes · Google Meet / Zoom / Teams · Session 2025–26'
  ),
  (
    'release_message',
    'Class teacher desk: enrol your own class with Name, Father name and Roll no. The LMS issues the student email and password. Subject teachers are limited to their assigned classes for quizzes, assignments, materials, attendance and live sessions.'
  )
on conflict (key) do update set value = excluded.value;
