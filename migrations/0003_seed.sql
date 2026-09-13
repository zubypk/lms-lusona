-- AEC College campus seed (academic session 2025–26)

insert into settings (key, value) values
  ('college_name', 'Atomic Energy Commission College'),
  ('college_short', 'AEC College'),
  ('city', 'Rawalpindi / Islamabad'),
  ('motto', 'Knowledge in Service of the Nation'),
  ('address', 'Lehtrar Road, Near Nilore, Islamabad Capital Territory'),
  ('phone', '+92 51 924 8801'),
  ('email', 'registrar@ecn.edu.pk'),
  ('current_session', '2025-26')
on conflict (key) do nothing;

insert into academic_sessions (id, name, starts_on, ends_on, is_current) values
  (1, '2025-26', '2025-08-15', '2026-06-30', true),
  (2, '2024-25', '2024-08-16', '2025-06-28', false);

insert into subjects (id, name, code, description, syllabus) values
  (1, 'Physics', 'PHY-401', 'Mechanics, waves, electricity and modern physics for HSSC.',
   E'Unit 1 — Motion and Force\nUnit 2 — Work, Energy and Power\nUnit 3 — Circular Motion\nUnit 4 — Oscillations and Waves\nUnit 5 — Electrostatics\nUnit 6 — Current Electricity\nUnit 7 — Electromagnetism\nUnit 8 — Modern Physics'),
  (2, 'Chemistry', 'CHM-401', 'Physical, inorganic and organic chemistry.',
   E'Unit 1 — Stoichiometry\nUnit 2 — Atomic Structure\nUnit 3 — Chemical Bonding\nUnit 4 — States of Matter\nUnit 5 — Thermochemistry\nUnit 6 — Chemical Equilibrium\nUnit 7 — Electrochemistry\nUnit 8 — Organic Chemistry'),
  (3, 'Mathematics', 'MTH-401', 'Algebra, calculus, vectors and trigonometry.',
   E'Unit 1 — Number Systems\nUnit 2 — Sets, Functions and Groups\nUnit 3 — Matrices and Determinants\nUnit 4 — Quadratic Equations\nUnit 5 — Partial Fractions\nUnit 6 — Sequences and Series\nUnit 7 — Trigonometry\nUnit 8 — Differentiation and Integration'),
  (4, 'Computer Science', 'CSC-401', 'Programming, data structures and computer systems.',
   E'Unit 1 — Computer Systems\nUnit 2 — Data Representation\nUnit 3 — Boolean Logic\nUnit 4 — Programming Fundamentals (C/Python)\nUnit 5 — Data Structures\nUnit 6 — Databases\nUnit 7 — Networks\nUnit 8 — Emerging Technologies'),
  (5, 'English', 'ENG-301', 'Language, literature and academic writing.',
   E'Paper A — Reading and writing\nPaper B — Grammar and composition\nLiterature — selected poems, short stories and a play'),
  (6, 'Urdu', 'URD-301', 'Urdu language and literature.',
   E'Nasr, Nazm, Ghazal, and composition as per FBISE HSSC syllabus'),
  (7, 'Pakistan Studies', 'PST-201', 'History, geography and civic life of Pakistan.',
   E'Ideology of Pakistan · Struggle for independence · Constitution · Geography and resources · Contemporary issues'),
  (8, 'Islamiyat', 'ISL-201', 'Quran, Hadith, Fiqh and Seerah.',
   E'Selected verses · Hadith · Ibadat · Seerah · Islamic ethics and contemporary issues'),
  (9, 'Biology', 'BIO-401', 'Cell biology, physiology and ecology.',
   E'Cell structure · Biological molecules · Enzymes · Bioenergetics · Circulation · Immunity · Ecology');

insert into classes (id, name, grade_level, stream, session_id) values
  (1, 'Grade 9', 9, 'general', 1),
  (2, 'Grade 10', 10, 'general', 1),
  (3, 'Grade 11 Pre-Engineering', 11, 'pre_engineering', 1),
  (4, 'Grade 12 Pre-Engineering', 12, 'pre_engineering', 1);

insert into teachers (id, teacher_code, employee_id, name, qualification, mobile, email) values
  (1, 'AEC-T-001', 'EMP-1042', 'Dr. Ayesha Rahman', 'PhD Nuclear Physics, QAU Islamabad', '0300-5551042', 'ayesha.rahman@ecn.edu.pk'),
  (2, 'AEC-T-002', 'EMP-1088', 'Mr. Imran Qureshi', 'MSc Mathematics, NUST', '0333-5551088', 'imran.qureshi@ecn.edu.pk'),
  (3, 'AEC-T-003', 'EMP-1104', 'Ms. Fatima Zahra', 'MPhil Chemistry, PINSTECH', '0321-5551104', 'fatima.zahra@ecn.edu.pk'),
  (4, 'AEC-T-004', 'EMP-1120', 'Mr. Hassan Ali', 'MS Computer Science, FAST-NUCES', '0345-5551120', 'hassan.ali@ecn.edu.pk'),
  (5, 'AEC-T-005', 'EMP-1135', 'Mrs. Sana Malik', 'MA English Literature, NUML', '0312-5551135', 'sana.malik@ecn.edu.pk'),
  (6, 'AEC-T-006', 'EMP-1148', 'Mr. Tariq Mehmood', 'MA Pakistan Studies, IIUI', '0301-5551148', 'tariq.mehmood@ecn.edu.pk'),
  (7, 'AEC-T-007', 'EMP-1162', 'Ms. Hina Khalid', 'MSc Biology, Quaid-i-Azam University', '0334-5551162', 'hina.khalid@ecn.edu.pk'),
  (8, 'AEC-T-008', 'EMP-1177', 'Mr. Usman Raza', 'MA Urdu, University of Punjab', '0308-5551177', 'usman.raza@ecn.edu.pk');

insert into sections (id, class_id, name, incharge_teacher_id, room) values
  (1, 1, 'A', 5, 'R-9A'),
  (2, 1, 'B', 6, 'R-9B'),
  (3, 2, 'A', 3, 'R-10A'),
  (4, 2, 'B', 8, 'R-10B'),
  (5, 3, 'A', 1, 'R-11A'),
  (6, 3, 'B', 2, 'R-11B'),
  (7, 4, 'A', 1, 'R-12A'),
  (8, 4, 'B', 4, 'R-12B');

insert into class_subjects (class_id, section_id, subject_id, teacher_id) values
  (3, 5, 1, 1), (3, 5, 2, 3), (3, 5, 3, 2), (3, 5, 4, 4), (3, 5, 5, 5), (3, 5, 7, 6), (3, 5, 8, 6),
  (3, 6, 1, 1), (3, 6, 2, 3), (3, 6, 3, 2), (3, 6, 4, 4), (3, 6, 5, 5), (3, 6, 7, 6), (3, 6, 8, 6),
  (4, 7, 1, 1), (4, 7, 2, 3), (4, 7, 3, 2), (4, 7, 4, 4), (4, 7, 5, 5),
  (4, 8, 1, 1), (4, 8, 3, 2), (4, 8, 4, 4),
  (1, 1, 5, 5), (1, 1, 6, 8), (1, 1, 7, 6), (1, 1, 3, 2),
  (2, 3, 1, 1), (2, 3, 2, 3), (2, 3, 3, 2), (2, 3, 5, 5);

insert into students (id, student_code, roll_number, registration_number, name, father_name, class_id, section_id, session_id, mobile, email, username) values
  (1,  'AEC-2025-001', '11A-01', 'FBISE-RWP-2025-44101', 'Ahmed Hassan', 'Muhammad Hassan', 3, 5, 1, '0300-4410001', 'ahmed.hassan@student.ecn.edu.pk', 'ahassan01'),
  (2,  'AEC-2025-002', '11A-02', 'FBISE-RWP-2025-44102', 'Fatima Noor', 'Abdul Noor', 3, 5, 1, '0300-4410002', 'fatima.noor@student.ecn.edu.pk', 'fnoor02'),
  (3,  'AEC-2025-003', '11A-03', 'FBISE-RWP-2025-44103', 'Ali Raza', 'Ghulam Raza', 3, 5, 1, '0300-4410003', 'ali.raza@student.ecn.edu.pk', 'araza03'),
  (4,  'AEC-2025-004', '11A-04', 'FBISE-RWP-2025-44104', 'Ayesha Siddiqui', 'Khalid Siddiqui', 3, 5, 1, '0300-4410004', 'ayesha.siddiqui@student.ecn.edu.pk', 'asiddiqui04'),
  (5,  'AEC-2025-005', '11A-05', 'FBISE-RWP-2025-44105', 'Bilal Ahmed', 'Saeed Ahmed', 3, 5, 1, '0300-4410005', 'bilal.ahmed@student.ecn.edu.pk', 'bahmed05'),
  (6,  'AEC-2025-006', '11A-06', 'FBISE-RWP-2025-44106', 'Hira Malik', 'Tariq Malik', 3, 5, 1, '0300-4410006', 'hira.malik@student.ecn.edu.pk', 'hmalik06'),
  (7,  'AEC-2025-007', '11A-07', 'FBISE-RWP-2025-44107', 'Usman Khan', 'Javed Khan', 3, 5, 1, '0300-4410007', 'usman.khan@student.ecn.edu.pk', 'ukhan07'),
  (8,  'AEC-2025-008', '11A-08', 'FBISE-RWP-2025-44108', 'Zainab Iftikhar', 'Iftikhar Ahmed', 3, 5, 1, '0300-4410008', 'zainab.iftikhar@student.ecn.edu.pk', 'ziftikhar08'),
  (9,  'AEC-2025-009', '11A-09', 'FBISE-RWP-2025-44109', 'Hamza Sheikh', 'Naveed Sheikh', 3, 5, 1, '0300-4410009', 'hamza.sheikh@student.ecn.edu.pk', 'hsheikh09'),
  (10, 'AEC-2025-010', '11A-10', 'FBISE-RWP-2025-44110', 'Sara Qureshi', 'Imran Qureshi', 3, 5, 1, '0300-4410010', 'sara.qureshi@student.ecn.edu.pk', 'squreshi10'),
  (11, 'AEC-2025-011', '11A-11', 'FBISE-RWP-2025-44111', 'Omar Farooq', 'Farooq Ahmad', 3, 5, 1, '0300-4410011', 'omar.farooq@student.ecn.edu.pk', 'ofarooq11'),
  (12, 'AEC-2025-012', '11A-12', 'FBISE-RWP-2025-44112', 'Mehwish Ali', 'Shafiq Ali', 3, 5, 1, '0300-4410012', 'mehwish.ali@student.ecn.edu.pk', 'mali12'),
  (13, 'AEC-2025-013', '11B-01', 'FBISE-RWP-2025-44201', 'Ibrahim Shah', 'Arif Shah', 3, 6, 1, '0301-4420001', 'ibrahim.shah@student.ecn.edu.pk', 'ishah13'),
  (14, 'AEC-2025-014', '11B-02', 'FBISE-RWP-2025-44202', 'Noor Fatima', 'Waseem Akram', 3, 6, 1, '0301-4420002', 'noor.fatima@student.ecn.edu.pk', 'nfatima14'),
  (15, 'AEC-2025-015', '11B-03', 'FBISE-RWP-2025-44203', 'Zain Ul Abideen', 'Nasir Hussain', 3, 6, 1, '0301-4420003', 'zain.abideen@student.ecn.edu.pk', 'zabideen15'),
  (16, 'AEC-2025-016', '11B-04', 'FBISE-RWP-2025-44204', 'Maham Javed', 'Javed Iqbal', 3, 6, 1, '0301-4420004', 'maham.javed@student.ecn.edu.pk', 'mjaved16'),
  (17, 'AEC-2025-017', '11B-05', 'FBISE-RWP-2025-44205', 'Saad Rehman', 'Abdul Rehman', 3, 6, 1, '0301-4420005', 'saad.rehman@student.ecn.edu.pk', 'srehman17'),
  (18, 'AEC-2025-018', '11B-06', 'FBISE-RWP-2025-44206', 'Laiba Khalid', 'Khalid Mehmood', 3, 6, 1, '0301-4420006', 'laiba.khalid@student.ecn.edu.pk', 'lkhalid18'),
  (19, 'AEC-2025-019', '11B-07', 'FBISE-RWP-2025-44207', 'Hassan Raza', 'Qamar Raza', 3, 6, 1, '0301-4420007', 'hassan.raza@student.ecn.edu.pk', 'hraza19'),
  (20, 'AEC-2025-020', '11B-08', 'FBISE-RWP-2025-44208', 'Areeba Nadeem', 'Nadeem Akhtar', 3, 6, 1, '0301-4420008', 'areeba.nadeem@student.ecn.edu.pk', 'anadeem20');

insert into timetable_slots (section_id, subject_id, teacher_id, day_of_week, period, starts_at, ends_at, room) values
  (5, 1, 1, 1, 1, '08:00', '08:45', 'R-11A'),
  (5, 3, 2, 1, 2, '08:45', '09:30', 'R-11A'),
  (5, 2, 3, 1, 3, '09:30', '10:15', 'R-11A'),
  (5, 4, 4, 1, 4, '10:30', '11:15', 'Lab-CS'),
  (5, 5, 5, 1, 5, '11:15', '12:00', 'R-11A'),
  (5, 7, 6, 1, 6, '12:00', '12:45', 'R-11A'),
  (5, 3, 2, 2, 1, '08:00', '08:45', 'R-11A'),
  (5, 1, 1, 2, 2, '08:45', '09:30', 'Lab-Phy'),
  (5, 4, 4, 2, 3, '09:30', '10:15', 'R-11A'),
  (5, 2, 3, 2, 4, '10:30', '11:15', 'Lab-Chm'),
  (5, 8, 6, 2, 5, '11:15', '12:00', 'R-11A'),
  (5, 5, 5, 2, 6, '12:00', '12:45', 'R-11A'),
  (5, 2, 3, 3, 1, '08:00', '08:45', 'R-11A'),
  (5, 3, 2, 3, 2, '08:45', '09:30', 'R-11A'),
  (5, 1, 1, 3, 3, '09:30', '10:15', 'R-11A'),
  (5, 5, 5, 3, 4, '10:30', '11:15', 'R-11A'),
  (5, 4, 4, 3, 5, '11:15', '12:00', 'Lab-CS'),
  (5, 7, 6, 3, 6, '12:00', '12:45', 'R-11A'),
  (5, 4, 4, 4, 1, '08:00', '08:45', 'R-11A'),
  (5, 1, 1, 4, 2, '08:45', '09:30', 'R-11A'),
  (5, 3, 2, 4, 3, '09:30', '10:15', 'R-11A'),
  (5, 2, 3, 4, 4, '10:30', '11:15', 'R-11A'),
  (5, 5, 5, 4, 5, '11:15', '12:00', 'R-11A'),
  (5, 8, 6, 4, 6, '12:00', '12:45', 'R-11A'),
  (5, 3, 2, 5, 1, '08:00', '08:45', 'R-11A'),
  (5, 2, 3, 5, 2, '08:45', '09:30', 'Lab-Chm'),
  (5, 1, 1, 5, 3, '09:30', '10:15', 'Lab-Phy'),
  (5, 4, 4, 5, 4, '10:30', '11:15', 'Lab-CS'),
  (5, 7, 6, 5, 5, '11:15', '12:00', 'R-11A'),
  (5, 5, 5, 5, 6, '12:00', '12:45', 'R-11A'),
  (6, 1, 1, 1, 1, '08:00', '08:45', 'R-11B'),
  (6, 3, 2, 1, 2, '08:45', '09:30', 'R-11B'),
  (6, 2, 3, 1, 3, '09:30', '10:15', 'R-11B'),
  (6, 4, 4, 1, 4, '10:30', '11:15', 'Lab-CS');

insert into materials (title, description, type, url, subject_id, class_id, section_id, teacher_id, uploaded_by) values
  ('Mechanics lecture notes', 'Worked examples on Newton''s laws and friction for Grade 11.', 'pdf', 'https://www.w3.org/WAI/WCAG21/Understanding/pdfs/understanding.pdf', 1, 3, 5, 1, 'seed'),
  ('MIT Classical Mechanics — Lecture 1', 'OpenCourseWare lecture on inertial frames and Newton''s laws.', 'youtube', 'https://www.youtube.com/watch?v=wWnfJ0-xXRE', 1, 3, null, 1, 'seed'),
  ('Chemical bonding worksheet', 'Ionic, covalent and metallic bonding practice sheet.', 'pdf', 'https://www.w3.org/WAI/WCAG21/Understanding/pdfs/understanding.pdf', 2, 3, null, 3, 'seed'),
  ('Calculus crash notes', 'Limits, derivatives and a first look at integrals.', 'docx', 'https://file-examples.com/storage/fe8c7eef0c66f447a9bf9b6/2017/02/file-sample_100kB.docx', 3, 3, null, 2, 'seed'),
  ('Python programming lab 01', 'Variables, types and control flow — lab brief.', 'pdf', 'https://www.w3.org/WAI/WCAG21/Understanding/pdfs/understanding.pdf', 4, 3, 5, 4, 'seed'),
  ('CS50 — Introduction to programming', 'Harvard CS50 lecture on computational thinking.', 'youtube', 'https://www.youtube.com/watch?v=8mAITcNt710', 4, 3, null, 4, 'seed'),
  ('Essay bank — Pakistan Studies', 'Model essays on ideology, constitution and Kashmir.', 'pdf', 'https://www.w3.org/WAI/WCAG21/Understanding/pdfs/understanding.pdf', 7, 3, null, 6, 'seed'),
  ('Periodic table wall chart', 'Printable IUPAC periodic table for the chemistry lab.', 'image', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Simple_Periodic_Table_Chart-en.svg/1280px-Simple_Periodic_Table_Chart-en.svg.png', 2, 3, null, 3, 'seed'),
  ('FBISE English paper pattern', 'External link to the current HSSC English paper scheme.', 'link', 'https://www.fbise.edu.pk/', 5, 3, null, 5, 'seed');

insert into assignments (id, title, description, subject_id, class_id, section_id, teacher_id, due_at, max_marks, attachment_url, created_by) values
  (1, 'Newton''s laws problem set', 'Solve problems 1–12 from the mechanics notes. Show free-body diagrams.', 1, 3, 5, 1, '2026-09-20 16:00:00+05', 50, null, 'seed'),
  (2, 'Stoichiometry worksheet', 'Balanced equations and limiting reagent calculations.', 2, 3, null, 3, '2026-09-18 16:00:00+05', 40, null, 'seed'),
  (3, 'Matrices project', 'Use matrices to encode and decode a short English message. Submit working + explanation.', 3, 3, 5, 2, '2026-09-25 16:00:00+05', 100, null, 'seed'),
  (4, 'Python: grade calculator', 'Write a program that reads marks for 5 subjects and prints percentage, GPA and letter grade.', 4, 3, 5, 4, '2026-09-16 23:59:00+05', 60, null, 'seed'),
  (5, 'Essay: Ideology of Pakistan', '800–1000 words. Cite at least two primary sources discussed in class.', 7, 3, null, 6, '2026-09-22 16:00:00+05', 30, null, 'seed'),
  (6, 'Lab report — Ohm''s law', 'Plot V–I characteristics of a resistor and extract resistance from the slope.', 1, 3, 5, 1, '2026-09-12 16:00:00+05', 40, null, 'seed');

insert into assignment_submissions (assignment_id, student_id, content, submitted_at, marks, feedback, status, graded_by) values
  (6, 1, 'Report attached. Measured R = 9.8 Ω, within 2% of the colour-code value.', '2026-09-11 21:10:00+05', 36, 'Clear graphs. Discuss uncertainty next time.', 'graded', 'seed'),
  (6, 2, 'V–I plot and calculations included.', '2026-09-11 18:42:00+05', 38, 'Excellent treatment of error bars.', 'graded', 'seed'),
  (6, 3, 'Completed lab report.', '2026-09-12 09:05:00+05', 31, 'Slope calculation is correct; axis labels missing.', 'graded', 'seed'),
  (4, 1, 'GitHub gist with the grade calculator. Handles A+ through F.', '2026-09-10 20:15:00+05', null, null, 'submitted', null),
  (4, 4, 'Program written in Python 3.12. Sample run attached.', '2026-09-11 14:02:00+05', null, null, 'submitted', null),
  (1, 2, 'Attempted 1–10. Need help with problem 11 (pulley + incline).', '2026-09-12 19:40:00+05', null, null, 'submitted', null);

insert into questions (id, subject_id, type, prompt, options_json, answer, marks) values
  (1, 1, 'mcq', 'A body of mass 2 kg is accelerated at 3 m/s². The net force is:', '["3 N","5 N","6 N","9 N"]', '6 N', 2),
  (2, 1, 'true_false', 'The work done by a centripetal force on a satellite in circular orbit is zero.', null, 'true', 1),
  (3, 1, 'fill_blank', 'The SI unit of power is the ____.', null, 'watt', 1),
  (4, 1, 'short', 'State Newton''s second law of motion in words.', null, 'The acceleration of a body is proportional to the net force and inversely proportional to its mass, in the direction of the net force.', 3),
  (5, 1, 'mcq', 'The dimensional formula of force is:', '["[MLT^-2]","[MLT^-1]","[ML^2T^-2]","[MT^-2]"]', '[MLT^-2]', 2),
  (6, 1, 'true_false', 'Momentum is a scalar quantity.', null, 'false', 1),
  (7, 3, 'mcq', 'The derivative of sin x with respect to x is:', '["cos x","-cos x","-sin x","tan x"]', 'cos x', 1),
  (8, 3, 'fill_blank', 'The determinant of an identity matrix of any order is ____.', null, '1', 1),
  (9, 3, 'mcq', 'If A = {1,2,3} and B = {3,4}, then A ∩ B is:', '["{1,2,3,4}","{3}","{1,2}","{}"]', '{3}', 1),
  (10, 4, 'mcq', 'Which data type in Python is immutable?', '["list","dict","tuple","set"]', 'tuple', 1),
  (11, 4, 'true_false', 'A binary search on a sorted array of n items has worst-case complexity O(log n).', null, 'true', 1),
  (12, 4, 'short', 'What does the acronym RAM stand for?', null, 'Random Access Memory', 2),
  (13, 2, 'mcq', 'The number of moles in 18 g of water is:', '["0.5","1","2","18"]', '1', 1),
  (14, 2, 'true_false', 'An ionic bond is formed by the sharing of electrons.', null, 'false', 1),
  (15, 1, 'long', 'Derive the expression for the kinetic energy of a body of mass m moving with speed v, starting from Newton''s second law and the work–energy theorem.', null, 'W = F s = m a s. Using v^2 = u^2 + 2as with u=0, s = v^2/2a, so W = m v^2 / 2. Hence KE = ½mv².', 5);

insert into quizzes (id, title, description, subject_id, class_id, section_id, teacher_id, duration_minutes, max_attempts, randomize, available_from, available_until, created_by) values
  (1, 'Mechanics checkpoint', 'Short quiz on force, momentum and energy. Auto-graded items plus one short answer.', 1, 3, 5, 1, 20, 2, true, '2026-09-01 08:00:00+05', '2026-09-30 23:59:00+05', 'seed'),
  (2, 'Mathematics warm-up', 'Functions, matrices and a first derivative.', 3, 3, null, 2, 15, 3, true, '2026-09-01 08:00:00+05', '2026-10-15 23:59:00+05', 'seed'),
  (3, 'Computing fundamentals', 'Data types, complexity and computer systems.', 4, 3, 5, 4, 15, 2, false, '2026-09-05 08:00:00+05', '2026-09-28 23:59:00+05', 'seed');

insert into quiz_questions (quiz_id, question_id, position) values
  (1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6),
  (2, 7, 1), (2, 8, 2), (2, 9, 3),
  (3, 10, 1), (3, 11, 2), (3, 12, 3);

insert into quiz_attempts (quiz_id, student_id, started_at, submitted_at, answers_json, score, max_score, attempt_no) values
  (1, 1, '2026-09-08 10:00:00+05', '2026-09-08 10:14:00+05', '{"1":"6 N","2":"true","3":"watt","4":"Net force equals mass times acceleration.","5":"[MLT^-2]","6":"false"}', 10, 10, 1),
  (1, 2, '2026-09-08 11:02:00+05', '2026-09-08 11:18:00+05', '{"1":"6 N","2":"true","3":"joule","5":"[MLT^-2]","6":"false"}', 6, 10, 1),
  (3, 4, '2026-09-09 09:30:00+05', '2026-09-09 09:40:00+05', '{"10":"tuple","11":"true","12":"Random Access Memory"}', 4, 4, 1);

insert into attendance (student_id, section_id, subject_id, attended_on, status, source, marked_by)
select s.id, s.section_id, null, d::date,
  case
    when (s.id + extract(day from d)::int) % 17 = 0 then 'absent'
    when (s.id + extract(day from d)::int) % 11 = 0 then 'late'
    else 'present'
  end,
  'class', 'seed'
from students s
cross join generate_series(date '2026-08-31', date '2026-09-11', interval '1 day') d
where extract(isodow from d) between 1 and 5;

insert into meetings (title, platform, url, subject_id, section_id, teacher_id, starts_at, ends_at, created_by) values
  ('Physics — Modern physics intro', 'meet', 'https://meet.google.com/aec-phys-11a', 1, 5, 1, '2026-09-15 09:30:00+05', '2026-09-15 10:15:00+05', 'seed'),
  ('Computer Science lab — Git', 'zoom', 'https://zoom.us/j/83729104615', 4, 5, 4, '2026-09-16 10:30:00+05', '2026-09-16 11:15:00+05', 'seed'),
  ('Mathematics problem clinic', 'teams', 'https://teams.microsoft.com/l/meetup-join/aec-math-clinic', 3, 5, 2, '2026-09-17 16:00:00+05', '2026-09-17 17:00:00+05', 'seed'),
  ('College assembly — Defence Day reflection', 'meet', 'https://meet.google.com/aec-assembly', null, null, 1, '2026-09-06 08:00:00+05', '2026-09-06 08:40:00+05', 'seed');

insert into notifications (title, body, type, audience, created_by, created_at) values
  ('Mid-term timetable released', 'The HSSC-I mid-term examination will run from 13 to 24 October 2026. Seating plans will be posted on the notice board and in Results.', 'notice', 'all', 'seed', '2026-09-08 09:00:00+05'),
  ('Physics assignment due Friday', 'Newton''s laws problem set is due 20 September at 16:00 PKT. Late work is not accepted without the class incharge''s note.', 'assignment', 'students', 'seed', '2026-09-10 11:00:00+05'),
  ('Mechanics checkpoint quiz is live', 'Grade 11-A: 20 minutes, two attempts, available until 30 September.', 'quiz', 'students', 'seed', '2026-09-07 08:30:00+05'),
  ('Attendance reminder', 'Parents of students below 80% attendance this month will receive a written notice from the Academic Office.', 'attendance', 'students', 'seed', '2026-09-09 14:00:00+05'),
  ('Lab safety briefing', 'Chemistry and Physics labs: lab coats are compulsory from Monday. Students without coats will be marked absent for the practical.', 'notice', 'all', 'seed', '2026-09-05 10:00:00+05'),
  ('Grading window open', 'Teachers: Ohm''s law lab reports for 11-A have been submitted. Please grade by Wednesday.', 'assignment', 'teachers', 'seed', '2026-09-12 08:00:00+05');

insert into forum_threads (id, title, body, subject_id, class_id, author_user_id, author_name, created_at) values
  (1, 'Pulley on an incline — sign of acceleration?', 'In problem 11 the block on the incline can go either way depending on μ. How do we choose the positive direction before we know which way it moves?', 1, 3, 'seed-student', 'Ahmed Hassan', '2026-09-09 19:12:00+05'),
  (2, 'Recommended Python editor for the lab?', 'Is VS Code acceptable or do we have to use the lab machines'' IDLE?', 4, 3, 'seed-student', 'Ayesha Siddiqui', '2026-09-08 16:40:00+05'),
  (3, 'Clarification on mid-term syllabus — Physics', 'Are oscillations included in the mid-term or only mechanics through energy?', 1, 3, 'seed-student', 'Fatima Noor', '2026-09-10 21:05:00+05');

insert into forum_posts (thread_id, body, author_user_id, author_name, created_at) values
  (1, 'Assume a direction, write equations, and if the acceleration comes out negative the block moves the other way. Do not change signs mid-solution.', 'seed-teacher', 'Dr. Ayesha Rahman', '2026-09-09 20:01:00+05'),
  (1, 'That helped — I got a = 0.31 m/s² down the plane with μ = 0.2.', 'seed-student', 'Ahmed Hassan', '2026-09-09 21:18:00+05'),
  (2, 'VS Code is fine. Install the Python extension and submit a .py file. Do not submit screenshots of the editor.', 'seed-teacher', 'Mr. Hassan Ali', '2026-09-08 17:10:00+05'),
  (3, 'Mid-term covers Units 1–4 only (through waves). Electrostatics starts after the exam.', 'seed-teacher', 'Dr. Ayesha Rahman', '2026-09-11 08:22:00+05');

insert into exams (id, name, type, session_id, class_id, exam_date, published) values
  (1, 'HSSC-I Mid-Term 2026', 'midterm', 1, 3, '2026-03-10', true),
  (2, 'First monthly test — Physics', 'subject', 1, 3, '2026-09-05', true);

insert into exam_scores (exam_id, student_id, subject_id, marks, max_marks)
select 1, s.id, subj.sid,
  greatest(42, least(96, 58 + ((s.id * 7 + subj.sid * 13) % 39)))::numeric,
  100
from students s
cross join (values (1), (2), (3), (4), (5), (7)) as subj(sid)
where s.class_id = 3;

insert into exam_scores (exam_id, student_id, subject_id, marks, max_marks)
select 2, s.id, 1,
  greatest(18, least(48, 22 + ((s.id * 5) % 27)))::numeric,
  50
from students s
where s.section_id = 5;

insert into calendar_events (title, description, event_date, event_type) values
  ('Start of academic session 2025-26', 'Orientation for new HSSC students in the auditorium, 08:30.', '2025-08-15', 'term'),
  ('Defence Day of Pakistan', 'College closed. Optional assembly recording posted on the LMS.', '2025-09-06', 'holiday'),
  ('First monthly tests', 'Subject tests for Grades 9–12. See the timetable module.', '2026-09-05', 'exam'),
  ('Parent–teacher conference', 'By appointment with class incharges, 14:00–18:00.', '2026-09-19', 'event'),
  ('HSSC-I Mid-term examinations begin', 'Seating in Halls A and B. Mobile phones are not permitted.', '2026-10-13', 'exam'),
  ('Quaid-e-Azam Day', 'College closed.', '2025-12-25', 'holiday'),
  ('Winter break begins', 'College reopens 5 January 2026.', '2025-12-26', 'term'),
  ('Pakistan Day', 'College closed. Flag-raising recorded for the archive.', '2026-03-23', 'holiday'),
  ('Annual sports day', 'Athletics at the PAEC ground, 08:00–15:00.', '2026-02-14', 'event'),
  ('Eid-ul-Fitr (tentative)', 'Dates subject to moon sighting. College closed.', '2026-03-21', 'holiday'),
  ('HSSC-II send-up examinations', 'Internal send-ups for Grade 12.', '2026-04-06', 'exam'),
  ('End of academic session', 'Result gazette and summer vacation.', '2026-06-30', 'term');

select setval('academic_sessions_id_seq', (select max(id) from academic_sessions));
select setval('subjects_id_seq', (select max(id) from subjects));
select setval('classes_id_seq', (select max(id) from classes));
select setval('teachers_id_seq', (select max(id) from teachers));
select setval('sections_id_seq', (select max(id) from sections));
select setval('students_id_seq', (select max(id) from students));
select setval('assignments_id_seq', (select max(id) from assignments));
select setval('questions_id_seq', (select max(id) from questions));
select setval('quizzes_id_seq', (select max(id) from quizzes));
select setval('exams_id_seq', (select max(id) from exams));
select setval('forum_threads_id_seq', (select max(id) from forum_threads));
