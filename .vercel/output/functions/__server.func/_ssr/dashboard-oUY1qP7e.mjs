import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
import { i as createServerRpc, s as requireActor } from "./actor-CpYnwQeu.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { o as num } from "./format-TM2oG14R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-oUY1qP7e.js
var getDashboard_createServerFn_handler = createServerRpc({
	id: "15226a5d1f7d1c39b12ef5aed28d4b8363d3a5e209a5e9e2ca519a1802ba4cbf",
	name: "getDashboard",
	filename: "src/lib/lms/dashboard.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const [students] = await sql`select count(*)::int as n from students`;
	const [teachers] = await sql`select count(*)::int as n from teachers`;
	const [classes] = await sql`select count(*)::int as n from classes`;
	const [sections] = await sql`select count(*)::int as n from sections`;
	const present = await sql`
      select status, count(*)::int as n from attendance
      where attended_on >= current_date - 14
      group by status
    `;
	const attMap = {};
	let attTotal = 0;
	for (const r of present) {
		attMap[r.status] = r.n;
		attTotal += r.n;
	}
	const attendancePct = attTotal ? Math.round((attMap.present ?? 0) / attTotal * 100) : 0;
	const [asg] = await sql`select count(*)::int as n from assignments where published = true`;
	const [pendingGrade] = await sql`
      select count(*)::int as n from assignment_submissions where status = 'submitted'
    `;
	const [quizN] = await sql`select count(*)::int as n from quizzes where published = true`;
	const upcomingMeetings = await sql`
      select m.id, m.title, m.platform, m.url, m.starts_at, s.name as subject_name
      from meetings m
      left join subjects s on s.id = m.subject_id
      where m.starts_at >= now() - interval '1 hour'
      order by m.starts_at
      limit 6
    `;
	const notices = await sql`
      select id, title, body, type, created_at from notifications
      order by created_at desc limit 6
    `;
	const deadlines = await sql`
      select a.id, a.title, a.due_at, s.name as subject_name, a.max_marks
      from assignments a
      join subjects s on s.id = a.subject_id
      where a.published = true and a.due_at >= now() - interval '1 day'
      order by a.due_at
      limit 6
    `;
	let myAttendance = null;
	let myGpa = null;
	let myPending = null;
	let teacherPending = pendingGrade.n;
	let mySubjects = [];
	if (actor.studentId) {
		const att = await sql`
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
		myAttendance = t ? Math.round(p / t * 100) : null;
		const scores = await sql`
        select marks, max_marks from exam_scores es
        join exams e on e.id = es.exam_id
        where es.student_id = ${actor.studentId} and e.type = 'midterm'
      `;
		if (scores.length) {
			const pcts = scores.map((s) => num(s.marks) / Math.max(1, num(s.max_marks)) * 100);
			const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
			myGpa = Math.round(avg / 100 * 4 * 100) / 100;
		}
		const [pend] = await sql`
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
		mySubjects = await sql`
        select sub.name, t.name as teacher
        from class_subjects cs
        join subjects sub on sub.id = cs.subject_id
        left join teachers t on t.id = cs.teacher_id
        where cs.section_id = ${actor.sectionId}
        order by sub.name
      `;
	}
	if (actor.teacherId) {
		const [tp] = await sql`
        select count(*)::int as n
        from assignment_submissions sub
        join assignments a on a.id = sub.assignment_id
        where sub.status = 'submitted' and a.teacher_id = ${actor.teacherId}
      `;
		teacherPending = tp.n;
	}
	const attendanceTrend = await sql`
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
			attendancePct
		},
		attendanceTrend,
		upcomingMeetings,
		notices,
		deadlines,
		myAttendance,
		myGpa,
		myPending,
		mySubjects
	};
});
//#endregion
export { getDashboard_createServerFn_handler };
