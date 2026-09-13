import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { audit, authUser, loadActor, requireActor } from "./actor";
import type { Actor, Role } from "./types";

const RoleSchema = z.enum(["super_admin", "academic_admin", "class_incharge", "teacher", "student"]);

async function applyRole(sql: Sql, userId: string, role: Role): Promise<Actor> {
  const existing = await loadActor(userId, sql);
  const user = await authUser(sql, userId);
  let studentId = existing?.studentId ?? null;
  let teacherId = existing?.teacherId ?? null;

  if (role === "student" && !studentId) {
    const free = await sql<{ id: number }>`
      select id from students where user_id is null order by id limit 1
    `;
    if (free[0]) {
      studentId = free[0].id;
      await sql`update students set user_id = ${userId} where id = ${studentId} and user_id is null`;
    } else {
      const created = await sql<{ id: number }>`
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
      `;
      studentId = created[0]?.id ?? null;
    }
  }

  if ((role === "teacher" || role === "class_incharge") && !teacherId) {
    const free =
      role === "class_incharge"
        ? await sql<{ id: number }>`
            select t.id from teachers t
            join sections s on s.incharge_teacher_id = t.id
            where t.user_id is null
            order by t.id limit 1
          `
        : await sql<{ id: number }>`
            select id from teachers where user_id is null order by id limit 1
          `;
    if (free[0]) {
      teacherId = free[0].id;
      await sql`update teachers set user_id = ${userId} where id = ${teacherId} and user_id is null`;
    } else {
      const created = await sql<{ id: number }>`
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
      `;
      teacherId = created[0]?.id ?? null;
      if (teacherId) {
        await sql`
          insert into class_subjects (class_id, section_id, subject_id, teacher_id)
          values (3, 5, 1, ${teacherId})
        `;
      }
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

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Actor | null> => {
    return loadActor(context.userId);
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .validator(z.object({ role: RoleSchema }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<Actor> => {
    const sql = await getSql();
    return applyRole(sql, context.userId, data.role);
  });

export const switchRole = createServerFn({ method: "POST" })
  .validator(z.object({ role: RoleSchema }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return applyRole(sql, context.userId, data.role);
  });

export const getSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<{ key: string; value: string }>`select key, value from settings`;
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  });

export const saveSettings = createServerFn({ method: "POST" })
  .validator(z.object({ entries: z.array(z.object({ key: z.string(), value: z.string() })) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    if (actor.role !== "super_admin") throw new Error("Only the Super Admin can change system settings.");
    for (const e of data.entries) {
      await sql`
        insert into settings (key, value) values (${e.key}, ${e.value})
        on conflict (key) do update set value = excluded.value
      `;
    }
    await audit(sql, context.userId, "update_settings", "settings");
    return { ok: true };
  });

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    if (actor.role !== "super_admin") throw new Error("Forbidden");
    return sql<{
      id: number;
      user_id: string;
      action: string;
      entity: string | null;
      entity_id: string | null;
      detail: string | null;
      created_at: string;
    }>`select id, user_id, action, entity, entity_id, detail, created_at from audit_logs order by created_at desc limit 80`;
  });

export type { Role };
