import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
import { i as createServerRpc, n as audit, s as requireActor, t as assertRole } from "./actor-CpYnwQeu.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academic-B_He1ORR.js
var listSessions_createServerFn_handler = createServerRpc({
	id: "a46058643198ad69e7f4f8fec4a0c3acf2ed57bfceb5d00c9212017d726bd6fc",
	name: "listSessions",
	filename: "src/lib/lms/academic.ts"
}, (opts) => listSessions.__executeServer(opts));
var listSessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSessions_createServerFn_handler, async ({ context }) => {
	await requireActor(context.userId);
	return (await getSql())`select id, name, starts_on, ends_on, is_current from academic_sessions order by starts_on desc`;
});
var saveSession_createServerFn_handler = createServerRpc({
	id: "2b2566f5c031995d7858e0dd17041f6cd9f3e92de2054ec4a5243f14280a468c",
	name: "saveSession",
	filename: "src/lib/lms/academic.ts"
}, (opts) => saveSession.__executeServer(opts));
var saveSession = createServerFn({ method: "POST" }).validator(object({
	id: number().optional(),
	name: string().min(2),
	startsOn: string(),
	endsOn: string(),
	isCurrent: boolean().optional()
})).middleware([authMiddleware]).handler(saveSession_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, ["super_admin", "academic_admin"]);
	if (data.isCurrent) await sql`update academic_sessions set is_current = false`;
	if (data.id) await sql`
        update academic_sessions set name = ${data.name}, starts_on = ${data.startsOn},
          ends_on = ${data.endsOn}, is_current = ${data.isCurrent ?? false}
        where id = ${data.id}
      `;
	else await sql`
        insert into academic_sessions (name, starts_on, ends_on, is_current)
        values (${data.name}, ${data.startsOn}, ${data.endsOn}, ${data.isCurrent ?? false})
      `;
	await audit(sql, context.userId, data.id ? "update_session" : "create_session", "session", data.id, data.name);
	return { ok: true };
});
var listClasses_createServerFn_handler = createServerRpc({
	id: "b6a23956efc2165f49b0ba7f44fa648baddbf520f1fd4d2d4c1c178f55285a53",
	name: "listClasses",
	filename: "src/lib/lms/academic.ts"
}, (opts) => listClasses.__executeServer(opts));
var listClasses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listClasses_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireActor(context.userId, sql);
	return {
		classes: await sql`
      select c.id, c.name, c.grade_level, c.stream, c.session_id, s.name as session_name
      from classes c join academic_sessions s on s.id = c.session_id
      order by c.grade_level, c.name
    `,
		sections: await sql`
      select sec.id, sec.class_id, sec.name, sec.room, t.name as incharge,
             (select count(*)::int from students st where st.section_id = sec.id) as students
      from sections sec
      left join teachers t on t.id = sec.incharge_teacher_id
      order by sec.name
    `
	};
});
var saveClass_createServerFn_handler = createServerRpc({
	id: "2a5c619a8ed9258dd32ded74a3502fd09c01763e9982bdda65f552ecb73e97f2",
	name: "saveClass",
	filename: "src/lib/lms/academic.ts"
}, (opts) => saveClass.__executeServer(opts));
var saveClass = createServerFn({ method: "POST" }).validator(object({
	name: string().min(2),
	gradeLevel: number(),
	stream: string(),
	sessionId: number()
})).middleware([authMiddleware]).handler(saveClass_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge"
	]);
	const rows = await sql`
      insert into classes (name, grade_level, stream, session_id)
      values (${data.name}, ${data.gradeLevel}, ${data.stream}, ${data.sessionId})
      returning id
    `;
	await audit(sql, context.userId, "create_class", "class", rows[0]?.id, data.name);
	return { id: rows[0]?.id };
});
var saveSection_createServerFn_handler = createServerRpc({
	id: "df2bcd625f41ff86f31d033bc55c3a95b1929202f09f97f1460247d5899aaf29",
	name: "saveSection",
	filename: "src/lib/lms/academic.ts"
}, (opts) => saveSection.__executeServer(opts));
var saveSection = createServerFn({ method: "POST" }).validator(object({
	classId: number(),
	name: string().min(1),
	room: string().optional(),
	inchargeTeacherId: number().optional()
})).middleware([authMiddleware]).handler(saveSection_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge"
	]);
	await sql`
      insert into sections (class_id, name, room, incharge_teacher_id)
      values (${data.classId}, ${data.name}, ${data.room ?? null}, ${data.inchargeTeacherId ?? null})
    `;
	await audit(sql, context.userId, "create_section", "section", data.classId, data.name);
	return { ok: true };
});
var listSubjects_createServerFn_handler = createServerRpc({
	id: "514e59aff01bb743c49b89dcf9a663d1eb3f60a7706dc19870a9a2b1817afae3",
	name: "listSubjects",
	filename: "src/lib/lms/academic.ts"
}, (opts) => listSubjects.__executeServer(opts));
var listSubjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSubjects_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireActor(context.userId, sql);
	return {
		subjects: await sql`select id, name, code, description, syllabus from subjects order by name`,
		assignments: await sql`
      select cs.id, cs.class_id, cs.section_id, cs.subject_id, cs.teacher_id,
             c.name as class_name, sec.name as section_name, t.name as teacher_name
      from class_subjects cs
      join classes c on c.id = cs.class_id
      left join sections sec on sec.id = cs.section_id
      left join teachers t on t.id = cs.teacher_id
      order by c.grade_level, sec.name
    `
	};
});
var saveSubject_createServerFn_handler = createServerRpc({
	id: "72b67993e36919c7e3604126001426145ea8faeda1c27ba39f6bc166766fc9fe",
	name: "saveSubject",
	filename: "src/lib/lms/academic.ts"
}, (opts) => saveSubject.__executeServer(opts));
var saveSubject = createServerFn({ method: "POST" }).validator(object({
	id: number().optional(),
	name: string().min(2),
	code: string().min(2),
	description: string().optional(),
	syllabus: string().optional()
})).middleware([authMiddleware]).handler(saveSubject_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"teacher",
		"class_incharge"
	]);
	if (data.id) await sql`
        update subjects set name = ${data.name}, code = ${data.code},
          description = ${data.description ?? null}, syllabus = ${data.syllabus ?? null}
        where id = ${data.id}
      `;
	else await sql`
        insert into subjects (name, code, description, syllabus)
        values (${data.name}, ${data.code}, ${data.description ?? null}, ${data.syllabus ?? null})
      `;
	return { ok: true };
});
var assignSubject_createServerFn_handler = createServerRpc({
	id: "448715c1fc8e98792e2d46f104e718fc38431fcfbc6a3395cae897d13f5d1cde",
	name: "assignSubject",
	filename: "src/lib/lms/academic.ts"
}, (opts) => assignSubject.__executeServer(opts));
var assignSubject = createServerFn({ method: "POST" }).validator(object({
	classId: number(),
	sectionId: number().optional(),
	subjectId: number(),
	teacherId: number().optional()
})).middleware([authMiddleware]).handler(assignSubject_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge"
	]);
	await sql`
      insert into class_subjects (class_id, section_id, subject_id, teacher_id)
      values (${data.classId}, ${data.sectionId ?? null}, ${data.subjectId}, ${data.teacherId ?? null})
    `;
	return { ok: true };
});
var getTimetable_createServerFn_handler = createServerRpc({
	id: "ed356b2823872e0d09a84e811e76d0aa903d789a4fb2f9f34d2a15395a9211a7",
	name: "getTimetable",
	filename: "src/lib/lms/academic.ts"
}, (opts) => getTimetable.__executeServer(opts));
var getTimetable = createServerFn({ method: "GET" }).validator(object({ sectionId: number().optional() }).optional()).middleware([authMiddleware]).handler(getTimetable_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const sectionId = data?.sectionId ?? actor.sectionId ?? 5;
	return {
		sectionId,
		slots: await sql`
      select ts.id, ts.day_of_week, ts.period, ts.starts_at, ts.ends_at, ts.room,
             sub.name as subject_name, t.name as teacher_name, ts.subject_id
      from timetable_slots ts
      join subjects sub on sub.id = ts.subject_id
      left join teachers t on t.id = ts.teacher_id
      where ts.section_id = ${sectionId}
      order by ts.day_of_week, ts.period
    `,
		sections: await sql`
      select sec.id, (c.name || ' · ' || sec.name) as label
      from sections sec join classes c on c.id = sec.class_id
      order by c.grade_level, sec.name
    `
	};
});
var saveTimetableSlot_createServerFn_handler = createServerRpc({
	id: "5dc3a40fe35109c48194495e3900622e37c144bb1476446ff6fc660a2f3dfeb8",
	name: "saveTimetableSlot",
	filename: "src/lib/lms/academic.ts"
}, (opts) => saveTimetableSlot.__executeServer(opts));
var saveTimetableSlot = createServerFn({ method: "POST" }).validator(object({
	sectionId: number(),
	subjectId: number(),
	teacherId: number().optional(),
	dayOfWeek: number(),
	period: number(),
	startsAt: string(),
	endsAt: string(),
	room: string().optional()
})).middleware([authMiddleware]).handler(saveTimetableSlot_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge"
	]);
	await sql`
      insert into timetable_slots (section_id, subject_id, teacher_id, day_of_week, period, starts_at, ends_at, room)
      values (
        ${data.sectionId}, ${data.subjectId}, ${data.teacherId ?? null}, ${data.dayOfWeek},
        ${data.period}, ${data.startsAt}, ${data.endsAt}, ${data.room ?? null}
      )
    `;
	return { ok: true };
});
var listCalendar_createServerFn_handler = createServerRpc({
	id: "bf6edcdba467e9f99067a8d1a14f8f66e2a394bfab1292ae00c0706a50603d38",
	name: "listCalendar",
	filename: "src/lib/lms/academic.ts"
}, (opts) => listCalendar.__executeServer(opts));
var listCalendar = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCalendar_createServerFn_handler, async ({ context }) => {
	await requireActor(context.userId);
	return (await getSql())`select id, title, description, event_date, event_type from calendar_events order by event_date`;
});
var saveCalendarEvent_createServerFn_handler = createServerRpc({
	id: "a9fc83a844be9069f93469d5e756924a2cc3f9004f101ca3985f6ce6722f2eaf",
	name: "saveCalendarEvent",
	filename: "src/lib/lms/academic.ts"
}, (opts) => saveCalendarEvent.__executeServer(opts));
var saveCalendarEvent = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	eventDate: string(),
	eventType: string()
})).middleware([authMiddleware]).handler(saveCalendarEvent_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, ["super_admin", "academic_admin"]);
	await sql`
      insert into calendar_events (title, description, event_date, event_type)
      values (${data.title}, ${data.description ?? null}, ${data.eventDate}, ${data.eventType})
    `;
	return { ok: true };
});
//#endregion
export { assignSubject_createServerFn_handler, getTimetable_createServerFn_handler, listCalendar_createServerFn_handler, listClasses_createServerFn_handler, listSessions_createServerFn_handler, listSubjects_createServerFn_handler, saveCalendarEvent_createServerFn_handler, saveClass_createServerFn_handler, saveSection_createServerFn_handler, saveSession_createServerFn_handler, saveSubject_createServerFn_handler, saveTimetableSlot_createServerFn_handler };
