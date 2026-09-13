import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Shield,
  Video,
} from "lucide-react";
import { Crest, Wordmark } from "@/components/brand/crest";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

const FEATURES = [
  {
    icon: BookOpen,
    title: "Courses & materials",
    body: "Syllabus, lecture notes, labs and recorded lessons — searchable by subject.",
  },
  {
    icon: ClipboardCheck,
    title: "Assignments & quizzes",
    body: "Deadlines, submissions, auto-graded checkpoints and a question bank.",
  },
  {
    icon: GraduationCap,
    title: "Attendance & results",
    body: "Daily registers, semester percentages, mid-term GPA and exportable gazettes.",
  },
  {
    icon: Video,
    title: "Live classes",
    body: "Schedule Meet, Zoom or Teams sessions with the college calendar.",
  },
  {
    icon: LineChart,
    title: "Role-based dashboards",
    body: "Separate views for Super Admin, Academic Admin, Incharge, Teacher and Student.",
  },
  {
    icon: Shield,
    title: "Campus accounts",
    body: "Signed-in access with Google, X, or college email. Activity is logged.",
  },
];

function Home() {
  const { isPending } = useCurrentUserState();

  return (
    <div className="min-h-dvh bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Wordmark />
        <div className="flex items-center gap-2">
          {isPending ? <div className="h-10 w-24 animate-pulse rounded-md bg-paper-2" /> : null}
          <SignedOut>
            <Button asChild variant="outline">
              <Link to="/login">Sign in</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link to="/dashboard">Open campus</Link>
            </Button>
          </SignedIn>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_55%)]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Academic session 2025–26 · FBISE
            </div>
            <h1 className="mt-5 font-display text-4xl leading-[1.12] font-semibold tracking-tight text-navy sm:text-5xl">
              Atomic Energy Commission College
            </h1>
            <p className="mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
              The campus learning system for students, teachers and academic staff in Rawalpindi
              and Islamabad. Timetables, laboratories, assessments and results — in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <SignedOut>
                <Button asChild size="lg">
                  <Link to="/login">Enter the LMS</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to dashboard</Link>
                </Button>
              </SignedIn>
              <Button asChild size="lg" variant="outline">
                <a href="#modules">Browse modules</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">
              After signing in, choose a campus role — Super Admin, Teacher or Student — to explore
              the seeded Grade 11 Pre-Engineering cohort.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-navy p-6 text-white shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-3">
              <Crest className="h-12 w-12" light />
              <div>
                <div className="font-display text-xl font-semibold">AEC LMS</div>
                <div className="text-xs tracking-[0.16em] text-white/55 uppercase">ecn.edu.pk</div>
              </div>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-white/50">Campus</dt>
                <dd className="mt-1 font-medium">Nilore · Islamabad</dd>
              </div>
              <div>
                <dt className="text-white/50">Board</dt>
                <dd className="mt-1 font-medium">FBISE HSSC</dd>
              </div>
              <div>
                <dt className="text-white/50">Streams</dt>
                <dd className="mt-1 font-medium">Pre-Engineering</dd>
              </div>
              <div>
                <dt className="text-white/50">Motto</dt>
                <dd className="mt-1 font-medium">Knowledge in service of the nation</dd>
              </div>
            </dl>
            <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/50">
              Registrar · +92 51 924 8801 · registrar@ecn.edu.pk
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="font-display text-2xl font-semibold text-navy">What the campus system covers</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Built for a college of several thousand students: class incharges, subject teachers and
          the academic office share one register.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-medium text-ink">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Atomic Energy Commission College · Rawalpindi / Islamabad</span>
          <span>Future production domain: www.ecn.edu.pk</span>
        </div>
      </footer>
    </div>
  );
}
