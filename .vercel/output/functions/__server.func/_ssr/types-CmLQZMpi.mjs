//#region node_modules/.nitro/vite/services/ssr/assets/types-CmLQZMpi.js
var ROLES = [
	{
		id: "super_admin",
		label: "Super Admin",
		blurb: "Institution-wide control: people, sessions, settings and reports."
	},
	{
		id: "academic_admin",
		label: "Academic Admin",
		blurb: "Sessions, classes, subjects, timetables and published results."
	},
	{
		id: "class_incharge",
		label: "Class Incharge",
		blurb: "One section: roster, timetable, attendance and student progress."
	},
	{
		id: "teacher",
		label: "Teacher",
		blurb: "Assigned classes — materials, assignments, quizzes and marking."
	},
	{
		id: "student",
		label: "Student",
		blurb: "Your timetable, work, attendance, results and class forum."
	}
];
function canManagePeople(role) {
	return role === "super_admin" || role === "academic_admin" || role === "class_incharge";
}
function canTeach(role) {
	return role === "teacher" || role === "class_incharge" || role === "super_admin" || role === "academic_admin";
}
function canAdmin(role) {
	return role === "super_admin" || role === "academic_admin";
}
//#endregion
export { canTeach as i, canAdmin as n, canManagePeople as r, ROLES as t };
