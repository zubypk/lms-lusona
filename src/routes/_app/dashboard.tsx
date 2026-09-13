import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  PenSquare,
  Users,
  Video,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/misc";
import { getDashboard } from "@/lib/lms";
import { formatDate, formatDateTime, platformLabel, roleLabel } from "@/lib/lms/format";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function Dashboard() {
  const q = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  if (q.isPending) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }
  if (q.error || !q.data) {
    return <p className="text-sm text-danger">{(q.error as Error)?.message ?? "Could not load dashboard."}</p>;
  }
  const d = q.data;
  const actor = d.actor;
  const chart = d.attendanceTrend.map((r) => ({
    day: r.day.slice(5),
    pct: r.total ? Math.round((r.present / r.total) * 100) : 0,
  }));

  return (
    <div>
      <PageHeader
        title={actor.role === "student" ? `Assalam-o-Alaikum, ${actor.displayName.split(" ")[0]}` : "Campus overview"}
        subtitle={`${roleLabel(actor.role)}${actor.className ? ` · ${actor.className} ${actor.sectionName ?? ""}` : ""} · Session 2025–26`}
      />

      {actor.role === "student" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Attendance" value={d.myAttendance != null ? `${d.myAttendance}%` : "—"} hint="Present + late / enrolled days" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard label="Mid-term GPA" value={d.myGpa ?? "—"} hint="HSSC-I published papers" icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard label="Open assignments" value={d.myPending ?? 0} hint="Not yet submitted" icon={<PenSquare className="h-5 w-5" />} />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Students" value={d.totals.students} icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard label="Teachers" value={d.totals.teachers} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Attendance (14 days)" value={`${d.totals.attendancePct}%`} icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard label="Pending grading" value={d.totals.pendingGrading} hint={`${d.totals.assignments} live assignments`} icon={<PenSquare className="h-5 w-5" />} />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] lg:col-span-3">
          <div className="text-sm font-medium text-ink">College attendance</div>
          <div className="text-xs text-muted">Last ten working days</div>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted)" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-muted)" }} />
                <RTooltip />
                <Line type="monotone" dataKey="pct" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-ink">Upcoming deadlines</div>
            <Link to="/assignments" className="text-xs text-primary">View all</Link>
          </div>
          <ul className="mt-3 space-y-3">
            {d.deadlines.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3">
                <div>
                  <Link to="/assignments/$id" params={{ id: String(a.id) }} className="text-sm font-medium text-ink hover:underline">
                    {a.title}
                  </Link>
                  <div className="text-xs text-muted">{a.subject_name}</div>
                </div>
                <div className="text-xs text-faint whitespace-nowrap">{formatDateTime(a.due_at)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-ink">Online classes</div>
            <Link to="/meetings" className="text-xs text-primary">Schedule</Link>
          </div>
          <ul className="mt-3 space-y-3">
            {d.upcomingMeetings.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{m.title}</div>
                  <div className="text-xs text-muted">
                    {platformLabel(m.platform)} · {formatDateTime(m.starts_at)}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={m.url} target="_blank" rel="noreferrer">
                    <Video className="h-3.5 w-3.5" /> Join
                  </a>
                </Button>
              </li>
            ))}
            {!d.upcomingMeetings.length ? <p className="text-sm text-muted">No upcoming sessions.</p> : null}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-ink">Notices</div>
            <Link to="/notifications" className="text-xs text-primary">Inbox</Link>
          </div>
          <ul className="mt-3 space-y-3">
            {d.notices.map((n) => (
              <li key={n.id}>
                <div className="flex items-center gap-2">
                  <Badge variant="muted">{n.type}</Badge>
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{n.body}</p>
                <div className="mt-1 text-[11px] text-faint">{formatDate(n.created_at)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {actor.role === "student" && d.mySubjects.length ? (
        <div className="mt-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-primary" /> This term
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {d.mySubjects.map((s) => (
              <div key={s.name} className="rounded-md border border-line px-3 py-2">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted">{s.teacher ?? "Faculty to be assigned"}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
