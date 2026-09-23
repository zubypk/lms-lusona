import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Shield,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppearanceControls } from "@/components/appearance/controls";
import { CampusMarquee } from "@/components/brand/marquee";
import { HeroSlider } from "@/components/brand/hero-slider";
import { Wordmark } from "@/components/brand/crest";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { openCampusDesk } from "@/lib/lms/enter-campus";
import { BUILD } from "@/lib/build";

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
    body: "Class teachers enrol with name, father name and roll no. Student login is issued automatically.",
  },
];

const MARQUEE =
  "Welcome to LMS · Class teachers enrol with Name, Father name and Roll no · Student login issued automatically · Subject teachers see only their classes";

function EnterLmsButton({ size = "lg" }: { size?: "default" | "lg" }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size={size}
      className="w-full sm:w-auto"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void openCampusDesk().catch(() => {
          setBusy(false);
          window.location.assign("/dashboard");
        });
      }}
    >
      {busy ? "Opening campus…" : "Enter LMS"}
    </Button>
  );
}

function Home() {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);

  const authSlot = !live ? (
    <div className="h-11 w-24 rounded-md bg-paper-2" aria-hidden />
  ) : (
    <>
      <SignedOut>
        <Button asChild variant="outline" className="h-11 px-3 sm:px-4">
          <Link to="/login">Sign in</Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <Button asChild className="h-11 px-3 sm:px-4">
          <Link to="/dashboard">Open LMS</Link>
        </Button>
      </SignedIn>
    </>
  );

  return (
    <div className="min-h-dvh">
      <CampusMarquee text={MARQUEE} />

      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4">
        <Wordmark compact />
        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <AppearanceControls />
          {authSlot}
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-6 pt-2 sm:px-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-warn/40 bg-warn-bg px-3 py-1 text-xs font-medium text-ink">
            Test preview · full site coming soon
          </div>
          <h1 className="mt-5 font-display text-[2.35rem] leading-[1.08] font-semibold tracking-tight text-heading sm:text-5xl">
            LMS
          </h1>
          <p className="mt-2 text-sm font-medium tracking-[0.14em] text-muted uppercase">
            Learning Management System
          </p>
          <p className="mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
            One campus system for students, teachers and academic staff. Timetables, laboratories,
            assessments and results — in one place, on phone or desktop.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {!live ? (
              <div className="h-12 w-40 rounded-lg bg-paper-2" aria-hidden />
            ) : (
              <>
                <SignedOut>
                  <EnterLmsButton />
                </SignedOut>
                <SignedIn>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to="/dashboard">Enter LMS</Link>
                  </Button>
                </SignedIn>
              </>
            )}
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#modules">Browse modules</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/help">Read help</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            Enter LMS opens the campus desk. Sign in is optional — use it for a named Google, X or email
            account.
          </p>
        </div>
        <HeroSlider className="h-[16rem] sm:h-[22rem] lg:h-[26rem]" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-5">
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-line bg-navy p-4 text-white sm:grid-cols-4 sm:p-6">
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Product</div>
            <div className="mt-1 font-medium">LMS</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Session</div>
            <div className="mt-1 font-medium">2025–26</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Access</div>
            <div className="mt-1 font-medium">Phone + web</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Build</div>
            <div className="mt-1 font-medium tabular-nums">{BUILD.number}</div>
          </div>
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
        <h2 className="font-display text-2xl font-semibold text-heading">What LMS covers</h2>
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
