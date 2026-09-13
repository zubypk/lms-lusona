import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LoginSlip } from "@/components/lms/login-slip";
import { PageHeader, Field, EmptyState } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { canEnrollStudents, listLookups, listStudents, saveStudent } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import type { IssuedLogin } from "@/lib/lms/types";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/students")({ component: StudentsPage });

function StudentsPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [issued, setIssued] = useState<IssuedLogin | null>(null);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const students = useQuery({ queryKey: ["students", q], queryFn: () => listStudents({ data: { q } }) });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const canEdit = canEnrollStudents(me.data?.role ?? "student");
  const lockClass = me.data?.role === "class_incharge";

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Class teachers enrol with name, father name and roll no. Login is generated automatically."
        actions={
          canEdit ? (
            <Button onClick={() => setOpen(true)}>Enrol student</Button>
          ) : null
        }
      />
      {issued ? (
        <div className="mb-4">
          <LoginSlip issued={issued} />
        </div>
      ) : null}
      <Input
        placeholder="Search name, roll or student ID"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-sm"
      />
      {students.isPending ? (
        <Skeleton className="h-64" />
      ) : !students.data?.length ? (
        <EmptyState title="No students" body="Try another search, or enrol a student in your class." />
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
                      <Badge variant="muted">
                        {s.class_name} · {s.section_name}
                      </Badge>
                      <span className="text-xs text-faint tabular-nums">Roll {s.roll_number}</span>
                    </div>
                    <div className="mt-2 text-xs text-muted">{s.email || s.username}</div>
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
                <th className="px-4 py-3 font-medium">ID / Roll</th>
                <th className="px-4 py-3 font-medium">Login</th>
                <th className="px-4 py-3 font-medium">Class</th>
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
                    <div>{s.student_code}</div>
                    <div className="text-xs text-muted">{s.roll_number}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div>{s.username}</div>
                    <div className="text-muted">{s.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="muted">
                      {s.class_name} · {s.section_name}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
      <AddStudent
        open={open}
        onOpenChange={setOpen}
        lookups={lookups.data}
        lockClass={lockClass}
        onIssued={(res) => {
          setIssued(res);
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["students"] });
        }}
      />
    </div>
  );
}

function AddStudent({
  open,
  onOpenChange,
  lookups,
  lockClass,
  onIssued,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  lockClass: boolean;
  onIssued: (issued: IssuedLogin) => void;
}) {
  const [name, setName] = useState("");
  const [father, setFather] = useState("");
  const [roll, setRoll] = useState("");
  const [classId, setClassId] = useState(String(lookups?.classes[0]?.id ?? "3"));
  const [sectionId, setSectionId] = useState(String(lookups?.sections[0]?.id ?? "5"));
  const sections = useMemo(
    () => lookups?.sections.filter((s) => String(s.class_id) === classId) ?? [],
    [lookups, classId],
  );
  const mut = useMutation({
    mutationFn: () =>
      saveStudent({
        data: {
          name,
          fatherName: father,
          rollNumber: roll,
          classId: Number(classId),
          sectionId: Number(sectionId),
          sessionId: lookups?.sessions[0]?.id ?? 1,
        },
      }),
    onSuccess: (res) => {
      toast.success(`Created ${res.studentCode}. Login issued.`);
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
          <DialogTitle>Enrol student</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <p className="text-xs text-muted">
            Only name, father name and roll no. Parent contact is classified and is not stored. Username and password
            are generated automatically.
          </p>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Father name">
            <Input value={father} onChange={(e) => setFather(e.target.value)} required />
          </Field>
          <Field label="Roll no">
            <Input value={roll} onChange={(e) => setRoll(e.target.value)} required />
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
