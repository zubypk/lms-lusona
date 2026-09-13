import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { assertRole, audit, notify, requireActor } from "./actor";

export const listMaterials = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().optional() }).optional())
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const q = data?.q?.trim().toLowerCase() ?? "";
    const like = `%${q}%`;
    return sql<{
      id: number;
      title: string;
      description: string | null;
      type: string;
      url: string;
      subject_name: string;
      class_name: string | null;
      teacher_name: string | null;
      created_at: string;
    }>`
      select m.id, m.title, m.description, m.type, m.url, sub.name as subject_name,
             c.name as class_name, t.name as teacher_name, m.created_at
      from materials m
      join subjects sub on sub.id = m.subject_id
      left join classes c on c.id = m.class_id
      left join teachers t on t.id = m.teacher_id
      where (${q} = '' or lower(m.title) like ${like} or lower(m.description) like ${like} or lower(sub.name) like ${like})
        and (
          ${actor.role} <> 'student'
          or m.class_id is null
          or m.class_id = ${actor.classId}
        )
      order by m.created_at desc
    `;
  });

export const saveMaterial = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      type: z.string(),
      url: z.string().min(4),
      subjectId: z.number(),
      classId: z.number().optional(),
      sectionId: z.number().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    await sql`
      insert into materials (title, description, type, url, subject_id, class_id, section_id, teacher_id, uploaded_by)
      values (
        ${data.title}, ${data.description ?? null}, ${data.type}, ${data.url}, ${data.subjectId},
        ${data.classId ?? null}, ${data.sectionId ?? null}, ${actor.teacherId}, ${context.userId}
      )
    `;
    await notify(sql, "New study material", data.title, "notice", "students", context.userId);
    return { ok: true };
  });

export const listAssignments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const rows = await sql<{
      id: number;
      title: string;
      description: string | null;
      due_at: string;
      max_marks: number;
      subject_name: string;
      class_name: string;
      teacher_name: string | null;
      submission_count: number;
      my_status: string | null;
      my_marks: number | null;
    }>`
      select a.id, a.title, a.description, a.due_at, a.max_marks,
             sub.name as subject_name, c.name as class_name, t.name as teacher_name,
             (select count(*)::int from assignment_submissions s where s.assignment_id = a.id) as submission_count,
             (select s.status from assignment_submissions s where s.assignment_id = a.id and s.student_id = ${actor.studentId} limit 1) as my_status,
             (select s.marks from assignment_submissions s where s.assignment_id = a.id and s.student_id = ${actor.studentId} limit 1) as my_marks
      from assignments a
      join subjects sub on sub.id = a.subject_id
      join classes c on c.id = a.class_id
      left join teachers t on t.id = a.teacher_id
      where a.published = true
        and (${actor.role} <> 'student' or (a.class_id = ${actor.classId} and (a.section_id is null or a.section_id = ${actor.sectionId})))
        and (${actor.role} <> 'teacher' or a.teacher_id = ${actor.teacherId} or ${actor.role} = 'class_incharge')
      order by a.due_at
    `;
    return rows;
  });

export const getAssignment = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const [assignment] = await sql<{
      id: number;
      title: string;
      description: string | null;
      due_at: string;
      max_marks: number;
      attachment_url: string | null;
      subject_id: number;
      class_id: number;
      section_id: number | null;
      teacher_id: number | null;
      subject_name: string;
      class_name: string;
    }>`
      select a.*, sub.name as subject_name, c.name as class_name
      from assignments a
      join subjects sub on sub.id = a.subject_id
      join classes c on c.id = a.class_id
      where a.id = ${data.id}
    `;
    if (!assignment) throw new Error("Assignment not found");
    const submissions = await sql<{
      id: number;
      student_id: number;
      student_name: string;
      roll_number: string;
      content: string | null;
      file_url: string | null;
      submitted_at: string;
      marks: number | null;
      feedback: string | null;
      status: string;
    }>`
      select s.id, s.student_id, st.name as student_name, st.roll_number, s.content, s.file_url,
             s.submitted_at, s.marks, s.feedback, s.status
      from assignment_submissions s
      join students st on st.id = s.student_id
      where s.assignment_id = ${data.id}
      order by st.roll_number
    `;
    const mine = actor.studentId ? submissions.find((s) => s.student_id === actor.studentId) ?? null : null;
    return { assignment, submissions: actor.role === "student" ? (mine ? [mine] : []) : submissions, mine, actor };
  });

export const saveAssignment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      subjectId: z.number(),
      classId: z.number(),
      sectionId: z.number().optional(),
      dueAt: z.string(),
      maxMarks: z.number(),
      attachmentUrl: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    const rows = await sql<{ id: number }>`
      insert into assignments (
        title, description, subject_id, class_id, section_id, teacher_id, due_at, max_marks, attachment_url, created_by
      ) values (
        ${data.title}, ${data.description ?? null}, ${data.subjectId}, ${data.classId},
        ${data.sectionId ?? null}, ${actor.teacherId}, ${data.dueAt}, ${data.maxMarks},
        ${data.attachmentUrl ?? null}, ${context.userId}
      ) returning id
    `;
    await notify(sql, "New assignment", data.title, "assignment", "students", context.userId);
    await audit(sql, context.userId, "create_assignment", "assignment", rows[0]?.id, data.title);
    return { id: rows[0]?.id };
  });

export const submitAssignment = createServerFn({ method: "POST" })
  .validator(z.object({ assignmentId: z.number(), content: z.string().min(2), fileUrl: z.string().optional() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    if (!actor.studentId) throw new Error("Only students can submit work.");
    const [a] = await sql<{ due_at: string }>`select due_at from assignments where id = ${data.assignmentId}`;
    if (!a) throw new Error("Assignment not found");
    if (new Date(a.due_at).getTime() < Date.now() - 60_000) {
      const existing = await sql<{ id: number }>`
        select id from assignment_submissions where assignment_id = ${data.assignmentId} and student_id = ${actor.studentId}
      `;
      if (!existing[0]) throw new Error("The deadline has passed.");
    }
    await sql`
      insert into assignment_submissions (assignment_id, student_id, content, file_url, status, submitted_at)
      values (${data.assignmentId}, ${actor.studentId}, ${data.content}, ${data.fileUrl ?? null}, 'submitted', now())
      on conflict (assignment_id, student_id) do update set
        content = excluded.content,
        file_url = excluded.file_url,
        status = 'submitted',
        submitted_at = now(),
        marks = null,
        feedback = null
    `;
    return { ok: true };
  });

export const gradeSubmission = createServerFn({ method: "POST" })
  .validator(z.object({ submissionId: z.number(), marks: z.number(), feedback: z.string().optional() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    await sql`
      update assignment_submissions
      set marks = ${data.marks}, feedback = ${data.feedback ?? null}, status = 'graded', graded_by = ${context.userId}
      where id = ${data.submissionId}
    `;
    return { ok: true };
  });

export const listQuizzes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    return sql<{
      id: number;
      title: string;
      description: string | null;
      duration_minutes: number;
      max_attempts: number;
      subject_name: string;
      class_name: string;
      available_until: string | null;
      question_count: number;
      my_attempts: number;
      my_best: string | number | null;
    }>`
      select q.id, q.title, q.description, q.duration_minutes, q.max_attempts,
             sub.name as subject_name, c.name as class_name, q.available_until,
             (select count(*)::int from quiz_questions qq where qq.quiz_id = q.id) as question_count,
             (select count(*)::int from quiz_attempts a where a.quiz_id = q.id and a.student_id = ${actor.studentId} and a.submitted_at is not null) as my_attempts,
             (select max(a.score) from quiz_attempts a where a.quiz_id = q.id and a.student_id = ${actor.studentId} and a.submitted_at is not null) as my_best
      from quizzes q
      join subjects sub on sub.id = q.subject_id
      join classes c on c.id = q.class_id
      where q.published = true
        and (${actor.role} <> 'student' or (q.class_id = ${actor.classId} and (q.section_id is null or q.section_id = ${actor.sectionId})))
      order by q.created_at desc
    `;
  });

export const getQuiz = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number(), forTaking: z.boolean().optional() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const [quiz] = await sql<{
      id: number;
      title: string;
      description: string | null;
      duration_minutes: number;
      max_attempts: number;
      randomize: boolean;
      subject_name: string;
      available_until: string | null;
    }>`
      select q.id, q.title, q.description, q.duration_minutes, q.max_attempts, q.randomize,
             sub.name as subject_name, q.available_until
      from quizzes q join subjects sub on sub.id = q.subject_id
      where q.id = ${data.id}
    `;
    if (!quiz) throw new Error("Quiz not found");
    const questions = await sql<{
      id: number;
      type: string;
      prompt: string;
      options_json: string | null;
      answer: string | null;
      marks: number;
      position: number;
    }>`
      select qs.id, qs.type, qs.prompt, qs.options_json, qs.answer, qs.marks, qq.position
      from quiz_questions qq
      join questions qs on qs.id = qq.question_id
      where qq.quiz_id = ${data.id}
      order by qq.position
    `;
    const hideAnswers = Boolean(data.forTaking) && actor.role === "student";
    const safe = questions.map((q) => ({
      ...q,
      answer: hideAnswers ? null : q.answer,
    }));
    const attempts = actor.studentId
      ? await sql<{
          id: number;
          attempt_no: number;
          score: string | number | null;
          max_score: string | number | null;
          submitted_at: string | null;
          started_at: string;
        }>`
          select id, attempt_no, score, max_score, submitted_at, started_at
          from quiz_attempts
          where quiz_id = ${data.id} and student_id = ${actor.studentId}
          order by attempt_no
        `
      : [];
    return { quiz, questions: safe, attempts, actor };
  });

export const startQuiz = createServerFn({ method: "POST" })
  .validator(z.object({ quizId: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    if (!actor.studentId) throw new Error("Only students can attempt quizzes.");
    const [quiz] = await sql<{ max_attempts: number; duration_minutes: number }>`
      select max_attempts, duration_minutes from quizzes where id = ${data.quizId}
    `;
    if (!quiz) throw new Error("Quiz not found");
    const existing = await sql<{ n: number; open_id: number | null }>`
      select count(*)::int as n,
             max(case when submitted_at is null then id end) as open_id
      from quiz_attempts where quiz_id = ${data.quizId} and student_id = ${actor.studentId}
    `;
    if (existing[0]?.open_id) return { attemptId: existing[0].open_id, duration: quiz.duration_minutes };
    if (existing[0].n >= quiz.max_attempts) throw new Error("No attempts remaining.");
    const rows = await sql<{ id: number }>`
      insert into quiz_attempts (quiz_id, student_id, attempt_no)
      values (${data.quizId}, ${actor.studentId}, ${existing[0].n + 1})
      returning id
    `;
    return { attemptId: rows[0].id, duration: quiz.duration_minutes };
  });

export const submitQuiz = createServerFn({ method: "POST" })
  .validator(
    z.object({
      attemptId: z.number(),
      answers: z.record(z.string(), z.string()),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    if (!actor.studentId) throw new Error("Only students can submit quizzes.");
    const [attempt] = await sql<{ id: number; quiz_id: number; submitted_at: string | null }>`
      select id, quiz_id, submitted_at from quiz_attempts
      where id = ${data.attemptId} and student_id = ${actor.studentId}
    `;
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.submitted_at) throw new Error("Already submitted.");
    const questions = await sql<{
      id: number;
      type: string;
      answer: string | null;
      marks: number;
    }>`
      select qs.id, qs.type, qs.answer, qs.marks
      from quiz_questions qq join questions qs on qs.id = qq.question_id
      where qq.quiz_id = ${attempt.quiz_id}
    `;
    let score = 0;
    let max = 0;
    for (const q of questions) {
      max += q.marks;
      const given = (data.answers[String(q.id)] ?? "").trim();
      if (q.type === "short" || q.type === "long") {
        if (given.length > 8) score += q.marks * 0.5;
        continue;
      }
      const expected = (q.answer ?? "").trim().toLowerCase();
      if (given.toLowerCase() === expected) score += q.marks;
    }
    await sql`
      update quiz_attempts
      set submitted_at = now(), answers_json = ${JSON.stringify(data.answers)},
          score = ${score}, max_score = ${max}
      where id = ${data.attemptId}
    `;
    return { score, max, pct: max ? Math.round((score / max) * 100) : 0 };
  });

export const saveQuiz = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      subjectId: z.number(),
      classId: z.number(),
      durationMinutes: z.number(),
      maxAttempts: z.number(),
      questions: z.array(
        z.object({
          type: z.string(),
          prompt: z.string().min(2),
          options: z.array(z.string()).optional(),
          answer: z.string().optional(),
          marks: z.number(),
        }),
      ),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    const [quiz] = await sql<{ id: number }>`
      insert into quizzes (title, description, subject_id, class_id, teacher_id, duration_minutes, max_attempts, created_by)
      values (
        ${data.title}, ${data.description ?? null}, ${data.subjectId}, ${data.classId},
        ${actor.teacherId}, ${data.durationMinutes}, ${data.maxAttempts}, ${context.userId}
      ) returning id
    `;
    let pos = 1;
    for (const q of data.questions) {
      const [row] = await sql<{ id: number }>`
        insert into questions (subject_id, type, prompt, options_json, answer, marks, created_by)
        values (
          ${data.subjectId}, ${q.type}, ${q.prompt},
          ${q.options ? JSON.stringify(q.options) : null},
          ${q.answer ?? null}, ${q.marks}, ${context.userId}
        ) returning id
      `;
      await sql`
        insert into quiz_questions (quiz_id, question_id, position)
        values (${quiz.id}, ${row.id}, ${pos})
      `;
      pos += 1;
    }
    await notify(sql, "New quiz", data.title, "quiz", "students", context.userId);
    return { id: quiz.id };
  });

export const listMeetings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireActor(context.userId, sql);
    return sql<{
      id: number;
      title: string;
      platform: string;
      url: string;
      starts_at: string;
      ends_at: string | null;
      subject_name: string | null;
      teacher_name: string | null;
    }>`
      select m.id, m.title, m.platform, m.url, m.starts_at, m.ends_at,
             sub.name as subject_name, t.name as teacher_name
      from meetings m
      left join subjects sub on sub.id = m.subject_id
      left join teachers t on t.id = m.teacher_id
      order by m.starts_at desc
    `;
  });

export const saveMeeting = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(2),
      platform: z.enum(["meet", "zoom", "teams"]),
      url: z.string().min(8),
      subjectId: z.number().optional(),
      sectionId: z.number().optional(),
      startsAt: z.string(),
      endsAt: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    await sql`
      insert into meetings (title, platform, url, subject_id, section_id, teacher_id, starts_at, ends_at, created_by)
      values (
        ${data.title}, ${data.platform}, ${data.url}, ${data.subjectId ?? null},
        ${data.sectionId ?? null}, ${actor.teacherId}, ${data.startsAt}, ${data.endsAt ?? null}, ${context.userId}
      )
    `;
    await notify(sql, "Online class scheduled", data.title, "notice", "students", context.userId);
    return { ok: true };
  });

export const listForum = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().optional() }).optional())
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireActor(context.userId, sql);
    const q = data?.q?.trim().toLowerCase() ?? "";
    const like = `%${q}%`;
    return sql<{
      id: number;
      title: string;
      body: string;
      author_name: string;
      created_at: string;
      subject_name: string | null;
      replies: number;
    }>`
      select t.id, t.title, t.body, t.author_name, t.created_at, sub.name as subject_name,
             (select count(*)::int from forum_posts p where p.thread_id = t.id) as replies
      from forum_threads t
      left join subjects sub on sub.id = t.subject_id
      where ${q} = '' or lower(t.title) like ${like} or lower(t.body) like ${like}
      order by t.created_at desc
    `;
  });

export const getThread = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireActor(context.userId, sql);
    const [thread] = await sql<{
      id: number;
      title: string;
      body: string;
      author_name: string;
      created_at: string;
      subject_name: string | null;
    }>`
      select t.id, t.title, t.body, t.author_name, t.created_at, sub.name as subject_name
      from forum_threads t left join subjects sub on sub.id = t.subject_id
      where t.id = ${data.id}
    `;
    if (!thread) throw new Error("Thread not found");
    const posts = await sql<{
      id: number;
      body: string;
      author_name: string;
      author_user_id: string;
      created_at: string;
    }>`
      select id, body, author_name, author_user_id, created_at
      from forum_posts where thread_id = ${data.id} order by created_at
    `;
    return { thread, posts };
  });

export const saveThread = createServerFn({ method: "POST" })
  .validator(z.object({ title: z.string().min(4), body: z.string().min(4), subjectId: z.number().optional() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const [row] = await sql<{ id: number }>`
      insert into forum_threads (title, body, subject_id, class_id, author_user_id, author_name)
      values (${data.title}, ${data.body}, ${data.subjectId ?? null}, ${actor.classId}, ${context.userId}, ${actor.displayName})
      returning id
    `;
    return { id: row.id };
  });

export const savePost = createServerFn({ method: "POST" })
  .validator(z.object({ threadId: z.number(), body: z.string().min(2) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    await sql`
      insert into forum_posts (thread_id, body, author_user_id, author_name)
      values (${data.threadId}, ${data.body}, ${context.userId}, ${actor.displayName})
    `;
    return { ok: true };
  });
