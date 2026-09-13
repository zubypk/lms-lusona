import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
import { c as teacherSectionIds, i as createServerRpc, n as audit, s as requireActor, t as assertRole } from "./actor-CpYnwQeu.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-QHVdbj9w.js
var listStudents_createServerFn_handler = createServerRpc({
	id: "53c5b8fe6bdbc40efccb58e47e48d6ff3badb5aa5e3b02c2bb1d56de39eb2430",
	name: "listStudents",
	filename: "src/lib/lms/people.ts"
}, (opts) => listStudents.__executeServer(opts));
var listStudents = createServerFn({ method: "GET" }).validator(object({
	q: string().optional(),
	sectionId: number().optional()
}).optional()).middleware([authMiddleware]).handler(listStudents_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const q = data?.q?.trim() ?? "";
	const like = `%${q.toLowerCase()}%`;
	let sectionFilter = data?.sectionId ?? null;
	if (actor.role === "student") return sql`
        select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
               st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
               sec.name as section_name, st.session_id
        from students st
        join classes c on c.id = st.class_id
        join sections sec on sec.id = st.section_id
        where st.id = ${actor.studentId}
      `;
	if (actor.role === "teacher" && actor.teacherId) {
		const ids = await teacherSectionIds(sql, actor.teacherId);
		if (!ids.length) return [];
		return await sql.query(`select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
                st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
                sec.name as section_name, st.session_id
         from students st
         join classes c on c.id = st.class_id
         join sections sec on sec.id = st.section_id
         where st.section_id = any($1)
           and ($2 = '' or lower(st.name) like $3 or lower(st.student_code) like $3 or lower(st.roll_number) like $3)
         order by st.roll_number`, [
			ids,
			q,
			like
		]);
	}
	if (actor.role === "class_incharge" && actor.teacherId && !sectionFilter) sectionFilter = (await sql`
        select id from sections where incharge_teacher_id = ${actor.teacherId}
      `)[0]?.id ?? sectionFilter;
	return sql`
      select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
             st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
             sec.name as section_name, st.session_id
      from students st
      join classes c on c.id = st.class_id
      join sections sec on sec.id = st.section_id
      where (${sectionFilter}::int is null or st.section_id = ${sectionFilter})
        and (${q} = '' or lower(st.name) like ${like} or lower(st.student_code) like ${like} or lower(st.roll_number) like ${like})
      order by st.roll_number
    `;
});
var saveStudent_createServerFn_handler = createServerRpc({
	id: "5d031dd9bb7a4df1b889152ec2974d8e22518f2e38f9efbe88a33d8e51d58729",
	name: "saveStudent",
	filename: "src/lib/lms/people.ts"
}, (opts) => saveStudent.__executeServer(opts));
var saveStudent = createServerFn({ method: "POST" }).validator(object({
	name: string().min(2),
	fatherName: string().min(2),
	classId: number(),
	sectionId: number(),
	sessionId: number(),
	mobile: string().optional(),
	email: string().optional(),
	rollNumber: string().optional()
})).middleware([authMiddleware]).handler(saveStudent_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"super_admin",
		"academic_admin",
		"class_incharge"
	]);
	const [n] = await sql`select count(*)::int as n from students`;
	const seq = n.n + 1;
	const code = `AEC-2025-${String(seq).padStart(3, "0")}`;
	const roll = data.rollNumber || `R-${seq}`;
	const username = (data.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8) || "student") + seq;
	const tempPassword = `Aec@${Math.floor(1e5 + Math.random() * 9e5)}`;
	const rows = await sql`
      insert into students (
        student_code, roll_number, registration_number, name, father_name,
        class_id, section_id, session_id, mobile, email, username
      ) values (
        ${code}, ${roll}, ${"FBISE-RWP-2025-" + (44e3 + seq)}, ${data.name}, ${data.fatherName},
        ${data.classId}, ${data.sectionId}, ${data.sessionId}, ${data.mobile ?? null},
        ${data.email ?? null}, ${username}
      ) returning id
    `;
	await audit(sql, context.userId, "create_student", "student", rows[0]?.id, data.name);
	return {
		id: rows[0]?.id,
		username,
		studentCode: code,
		tempPassword
	};
});
var listTeachers_createServerFn_handler = createServerRpc({
	id: "aa50057be82489a03b8df58352fd510b608c6eb7131d69597253266268824223",
	name: "listTeachers",
	filename: "src/lib/lms/people.ts"
}, (opts) => listTeachers.__executeServer(opts));
var listTeachers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTeachers_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	if (actor.role === "student") return sql`
        select t.id, t.teacher_code, t.employee_id, t.name, t.qualification, t.mobile, t.email,
               coalesce((
                 select string_agg(distinct sub.name, ', ')
                 from class_subjects cs join subjects sub on sub.id = cs.subject_id
                 where cs.teacher_id = t.id
               ), '') as subjects,
               coalesce((
                 select string_agg(distinct (c.name || '-' || sec.name), ', ')
                 from class_subjects cs
                 join classes c on c.id = cs.class_id
                 left join sections sec on sec.id = cs.section_id
                 where cs.teacher_id = t.id
               ), '') as classes
        from teachers t
        join class_subjects cs on cs.teacher_id = t.id
        where cs.section_id = ${actor.sectionId}
        group by t.id
        order by t.name
      `;
	if (actor.role === "teacher" && actor.teacherId) return sql`
        select t.id, t.teacher_code, t.employee_id, t.name, t.qualification, t.mobile, t.email,
               coalesce((
                 select string_agg(distinct sub.name, ', ')
                 from class_subjects cs join subjects sub on sub.id = cs.subject_id
                 where cs.teacher_id = t.id
               ), '') as subjects,
               coalesce((
                 select string_agg(distinct (c.name || '-' || coalesce(sec.name,'')), ', ')
                 from class_subjects cs
                 join classes c on c.id = cs.class_id
                 left join sections sec on sec.id = cs.section_id
                 where cs.teacher_id = t.id
               ), '') as classes
        from teachers t
        where t.id = ${actor.teacherId}
      `;
	return sql`
      select t.id, t.teacher_code, t.employee_id, t.name, t.qualification, t.mobile, t.email,
             coalesce((
               select string_agg(distinct sub.name, ', ')
               from class_subjects cs join subjects sub on sub.id = cs.subject_id
               where cs.teacher_id = t.id
             ), '') as subjects,
             coalesce((
               select string_agg(distinct (c.name || '-' || coalesce(sec.name,'')), ', ')
               from class_subjects cs
               join classes c on c.id = cs.class_id
               left join sections sec on sec.id = cs.section_id
               where cs.teacher_id = t.id
             ), '') as classes
      from teachers t
      order by t.name
    `;
});
var saveTeacher_createServerFn_handler = createServerRpc({
	id: "afc23b6f2955e92f6b47176972626534261558498666b1f3d746feb32c6184c9",
	name: "saveTeacher",
	filename: "src/lib/lms/people.ts"
}, (opts) => saveTeacher.__executeServer(opts));
var saveTeacher = createServerFn({ method: "POST" }).validator(object({
	name: string().min(2),
	qualification: string().optional(),
	mobile: string().optional(),
	email: string().optional()
})).middleware([authMiddleware]).handler(saveTeacher_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, ["super_admin", "academic_admin"]);
	const [n] = await sql`select count(*)::int as n from teachers`;
	const seq = n.n + 1;
	await sql`
      insert into teachers (teacher_code, employee_id, name, qualification, mobile, email)
      values (
        ${"AEC-T-" + String(seq).padStart(3, "0")},
        ${"EMP-" + (1200 + seq)},
        ${data.name}, ${data.qualification ?? null}, ${data.mobile ?? null}, ${data.email ?? null}
      )
    `;
	await audit(sql, context.userId, "create_teacher", "teacher", void 0, data.name);
	return { ok: true };
});
//#endregion
export { listStudents_createServerFn_handler, listTeachers_createServerFn_handler, saveStudent_createServerFn_handler, saveTeacher_createServerFn_handler };
