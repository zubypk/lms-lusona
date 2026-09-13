import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { canManagePeople, listLookups, listStudents, saveStudent } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/students")({ component: StudentsPage });

function StudentsPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const students = useQuery({ queryKey: ["students", q], queryFn: () => listStudents({ data: { q } }) });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const canEdit = canManagePeople(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Register, roll numbers and section placement for session 2025–26."
        actions={
          canEdit ? (
            <Button onClick={() => setOpen(true)}>Add student</Button>
          ) : null
        }
      />
      <Input
        placeholder="Search name, roll or student ID"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-sm"
      />
      {students.isPending ? (
        <Skeleton className="h-64" />
      ) : !students.data?.length ? (
        <EmptyState title="No students" body="Try another search, or add a student to this session." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">ID / Roll</th>
                <th className="px-4 py-3 font-medium">Registration</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Contact</th>
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
                  <td className="px-4 py-3 text-xs tabular-nums">{s.registration_number}</td>
                  <td className="px-4 py-3">
                    <Badge variant="muted">
                      {s.class_name} · {s.section_name}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div>{s.username}</div>
                    <div className="text-muted">{s.email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddStudent open={open} onOpenChange={setOpen} lookups={lookups.data} />
    </div>
  );
}

function AddStudent({
  open,
  onOpenChange,
  lookups,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lookups?: Awaited<ReturnType<typeof listLookups>>;
}) {
  const [name, setName] = useState("");
  const [father, setFather] = useState("");
  const [classId, setClassId] = useState("3");
  const [sectionId, setSectionId] = useState("5");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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
          classId: Number(classId),
          sectionId: Number(sectionId),
          sessionId: lookups?.sessions[0]?.id ?? 1,
          email,
          mobile,
        },
      }),
    onSuccess: (res) => {
      toast.success(`Created ${res.studentCode}. Username ${res.username}. Temporary password: ${res.tempPassword}`);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admit student</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Father name">
            <Input value={father} onChange={(e) => setFather(e.target.value)} required />
          </Field>
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
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Mobile">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </Field>
          <p className="text-xs text-muted">
            A campus username and temporary password are generated. The student signs in with this
            email when they create their account.
          </p>
          <Button type="submit" disabled={mut.isPending}>
            Save student
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
