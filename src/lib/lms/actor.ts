import { getSql, type Sql } from "@/lib/db";
import type { Actor, Role, TeachingAssignment } from "./types";

type ProfileRow = {
  user_id: string;
  role: Role;
  display_name: string;
  email: string | null;
  photo_url: string | null;
  student_id: number | null;
  teacher_id: number | null;
  class_id: number | null;
  section_id: number | null;
  class_name: string | null;
  section_name: string | null;
};

export async function loadActor(userId: string, sql?: Sql): Promise<Actor | null> {
  const db = sql ?? (await getSql());
  const rows = await db<ProfileRow>`
    select p.user_id, p.role, p.display_name, p.email, p.photo_url,
           p.student_id, p.teacher_id,
           s.class_id, s.section_id, c.name as class_name, sec.name as section_name
    from profiles p
    left join students s on s.id = p.student_id
    left join classes c on c.id = s.class_id
    left join sections sec on sec.id = s.section_id
    where p.user_id = ${userId}
  `;
  const r = rows[0];
  if (!r) return null;

  let classId = r.class_id;
  let sectionId = r.section_id;
  let className = r.class_name;
  let sectionName = r.section_name;

  if (!sectionId && r.teacher_id) {
    const inc = await db<{
      section_id: number;
      class_id: number;
      class_name: string;
      section_name: string;
    }>`
      select sec.id as section_id, sec.class_id, c.name as class_name, sec.name as section_name
      from sections sec
      join classes c on c.id = sec.class_id
      where sec.incharge_teacher_id = ${r.teacher_id}
      order by sec.id
      limit 1
    `;
    if (inc[0]) {
      classId = inc[0].class_id;
      sectionId = inc[0].section_id;
      className = inc[0].class_name;
      sectionName = inc[0].section_name;
    }
  }

  return {
    userId: r.user_id,
    role: r.role,
    displayName: r.display_name,
    email: r.email,
    photoUrl: r.photo_url,
    studentId: r.student_id,
    teacherId: r.teacher_id,
    classId,
    sectionId,
    className,
    sectionName,
  };
}

export async function requireActor(userId: string, sql?: Sql): Promise<Actor> {
  const actor = await loadActor(userId, sql);
  if (!actor) throw new Error("Complete campus onboarding first.");
  return actor;
}

export function assertRole(actor: Actor, roles: Role[]) {
  if (actor.role === "super_admin") return;
  if (!roles.includes(actor.role)) {
    throw new Error("You do not have permission for this action.");
  }
}

export async function audit(
  sql: Sql,
  userId: string,
  action: string,
  entity?: string,
  entityId?: string | number,
  detail?: string,
) {
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

export async function authUser(sql: Sql, userId: string) {
  const rows = await sql<{ id: string; name: string; email: string; image: string | null }>`
    select id, name, email, image from "user" where id = ${userId}
  `;
  return rows[0] ?? { id: userId, name: "Campus member", email: "", image: null };
}

export async function teacherSectionIds(sql: Sql, teacherId: number) {
  const rows = await sql<{ section_id: number | null }>`
    select distinct section_id from class_subjects where teacher_id = ${teacherId}
    union
    select id as section_id from sections where incharge_teacher_id = ${teacherId}
  `;
  return rows.map((r) => r.section_id).filter((id): id is number => id != null);
}

export async function teacherClassIds(sql: Sql, teacherId: number) {
  const rows = await sql<{ class_id: number }>`
    select distinct class_id from class_subjects where teacher_id = ${teacherId}
    union
    select class_id from sections where incharge_teacher_id = ${teacherId}
  `;
  return rows.map((r) => r.class_id);
}

export async function teacherSubjectIds(sql: Sql, teacherId: number) {
  const rows = await sql<{ subject_id: number }>`
    select distinct subject_id from class_subjects where teacher_id = ${teacherId}
  `;
  return rows.map((r) => r.subject_id);
}

export async function assertSectionAccess(sql: Sql, actor: Actor, sectionId: number) {
  if (actor.role === "super_admin" || actor.role === "academic_admin") return;
  if (actor.role === "student") {
    if (actor.sectionId !== sectionId) throw new Error("You can only view your own class.");
    return;
  }
  if (!actor.teacherId) throw new Error("You do not have permission for this class.");
  const ids = await teacherSectionIds(sql, actor.teacherId);
  if (!ids.includes(sectionId)) {
    throw new Error("You only have access to your assigned classes.");
  }
}

export async function listTeachingAssignments(sql: Sql, teacherId: number): Promise<TeachingAssignment[]> {
  return sql<TeachingAssignment>`
    select cs.class_id, cs.section_id, cs.subject_id,
           c.name as class_name, sec.name as section_name, sub.name as subject_name,
           (sec.incharge_teacher_id = ${teacherId}) as is_incharge
    from class_subjects cs
    join classes c on c.id = cs.class_id
    join subjects sub on sub.id = cs.subject_id
    left join sections sec on sec.id = cs.section_id
    where cs.teacher_id = ${teacherId}
    order by c.grade_level, sec.name, sub.name
  `;
}

export async function listInchargeSections(sql: Sql, teacherId: number) {
  return sql<{
    section_id: number;
    class_id: number;
    class_name: string;
    section_name: string;
    room: string | null;
    students: number;
  }>`
    select sec.id as section_id, sec.class_id, c.name as class_name, sec.name as section_name,
           sec.room, (select count(*)::int from students st where st.section_id = sec.id) as students
    from sections sec
    join classes c on c.id = sec.class_id
    where sec.incharge_teacher_id = ${teacherId}
    order by c.grade_level, sec.name
  `;
}

export async function notify(
  sql: Sql,
  title: string,
  body: string,
  type: string,
  audience: string,
  createdBy: string,
  audienceRef?: string,
) {
  await sql`
    insert into notifications (title, body, type, audience, audience_ref, created_by)
    values (${title}, ${body}, ${type}, ${audience}, ${audienceRef ?? null}, ${createdBy})
  `;
}
