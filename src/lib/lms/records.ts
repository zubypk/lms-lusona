import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { assertRole, assertSectionAccess, notify, requireActor, teacherSectionIds } from "./actor";

import { letterAndGpa, num } from "./format";

export const getAttendance = createServerFn({ method: "GET" })
  .validator(z.object({ sectionId: z.number().optional(), from: z.string().optional(), to: z.string().optional() }).optional())
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const mine = actor.teacherId ? await teacherSectionIds(sql, actor.teacherId) : [];
    const fallback = actor.sectionId ?? mine[0] ?? 5;
    const sectionId = data?.sectionId ?? fallback;
    if (actor.role === "teacher" || actor.role === "class_incharge") {
      await assertSectionAccess(sql, actor, sectionId);
    }
    const from = data?.from ?? "2026-08-01";
    const to = data?.to ?? "2026-12-31";

    const students = await sql<{ id: number; name: string; roll_number: string }>`
      select id, name, roll_number from students where section_id = ${sectionId} order by roll_number
    `;
    const records = await sql<{
      student_id: number;
      attended_on: string;
      status: string;
    }>`
      select student_id, attended_on, status from attendance
      where section_id = ${sectionId} and attended_on >= ${from} and attended_on <= ${to}
        and (${actor.role} <> 'student' or student_id = ${actor.studentId})
    `;
    const days = [...new Set(records.map((r) => r.attended_on))].sort();
    const map: Record<string, string> = {};
    for (const r of records) map[`${r.student_id}:${r.attended_on}`] = r.status;
    const summary = students.map((s) => {
      let present = 0;
      let total = 0;
      for (const d of days) {
        const st = map[`${s.id}:${d}`];
        if (!st) continue;
        total += 1;
        if (st === "present" || st === "late") present += 1;
      }
      return { ...s, present, total, pct: total ? Math.round((present / total) * 100) : 0 };
    });
    const sectionList =
      actor.role === "teacher" || actor.role === "class_incharge"
        ? await sql.query<{ id: number; label: string }>(
            `select sec.id, (c.name || ' · ' || sec.name) as label
             from sections sec join classes c on c.id = sec.class_id
             where sec.id = any($1)
             order by c.grade_level, sec.name`,
            [mine.length ? mine : [sectionId]],
          )
        : await sql<{ id: number; label: string }>`
            select sec.id, (c.name || ' · ' || sec.name) as label
            from sections sec join classes c on c.id = sec.class_id
            order by c.grade_level, sec.name
          `;
    return { sectionId, students, days, map, summary, sections: sectionList };
  });

export const markAttendance = createServerFn({ method: "POST" })
  .validator(
    z.object({
      sectionId: z.number(),
      date: z.string(),
      marks: z.array(z.object({ studentId: z.number(), status: z.enum(["present", "absent", "late", "excused"]) })),
      source: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    await assertSectionAccess(sql, actor, data.sectionId);
    for (const m of data.marks) {
      await sql`
        delete from attendance
        where student_id = ${m.studentId} and attended_on = ${data.date} and subject_id is null
      `;
      await sql`
        insert into attendance (student_id, section_id, subject_id, attended_on, status, source, marked_by)
        values (${m.studentId}, ${data.sectionId}, null, ${data.date}, ${m.status}, ${data.source ?? "class"}, ${context.userId})
      `;
    }
    return { ok: true };
  });

export const listResults = createServerFn({ method: "GET" })
  .validator(z.object({ examId: z.number().optional() }).optional())
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const exams = await sql<{
      id: number;
      name: string;
      type: string;
      exam_date: string | null;
      published: boolean;
    }>`select id, name, type, exam_date, published from exams order by exam_date desc nulls last`;
    const examId = data?.examId ?? exams[0]?.id;
    if (!examId) return { exams, examId: null, rows: [], subjects: [] };

    const subjects = await sql<{ id: number; name: string }>`
      select distinct sub.id, sub.name
      from exam_scores es join subjects sub on sub.id = es.subject_id
      where es.exam_id = ${examId}
      order by sub.name
    `;
    const scores = await sql<{
      student_id: number;
      student_name: string;
      roll_number: string;
      subject_id: number;
      marks: string | number;
      max_marks: string | number;
    }>`
      select es.student_id, st.name as student_name, st.roll_number, es.subject_id, es.marks, es.max_marks
      from exam_scores es
      join students st on st.id = es.student_id
      where es.exam_id = ${examId}
        and (${actor.role} <> 'student' or es.student_id = ${actor.studentId})
      order by st.roll_number
    `;
    const byStudent = new Map<
      number,
      {
        studentId: number;
        name: string;
        roll: string;
        marks: Record<number, { marks: number; max: number }>;
      }
    >();
    for (const s of scores) {
      let row = byStudent.get(s.student_id);
      if (!row) {
        row = { studentId: s.student_id, name: s.student_name, roll: s.roll_number, marks: {} };
        byStudent.set(s.student_id, row);
      }
      row.marks[s.subject_id] = { marks: num(s.marks), max: num(s.max_marks) };
    }
    const rows = [...byStudent.values()].map((r) => {
      let tot = 0;
      let max = 0;
      for (const v of Object.values(r.marks)) {
        tot += v.marks;
        max += v.max;
      }
      const pct = max ? (tot / max) * 100 : 0;
      const g = letterAndGpa(pct);
      return { ...r, total: tot, max, pct, letter: g.letter, gpa: g.gpa };
    });
    return { exams, examId, rows, subjects };
  });

export const saveScore = createServerFn({ method: "POST" })
  .validator(
    z.object({
      examId: z.number(),
      studentId: z.number(),
      subjectId: z.number(),
      marks: z.number(),
      maxMarks: z.number(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["teacher", "class_incharge", "academic_admin", "super_admin"]);
    await sql`
      insert into exam_scores (exam_id, student_id, subject_id, marks, max_marks)
      values (${data.examId}, ${data.studentId}, ${data.subjectId}, ${data.marks}, ${data.maxMarks})
      on conflict (exam_id, student_id, subject_id) do update set marks = excluded.marks, max_marks = excluded.max_marks
    `;
    return { ok: true };
  });

export const publishExam = createServerFn({ method: "POST" })
  .validator(z.object({ examId: z.number(), published: z.boolean() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["academic_admin", "super_admin"]);
    await sql`update exams set published = ${data.published} where id = ${data.examId}`;
    if (data.published) {
      await notify(sql, "Results published", "An examination result is now available.", "result", "students", context.userId);
    }
    return { ok: true };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const rows = await sql<{
      id: number;
      title: string;
      body: string;
      type: string;
      audience: string;
      created_at: string;
      read_at: string | null;
    }>`
      select n.id, n.title, n.body, n.type, n.audience, n.created_at, r.read_at
      from notifications n
      left join notification_reads r on r.notification_id = n.id and r.user_id = ${context.userId}
      where n.audience = 'all'
         or (n.audience = 'students' and ${actor.role} = 'student')
         or (n.audience = 'teachers' and ${actor.role} <> 'student')
         or (n.audience = 'user' and n.audience_ref = ${context.userId})
      order by n.created_at desc
      limit 50
    `;
    return rows;
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into notification_reads (notification_id, user_id)
      values (${data.id}, ${context.userId})
      on conflict (notification_id, user_id) do nothing
    `;
    return { ok: true };
  });

export const sendNotification = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(2),
      body: z.string().min(2),
      type: z.string(),
      audience: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge", "teacher"]);
    await notify(sql, data.title, data.body, data.type, data.audience, context.userId);
    return { ok: true };
  });

export const getReports = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);

    const attendanceBySection = await sql<{ label: string; pct: number }>`
      select (c.name || ' · ' || sec.name) as label,
             round(100.0 * sum(case when a.status in ('present','late') then 1 else 0 end) / nullif(count(*),0))::int as pct
      from attendance a
      join sections sec on sec.id = a.section_id
      join classes c on c.id = sec.class_id
      group by c.name, sec.name
      order by c.name, sec.name
    `;
    const assignmentStats = await sql<{ title: string; submitted: number; graded: number }>`
      select a.title,
             (select count(*)::int from assignment_submissions s where s.assignment_id = a.id) as submitted,
             (select count(*)::int from assignment_submissions s where s.assignment_id = a.id and s.status = 'graded') as graded
      from assignments a
      order by a.due_at desc
      limit 8
    `;
    const quizStats = await sql<{ title: string; attempts: number; avg_score: string | number | null }>`
      select q.title,
             count(a.id)::int as attempts,
             avg(a.score) as avg_score
      from quizzes q
      left join quiz_attempts a on a.quiz_id = q.id and a.submitted_at is not null
      group by q.id, q.title
    `;
    const classSizes = await sql<{ label: string; n: number }>`
      select (c.name || ' · ' || sec.name) as label, count(st.id)::int as n
      from sections sec
      join classes c on c.id = sec.class_id
      left join students st on st.section_id = sec.id
      group by c.name, sec.name, c.grade_level
      order by c.grade_level, sec.name
    `;
    return { attendanceBySection, assignmentStats, quizStats, classSizes };
  });

export const listLookups = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const scoped = (actor.role === "teacher" || actor.role === "class_incharge") && actor.teacherId;
    const sectionIds = scoped && actor.teacherId ? await teacherSectionIds(sql, actor.teacherId) : [];
    const ids = sectionIds.length ? sectionIds : [0];
    const classes = scoped
      ? await sql.query<{ id: number; name: string }>(
          `select distinct c.id, c.name
           from classes c
           join sections sec on sec.class_id = c.id
           where sec.id = any($1)
           order by c.grade_level`,
          [ids],
        )
      : await sql<{ id: number; name: string }>`select id, name from classes order by grade_level`;
    const sections = scoped
      ? await sql.query<{ id: number; class_id: number; name: string }>(
          `select id, class_id, name from sections where id = any($1) order by name`,
          [ids],
        )
      : await sql<{ id: number; class_id: number; name: string }>`select id, class_id, name from sections order by name`;
    const subjects = scoped && actor.teacherId
      ? await sql<{ id: number; name: string }>`
          select distinct sub.id, sub.name
          from class_subjects cs
          join subjects sub on sub.id = cs.subject_id
          where cs.teacher_id = ${actor.teacherId}
          order by sub.name
        `
      : await sql<{ id: number; name: string }>`select id, name from subjects order by name`;
    const teachers = await sql<{ id: number; name: string }>`select id, name from teachers order by name`;
    const sessions = await sql<{ id: number; name: string }>`select id, name from academic_sessions order by starts_on desc`;
    return { classes, sections, subjects, teachers, sessions, scoped: Boolean(scoped) };
  });
