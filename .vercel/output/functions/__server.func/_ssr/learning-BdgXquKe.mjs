import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, vn as record, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learning-BdgXquKe.js
var listMaterials = createServerFn({ method: "GET" }).validator(object({ q: string().optional() }).optional()).middleware([authMiddleware]).handler(createSsrRpc("e777a94ad445db74d3c15b37ef14aaffed9a50bc2c338446a43860e1c353a5e9"));
var saveMaterial = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	type: string(),
	url: string().min(4),
	subjectId: number(),
	classId: number().optional(),
	sectionId: number().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("0ec412dd2db4c046e98fb0782714d89944c53467b367063c98db3bdbc5af6328"));
var listAssignments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("834811eb2581e19f6e7451fb7fe7c6081b6384a92eeb0ca6a6704a7007312ae2"));
var getAssignment = createServerFn({ method: "GET" }).validator(object({ id: number() })).middleware([authMiddleware]).handler(createSsrRpc("149a009c3c0f9aa24e094358d5d81a31689408896f8696d24c99324489b90375"));
var saveAssignment = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	subjectId: number(),
	classId: number(),
	sectionId: number().optional(),
	dueAt: string(),
	maxMarks: number(),
	attachmentUrl: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("176fd8fe1ad2627dd672f44b3b0307687c72b511e608cf068701ef9ff0bf6baa"));
var submitAssignment = createServerFn({ method: "POST" }).validator(object({
	assignmentId: number(),
	content: string().min(2),
	fileUrl: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("69ce2da21ece90a74a1b74e4c1430f99e5fc1ba441943d58325024e6f61fa7f3"));
var gradeSubmission = createServerFn({ method: "POST" }).validator(object({
	submissionId: number(),
	marks: number(),
	feedback: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("a0e5e5e9641468bf10db37ea05d5ff429005145533726dd858a430db066dfdaf"));
var listQuizzes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3352d379db835b83f337c821528272bc3effad249e089e1726d157d7295d40ac"));
var getQuiz = createServerFn({ method: "GET" }).validator(object({
	id: number(),
	forTaking: boolean().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("4d8c4d9e5c5923dbc11e23587fb5b328b9c2949c280bc5336854f838cd91a826"));
var startQuiz = createServerFn({ method: "POST" }).validator(object({ quizId: number() })).middleware([authMiddleware]).handler(createSsrRpc("d99d57633977a17e67b99f0158ee43ba3ca81ba03b8624fb8f692833920e3b4c"));
var submitQuiz = createServerFn({ method: "POST" }).validator(object({
	attemptId: number(),
	answers: record(string(), string())
})).middleware([authMiddleware]).handler(createSsrRpc("a1052f92bb67c0b7c9a5afafc5db9632dc405aad2134ab0c1844fa12b5ae742d"));
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
})).middleware([authMiddleware]).handler(createSsrRpc("ee1771157ed35097bcfba7fc7a5bc04965c1e1b6499520500ae03c69cd9b3cde"));
var listMeetings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("41682385b79e96a521a46e6261ac9b9ccdbcae3a358baa39710202dca2ff8c2d"));
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
})).middleware([authMiddleware]).handler(createSsrRpc("aaf30b8ee2d90bca657f5b0fa073e4761726fe25f9fb5b6fa0d4707119d816d4"));
var listForum = createServerFn({ method: "GET" }).validator(object({ q: string().optional() }).optional()).middleware([authMiddleware]).handler(createSsrRpc("0bdf96145496f98492f87a9d1148c36aa83a3b63fb5b043efd4757a41ae93278"));
var getThread = createServerFn({ method: "GET" }).validator(object({ id: number() })).middleware([authMiddleware]).handler(createSsrRpc("3df97a8db9573c89694c36079c0c929d2079f63ef73b2c22f99752cdb76258d9"));
var saveThread = createServerFn({ method: "POST" }).validator(object({
	title: string().min(4),
	body: string().min(4),
	subjectId: number().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("da8596e3bbdffd52389c47f81416217d923407b7396399efa90060f8054defb4"));
var savePost = createServerFn({ method: "POST" }).validator(object({
	threadId: number(),
	body: string().min(2)
})).middleware([authMiddleware]).handler(createSsrRpc("fa4c61a30c5fe1a8bf7718079933473bdf34cc1e1c7833e13d0e32c84204e8e6"));
//#endregion
export { submitAssignment as _, listAssignments as a, listMeetings as c, saveMaterial as d, saveMeeting as f, startQuiz as g, saveThread as h, gradeSubmission as i, listQuizzes as l, saveQuiz as m, getQuiz as n, listForum as o, savePost as p, getThread as r, listMaterials as s, getAssignment as t, saveAssignment as u, submitQuiz as v };
