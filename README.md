# AEC Learning Management System

Campus LMS for **Atomic Energy Commission College**, Rawalpindi / Islamabad.

- Portal: [lms.lusona.org](https://lms.lusona.org)
- College mail: `@lms.edu.pk`
- Build: `2026.09.13.2`

## What it includes

- Role-based campus: Super Admin, Academic Admin, Class Incharge, Teacher, Student
- Admin panel with full directory lists and **Users & roles** assignment
- Courses, materials, assignments, quizzes, attendance, results, forums, live classes
- Themes and background dropdowns, welcome screen, scrolling marquee
- Campus photo slider on the landing page
- New-build notice for every release, with the build number in the footer

## Sign in

Create an account with email, Google, or X. On first entry pick a campus role, or ask a Super Admin to assign one from **Users & roles**.

## Local development

```bash
npm install
npm run dev
```

The app expects the Grok App Builder runtime (TanStack Start, Postgres / PGLite, Better Auth). Migrations live in `migrations/`.

## Domain rename

`ecn.edu.pk` has been replaced by **`lms.edu.pk`** for college mail. The public portal identity is **`lms.lusona.org`**.
