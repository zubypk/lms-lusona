import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Library,
  PenSquare,
  School,
  Shield,
  Users,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BUILD } from "@/lib/build";
import {
  formatDateTime,
  getAdminOverview,
  getSettings,
  listAudit,
  listClasses,
  listLookups,
  listSessions,
  listSubjects,
  listTeachers,
  saveSettings,
} from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";
import { roleLabel } from "@/lib/lms/format";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({ component: AdminPage });

function AdminPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const role = me.data?.role;
  if (me.isPending) return <Skeleton className="h-64" />;
  if (role !== "super_admin" && role !== "academic_admin") {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-sm text-muted">
        The admin panel is limited to Super Admin and Academic Admin.
      </div>
    );
  }
  const canSettings = role === "super_admin";
  return (
    <div>
      <PageHeader
        title="Admin panel"
        subtitle="Institution control for LMS. Assign campus roles, review every list, and publish notices."
        actions={
          <Button asChild variant="outline">
            <Link to="/users">Users & roles</Link>
          </Button>
        }
      />
      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="directory">All lists</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          {canSettings ? <TabsTrigger value="release">Build & domain</TabsTrigger> : null}
          {canSettings ? <TabsTrigger value="audit">Audit</TabsTrigger> : null}
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="directory">
          <Directory />
        </TabsContent>
        <TabsContent value="notices">
          <NoticesForm locked={!canSettings} />
        </TabsContent>
        {canSettings ? (
          <TabsContent value="release">
            <ReleaseForm />
          </TabsContent>
        ) : null}
        {canSettings ? (
          <TabsContent value="audit">
            <AuditTable />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  );
}

function Overview() {
  const q = useQuery({ queryKey: ["admin-overview"], queryFn: () => getAdminOverview() });
  if (q.isPending) return <Skeleton className="h-40" />;
  if (!q.data) return null;
  const d = q.data;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Signed-in users" value={d.users} icon={<Shield className="h-5 w-5" />} />
        <StatCard label="Students" value={d.students} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Teachers" value={d.teachers} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Classes" value={d.classes} hint={`${d.sections} sections`} icon={<School className="h-5 w-5" />} />
        <StatCard label="Subjects" value={d.subjects} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Assignments" value={d.assignments} icon={<PenSquare className="h-5 w-5" />} />
        <StatCard label="Quizzes" value={d.quizzes} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard label="Notices" value={d.notices} icon={<Library className="h-5 w-5" />} />
      </div>
      <div className="mt-5 rounded-xl border border-line bg-surface p-5">
        <div className="text-sm font-medium text-ink">Role distribution</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {d.roles.map((r) => (
            <Badge key={r.role} variant="navy">
              {roleLabel(r.role)} · {r.n}
            </Badge>
          ))}
          {!d.roles.length ? <span className="text-sm text-muted">No campus profiles yet.</span> : null}
        </div>
      </div>
    </div>
  );
}

function Directory() {
  const classes = useQuery({ queryKey: ["classes"], queryFn: () => listClasses() });
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: () => listSubjects() });
  const teachers = useQuery({ queryKey: ["teachers"], queryFn: () => listTeachers() });
  const sessions = useQuery({ queryKey: ["sessions"], queryFn: () => listSessions() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ListCard
        title="Academic sessions"
        to="/sessions"
        rows={sessions.data?.map((s) => ({ k: s.id, a: s.name, b: s.is_current ? "Current" : `${s.starts_on} – ${s.ends_on}` }))}
        pending={sessions.isPending}
      />
      <ListCard
        title="Classes"
        to="/classes"
        rows={classes.data?.classes.map((c) => ({ k: c.id, a: c.name, b: `${c.stream} · ${c.session_name}` }))}
        pending={classes.isPending}
      />
      <ListCard
        title="Sections"
        to="/classes"
        rows={classes.data?.sections.map((s) => ({
          k: s.id,
          a: s.name,
          b: `${s.incharge ?? "No incharge"} · ${s.students} students`,
        }))}
        pending={classes.isPending}
      />
      <ListCard
        title="Subjects"
        to="/subjects"
        rows={subjects.data?.subjects.map((s) => ({ k: s.id, a: s.name, b: s.code }))}
        pending={subjects.isPending}
      />
      <ListCard
        title="Faculty"
        to="/teachers"
        rows={teachers.data?.map((t) => ({ k: t.id, a: t.name, b: t.subjects || t.employee_id }))}
        pending={teachers.isPending}
      />
      <ListCard
        title="Lookups"
        to="/students"
        rows={lookups.data?.classes.map((c) => ({ k: c.id, a: c.name, b: "Class register" }))}
        pending={lookups.isPending}
      />
    </div>
  );
}

function ListCard({
  title,
  to,
  rows,
  pending,
}: {
  title: string;
  to: string;
  rows?: { k: number | string; a: string; b: string }[];
  pending: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium text-ink">{title}</h2>
        <Link to={to} className="text-xs text-primary">
          Open
        </Link>
      </div>
      {pending ? (
        <Skeleton className="mt-3 h-28" />
      ) : (
        <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">
          {rows?.map((r) => (
            <li key={r.k} className="flex items-baseline justify-between gap-3 border-b border-line py-1.5 last:border-0">
              <span className="font-medium text-ink">{r.a}</span>
              <span className="text-xs text-muted">{r.b}</span>
            </li>
          ))}
          {!rows?.length ? <li className="text-muted">Empty.</li> : null}
        </ul>
      )}
    </div>
  );
}

function NoticesForm({ locked }: { locked: boolean }) {
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const [marquee, setMarquee] = useState("");
  const [release, setRelease] = useState("");
  useEffect(() => {
    if (!settings.data) return;
    setMarquee(settings.data.marquee ?? "");
    setRelease(settings.data.release_message ?? "");
  }, [settings.data]);
  const mut = useMutation({
    mutationFn: () =>
      saveSettings({
        data: {
          entries: [
            { key: "marquee", value: marquee },
            { key: "release_message", value: release },
          ],
        },
      }),
    onSuccess: () => {
      toast.success("Notices published");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-campus"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  if (settings.isPending) return <Skeleton className="h-40" />;
  return (
    <form
      className="grid max-w-2xl gap-3 rounded-xl border border-line bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">Scrolling marquee</span>
        <Textarea value={marquee} onChange={(e) => setMarquee(e.target.value)} disabled={locked} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-ink-soft">New-build message</span>
        <Textarea value={release} onChange={(e) => setRelease(e.target.value)} disabled={locked} />
      </label>
      <Button type="submit" disabled={locked || mut.isPending}>
        Publish
      </Button>
    </form>
  );
}

function ReleaseForm() {
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => {
    if (settings.data) setForm(settings.data);
  }, [settings.data]);
  const mut = useMutation({
    mutationFn: () =>
      saveSettings({
        data: {
          entries: ["college_name", "college_short", "domain", "email_domain", "email", "phone", "city", "address", "motto"].map(
            (key) => ({ key, value: form[key] ?? "" }),
          ),
        },
      }),
    onSuccess: () => {
      toast.success("Campus identity saved");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-campus"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  if (settings.isPending) return <Skeleton className="h-40" />;
  const fields = [
    ["college_name", "College name"],
    ["college_short", "Short name"],
    ["domain", "Public domain"],
    ["email_domain", "Mail domain"],
    ["email", "Registrar email"],
    ["phone", "Phone"],
    ["city", "City"],
    ["address", "Address"],
    ["motto", "Motto"],
  ] as const;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
      <form
        className="grid gap-3 rounded-xl border border-line bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
      >
        {fields.map(([key, label]) => (
          <label key={key} className="grid gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">{label}</span>
            <Input value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
          </label>
        ))}
        <Button type="submit" disabled={mut.isPending}>
          Save identity
        </Button>
      </form>
      <div className="h-fit rounded-xl border border-line bg-navy p-5 text-white">
        <div className="text-[10px] tracking-[0.16em] text-white/50 uppercase">Running build</div>
        <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{BUILD.number}</div>
        <p className="mt-2 text-sm text-white/70">{BUILD.title}</p>
        <p className="mt-3 text-xs text-white/55">LMS · Learning Management System</p>
      </div>
    </div>
  );
}

function AuditTable() {
  const audit = useQuery({ queryKey: ["audit"], queryFn: () => listAudit() });
  if (audit.isPending) return <Skeleton className="h-40" />;
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-paper text-xs text-muted uppercase">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Entity</th>
            <th className="px-4 py-3">Detail</th>
          </tr>
        </thead>
        <tbody>
          {audit.data?.map((a) => (
            <tr key={a.id} className="border-t border-line">
              <td className="px-4 py-2 text-xs">{formatDateTime(a.created_at)}</td>
              <td className="px-4 py-2">{a.action}</td>
              <td className="px-4 py-2 text-xs">
                {a.entity} {a.entity_id}
              </td>
              <td className="px-4 py-2 text-xs text-muted">{a.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
