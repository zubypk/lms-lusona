import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academic-BlRUvdp3.js
var listSessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a46058643198ad69e7f4f8fec4a0c3acf2ed57bfceb5d00c9212017d726bd6fc"));
var saveSession = createServerFn({ method: "POST" }).validator(object({
	id: number().optional(),
	name: string().min(2),
	startsOn: string(),
	endsOn: string(),
	isCurrent: boolean().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("2b2566f5c031995d7858e0dd17041f6cd9f3e92de2054ec4a5243f14280a468c"));
var listClasses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b6a23956efc2165f49b0ba7f44fa648baddbf520f1fd4d2d4c1c178f55285a53"));
var saveClass = createServerFn({ method: "POST" }).validator(object({
	name: string().min(2),
	gradeLevel: number(),
	stream: string(),
	sessionId: number()
})).middleware([authMiddleware]).handler(createSsrRpc("2a5c619a8ed9258dd32ded74a3502fd09c01763e9982bdda65f552ecb73e97f2"));
var saveSection = createServerFn({ method: "POST" }).validator(object({
	classId: number(),
	name: string().min(1),
	room: string().optional(),
	inchargeTeacherId: number().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("df2bcd625f41ff86f31d033bc55c3a95b1929202f09f97f1460247d5899aaf29"));
var listSubjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("514e59aff01bb743c49b89dcf9a663d1eb3f60a7706dc19870a9a2b1817afae3"));
var saveSubject = createServerFn({ method: "POST" }).validator(object({
	id: number().optional(),
	name: string().min(2),
	code: string().min(2),
	description: string().optional(),
	syllabus: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("72b67993e36919c7e3604126001426145ea8faeda1c27ba39f6bc166766fc9fe"));
var assignSubject = createServerFn({ method: "POST" }).validator(object({
	classId: number(),
	sectionId: number().optional(),
	subjectId: number(),
	teacherId: number().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("448715c1fc8e98792e2d46f104e718fc38431fcfbc6a3395cae897d13f5d1cde"));
var getTimetable = createServerFn({ method: "GET" }).validator(object({ sectionId: number().optional() }).optional()).middleware([authMiddleware]).handler(createSsrRpc("ed356b2823872e0d09a84e811e76d0aa903d789a4fb2f9f34d2a15395a9211a7"));
var saveTimetableSlot = createServerFn({ method: "POST" }).validator(object({
	sectionId: number(),
	subjectId: number(),
	teacherId: number().optional(),
	dayOfWeek: number(),
	period: number(),
	startsAt: string(),
	endsAt: string(),
	room: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("5dc3a40fe35109c48194495e3900622e37c144bb1476446ff6fc660a2f3dfeb8"));
var listCalendar = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bf6edcdba467e9f99067a8d1a14f8f66e2a394bfab1292ae00c0706a50603d38"));
var saveCalendarEvent = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	description: string().optional(),
	eventDate: string(),
	eventType: string()
})).middleware([authMiddleware]).handler(createSsrRpc("a9fc83a844be9069f93469d5e756924a2cc3f9004f101ca3985f6ce6722f2eaf"));
//#endregion
export { listSessions as a, saveClass as c, saveSubject as d, saveTimetableSlot as f, listClasses as i, saveSection as l, getTimetable as n, listSubjects as o, listCalendar as r, saveCalendarEvent as s, assignSubject as t, saveSession as u };
