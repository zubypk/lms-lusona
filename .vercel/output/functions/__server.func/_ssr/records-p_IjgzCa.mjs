import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
import { i as createServerRpc, o as notify, s as requireActor, t as assertRole } from "./actor-CpYnwQeu.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as letterAndGpa, o as num } from "./format-TM2oG14R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/records-p_IjgzCa.js
var getAttendance_createServerFn_handler = createServerRpc({
	id: "558b29d066e7ebdf4a5be55552b3bd7d7e8ba97098098f54174344cef2583377",
	name: "getAttendance",
	filename: "src/lib/lms/records.ts"
}, (opts) => getAttendance.__executeServer(opts));
var getAttendance = createServerFn({ method: "GET" }).validator(object({
	sectionId: number().optional(),
	from: string().optional(),
	to: string().optional()
}).optional()).middleware([authMiddleware]).handler(getAttendance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const sectionId = data?.sectionId ?? actor.sectionId ?? 5;
	const from = data?.from ?? "2026-08-01";
	const to = data?.to ?? "2026-12-31";
	const students = await sql`
      select id, name, roll_number from students where section_id = ${sectionId} order by roll_number
    `;
	const records = await sql`
      select student_id, attended_on, status from attendance
      where section_id = ${sectionId} and attended_on >= ${from} and attended_on <= ${to}
        and (${actor.role} <> 'student' or student_id = ${actor.studentId})
    `;
	const days = [...new Set(records.map((r) => r.attended_on))].sort();
	const map = {};
	for (const r of records) map[`${r.student_id}:${r.attended_on}`] = r.status;
	return {
		sectionId,
		students,
		days,
		map,
		summary: students.map((s) => {
			let present = 0;
			let total = 0;
			for (const d of days) {
				const st = map[`${s.id}:${d}`];
				if (!st) continue;
				total += 1;
				if (st === "present" || st === "late") present += 1;
			}
			return {
				...s,
				present,
				total,
				pct: total ? Math.round(present / total * 100) : 0
			};
		}),
		sections: await sql`
      select sec.id, (c.name || ' · ' || sec.name) as label
      from sections sec join classes c on c.id = sec.class_id
      order by c.grade_level, sec.name
    `
	};
});
var markAttendance_createServerFn_handler = createServerRpc({
	id: "ba76fd3b89dfafdd06d3cfaa033a2815d7d7985c049cb2eafe5ce550a6ee4b0b",
	name: "markAttendance",
	filename: "src/lib/lms/records.ts"
}, (opts) => markAttendance.__executeServer(opts));
var markAttendance = createServerFn({ method: "POST" }).validator(object({
	sectionId: number(),
	date: string(),
	marks: array(object({
		studentId: number(),
		status: _enum([
			"present",
			"absent",
			"late",
			"excused"
		])
	})),
	source: string().optional()
})).middleware([authMiddleware]).handler(markAttendance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
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
var listResults_createServerFn_handler = createServerRpc({
	id: "23dd4735c700985b0ea2d8ec474737f24b86b3ca0c93d93f5d33c6b37773a0a4",
	name: "listResults",
	filename: "src/lib/lms/records.ts"
}, (opts) => listResults.__executeServer(opts));
var listResults = createServerFn({ method: "GET" }).validator(object({ examId: number().optional() }).optional()).middleware([authMiddleware]).handler(listResults_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const exams = await sql`select id, name, type, exam_date, published from exams order by exam_date desc nulls last`;
	const examId = data?.examId ?? exams[0]?.id;
	if (!examId) return {
		exams,
		examId: null,
		rows: [],
		subjects: []
	};
	const subjects = await sql`
      select distinct sub.id, sub.name
      from exam_scores es join subjects sub on sub.id = es.subject_id
      where es.exam_id = ${examId}
      order by sub.name
    `;
	const scores = await sql`
      select es.student_id, st.name as student_name, st.roll_number, es.subject_id, es.marks, es.max_marks
      from exam_scores es
      join students st on st.id = es.student_id
      where es.exam_id = ${examId}
        and (${actor.role} <> 'student' or es.student_id = ${actor.studentId})
      order by st.roll_number
    `;
	const byStudent = /* @__PURE__ */ new Map();
	for (const s of scores) {
		let row = byStudent.get(s.student_id);
		if (!row) {
			row = {
				studentId: s.student_id,
				name: s.student_name,
				roll: s.roll_number,
				marks: {}
			};
			byStudent.set(s.student_id, row);
		}
		row.marks[s.subject_id] = {
			marks: num(s.marks),
			max: num(s.max_marks)
		};
	}
	return {
		exams,
		examId,
		rows: [...byStudent.values()].map((r) => {
			let tot = 0;
			let max = 0;
			for (const v of Object.values(r.marks)) {
				tot += v.marks;
				max += v.max;
			}
			const pct = max ? tot / max * 100 : 0;
			const g = letterAndGpa(pct);
			return {
				...r,
				total: tot,
				max,
				pct,
				letter: g.letter,
				gpa: g.gpa
			};
		}),
		subjects
	};
});
var saveScore_createServerFn_handler = createServerRpc({
	id: "5f171d33810b6a939b7ac74b02bc5cff78bec0a53217912a01bd159f25d8a1ec",
	name: "saveScore",
	filename: "src/lib/lms/records.ts"
}, (opts) => saveScore.__executeServer(opts));
var saveScore = createServerFn({ method: "POST" }).validator(object({
	examId: number(),
	studentId: number(),
	subjectId: number(),
	marks: number(),
	maxMarks: number()
})).middleware([authMiddleware]).handler(saveScore_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
	await sql`
      insert into exam_scores (exam_id, student_id, subject_id, marks, max_marks)
      values (${data.examId}, ${data.studentId}, ${data.subjectId}, ${data.marks}, ${data.maxMarks})
      on conflict (exam_id, student_id, subject_id) do update set marks = excluded.marks, max_marks = excluded.max_marks
    `;
	return { ok: true };
});
var publishExam_createServerFn_handler = createServerRpc({
	id: "e2e5cbc26eff980f8e021e104fe790a78ae79c115096d32fe0798a423c367a1f",
	name: "publishExam",
	filename: "src/lib/lms/records.ts"
}, (opts) => publishExam.__executeServer(opts));
var publishExam = createServerFn({ method: "POST" }).validator(object({
	examId: number(),
	published: boolean()
})).middleware([authMiddleware]).handler(publishExam_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, ["academic_admin", "super_admin"]);
	await sql`update exams set published = ${data.published} where id = ${data.examId}`;
	if (data.published) await notify(sql, "Results published", "An examination result is now available.", "result", "students", context.userId);
	return { ok: true };
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "2a5b3ef8837eca650983966b903d1dfb0b01efe855002212ea28f25882722ab5",
	name: "listNotifications",
	filename: "src/lib/lms/records.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	return await sql`
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
});
var markNotificationRead_createServerFn_handler = createServerRpc({
	id: "42de53079db9ae2b92d958c5828cde29101b558ca253905b1be05b4e1e74a59d",
	name: "markNotificationRead",
	filename: "src/lib/lms/records.ts"
}, (opts) => markNotificationRead.__executeServer(opts));
var markNotificationRead = createServerFn({ method: "POST" }).validator(object({ id: number() })).middleware([authMiddleware]).handler(markNotificationRead_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into notification_reads (notification_id, user_id)
      values (${data.id}, ${context.userId})
      on conflict (notification_id, user_id) do nothing
    `;
	return { ok: true };
});
var sendNotification_createServerFn_handler = createServerRpc({
	id: "049646220efccfc3ab9ddb04fd90941f1ab7032d0c97f5d8aabedf16a1e0a535",
	name: "sendNotification",
	filename: "src/lib/lms/records.ts"
}, (opts) => sendNotification.__executeServer(opts));
var sendNotification = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	body: string().min(2),
	type: string(),
	audience: string()
})).middleware([authMiddleware]).handler(sendNotification_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge",
		"teacher"
	]);
	await notify(sql, data.title, data.body, data.type, data.audience, context.userId);
	return { ok: true };
});
var getReports_createServerFn_handler = createServerRpc({
	id: "f1a54432f93994fc8ab7e24f0c92d73f95b199ecedc89c552fd158191b2cd8d3",
	name: "getReports",
	filename: "src/lib/lms/records.ts"
}, (opts) => getReports.__executeServer(opts));
var getReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getReports_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge"
	]);
	return {
		attendanceBySection: await sql`
      select (c.name || ' · ' || sec.name) as label,
             round(100.0 * sum(case when a.status in ('present','late') then 1 else 0 end) / nullif(count(*),0))::int as pct
      from attendance a
      join sections sec on sec.id = a.section_id
      join classes c on c.id = sec.class_id
      group by c.name, sec.name
      order by c.name, sec.name
    `,
		assignmentStats: await sql`
      select a.title,
             (select count(*)::int from assignment_submissions s where s.assignment_id = a.id) as submitted,
             (select count(*)::int from assignment_submissions s where s.assignment_id = a.id and s.status = 'graded') as graded
      from assignments a
      order by a.due_at desc
      limit 8
    `,
		quizStats: await sql`
      select q.title,
             count(a.id)::int as attempts,
             avg(a.score) as avg_score
      from quizzes q
      left join quiz_attempts a on a.quiz_id = q.id and a.submitted_at is not null
      group by q.id, q.title
    `,
		classSizes: await sql`
      select (c.name || ' · ' || sec.name) as label, count(st.id)::int as n
      from sections sec
      join classes c on c.id = sec.class_id
      left join students st on st.section_id = sec.id
      group by c.name, sec.name, c.grade_level
      order by c.grade_level, sec.name
    `
	};
});
var listLookups_createServerFn_handler = createServerRpc({
	id: "b0a0a46e3bc52fe649c0d948888015416b914aadf048d2f4971f0bfe669a6267",
	name: "listLookups",
	filename: "src/lib/lms/records.ts"
}, (opts) => listLookups.__executeServer(opts));
var listLookups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listLookups_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireActor(context.userId, sql);
	return {
		classes: await sql`select id, name from classes order by grade_level`,
		sections: await sql`select id, class_id, name from sections order by name`,
		subjects: await sql`select id, name from subjects order by name`,
		teachers: await sql`select id, name from teachers order by name`,
		sessions: await sql`select id, name from academic_sessions order by starts_on desc`
	};
});
//#endregion
export { getAttendance_createServerFn_handler, getReports_createServerFn_handler, listLookups_createServerFn_handler, listNotifications_createServerFn_handler, listResults_createServerFn_handler, markAttendance_createServerFn_handler, markNotificationRead_createServerFn_handler, publishExam_createServerFn_handler, saveScore_createServerFn_handler, sendNotification_createServerFn_handler };
