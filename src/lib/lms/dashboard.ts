import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireActor } from "./actor";
import { num } from "./format";

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);

    const [students] = await sql<{ n: number }>`select count(*)::int as n from students`;
    const [teachers] = await sql<{ n: number }>`select count(*)::int as n from teachers`;
    const [classes] = await sql<{ n: number }>`select count(*)::int as n from classes`;
    const [sections] = await sql<{ n: number }>`select count(*)::int as n from sections`;

    const present = await sql<{ status: string; n: number }>`
      select status, count(*)::int as n from attendance
      where attended_on >= current_date - 14
      group by status
    `;
    const attMap: Record<string, number> = {};
    let attTotal = 0;
    for (const r of present) {
      attMap[r.status] = r.n;
      attTotal += r.n;
    }
    const attendancePct = attTotal ? Math.round(((attMap.present ?? 0) / attTotal) * 100) : 0;

    const [asg] = await sql<{ n: number }>`select count(*)::int as n from assignments where published = true`;
    const [pendingGrade] = await sql<{ n: number }>`
      select count(*)::int as n from assignment_submissions where status = 'submitted'
    `;
    const [quizN] = await sql<{ n: number }>`select count(*)::int as n from quizzes where published = true`;

    const upcomingMeetings = await sql<{
      id: number;
      title: string;
      platform: string;
      url: string;
      starts_at: string;
      subject_name: string | null;
    }>`
      select m.id, m.title, m.platform, m.url, m.starts_at, s.name as subject_name
      from meetings m
      left join subjects s on s.id = m.subject_id
      where m.starts_at >= now() - interval '1 hour'
      order by m.starts_at
      limit 6
    `;

    const notices = await sql<{
      id: number;
      title: string;
      body: string;
      type: string;
      created_at: string;
    }>`
      select id, title, body, type, created_at from notifications
      order by created_at desc limit 6
    `;

    const deadlines = await sql<{
      id: number;
      title: string;
      due_at: string;
      subject_name: string;
      max_marks: number;
    }>`
      select a.id, a.title, a.due_at, s.name as subject_name, a.max_marks
      from assignments a
      join subjects s on s.id = a.subject_id
      where a.published = true and a.due_at >= now() - interval '1 day'
      order by a.due_at
      limit 6
    `;

    let myAttendance: number | null = null;
    let myGpa: number | null = null;
    let myPending: number | null = null;
    let teacherPending = pendingGrade.n;
    let mySubjects: { name: string; teacher: string | null }[] = [];

    if (actor.studentId) {
      const att = await sql<{ status: string; n: number }>`
        select status, count(*)::int as n from attendance
        where student_id = ${actor.studentId}
        group by status
      `;
      let t = 0;
      let p = 0;
      for (const r of att) {
        t += r.n;
        if (r.status === "present" || r.status === "late") p += r.n;
      }
      myAttendance = t ? Math.round((p / t) * 100) : null;

      const scores = await sql<{ marks: string | number; max_marks: string | number }>`
        select marks, max_marks from exam_scores es
        join exams e on e.id = es.exam_id
        where es.student_id = ${actor.studentId} and e.type = 'midterm'
      `;
      if (scores.length) {
        const pcts = scores.map((s) => (num(s.marks) / Math.max(1, num(s.max_marks))) * 100);
        const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
        myGpa = Math.round((avg / 100) * 4 * 100) / 100;
      }

      const [pend] = await sql<{ n: number }>`
        select count(*)::int as n from assignments a
        where a.published = true
          and (a.section_id is null or a.section_id = ${actor.sectionId})
          and (a.class_id = ${actor.classId})
          and not exists (
            select 1 from assignment_submissions sub
            where sub.assignment_id = a.id and sub.student_id = ${actor.studentId}
          )
      `;
      myPending = pend.n;

      mySubjects = await sql<{ name: string; teacher: string | null }>`
        select sub.name, t.name as teacher
        from class_subjects cs
        join subjects sub on sub.id = cs.subject_id
        left join teachers t on t.id = cs.teacher_id
        where cs.section_id = ${actor.sectionId}
        order by sub.name
      `;
    }

    if (actor.teacherId) {
      const [tp] = await sql<{ n: number }>`
        select count(*)::int as n
        from assignment_submissions sub
        join assignments a on a.id = sub.assignment_id
        where sub.status = 'submitted' and a.teacher_id = ${actor.teacherId}
      `;
      teacherPending = tp.n;
    }

    const attendanceTrend = await sql<{ day: string; present: number; total: number }>`
      select attended_on::text as day,
             sum(case when status in ('present','late') then 1 else 0 end)::int as present,
             count(*)::int as total
      from attendance
      where attended_on >= current_date - 14
      group by attended_on
      order by attended_on
    `;

    return {
      actor,
      totals: {
        students: students.n,
        teachers: teachers.n,
        classes: classes.n,
        sections: sections.n,
        assignments: asg.n,
        quizzes: quizN.n,
        pendingGrading: teacherPending,
        attendancePct,
      },
      attendanceTrend,
      upcomingMeetings,
      notices,
      deadlines,
      myAttendance,
      myGpa,
      myPending,
      mySubjects,
    };
  });
