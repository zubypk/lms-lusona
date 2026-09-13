-- AEC LMS academic schema

create table if not exists profiles (
  user_id text primary key,
  role text not null check (role in ('super_admin','academic_admin','class_incharge','teacher','student')),
  display_name text not null,
  email text,
  photo_url text,
  student_id integer,
  teacher_id integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists academic_sessions (
  id serial primary key,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false
);

create table if not exists subjects (
  id serial primary key,
  name text not null,
  code text not null unique,
  description text,
  syllabus text
);

create table if not exists classes (
  id serial primary key,
  name text not null,
  grade_level integer not null,
  stream text not null default 'general',
  session_id integer not null references academic_sessions(id)
);

create table if not exists teachers (
  id serial primary key,
  teacher_code text not null unique,
  employee_id text not null unique,
  name text not null,
  qualification text,
  mobile text,
  email text,
  user_id text,
  created_at timestamptz not null default now()
);

create table if not exists sections (
  id serial primary key,
  class_id integer not null references classes(id),
  name text not null,
  incharge_teacher_id integer references teachers(id),
  room text
);

create table if not exists class_subjects (
  id serial primary key,
  class_id integer not null references classes(id),
  section_id integer references sections(id),
  subject_id integer not null references subjects(id),
  teacher_id integer references teachers(id)
);

create table if not exists students (
  id serial primary key,
  student_code text not null unique,
  roll_number text not null,
  registration_number text not null unique,
  name text not null,
  father_name text,
  class_id integer not null references classes(id),
  section_id integer not null references sections(id),
  session_id integer not null references academic_sessions(id),
  mobile text,
  email text,
  username text not null unique,
  user_id text,
  created_at timestamptz not null default now()
);

create table if not exists timetable_slots (
  id serial primary key,
  section_id integer not null references sections(id),
  subject_id integer not null references subjects(id),
  teacher_id integer references teachers(id),
  day_of_week integer not null,
  period integer not null,
  starts_at text not null,
  ends_at text not null,
  room text
);

create table if not exists materials (
  id serial primary key,
  title text not null,
  description text,
  type text not null,
  url text not null,
  subject_id integer not null references subjects(id),
  class_id integer references classes(id),
  section_id integer references sections(id),
  teacher_id integer references teachers(id),
  uploaded_by text,
  created_at timestamptz not null default now()
);

create table if not exists assignments (
  id serial primary key,
  title text not null,
  description text,
  subject_id integer not null references subjects(id),
  class_id integer not null references classes(id),
  section_id integer references sections(id),
  teacher_id integer references teachers(id),
  due_at timestamptz not null,
  max_marks integer not null default 100,
  attachment_url text,
  published boolean not null default true,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists assignment_submissions (
  id serial primary key,
  assignment_id integer not null references assignments(id) on delete cascade,
  student_id integer not null references students(id),
  content text,
  file_url text,
  submitted_at timestamptz not null default now(),
  marks integer,
  feedback text,
  status text not null default 'submitted',
  graded_by text,
  unique (assignment_id, student_id)
);

create table if not exists questions (
  id serial primary key,
  subject_id integer not null references subjects(id),
  type text not null,
  prompt text not null,
  options_json text,
  answer text,
  marks integer not null default 1,
  created_by text
);

create table if not exists quizzes (
  id serial primary key,
  title text not null,
  description text,
  subject_id integer not null references subjects(id),
  class_id integer not null references classes(id),
  section_id integer references sections(id),
  teacher_id integer references teachers(id),
  duration_minutes integer not null default 30,
  max_attempts integer not null default 2,
  randomize boolean not null default true,
  published boolean not null default true,
  available_from timestamptz,
  available_until timestamptz,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists quiz_questions (
  quiz_id integer not null references quizzes(id) on delete cascade,
  question_id integer not null references questions(id) on delete cascade,
  position integer not null default 0,
  primary key (quiz_id, question_id)
);

create table if not exists quiz_attempts (
  id serial primary key,
  quiz_id integer not null references quizzes(id) on delete cascade,
  student_id integer not null references students(id),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  answers_json text,
  score numeric,
  max_score numeric,
  attempt_no integer not null default 1
);

create table if not exists attendance (
  id serial primary key,
  student_id integer not null references students(id),
  section_id integer not null references sections(id),
  subject_id integer references subjects(id),
  attended_on date not null,
  status text not null,
  source text not null default 'class',
  marked_by text
);

create table if not exists meetings (
  id serial primary key,
  title text not null,
  platform text not null,
  url text not null,
  subject_id integer references subjects(id),
  section_id integer references sections(id),
  teacher_id integer references teachers(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_by text
);

create table if not exists notifications (
  id serial primary key,
  title text not null,
  body text not null,
  type text not null,
  audience text not null default 'all',
  audience_ref text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists notification_reads (
  notification_id integer not null references notifications(id) on delete cascade,
  user_id text not null,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

create table if not exists forum_threads (
  id serial primary key,
  title text not null,
  body text not null,
  subject_id integer references subjects(id),
  class_id integer references classes(id),
  author_user_id text not null,
  author_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists forum_posts (
  id serial primary key,
  thread_id integer not null references forum_threads(id) on delete cascade,
  body text not null,
  author_user_id text not null,
  author_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists exams (
  id serial primary key,
  name text not null,
  type text not null,
  session_id integer not null references academic_sessions(id),
  class_id integer references classes(id),
  exam_date date,
  published boolean not null default true
);

create table if not exists exam_scores (
  id serial primary key,
  exam_id integer not null references exams(id) on delete cascade,
  student_id integer not null references students(id),
  subject_id integer not null references subjects(id),
  marks numeric not null,
  max_marks numeric not null default 100,
  unique (exam_id, student_id, subject_id)
);

create table if not exists calendar_events (
  id serial primary key,
  title text not null,
  description text,
  event_date date not null,
  event_type text not null
);

create table if not exists settings (
  key text primary key,
  value text not null
);

create table if not exists audit_logs (
  id serial primary key,
  user_id text not null,
  action text not null,
  entity text,
  entity_id text,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists students_class_idx on students (class_id, section_id);
create index if not exists students_user_idx on students (user_id);
create index if not exists teachers_user_idx on teachers (user_id);
create index if not exists attendance_student_idx on attendance (student_id, attended_on);
create index if not exists attendance_section_day_idx on attendance (section_id, attended_on);
create index if not exists materials_subject_idx on materials (subject_id);
create index if not exists assignments_class_idx on assignments (class_id, section_id);
create index if not exists notifications_created_idx on notifications (created_at desc);
create index if not exists audit_user_idx on audit_logs (user_id, created_at desc);
