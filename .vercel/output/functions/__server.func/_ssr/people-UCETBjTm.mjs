import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-UCETBjTm.js
var listStudents = createServerFn({ method: "GET" }).validator(object({
	q: string().optional(),
	sectionId: number().optional()
}).optional()).middleware([authMiddleware]).handler(createSsrRpc("53c5b8fe6bdbc40efccb58e47e48d6ff3badb5aa5e3b02c2bb1d56de39eb2430"));
var saveStudent = createServerFn({ method: "POST" }).validator(object({
	name: string().min(2),
	fatherName: string().min(2),
	classId: number(),
	sectionId: number(),
	sessionId: number(),
	mobile: string().optional(),
	email: string().optional(),
	rollNumber: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("5d031dd9bb7a4df1b889152ec2974d8e22518f2e38f9efbe88a33d8e51d58729"));
var listTeachers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("aa50057be82489a03b8df58352fd510b608c6eb7131d69597253266268824223"));
var saveTeacher = createServerFn({ method: "POST" }).validator(object({
	name: string().min(2),
	qualification: string().optional(),
	mobile: string().optional(),
	email: string().optional()
})).middleware([authMiddleware]).handler(createSsrRpc("afc23b6f2955e92f6b47176972626534261558498666b1f3d746feb32c6184c9"));
//#endregion
export { saveTeacher as i, listTeachers as n, saveStudent as r, listStudents as t };
