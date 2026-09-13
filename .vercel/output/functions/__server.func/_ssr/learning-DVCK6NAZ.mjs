import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CxRmoZ9t.mjs";
import { i as createServerRpc, n as audit, o as notify, s as requireActor, t as assertRole } from "./actor-CpYnwQeu.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, vn as record, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learning-DVCK6NAZ.js
var listMaterials_createServerFn_handler = createServerRpc({
	id: "e777a94ad445db74d3c15b37ef14aaffed9a50bc2c338446a43860e1c353a5e9",
	name: "listMaterials",
	filename: "src/lib/lms/learning.ts"
}, (opts) => listMaterials.__executeServer(opts));
var listMaterials = createServerFn({ method: "GET" }).validator(object({ q: string().optional() }).optional()).middleware([authMiddleware]).handler(listMaterials_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const q = data?.q?.trim().toLowerCase() ?? "";
	const like = `%${q}%`;
	return sql`
      select m.id, m.title, m.description, m.type, m.url, sub.name as subject_name,
             c.name as class_name, t.name as teacher_name, m.created_at
      from materials m
      join subjects sub on sub.id = m.subject_id
      left join classes c on c.id = m.class_id
      left join teachers t on t.id = m.teacher_id
      where (${q} = '' or lower(m.title) like ${like} or lower(m.description) like ${like} or lower(sub.name) like ${like})
        and (
          ${actor.role} <> 'student'
          or m.class_id is null
          or m.class_id = ${actor.classId}
        )
      order by m.created_at desc
    `;
});
var saveMaterial_createServerFn_handler = createServerRpc({
	id: "0ec412dd2db4c046e98fb0782714d89944c53467b367063c98db3bdbc5af6328",
	name: "saveMaterial",
	filename: "src/lib/lms/learning.ts"
}, (opts) => saveMaterial.__executeServer(opts));
var saveMaterial = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	type: string(),
	url: string().min(4),
	subjectId: number(),
	classId: number().optional(),
	sectionId: number().optional()
})).middleware([authMiddleware]).handler(saveMaterial_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
	await sql`
      insert into materials (title, description, type, url, subject_id, class_id, section_id, teacher_id, uploaded_by)
      values (
        ${data.title}, ${data.description ?? null}, ${data.type}, ${data.url}, ${data.subjectId},
        ${data.classId ?? null}, ${data.sectionId ?? null}, ${actor.teacherId}, ${context.userId}
      )
    `;
	await notify(sql, "New study material", data.title, "notice", "students", context.userId);
	return { ok: true };
});
var listAssignments_createServerFn_handler = createServerRpc({
	id: "834811eb2581e19f6e7451fb7fe7c6081b6384a92eeb0ca6a6704a7007312ae2",
	name: "listAssignments",
	filename: "src/lib/lms/learning.ts"
}, (opts) => listAssignments.__executeServer(opts));
var listAssignments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAssignments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	return await sql`
      select a.id, a.title, a.description, a.due_at, a.max_marks,
             sub.name as subject_name, c.name as class_name, t.name as teacher_name,
             (select count(*)::int from assignment_submissions s where s.assignment_id = a.id) as submission_count,
             (select s.status from assignment_submissions s where s.assignment_id = a.id and s.student_id = ${actor.studentId} limit 1) as my_status,
             (select s.marks from assignment_submissions s where s.assignment_id = a.id and s.student_id = ${actor.studentId} limit 1) as my_marks
      from assignments a
      join subjects sub on sub.id = a.subject_id
      join classes c on c.id = a.class_id
      left join teachers t on t.id = a.teacher_id
      where a.published = true
        and (${actor.role} <> 'student' or (a.class_id = ${actor.classId} and (a.section_id is null or a.section_id = ${actor.sectionId})))
        and (${actor.role} <> 'teacher' or a.teacher_id = ${actor.teacherId} or ${actor.role} = 'class_incharge')
      order by a.due_at
    `;
});
var getAssignment_createServerFn_handler = createServerRpc({
	id: "149a009c3c0f9aa24e094358d5d81a31689408896f8696d24c99324489b90375",
	name: "getAssignment",
	filename: "src/lib/lms/learning.ts"
}, (opts) => getAssignment.__executeServer(opts));
var getAssignment = createServerFn({ method: "GET" }).validator(object({ id: number() })).middleware([authMiddleware]).handler(getAssignment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const [assignment] = await sql`
      select a.*, sub.name as subject_name, c.name as class_name
      from assignments a
      join subjects sub on sub.id = a.subject_id
      join classes c on c.id = a.class_id
      where a.id = ${data.id}
    `;
	if (!assignment) throw new Error("Assignment not found");
	const submissions = await sql`
      select s.id, s.student_id, st.name as student_name, st.roll_number, s.content, s.file_url,
             s.submitted_at, s.marks, s.feedback, s.status
      from assignment_submissions s
      join students st on st.id = s.student_id
      where s.assignment_id = ${data.id}
      order by st.roll_number
    `;
	const mine = actor.studentId ? submissions.find((s) => s.student_id === actor.studentId) ?? null : null;
	return {
		assignment,
		submissions: actor.role === "student" ? mine ? [mine] : [] : submissions,
		mine,
		actor
	};
});
var saveAssignment_createServerFn_handler = createServerRpc({
	id: "176fd8fe1ad2627dd672f44b3b0307687c72b511e608cf068701ef9ff0bf6baa",
	name: "saveAssignment",
	filename: "src/lib/lms/learning.ts"
}, (opts) => saveAssignment.__executeServer(opts));
var saveAssignment = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	subjectId: number(),
	classId: number(),
	sectionId: number().optional(),
	dueAt: string(),
	maxMarks: number(),
	attachmentUrl: string().optional()
})).middleware([authMiddleware]).handler(saveAssignment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
	const rows = await sql`
      insert into assignments (
        title, description, subject_id, class_id, section_id, teacher_id, due_at, max_marks, attachment_url, created_by
      ) values (
        ${data.title}, ${data.description ?? null}, ${data.subjectId}, ${data.classId},
        ${data.sectionId ?? null}, ${actor.teacherId}, ${data.dueAt}, ${data.maxMarks},
        ${data.attachmentUrl ?? null}, ${context.userId}
      ) returning id
    `;
	await notify(sql, "New assignment", data.title, "assignment", "students", context.userId);
	await audit(sql, context.userId, "create_assignment", "assignment", rows[0]?.id, data.title);
	return { id: rows[0]?.id };
});
var submitAssignment_createServerFn_handler = createServerRpc({
	id: "69ce2da21ece90a74a1b74e4c1430f99e5fc1ba441943d58325024e6f61fa7f3",
	name: "submitAssignment",
	filename: "src/lib/lms/learning.ts"
}, (opts) => submitAssignment.__executeServer(opts));
var submitAssignment = createServerFn({ method: "POST" }).validator(object({
	assignmentId: number(),
	content: string().min(2),
	fileUrl: string().optional()
})).middleware([authMiddleware]).handler(submitAssignment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	if (!actor.studentId) throw new Error("Only students can submit work.");
	const [a] = await sql`select due_at from assignments where id = ${data.assignmentId}`;
	if (!a) throw new Error("Assignment not found");
	if (new Date(a.due_at).getTime() < Date.now() - 6e4) {
		if (!(await sql`
        select id from assignment_submissions where assignment_id = ${data.assignmentId} and student_id = ${actor.studentId}
      `)[0]) throw new Error("The deadline has passed.");
	}
	await sql`
      insert into assignment_submissions (assignment_id, student_id, content, file_url, status, submitted_at)
      values (${data.assignmentId}, ${actor.studentId}, ${data.content}, ${data.fileUrl ?? null}, 'submitted', now())
      on conflict (assignment_id, student_id) do update set
        content = excluded.content,
        file_url = excluded.file_url,
        status = 'submitted',
        submitted_at = now(),
        marks = null,
        feedback = null
    `;
	return { ok: true };
});
var gradeSubmission_createServerFn_handler = createServerRpc({
	id: "a0e5e5e9641468bf10db37ea05d5ff429005145533726dd858a430db066dfdaf",
	name: "gradeSubmission",
	filename: "src/lib/lms/learning.ts"
}, (opts) => gradeSubmission.__executeServer(opts));
var gradeSubmission = createServerFn({ method: "POST" }).validator(object({
	submissionId: number(),
	marks: number(),
	feedback: string().optional()
})).middleware([authMiddleware]).handler(gradeSubmission_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
	await sql`
      update assignment_submissions
      set marks = ${data.marks}, feedback = ${data.feedback ?? null}, status = 'graded', graded_by = ${context.userId}
      where id = ${data.submissionId}
    `;
	return { ok: true };
});
var listQuizzes_createServerFn_handler = createServerRpc({
	id: "3352d379db835b83f337c821528272bc3effad249e089e1726d157d7295d40ac",
	name: "listQuizzes",
	filename: "src/lib/lms/learning.ts"
}, (opts) => listQuizzes.__executeServer(opts));
var listQuizzes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listQuizzes_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	return sql`
      select q.id, q.title, q.description, q.duration_minutes, q.max_attempts,
             sub.name as subject_name, c.name as class_name, q.available_until,
             (select count(*)::int from quiz_questions qq where qq.quiz_id = q.id) as question_count,
             (select count(*)::int from quiz_attempts a where a.quiz_id = q.id and a.student_id = ${actor.studentId} and a.submitted_at is not null) as my_attempts,
             (select max(a.score) from quiz_attempts a where a.quiz_id = q.id and a.student_id = ${actor.studentId} and a.submitted_at is not null) as my_best
      from quizzes q
      join subjects sub on sub.id = q.subject_id
      join classes c on c.id = q.class_id
      where q.published = true
        and (${actor.role} <> 'student' or (q.class_id = ${actor.classId} and (q.section_id is null or q.section_id = ${actor.sectionId})))
      order by q.created_at desc
    `;
});
var getQuiz_createServerFn_handler = createServerRpc({
	id: "4d8c4d9e5c5923dbc11e23587fb5b328b9c2949c280bc5336854f838cd91a826",
	name: "getQuiz",
	filename: "src/lib/lms/learning.ts"
}, (opts) => getQuiz.__executeServer(opts));
var getQuiz = createServerFn({ method: "GET" }).validator(object({
	id: number(),
	forTaking: boolean().optional()
})).middleware([authMiddleware]).handler(getQuiz_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const [quiz] = await sql`
      select q.id, q.title, q.description, q.duration_minutes, q.max_attempts, q.randomize,
             sub.name as subject_name, q.available_until
      from quizzes q join subjects sub on sub.id = q.subject_id
      where q.id = ${data.id}
    `;
	if (!quiz) throw new Error("Quiz not found");
	const questions = await sql`
      select qs.id, qs.type, qs.prompt, qs.options_json, qs.answer, qs.marks, qq.position
      from quiz_questions qq
      join questions qs on qs.id = qq.question_id
      where qq.quiz_id = ${data.id}
      order by qq.position
    `;
	const hideAnswers = Boolean(data.forTaking) && actor.role === "student";
	return {
		quiz,
		questions: questions.map((q) => ({
			...q,
			answer: hideAnswers ? null : q.answer
		})),
		attempts: actor.studentId ? await sql`
          select id, attempt_no, score, max_score, submitted_at, started_at
          from quiz_attempts
          where quiz_id = ${data.id} and student_id = ${actor.studentId}
          order by attempt_no
        ` : [],
		actor
	};
});
var startQuiz_createServerFn_handler = createServerRpc({
	id: "d99d57633977a17e67b99f0158ee43ba3ca81ba03b8624fb8f692833920e3b4c",
	name: "startQuiz",
	filename: "src/lib/lms/learning.ts"
}, (opts) => startQuiz.__executeServer(opts));
var startQuiz = createServerFn({ method: "POST" }).validator(object({ quizId: number() })).middleware([authMiddleware]).handler(startQuiz_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	if (!actor.studentId) throw new Error("Only students can attempt quizzes.");
	const [quiz] = await sql`
      select max_attempts, duration_minutes from quizzes where id = ${data.quizId}
    `;
	if (!quiz) throw new Error("Quiz not found");
	const existing = await sql`
      select count(*)::int as n,
             max(case when submitted_at is null then id end) as open_id
      from quiz_attempts where quiz_id = ${data.quizId} and student_id = ${actor.studentId}
    `;
	if (existing[0]?.open_id) return {
		attemptId: existing[0].open_id,
		duration: quiz.duration_minutes
	};
	if (existing[0].n >= quiz.max_attempts) throw new Error("No attempts remaining.");
	return {
		attemptId: (await sql`
      insert into quiz_attempts (quiz_id, student_id, attempt_no)
      values (${data.quizId}, ${actor.studentId}, ${existing[0].n + 1})
      returning id
    `)[0].id,
		duration: quiz.duration_minutes
	};
});
var submitQuiz_createServerFn_handler = createServerRpc({
	id: "a1052f92bb67c0b7c9a5afafc5db9632dc405aad2134ab0c1844fa12b5ae742d",
	name: "submitQuiz",
	filename: "src/lib/lms/learning.ts"
}, (opts) => submitQuiz.__executeServer(opts));
var submitQuiz = createServerFn({ method: "POST" }).validator(object({
	attemptId: number(),
	answers: record(string(), string())
})).middleware([authMiddleware]).handler(submitQuiz_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	if (!actor.studentId) throw new Error("Only students can submit quizzes.");
	const [attempt] = await sql`
      select id, quiz_id, submitted_at from quiz_attempts
      where id = ${data.attemptId} and student_id = ${actor.studentId}
    `;
	if (!attempt) throw new Error("Attempt not found");
	if (attempt.submitted_at) throw new Error("Already submitted.");
	const questions = await sql`
      select qs.id, qs.type, qs.answer, qs.marks
      from quiz_questions qq join questions qs on qs.id = qq.question_id
      where qq.quiz_id = ${attempt.quiz_id}
    `;
	let score = 0;
	let max = 0;
	for (const q of questions) {
		max += q.marks;
		const given = (data.answers[String(q.id)] ?? "").trim();
		if (q.type === "short" || q.type === "long") {
			if (given.length > 8) score += q.marks * .5;
			continue;
		}
		const expected = (q.answer ?? "").trim().toLowerCase();
		if (given.toLowerCase() === expected) score += q.marks;
	}
	await sql`
      update quiz_attempts
      set submitted_at = now(), answers_json = ${JSON.stringify(data.answers)},
          score = ${score}, max_score = ${max}
      where id = ${data.attemptId}
    `;
	return {
		score,
		max,
		pct: max ? Math.round(score / max * 100) : 0
	};
});
var saveQuiz_createServerFn_handler = createServerRpc({
	id: "ee1771157ed35097bcfba7fc7a5bc04965c1e1b6499520500ae03c69cd9b3cde",
	name: "saveQuiz",
	filename: "src/lib/lms/learning.ts"
}, (opts) => saveQuiz.__executeServer(opts));
var saveQuiz = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	subjectId: number(),
	classId: number(),
	durationMinutes: number(),
	maxAttempts: number(),
	questions: array(object({
		type: string(),
		prompt: string().min(2),
		options: array(string()).optional(),
		answer: string().optional(),
		marks: number()
	}))
})).middleware([authMiddleware]).handler(saveQuiz_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
	const [quiz] = await sql`
      insert into quizzes (title, description, subject_id, class_id, teacher_id, duration_minutes, max_attempts, created_by)
      values (
        ${data.title}, ${data.description ?? null}, ${data.subjectId}, ${data.classId},
        ${actor.teacherId}, ${data.durationMinutes}, ${data.maxAttempts}, ${context.userId}
      ) returning id
    `;
	let pos = 1;
	for (const q of data.questions) {
		const [row] = await sql`
        insert into questions (subject_id, type, prompt, options_json, answer, marks, created_by)
        values (
          ${data.subjectId}, ${q.type}, ${q.prompt},
          ${q.options ? JSON.stringify(q.options) : null},
          ${q.answer ?? null}, ${q.marks}, ${context.userId}
        ) returning id
      `;
		await sql`
        insert into quiz_questions (quiz_id, question_id, position)
        values (${quiz.id}, ${row.id}, ${pos})
      `;
		pos += 1;
	}
	await notify(sql, "New quiz", data.title, "quiz", "students", context.userId);
	return { id: quiz.id };
});
var listMeetings_createServerFn_handler = createServerRpc({
	id: "41682385b79e96a521a46e6261ac9b9ccdbcae3a358baa39710202dca2ff8c2d",
	name: "listMeetings",
	filename: "src/lib/lms/learning.ts"
}, (opts) => listMeetings.__executeServer(opts));
var listMeetings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMeetings_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireActor(context.userId, sql);
	return sql`
      select m.id, m.title, m.platform, m.url, m.starts_at, m.ends_at,
             sub.name as subject_name, t.name as teacher_name
      from meetings m
      left join subjects sub on sub.id = m.subject_id
      left join teachers t on t.id = m.teacher_id
      order by m.starts_at desc
    `;
});
var saveMeeting_createServerFn_handler = createServerRpc({
	id: "aaf30b8ee2d90bca657f5b0fa073e4761726fe25f9fb5b6fa0d4707119d816d4",
	name: "saveMeeting",
	filename: "src/lib/lms/learning.ts"
}, (opts) => saveMeeting.__executeServer(opts));
var saveMeeting = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	platform: _enum([
		"meet",
		"zoom",
		"teams"
	]),
	url: string().min(8),
	subjectId: number().optional(),
	sectionId: number().optional(),
	startsAt: string(),
	endsAt: string().optional()
})).middleware([authMiddleware]).handler(saveMeeting_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	assertRole(actor, [
		"teacher",
		"class_incharge",
		"academic_admin",
		"super_admin"
	]);
	await sql`
      insert into meetings (title, platform, url, subject_id, section_id, teacher_id, starts_at, ends_at, created_by)
      values (
        ${data.title}, ${data.platform}, ${data.url}, ${data.subjectId ?? null},
        ${data.sectionId ?? null}, ${actor.teacherId}, ${data.startsAt}, ${data.endsAt ?? null}, ${context.userId}
      )
    `;
	await notify(sql, "Online class scheduled", data.title, "notice", "students", context.userId);
	return { ok: true };
});
var listForum_createServerFn_handler = createServerRpc({
	id: "0bdf96145496f98492f87a9d1148c36aa83a3b63fb5b043efd4757a41ae93278",
	name: "listForum",
	filename: "src/lib/lms/learning.ts"
}, (opts) => listForum.__executeServer(opts));
var listForum = createServerFn({ method: "GET" }).validator(object({ q: string().optional() }).optional()).middleware([authMiddleware]).handler(listForum_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActor(context.userId, sql);
	const q = data?.q?.trim().toLowerCase() ?? "";
	const like = `%${q}%`;
	return sql`
      select t.id, t.title, t.body, t.author_name, t.created_at, sub.name as subject_name,
             (select count(*)::int from forum_posts p where p.thread_id = t.id) as replies
      from forum_threads t
      left join subjects sub on sub.id = t.subject_id
      where ${q} = '' or lower(t.title) like ${like} or lower(t.body) like ${like}
      order by t.created_at desc
    `;
});
var getThread_createServerFn_handler = createServerRpc({
	id: "3df97a8db9573c89694c36079c0c929d2079f63ef73b2c22f99752cdb76258d9",
	name: "getThread",
	filename: "src/lib/lms/learning.ts"
}, (opts) => getThread.__executeServer(opts));
var getThread = createServerFn({ method: "GET" }).validator(object({ id: number() })).middleware([authMiddleware]).handler(getThread_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireActor(context.userId, sql);
	const [thread] = await sql`
      select t.id, t.title, t.body, t.author_name, t.created_at, sub.name as subject_name
      from forum_threads t left join subjects sub on sub.id = t.subject_id
      where t.id = ${data.id}
    `;
	if (!thread) throw new Error("Thread not found");
	return {
		thread,
		posts: await sql`
      select id, body, author_name, author_user_id, created_at
      from forum_posts where thread_id = ${data.id} order by created_at
    `
	};
});
var saveThread_createServerFn_handler = createServerRpc({
	id: "da8596e3bbdffd52389c47f81416217d923407b7396399efa90060f8054defb4",
	name: "saveThread",
	filename: "src/lib/lms/learning.ts"
}, (opts) => saveThread.__executeServer(opts));
var saveThread = createServerFn({ method: "POST" }).validator(object({
	title: string().min(4),
	body: string().min(4),
	subjectId: number().optional()
})).middleware([authMiddleware]).handler(saveThread_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	const [row] = await sql`
      insert into forum_threads (title, body, subject_id, class_id, author_user_id, author_name)
      values (${data.title}, ${data.body}, ${data.subjectId ?? null}, ${actor.classId}, ${context.userId}, ${actor.displayName})
      returning id
    `;
	return { id: row.id };
});
var savePost_createServerFn_handler = createServerRpc({
	id: "fa4c61a30c5fe1a8bf7718079933473bdf34cc1e1c7833e13d0e32c84204e8e6",
	name: "savePost",
	filename: "src/lib/lms/learning.ts"
}, (opts) => savePost.__executeServer(opts));
var savePost = createServerFn({ method: "POST" }).validator(object({
	threadId: number(),
	body: string().min(2)
})).middleware([authMiddleware]).handler(savePost_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const actor = await requireActor(context.userId, sql);
	await sql`
      insert into forum_posts (thread_id, body, author_user_id, author_name)
      values (${data.threadId}, ${data.body}, ${context.userId}, ${actor.displayName})
    `;
	return { ok: true };
});
//#endregion
export { getAssignment_createServerFn_handler, getQuiz_createServerFn_handler, getThread_createServerFn_handler, gradeSubmission_createServerFn_handler, listAssignments_createServerFn_handler, listForum_createServerFn_handler, listMaterials_createServerFn_handler, listMeetings_createServerFn_handler, listQuizzes_createServerFn_handler, saveAssignment_createServerFn_handler, saveMaterial_createServerFn_handler, saveMeeting_createServerFn_handler, savePost_createServerFn_handler, saveQuiz_createServerFn_handler, saveThread_createServerFn_handler, startQuiz_createServerFn_handler, submitAssignment_createServerFn_handler, submitQuiz_createServerFn_handler };
