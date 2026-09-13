import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Shield,
  Video,
} from "lucide-react";
import { AppearanceControls } from "@/components/appearance/controls";
import { CampusMarquee } from "@/components/brand/marquee";
import { HeroSlider } from "@/components/brand/hero-slider";
import { Wordmark } from "@/components/brand/crest";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BUILD, CAMPUS_DOMAIN, MAIL_DOMAIN } from "@/lib/build";

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

const MARQUEE =
  "Welcome to AEC LMS · Session 2025–26 · Official portal lms.lusona.org · College mail @lms.edu.pk · Mid-term week begins 22 September · Physics practicals in Lab 2";

function Home() {
  const { isPending } = useCurrentUserState();

  return (
    <div className="min-h-dvh bg-paper">
      <CampusMarquee text={MARQUEE} />

      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
        <Wordmark />
        <div className="flex items-center gap-2">
          <AppearanceControls />
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

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-6 pt-2 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            Academic session 2025–26 · FBISE
          </div>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] font-semibold tracking-tight text-navy sm:text-5xl">
            Atomic Energy Commission College
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
            The campus learning system for students, teachers and academic staff in Rawalpindi and
            Islamabad. Timetables, laboratories, assessments and results — in one place.
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
            After signing in, choose a campus role — Super Admin, Teacher or Student — or ask an
            administrator to assign one. Mail domain @{MAIL_DOMAIN}.
          </p>
        </div>
        <HeroSlider className="h-[18rem] sm:h-[22rem] lg:h-[26rem]" />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="grid gap-3 rounded-xl border border-line bg-navy p-5 text-white sm:grid-cols-4 sm:p-6">
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Portal</div>
            <div className="mt-1 font-medium">{CAMPUS_DOMAIN}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Mail</div>
            <div className="mt-1 font-medium">@{MAIL_DOMAIN}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Registrar</div>
            <div className="mt-1 font-medium">registrar@{MAIL_DOMAIN}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Build</div>
            <div className="mt-1 font-medium tabular-nums">{BUILD.number}</div>
          </div>
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="font-display text-2xl font-semibold text-navy">What the campus system covers</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Built for a college of several thousand students: class incharges, subject teachers and the
          academic office share one register.
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

      <SiteFooter />
    </div>
  );
}
