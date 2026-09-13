import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/records-g3YmYo9V.js
var getAttendance = createServerFn({ method: "GET" }).validator(object({
	sectionId: number().optional(),
	from: string().optional(),
	to: string().optional()
}).optional()).middleware([authMiddleware]).handler(createSsrRpc("558b29d066e7ebdf4a5be55552b3bd7d7e8ba97098098f54174344cef2583377"));
var markAttendance = createServerFn({ method: "POST" }).validator(object({
	sectionId: number(),
	date: string(),
	marks: array(object({
		studentId: number(),
		status: _enum([
			"present",
			"absent",
			"late",
			"excused"
		])
	})),
	source: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("ba76fd3b89dfafdd06d3cfaa033a2815d7d7985c049cb2eafe5ce550a6ee4b0b"));
var listResults = createServerFn({ method: "GET" }).validator(object({ examId: number().optional() }).optional()).middleware([authMiddleware]).handler(createSsrRpc("23dd4735c700985b0ea2d8ec474737f24b86b3ca0c93d93f5d33c6b37773a0a4"));
createServerFn({ method: "POST" }).validator(object({
	examId: number(),
	studentId: number(),
	subjectId: number(),
	marks: number(),
	maxMarks: number()
})).middleware([authMiddleware]).handler(createSsrRpc("5f171d33810b6a939b7ac74b02bc5cff78bec0a53217912a01bd159f25d8a1ec"));
createServerFn({ method: "POST" }).validator(object({
	examId: number(),
	published: boolean()
})).middleware([authMiddleware]).handler(createSsrRpc("e2e5cbc26eff980f8e021e104fe790a78ae79c115096d32fe0798a423c367a1f"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2a5b3ef8837eca650983966b903d1dfb0b01efe855002212ea28f25882722ab5"));
var markNotificationRead = createServerFn({ method: "POST" }).validator(object({ id: number() })).middleware([authMiddleware]).handler(createSsrRpc("42de53079db9ae2b92d958c5828cde29101b558ca253905b1be05b4e1e74a59d"));
var sendNotification = createServerFn({ method: "POST" }).validator(object({
	title: string().min(2),
	body: string().min(2),
	type: string(),
	audience: string()
})).middleware([authMiddleware]).handler(createSsrRpc("049646220efccfc3ab9ddb04fd90941f1ab7032d0c97f5d8aabedf16a1e0a535"));
var getReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f1a54432f93994fc8ab7e24f0c92d73f95b199ecedc89c552fd158191b2cd8d3"));
var listLookups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b0a0a46e3bc52fe649c0d948888015416b914aadf048d2f4971f0bfe669a6267"));
//#endregion
export { listResults as a, sendNotification as c, listNotifications as i, getReports as n, markAttendance as o, listLookups as r, markNotificationRead as s, getAttendance as t };
