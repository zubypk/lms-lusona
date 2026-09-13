import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { assertRole, audit, requireActor } from "./actor";

export const listSessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireActor(context.userId);
    const sql = await getSql();
    return sql<{
      id: number;
      name: string;
      starts_on: string;
      ends_on: string;
      is_current: boolean;
    }>`select id, name, starts_on, ends_on, is_current from academic_sessions order by starts_on desc`;
  });

export const saveSession = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number().optional(),
      name: z.string().min(2),
      startsOn: z.string(),
      endsOn: z.string(),
      isCurrent: z.boolean().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin"]);
    if (data.isCurrent) await sql`update academic_sessions set is_current = false`;
    if (data.id) {
      await sql`
        update academic_sessions set name = ${data.name}, starts_on = ${data.startsOn},
          ends_on = ${data.endsOn}, is_current = ${data.isCurrent ?? false}
        where id = ${data.id}
      `;
    } else {
      await sql`
        insert into academic_sessions (name, starts_on, ends_on, is_current)
        values (${data.name}, ${data.startsOn}, ${data.endsOn}, ${data.isCurrent ?? false})
      `;
    }
    await audit(sql, context.userId, data.id ? "update_session" : "create_session", "session", data.id, data.name);
    return { ok: true };
  });

export const listClasses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireActor(context.userId, sql);
    const classes = await sql<{
      id: number;
      name: string;
      grade_level: number;
      stream: string;
      session_id: number;
      session_name: string;
    }>`
      select c.id, c.name, c.grade_level, c.stream, c.session_id, s.name as session_name
      from classes c join academic_sessions s on s.id = c.session_id
      order by c.grade_level, c.name
    `;
    const sections = await sql<{
      id: number;
      class_id: number;
      name: string;
      room: string | null;
      incharge: string | null;
      students: number;
    }>`
      select sec.id, sec.class_id, sec.name, sec.room, t.name as incharge,
             (select count(*)::int from students st where st.section_id = sec.id) as students
      from sections sec
      left join teachers t on t.id = sec.incharge_teacher_id
      order by sec.name
    `;
    return { classes, sections };
  });

export const saveClass = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2),
      gradeLevel: z.number(),
      stream: z.string(),
      sessionId: z.number(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);
    const rows = await sql<{ id: number }>`
      insert into classes (name, grade_level, stream, session_id)
      values (${data.name}, ${data.gradeLevel}, ${data.stream}, ${data.sessionId})
      returning id
    `;
    await audit(sql, context.userId, "create_class", "class", rows[0]?.id, data.name);
    return { id: rows[0]?.id };
  });

export const saveSection = createServerFn({ method: "POST" })
  .validator(
    z.object({
      classId: z.number(),
      name: z.string().min(1),
      room: z.string().optional(),
      inchargeTeacherId: z.number().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);
    await sql`
      insert into sections (class_id, name, room, incharge_teacher_id)
      values (${data.classId}, ${data.name}, ${data.room ?? null}, ${data.inchargeTeacherId ?? null})
    `;
    await audit(sql, context.userId, "create_section", "section", data.classId, data.name);
    return { ok: true };
  });

export const listSubjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireActor(context.userId, sql);
    const subjects = await sql<{
      id: number;
      name: string;
      code: string;
      description: string | null;
      syllabus: string | null;
    }>`select id, name, code, description, syllabus from subjects order by name`;
    const assignments = await sql<{
      id: number;
      class_id: number;
      section_id: number | null;
      subject_id: number;
      teacher_id: number | null;
      class_name: string;
      section_name: string | null;
      teacher_name: string | null;
    }>`
      select cs.id, cs.class_id, cs.section_id, cs.subject_id, cs.teacher_id,
             c.name as class_name, sec.name as section_name, t.name as teacher_name
      from class_subjects cs
      join classes c on c.id = cs.class_id
      left join sections sec on sec.id = cs.section_id
      left join teachers t on t.id = cs.teacher_id
      order by c.grade_level, sec.name
    `;
    return { subjects, assignments };
  });

export const saveSubject = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number().optional(),
      name: z.string().min(2),
      code: z.string().min(2),
      description: z.string().optional(),
      syllabus: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "teacher", "class_incharge"]);
    if (data.id) {
      await sql`
        update subjects set name = ${data.name}, code = ${data.code},
          description = ${data.description ?? null}, syllabus = ${data.syllabus ?? null}
        where id = ${data.id}
      `;
    } else {
      await sql`
        insert into subjects (name, code, description, syllabus)
        values (${data.name}, ${data.code}, ${data.description ?? null}, ${data.syllabus ?? null})
      `;
    }
    return { ok: true };
  });

export const assignSubject = createServerFn({ method: "POST" })
  .validator(
    z.object({
      classId: z.number(),
      sectionId: z.number().optional(),
      subjectId: z.number(),
      teacherId: z.number().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);
    await sql`
      insert into class_subjects (class_id, section_id, subject_id, teacher_id)
      values (${data.classId}, ${data.sectionId ?? null}, ${data.subjectId}, ${data.teacherId ?? null})
    `;
    return { ok: true };
  });

export const getTimetable = createServerFn({ method: "GET" })
  .validator(z.object({ sectionId: z.number().optional() }).optional())
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    const sectionId = data?.sectionId ?? actor.sectionId ?? 5;
    const slots = await sql<{
      id: number;
      day_of_week: number;
      period: number;
      starts_at: string;
      ends_at: string;
      room: string | null;
      subject_name: string;
      teacher_name: string | null;
      subject_id: number;
    }>`
      select ts.id, ts.day_of_week, ts.period, ts.starts_at, ts.ends_at, ts.room,
             sub.name as subject_name, t.name as teacher_name, ts.subject_id
      from timetable_slots ts
      join subjects sub on sub.id = ts.subject_id
      left join teachers t on t.id = ts.teacher_id
      where ts.section_id = ${sectionId}
      order by ts.day_of_week, ts.period
    `;
    const sections = await sql<{ id: number; label: string }>`
      select sec.id, (c.name || ' · ' || sec.name) as label
      from sections sec join classes c on c.id = sec.class_id
      order by c.grade_level, sec.name
    `;
    return { sectionId, slots, sections };
  });

export const saveTimetableSlot = createServerFn({ method: "POST" })
  .validator(
    z.object({
      sectionId: z.number(),
      subjectId: z.number(),
      teacherId: z.number().optional(),
      dayOfWeek: z.number(),
      period: z.number(),
      startsAt: z.string(),
      endsAt: z.string(),
      room: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin", "class_incharge"]);
    await sql`
      insert into timetable_slots (section_id, subject_id, teacher_id, day_of_week, period, starts_at, ends_at, room)
      values (
        ${data.sectionId}, ${data.subjectId}, ${data.teacherId ?? null}, ${data.dayOfWeek},
        ${data.period}, ${data.startsAt}, ${data.endsAt}, ${data.room ?? null}
      )
    `;
    return { ok: true };
  });

export const listCalendar = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireActor(context.userId);
    const sql = await getSql();
    return sql<{
      id: number;
      title: string;
      description: string | null;
      event_date: string;
      event_type: string;
    }>`select id, title, description, event_date, event_type from calendar_events order by event_date`;
  });

export const saveCalendarEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      eventDate: z.string(),
      eventType: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const actor = await requireActor(context.userId, sql);
    assertRole(actor, ["super_admin", "academic_admin"]);
    await sql`
      insert into calendar_events (title, description, event_date, event_type)
      values (${data.title}, ${data.description ?? null}, ${data.eventDate}, ${data.eventType})
    `;
    return { ok: true };
  });
