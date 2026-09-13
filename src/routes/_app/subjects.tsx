import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { assignSubject, canTeach, listLookups, listSubjects, saveSubject } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/subjects")({ component: SubjectsPage });

function SubjectsPage() {
  const q = useQuery({ queryKey: ["subjects"], queryFn: () => listSubjects() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const teach = canTeach(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Subjects & syllabus"
        subtitle="HSSC scheme of studies with class assignments."
        actions={
          teach ? (
            <>
              <Button variant="outline" onClick={() => setAssignOpen(true)}>
                Assign to class
              </Button>
              <Button onClick={() => setOpen(true)}>Add subject</Button>
            </>
          ) : null
        }
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-4">
          {q.data?.subjects.map((s) => {
            const assigned = q.data.assignments.filter((a) => a.subject_id === s.id);
            return (
              <div key={s.id} className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-semibold">{s.name}</h2>
                    <p className="text-xs text-muted">{s.code}</p>
                  </div>
                  <Badge variant="muted">{assigned.length} class links</Badge>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{s.description}</p>
                {s.syllabus ? (
                  <pre className="mt-3 overflow-x-auto rounded-md bg-paper p-3 font-sans text-xs whitespace-pre-wrap text-muted">
                    {s.syllabus}
                  </pre>
                ) : null}
                {assigned.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {assigned.map((a) => (
                      <Badge key={a.id} variant="outline">
                        {a.class_name}
                        {a.section_name ? `-${a.section_name}` : ""} · {a.teacher_name ?? "unassigned"}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New subject</DialogTitle>
          </DialogHeader>
          <SubjectForm
            onDone={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["subjects"] });
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign subject</DialogTitle>
          </DialogHeader>
          <AssignForm
            lookups={lookups.data}
            subjects={q.data?.subjects}
            onDone={() => {
              setAssignOpen(false);
              queryClient.invalidateQueries({ queryKey: ["subjects"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SubjectForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const mut = useMutation({
    mutationFn: () => saveSubject({ data: { name, code, description, syllabus } }),
    onSuccess: () => {
      toast.success("Subject saved");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Code">
        <Input value={code} onChange={(e) => setCode(e.target.value)} required />
      </Field>
      <Field label="Description">
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="Syllabus">
        <Textarea value={syllabus} onChange={(e) => setSyllabus(e.target.value)} />
      </Field>
      <Button type="submit">Save</Button>
    </form>
  );
}

function AssignForm({
  lookups,
  subjects,
  onDone,
}: {
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  subjects?: { id: number; name: string }[];
  onDone: () => void;
}) {
  const [classId, setClassId] = useState("3");
  const [sectionId, setSectionId] = useState("5");
  const [subjectId, setSubjectId] = useState("1");
  const [teacherId, setTeacherId] = useState("");
  const mut = useMutation({
    mutationFn: () =>
      assignSubject({
        data: {
          classId: Number(classId),
          sectionId: Number(sectionId),
          subjectId: Number(subjectId),
          teacherId: teacherId ? Number(teacherId) : undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Assigned");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <Field label="Subject">
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects?.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
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
            {lookups?.sections
              .filter((s) => String(s.class_id) === classId)
              .map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Teacher">
        <Select value={teacherId} onValueChange={setTeacherId}>
          <SelectTrigger>
            <SelectValue placeholder="Optional" />
          </SelectTrigger>
          <SelectContent>
            {lookups?.teachers.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Button type="submit">Assign</Button>
    </form>
  );
}
