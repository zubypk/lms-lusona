import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
import { a as loadActor, i as createServerRpc, n as audit, r as authUser, s as requireActor } from "./actor-CpYnwQeu.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { cn as _enum, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DANDAdhu.js
var RoleSchema = _enum([
	"super_admin",
	"academic_admin",
	"class_incharge",
	"teacher",
	"student"
]);
async function applyRole(sql, userId, role) {
	const existing = await loadActor(userId, sql);
	const user = await authUser(sql, userId);
	let studentId = existing?.studentId ?? null;
	let teacherId = existing?.teacherId ?? null;
	if (role === "student" && !studentId) {
		const free = await sql`
      select id from students where user_id is null order by id limit 1
    `;
		if (free[0]) {
			studentId = free[0].id;
			await sql`update students set user_id = ${userId} where id = ${studentId} and user_id is null`;
		} else studentId = (await sql`
        insert into students (
          student_code, roll_number, registration_number, name, father_name,
          class_id, section_id, session_id, email, username, user_id
        )
        values (
          ${"AEC-" + Date.now()},
          ${"11A-N"},
          ${"FBISE-RWP-" + Date.now()},
          ${user.name},
          ${"Guardian"},
          3, 5, 1,
          ${user.email || null},
          ${"u" + userId.slice(0, 10)},
          ${userId}
        )
        returning id
      `)[0]?.id ?? null;
	}
	if ((role === "teacher" || role === "class_incharge") && !teacherId) {
		const free = role === "class_incharge" ? await sql`
            select t.id from teachers t
            join sections s on s.incharge_teacher_id = t.id
            where t.user_id is null
            order by t.id limit 1
          ` : await sql`
            select id from teachers where user_id is null order by id limit 1
          `;
		if (free[0]) {
			teacherId = free[0].id;
			await sql`update teachers set user_id = ${userId} where id = ${teacherId} and user_id is null`;
		} else {
			teacherId = (await sql`
        insert into teachers (teacher_code, employee_id, name, qualification, email, user_id)
        values (
          ${"AEC-T-" + Date.now()},
          ${"EMP-" + Date.now()},
          ${user.name},
          ${"Faculty"},
          ${user.email || null},
          ${userId}
        )
        returning id
      `)[0]?.id ?? null;
			if (teacherId) await sql`
          insert into class_subjects (class_id, section_id, subject_id, teacher_id)
          values (3, 5, 1, ${teacherId})
        `;
		}
	}
	await sql`
    insert into profiles (user_id, role, display_name, email, photo_url, student_id, teacher_id, updated_at)
    values (
      ${userId}, ${role}, ${user.name}, ${user.email || null}, ${user.image},
      ${studentId}, ${teacherId}, now()
    )
    on conflict (user_id) do update set
      role = excluded.role,
      display_name = excluded.display_name,
      email = excluded.email,
      photo_url = excluded.photo_url,
      student_id = coalesce(excluded.student_id, profiles.student_id),
      teacher_id = coalesce(excluded.teacher_id, profiles.teacher_id),
      updated_at = now()
  `;
	await audit(sql, userId, "onboarding", "profile", role);
	const actor = await loadActor(userId, sql);
	if (!actor) throw new Error("Could not create campus profile.");
	return actor;
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "dc2d96209353308d99a65824fe7fe6d467f6aa64721f16fc047e6bab29dbb821",
	name: "getMyProfile",
	filename: "src/lib/lms/profile.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return loadActor(context.userId);
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "27828f3bbcb03233f816e55225cfba85ddb5e75414d00417ea8fde22c705ee6c",
	name: "completeOnboarding",
	filename: "src/lib/lms/profile.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).validator(object({ role: RoleSchema })).middleware([authMiddleware]).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	return applyRole(await getSql(), context.userId, data.role);
});
var switchRole_createServerFn_handler = createServerRpc({
	id: "61732e29c10f8b348cd574d2bbeb0624e504ed8fe0e81b68ee5f54c274f30855",
	name: "switchRole",
	filename: "src/lib/lms/profile.ts"
}, (opts) => switchRole.__executeServer(opts));
var switchRole = createServerFn({ method: "POST" }).validator(object({ role: RoleSchema })).middleware([authMiddleware]).handler(switchRole_createServerFn_handler, async ({ context, data }) => {
	return applyRole(await getSql(), context.userId, data.role);
});
var getSettings_createServerFn_handler = createServerRpc({
	id: "9fe84f18dcf7ee2ec391f7d99cfe8799d23ab4e5bbd3bbea1465fe279758e4ab",
	name: "getSettings",
	filename: "src/lib/lms/profile.ts"
}, (opts) => getSettings.__executeServer(opts));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSettings_createServerFn_handler, async () => {
	const rows = await (await getSql())`select key, value from settings`;
	const map = {};
	for (const r of rows) map[r.key] = r.value;
	return map;
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "814ee82be443906e7d0a137e4dde04a0b28519c1605c6e2e7f5c0203914088ea",
	name: "saveSettings",
	filename: "src/lib/lms/profile.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).validator(object({ entries: array(object({
	key: string(),
	value: string()
})) })).middleware([authMiddleware]).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await requireActor(context.userId, sql)).role !== "super_admin") throw new Error("Only the Super Admin can change system settings.");
	for (const e of data.entries) await sql`
        insert into settings (key, value) values (${e.key}, ${e.value})
        on conflict (key) do update set value = excluded.value
      `;
	await audit(sql, context.userId, "update_settings", "settings");
	return { ok: true };
});
var listAudit_createServerFn_handler = createServerRpc({
	id: "9118a79f1a8e44c5f28cbccf2a4dc16fd8e1879c958c973f77a208bc62887e5e",
	name: "listAudit",
	filename: "src/lib/lms/profile.ts"
}, (opts) => listAudit.__executeServer(opts));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAudit_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	if ((await requireActor(context.userId, sql)).role !== "super_admin") throw new Error("Forbidden");
	return sql`select id, user_id, action, entity, entity_id, detail, created_at from audit_logs order by created_at desc limit 80`;
});
//#endregion
export { completeOnboarding_createServerFn_handler, getMyProfile_createServerFn_handler, getSettings_createServerFn_handler, listAudit_createServerFn_handler, saveSettings_createServerFn_handler, switchRole_createServerFn_handler };
