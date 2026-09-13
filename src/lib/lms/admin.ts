import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { assertRole, audit, authUser, loadActor, requireActor } from "./actor";
import type { Actor, Role } from "./types";

const RoleSchema = z.enum(["super_admin", "academic_admin", "class_incharge", "teacher", "student"]);

export type CampusAccount = {
  user_id: string;
  account_name: string;
  account_email: string | null;
  photo_url: string | null;
  role: Role | null;
  display_name: string | null;
  student_id: number | null;
  teacher_id: number | null;
  student_code: string | null;
  student_name: string | null;
  class_name: string | null;
  section_name: string | null;
  teacher_code: string | null;
  teacher_name: string | null;
  employee_id: string | null;
  updated_at: string | null;
};

async function applyAssignedRole(
  sql: Sql,
  userId: string,
  role: Role,
  link?: { studentId?: number | null; teacherId?: number | null },
): Promise<Actor> {
  const existing = await loadActor(userId, sql);
  const user = await authUser(sql, userId);
  let studentId = link?.studentId !== undefined ? link.studentId : (existing?.studentId ?? null);
  let teacherId = link?.teacherId !== undefined ? link.teacherId : (existing?.teacherId ?? null);

  if (role === "student") {
    teacherId = null;
    if (!studentId) {
      const free = await sql<{ id: number }>`
        select id from students where user_id is null order by id limit 1
      `;
      studentId = free[0]?.id ?? null;
    }
    if (studentId) {
      await sql`update students set user_id = null where user_id = ${userId} and id <> ${studentId}`;
      await sql`update students set user_id = ${userId} where id = ${studentId}`;
    }
  } else if (role === "teacher" || role === "class_incharge") {
    studentId = null;
    if (!teacherId) {
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
      teacherId = free[0]?.id ?? null;
    }
    if (teacherId) {
      await sql`update teachers set user_id = null where user_id = ${userId} and id <> ${teacherId}`;
      await sql`update teachers set user_id = ${userId} where id = ${teacherId}`;
    }
  } else {
    studentId = null;
    teacherId = null;
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
      student_id = excluded.student_id,
      teacher_id = excluded.teacher_id,
      updated_at = now()
  `;
  const actor = await loadActor(userId, sql);
  if (!actor) throw new Error("Could not assign campus role.");
  return actor;
}

export const listCampusAccounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CampusAccount[]> => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin"]);
    return sql<CampusAccount>`
      select u.id as user_id, u.name as account_name, u.email as account_email, u.image as photo_url,
             p.role, p.display_name, p.student_id, p.teacher_id, p.updated_at,
             s.student_code, s.name as student_name, c.name as class_name, sec.name as section_name,
             t.teacher_code, t.name as teacher_name, t.employee_id
      from "user" u
      left join profiles p on p.user_id = u.id
      left join students s on s.id = p.student_id
      left join classes c on c.id = s.class_id
      left join sections sec on sec.id = s.section_id
      left join teachers t on t.id = p.teacher_id
      order by coalesce(p.display_name, u.name)
    `;
  });

export const listRoleLinks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin"]);
    const students = await sql<{ id: number; name: string; student_code: string; user_id: string | null }>`
      select id, name, student_code, user_id from students order by name
    `;
    const teachers = await sql<{ id: number; name: string; teacher_code: string; employee_id: string; user_id: string | null }>`
      select id, name, teacher_code, employee_id, user_id from teachers order by name
    `;
    return { students, teachers };
  });

export const assignCampusRole = createServerFn({ method: "POST" })
  .validator(
    z.object({
      userId: z.string().min(1),
      role: RoleSchema,
      studentId: z.number().nullable().optional(),
      teacherId: z.number().nullable().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin"]);
    const result = await applyAssignedRole(sql, data.userId, data.role, {
      studentId: data.studentId,
      teacherId: data.teacherId,
    });
    await audit(sql, context.userId, "assign_role", "profile", data.userId, data.role);
    return result;
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin"]);

    const [users] = await sql<{ n: number }>`select count(*)::int as n from "user"`;
    const [students] = await sql<{ n: number }>`select count(*)::int as n from students`;
    const [teachers] = await sql<{ n: number }>`select count(*)::int as n from teachers`;
    const [classes] = await sql<{ n: number }>`select count(*)::int as n from classes`;
    const [sections] = await sql<{ n: number }>`select count(*)::int as n from sections`;
    const [subjects] = await sql<{ n: number }>`select count(*)::int as n from subjects`;
    const [assignments] = await sql<{ n: number }>`select count(*)::int as n from assignments`;
    const [quizzes] = await sql<{ n: number }>`select count(*)::int as n from quizzes`;
    const [notices] = await sql<{ n: number }>`select count(*)::int as n from notifications`;
    const roles = await sql<{ role: Role; n: number }>`
      select role, count(*)::int as n from profiles group by role order by role
    `;
    return {
      users: users.n,
      students: students.n,
      teachers: teachers.n,
      classes: classes.n,
      sections: sections.n,
      subjects: subjects.n,
      assignments: assignments.n,
      quizzes: quizzes.n,
      notices: notices.n,
      roles,
    };
  });
