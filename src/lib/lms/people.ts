import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { assertRole, audit, requireActor, teacherSectionIds } from "./actor";

export const listStudents = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().optional(), sectionId: z.number().optional() }).optional())
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const q = data?.q?.trim() ?? "";
    const like = `%${q.toLowerCase()}%`;

    let sectionFilter = data?.sectionId ?? null;
    if (actor.role === "student") {
      return sql<StudentRow>`
        select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
               st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
               sec.name as section_name, st.session_id
        from students st
        join classes c on c.id = st.class_id
        join sections sec on sec.id = st.section_id
        where st.id = ${actor.studentId}
      `;
    }
    if (actor.role === "teacher" && actor.teacherId) {
      const ids = await teacherSectionIds(sql, actor.teacherId);
      if (!ids.length) return [];
      const rows = await sql.query<StudentRow>(
        `select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
                st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
                sec.name as section_name, st.session_id
         from students st
         join classes c on c.id = st.class_id
         join sections sec on sec.id = st.section_id
         where st.section_id = any($1)
           and ($2 = '' or lower(st.name) like $3 or lower(st.student_code) like $3 or lower(st.roll_number) like $3)
         order by st.roll_number`,
        [ids, q, like],
      );
      return rows;
    }
    if (actor.role === "class_incharge" && actor.teacherId && !sectionFilter) {
      const inc = await sql<{ id: number }>`
        select id from sections where incharge_teacher_id = ${actor.teacherId}
      `;
      sectionFilter = inc[0]?.id ?? sectionFilter;
    }

    return sql<StudentRow>`
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

type StudentRow = {
  id: number;
  student_code: string;
  roll_number: string;
  registration_number: string;
  name: string;
  father_name: string | null;
  mobile: string | null;
  email: string | null;
  username: string;
  class_id: number;
  section_id: number;
  class_name: string;
  section_name: string;
  session_id: number;
};

export const saveStudent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2),
      fatherName: z.string().min(2),
      classId: z.number(),
      sectionId: z.number(),
      sessionId: z.number(),
      mobile: z.string().optional(),
      email: z.string().optional(),
      rollNumber: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);
    const [n] = await sql<{ n: number }>`select count(*)::int as n from students`;
    const seq = n.n + 1;
    const code = `AEC-2025-${String(seq).padStart(3, "0")}`;
    const roll = data.rollNumber || `R-${seq}`;
    const username = (data.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8) || "student") + seq;
    const tempPassword = `Aec@${Math.floor(100000 + Math.random() * 900000)}`;
    const rows = await sql<{ id: number }>`
      insert into students (
        student_code, roll_number, registration_number, name, father_name,
        class_id, section_id, session_id, mobile, email, username
      ) values (
        ${code}, ${roll}, ${"FBISE-RWP-2025-" + (44000 + seq)}, ${data.name}, ${data.fatherName},
        ${data.classId}, ${data.sectionId}, ${data.sessionId}, ${data.mobile ?? null},
        ${data.email ?? null}, ${username}
      ) returning id
    `;
    await audit(sql, context.userId, "create_student", "student", rows[0]?.id, data.name);
    return { id: rows[0]?.id, username, studentCode: code, tempPassword };
  });

export const listTeachers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    if (actor.role === "student") {
      return sql<TeacherRow>`
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
    }
    if (actor.role === "teacher" && actor.teacherId) {
      return sql<TeacherRow>`
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
    }
    return sql<TeacherRow>`
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

type TeacherRow = {
  id: number;
  teacher_code: string;
  employee_id: string;
  name: string;
  qualification: string | null;
  mobile: string | null;
  email: string | null;
  subjects: string;
  classes: string;
};

export const saveTeacher = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2),
      qualification: z.string().optional(),
      mobile: z.string().optional(),
      email: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin"]);
    const [n] = await sql<{ n: number }>`select count(*)::int as n from teachers`;
    const seq = n.n + 1;
    await sql`
      insert into teachers (teacher_code, employee_id, name, qualification, mobile, email)
      values (
        ${"AEC-T-" + String(seq).padStart(3, "0")},
        ${"EMP-" + (1200 + seq)},
        ${data.name}, ${data.qualification ?? null}, ${data.mobile ?? null}, ${data.email ?? null}
      )
    `;
    await audit(sql, context.userId, "create_teacher", "teacher", undefined, data.name);
    return { ok: true };
  });
