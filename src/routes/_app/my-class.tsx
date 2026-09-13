import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, PenSquare, Video, ClipboardList, ClipboardCheck, KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LoginSlip } from "@/components/lms/login-slip";
import { Field, PageHeader, EmptyState } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, Skeleton } from "@/components/ui/misc";
import {
  canEnrollStudents,
  getTeacherDesk,
  listLookups,
  listStudents,
  resetStudentLogin,
  saveStudent,
} from "@/lib/lms";
import type { IssuedLogin } from "@/lib/lms/types";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/my-class")({ component: MyClassPage });

function MyClassPage() {
  const desk = useQuery({ queryKey: ["teacher-desk"], queryFn: () => getTeacherDesk() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const actor = desk.data?.actor;
  const incharge = desk.data?.incharge ?? [];
  const teaching = desk.data?.teaching ?? [];
  const [sectionId, setSectionId] = useState<number | undefined>();
  const chosen = sectionId ?? incharge[0]?.section_id;
  const students = useQuery({
    queryKey: ["students", chosen ?? "all"],
    queryFn: () => listStudents({ data: chosen ? { sectionId: chosen } : undefined }),
    enabled: !!actor,
  });
  const [open, setOpen] = useState(false);
  const [issued, setIssued] = useState<IssuedLogin | null>(null);
  const enroll = canEnrollStudents(actor?.role ?? "student") && (incharge.length > 0 || actor?.role === "super_admin" || actor?.role === "academic_admin");

  const resetMut = useMutation({
    mutationFn: (studentId: number) => resetStudentLogin({ data: { studentId } }),
    onSuccess: (res) => {
      setIssued(res);
      toast.success(`New password for ${res.name}`);
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (desk.isPending) return <Skeleton className="h-64" />;
  if (desk.error) return <p className="text-sm text-danger">{(desk.error as Error).message}</p>;

  return (
    <div>
      <PageHeader
        title="My class"
        subtitle={
          incharge.length
            ? "Enrol your own class. Only name, father name and roll no. Login is issued automatically."
            : "Your assigned classes and subjects. Students in those sections only."
        }
        actions={
          enroll ? (
            <Button onClick={() => setOpen(true)}>Enrol student</Button>
          ) : null
        }
      />

      {incharge.length ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {incharge.map((sec) => (
            <button
              key={sec.section_id}
              type="button"
              onClick={() => setSectionId(sec.section_id)}
              className={`rounded-xl border p-4 text-left shadow-[var(--shadow-card)] ${
                chosen === sec.section_id ? "border-primary bg-info-bg" : "border-line bg-surface"
              }`}
            >
              <div className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">Class teacher</div>
              <div className="mt-1 font-display text-lg font-semibold text-ink">
                {sec.class_name} · {sec.section_name}
              </div>
              <div className="mt-1 text-xs text-muted">
                {sec.students} students{sec.room ? ` · ${sec.room}` : ""}
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {teaching.length ? (
        <div className="mb-6">
          <div className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">Assigned subjects</div>
          <div className="flex flex-wrap gap-2">
            {teaching.map((t, i) => (
              <Badge key={`${t.subject_id}-${t.section_id}-${i}`} variant={t.is_incharge ? "ok" : "muted"}>
                {t.subject_name} · {t.class_name}
                {t.section_name ? ` ${t.section_name}` : ""}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/materials">
                <BookOpen className="h-3.5 w-3.5" /> Materials
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/assignments">
                <PenSquare className="h-3.5 w-3.5" /> Assignments
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/quizzes">
                <ClipboardList className="h-3.5 w-3.5" /> Quizzes
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/meetings">
                <Video className="h-3.5 w-3.5" /> Google Meet
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/attendance">
                <ClipboardCheck className="h-3.5 w-3.5" /> Attendance
              </Link>
            </Button>
          </div>
        </div>
      ) : null}

      {issued ? (
        <div className="mb-6">
          <LoginSlip issued={issued} />
        </div>
      ) : null}

      {students.isPending ? (
        <Skeleton className="h-64" />
      ) : !students.data?.length ? (
        <EmptyState
          title="No students in this class yet"
          body="Add a student with name, father name and roll no. The LMS will create their sign-in."
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {students.data.map((s) => (
              <div key={s.id} className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <Avatar name={s.name} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink">{s.name}</div>
                    <div className="text-xs text-muted">S/O {s.father_name}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="muted">Roll {s.roll_number}</Badge>
                      {s.has_login ? <Badge variant="ok">Login ready</Badge> : <Badge variant="warn">No login</Badge>}
                    </div>
                    <div className="mt-1 text-xs text-muted">{s.email || s.username}</div>
                    {enroll ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 px-0"
                        onClick={() => resetMut.mutate(s.id)}
                      >
                        <KeyRound className="h-3.5 w-3.5" /> Reset password
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lms-table-scroll hidden overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Roll</th>
                  <th className="px-4 py-3 font-medium">Login</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  {enroll ? <th className="px-4 py-3 font-medium"> </th> : null}
                </tr>
              </thead>
              <tbody>
                {students.data.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} />
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted">S/O {s.father_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      <div>{s.roll_number}</div>
                      <div className="text-xs text-muted">{s.student_code}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium">{s.email || s.username}</div>
                      {s.has_login ? (
                        <span className="text-ok">Account issued</span>
                      ) : (
                        <span className="text-warn">Needs login</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="muted">
                        {s.class_name} · {s.section_name}
                      </Badge>
                    </td>
                    {enroll ? (
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => resetMut.mutate(s.id)}>
                          <KeyRound className="h-3.5 w-3.5" /> Reset
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <EnrolDialog
        open={open}
        onOpenChange={setOpen}
        lookups={lookups.data}
        defaultSectionId={chosen}
        lockClass={!actor || actor.role === "class_incharge"}
        onIssued={(res) => {
          setIssued(res);
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["students"] });
          queryClient.invalidateQueries({ queryKey: ["teacher-desk"] });
        }}
      />
    </div>
  );
}

function EnrolDialog({
  open,
  onOpenChange,
  lookups,
  defaultSectionId,
  lockClass,
  onIssued,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  defaultSectionId?: number;
  lockClass: boolean;
  onIssued: (issued: IssuedLogin) => void;
}) {
  const [name, setName] = useState("");
  const [father, setFather] = useState("");
  const [roll, setRoll] = useState("");
  const [classId, setClassId] = useState(String(lookups?.classes[0]?.id ?? ""));
  const [sectionId, setSectionId] = useState(String(defaultSectionId ?? lookups?.sections[0]?.id ?? ""));
  const sections = useMemo(
    () => lookups?.sections.filter((s) => !classId || String(s.class_id) === classId) ?? [],
    [lookups, classId],
  );
  const mut = useMutation({
    mutationFn: () =>
      saveStudent({
        data: {
          name,
          fatherName: father,
          rollNumber: roll,
          classId: classId ? Number(classId) : undefined,
          sectionId: sectionId ? Number(sectionId) : undefined,
        },
      }),
    onSuccess: (res) => {
      toast.success(`Login issued for ${res.name}`);
      setName("");
      setFather("");
      setRoll("");
      onIssued(res);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enrol in your class</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <p className="text-xs text-muted">
            Classified parent data is not collected. Enter only name, father name and roll no. The LMS generates the
            student email and password.
          </p>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </Field>
          <Field label="Father name">
            <Input value={father} onChange={(e) => setFather(e.target.value)} required />
          </Field>
          <Field label="Roll no">
            <Input value={roll} onChange={(e) => setRoll(e.target.value)} required placeholder="11A-24" />
          </Field>
          {lockClass ? null : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Class">
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lookups?.classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Section">
                <Select value={sectionId} onValueChange={setSectionId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}
          <Button type="submit" disabled={mut.isPending}>
            {mut.isPending ? "Issuing login…" : "Save and issue login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
