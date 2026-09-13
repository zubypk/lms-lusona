import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actor-CpYnwQeu.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function loadActor(userId, sql) {
	const r = (await (sql ?? await getSql())`
    select p.user_id, p.role, p.display_name, p.email, p.photo_url,
           p.student_id, p.teacher_id,
           s.class_id, s.section_id, c.name as class_name, sec.name as section_name
    from profiles p
    left join students s on s.id = p.student_id
    left join classes c on c.id = s.class_id
    left join sections sec on sec.id = s.section_id
    where p.user_id = ${userId}
  `)[0];
	if (!r) return null;
	return {
		userId: r.user_id,
		role: r.role,
		displayName: r.display_name,
		email: r.email,
		photoUrl: r.photo_url,
		studentId: r.student_id,
		teacherId: r.teacher_id,
		classId: r.class_id,
		sectionId: r.section_id,
		className: r.class_name,
		sectionName: r.section_name
	};
}
async function requireActor(userId, sql) {
	const actor = await loadActor(userId, sql);
	if (!actor) throw new Error("Complete campus onboarding first.");
	return actor;
}
function assertRole(actor, roles) {
	if (actor.role === "super_admin") return;
	if (!roles.includes(actor.role)) throw new Error("You do not have permission for this action.");
}
async function audit(sql, userId, action, entity, entityId, detail) {
	await sql`
    insert into audit_logs (user_id, action, entity, entity_id, detail)
    values (
      ${userId},
      ${action},
      ${entity ?? null},
      ${entityId == null ? null : String(entityId)},
      ${detail ?? null}
    )
  `;
}
async function authUser(sql, userId) {
	return (await sql`
    select id, name, email, image from "user" where id = ${userId}
  `)[0] ?? {
		id: userId,
		name: "Campus member",
		email: "",
		image: null
	};
}
async function teacherSectionIds(sql, teacherId) {
	return (await sql`
    select distinct section_id from class_subjects where teacher_id = ${teacherId}
    union
    select id as section_id from sections where incharge_teacher_id = ${teacherId}
  `).map((r) => r.section_id).filter((id) => id != null);
}
async function notify(sql, title, body, type, audience, createdBy, audienceRef) {
	await sql`
    insert into notifications (title, body, type, audience, audience_ref, created_by)
    values (${title}, ${body}, ${type}, ${audience}, ${audienceRef ?? null}, ${createdBy})
  `;
}
//#endregion
export { loadActor as a, teacherSectionIds as c, createServerRpc as i, audit as n, notify as o, authUser as r, requireActor as s, assertRole as t };
