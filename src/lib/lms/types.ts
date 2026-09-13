export type Role =
  | "super_admin"
  | "academic_admin"
  | "class_incharge"
  | "teacher"
  | "student";

export const ROLES: { id: Role; label: string; blurb: string }[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    blurb: "Institution-wide control: people, sessions, settings and reports.",
  },
  {
    id: "academic_admin",
    label: "Academic Admin",
    blurb: "Sessions, classes, subjects, timetables and published results.",
  },
  {
    id: "class_incharge",
    label: "Class Incharge",
    blurb: "Your class: enrol with name, father name and roll no. Login is issued automatically.",
  },
  {
    id: "teacher",
    label: "Subject Teacher",
    blurb: "Only your assigned classes — materials, quizzes, assignments and live sessions.",
  },
  {
    id: "student",
    label: "Student",
    blurb: "Your timetable, work, attendance, results and class forum.",
  },
];

export type Actor = {
  userId: string;
  role: Role;
  displayName: string;
  email: string | null;
  photoUrl: string | null;
  studentId: number | null;
  teacherId: number | null;
  classId: number | null;
  sectionId: number | null;
  className: string | null;
  sectionName: string | null;
};

export type TeachingAssignment = {
  class_id: number;
  section_id: number | null;
  subject_id: number;
  class_name: string;
  section_name: string | null;
  subject_name: string;
  is_incharge: boolean;
};

export type IssuedLogin = {
  id: number;
  username: string;
  email: string;
  tempPassword: string;
  studentCode: string;
  rollNumber: string;
  name: string;
};

export function isStaff(role: Role) {
  return role !== "student";
}

export function canManagePeople(role: Role) {
  return role === "super_admin" || role === "academic_admin" || role === "class_incharge";
}

export function canEnrollStudents(role: Role) {
  return canManagePeople(role);
}

export function canTeach(role: Role) {
  return role === "teacher" || role === "class_incharge" || role === "super_admin" || role === "academic_admin";
}

export function canAdmin(role: Role) {
  return role === "super_admin" || role === "academic_admin";
}
