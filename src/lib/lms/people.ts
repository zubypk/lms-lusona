import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  makeStudentEmail,
  makeStudentPassword,
  makeStudentUsername,
  provisionEmailLogin,
  rotateEmailPassword,
} from "./accounts";
import {
  assertRole,
  assertSectionAccess,
  audit,
  listInchargeSections,
  listTeachingAssignments,
  requireActor,
  teacherSectionIds,
} from "./actor";
import type { IssuedLogin } from "./types";

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
               sec.name as section_name, st.session_id, (st.user_id is not null) as has_login
        from students st
        join classes c on c.id = st.class_id
        join sections sec on sec.id = st.section_id
        where st.id = ${actor.studentId}
      `;
    }
    if ((actor.role === "teacher" || actor.role === "class_incharge") && actor.teacherId) {
      const ids = await teacherSectionIds(sql, actor.teacherId);
      if (!ids.length) return [];
      if (sectionFilter && !ids.includes(sectionFilter)) sectionFilter = null;
      const rows = await sql.query<StudentRow>(
        `select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
                st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
                sec.name as section_name, st.session_id, (st.user_id is not null) as has_login
         from students st
         join classes c on c.id = st.class_id
         join sections sec on sec.id = st.section_id
         where st.section_id = any($1)
           and ($2::int is null or st.section_id = $2)
           and ($3 = '' or lower(st.name) like $4 or lower(st.student_code) like $4 or lower(st.roll_number) like $4)
         order by st.roll_number`,
        [ids, sectionFilter, q, like],
      );
      return rows;
    }

    return sql<StudentRow>`
      select st.id, st.student_code, st.roll_number, st.registration_number, st.name, st.father_name,
             st.mobile, st.email, st.username, st.class_id, st.section_id, c.name as class_name,
             sec.name as section_name, st.session_id, (st.user_id is not null) as has_login
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
  has_login: boolean;
};

async function uniqueUsername(sql: Awaited<ReturnType<typeof getSql>>, seed: string) {
  let username = seed;
  let n = 0;
  for (;;) {
    const hit = await sql<{ id: number }>`select id from students where username = ${username} limit 1`;
    if (!hit[0]) return username;
    n += 1;
    username = `${seed}${n}`;
  }
}

export const saveStudent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2),
      fatherName: z.string().min(2),
      rollNumber: z.string().min(1),
      classId: z.number().optional(),
      sectionId: z.number().optional(),
      sessionId: z.number().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<IssuedLogin> => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);

    let classId = data.classId ?? actor.classId;
    let sectionId = data.sectionId ?? actor.sectionId;
    let sessionId = data.sessionId;

    if (actor.role === "class_incharge") {
      if (!actor.teacherId) throw new Error("You are not assigned as a class teacher.");
      const mine = await listInchargeSections(sql, actor.teacherId);
      if (!mine.length) throw new Error("You are not the class teacher of any section.");
      const chosen = sectionId ? mine.find((s) => s.section_id === sectionId) : mine[0];
      if (!chosen) throw new Error("You can only enrol students in your own class.");
      classId = chosen.class_id;
      sectionId = chosen.section_id;
    }

    if (!classId || !sectionId) throw new Error("Choose a class and section.");
    await assertSectionAccess(sql, actor, sectionId);

    if (!sessionId) {
      const [cur] = await sql<{ id: number }>`
        select id from academic_sessions where is_current = true order by id desc limit 1
      `;
      sessionId = cur?.id ?? 1;
    }

    const roll = data.rollNumber.trim();
    const dup = await sql<{ id: number }>`
      select id from students
      where section_id = ${sectionId} and lower(roll_number) = ${roll.toLowerCase()}
      limit 1
    `;
    if (dup[0]) throw new Error("That roll number is already in this class.");

    const [n] = await sql<{ n: number }>`select count(*)::int as n from students`;
    const seq = n.n + 1;
    const code = `AEC-2025-${String(seq).padStart(3, "0")}`;
    const username = await uniqueUsername(sql, makeStudentUsername(data.name, roll, seq));
    const email = makeStudentEmail(username);
    const tempPassword = makeStudentPassword();
    const userId = await provisionEmailLogin(sql, {
      name: data.name.trim(),
      email,
      password: tempPassword,
    });

    const rows = await sql<{ id: number }>`
      insert into students (
        student_code, roll_number, registration_number, name, father_name,
        class_id, section_id, session_id, email, username, user_id,
        login_issued_at, login_issued_by
      ) values (
        ${code}, ${roll}, ${"FBISE-RWP-2025-" + (44000 + seq)}, ${data.name.trim()}, ${data.fatherName.trim()},
        ${classId}, ${sectionId}, ${sessionId}, ${email}, ${username}, ${userId},
        now(), ${context.userId}
      ) returning id
    `;
    const studentId = rows[0]?.id;
    if (!studentId) throw new Error("Could not save the student.");

    await sql`
      insert into profiles (user_id, role, display_name, email, student_id, updated_at)
      values (${userId}, 'student', ${data.name.trim()}, ${email}, ${studentId}, now())
      on conflict (user_id) do update set
        role = 'student',
        display_name = excluded.display_name,
        email = excluded.email,
        student_id = excluded.student_id,
        updated_at = now()
    `;
    await audit(sql, context.userId, "create_student", "student", studentId, data.name);
    return {
      id: studentId,
      username,
      email,
      tempPassword,
      studentCode: code,
      rollNumber: roll,
      name: data.name.trim(),
    };
  });

export const resetStudentLogin = createServerFn({ method: "POST" })
  .validator(z.object({ studentId: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<IssuedLogin> => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);
    const [st] = await sql<{
      id: number;
      name: string;
      username: string;
      email: string | null;
      user_id: string | null;
      student_code: string;
      roll_number: string;
      section_id: number;
    }>`
      select id, name, username, email, user_id, student_code, roll_number, section_id
      from students where id = ${data.studentId}
    `;
    if (!st) throw new Error("Student not found.");
    await assertSectionAccess(sql, actor, st.section_id);
    if (actor.role === "class_incharge" && actor.teacherId) {
      const mine = await listInchargeSections(sql, actor.teacherId);
      if (!mine.some((s) => s.section_id === st.section_id)) {
        throw new Error("You can only reset logins for students in your own class.");
      }
    }
    const tempPassword = makeStudentPassword();
    const email = st.email || makeStudentEmail(st.username);
    let userId = st.user_id;
    if (!userId) {
      userId = await provisionEmailLogin(sql, { name: st.name, email, password: tempPassword });
      await sql`
        update students
        set user_id = ${userId}, email = ${email}, login_issued_at = now(), login_issued_by = ${context.userId}
        where id = ${st.id}
      `;
      await sql`
        insert into profiles (user_id, role, display_name, email, student_id, updated_at)
        values (${userId}, 'student', ${st.name}, ${email}, ${st.id}, now())
        on conflict (user_id) do update set
          role = 'student', student_id = excluded.student_id, updated_at = now()
      `;
    } else {
      await rotateEmailPassword(sql, userId, tempPassword);
      await sql`
        update students
        set login_issued_at = now(), login_issued_by = ${context.userId}, email = ${email}
        where id = ${st.id}
      `;
    }
    await audit(sql, context.userId, "reset_student_login", "student", st.id, st.name);
    return {
      id: st.id,
      username: st.username,
      email,
      tempPassword,
      studentCode: st.student_code,
      rollNumber: st.roll_number,
      name: st.name,
    };
  });

export const getTeacherDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const teaching = actor.teacherId ? await listTeachingAssignments(sql, actor.teacherId) : [];
    const incharge = actor.teacherId ? await listInchargeSections(sql, actor.teacherId) : [];
    return { actor, teaching, incharge, canEnroll: incharge.length > 0 || actor.role === "super_admin" || actor.role === "academic_admin" };
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
