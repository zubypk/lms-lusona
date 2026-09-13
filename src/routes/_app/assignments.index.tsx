import { createFileRoute, Link } from "@tanstack/react-router";
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
import { canTeach, formatDateTime, listAssignments, listLookups, saveAssignment } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/assignments/")({ component: AssignmentsPage });

function AssignmentsPage() {
  const q = useQuery({ queryKey: ["assignments"], queryFn: () => listAssignments() });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const [open, setOpen] = useState(false);
  const teach = canTeach(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle="Set work, collect submissions before the deadline, then grade."
        actions={teach ? <Button onClick={() => setOpen(true)}>Create assignment</Button> : null}
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-3">
          {q.data?.map((a) => (
            <Link
              key={a.id}
              to="/assignments/$id"
              params={{ id: String(a.id) }}
              className="block rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-medium">{a.title}</h2>
                  <p className="text-sm text-muted">
                    {a.subject_name} · {a.class_name} · due {formatDateTime(a.due_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="muted">{a.max_marks} marks</Badge>
                  {a.my_status ? (
                    <Badge variant={a.my_status === "graded" ? "ok" : "default"}>{a.my_status}</Badge>
                  ) : (
                    <Badge variant="outline">{a.submission_count} submitted</Badge>
                  )}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{a.description}</p>
            </Link>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New assignment</DialogTitle>
          </DialogHeader>
          <AssignmentForm
            lookups={lookups.data}
            onDone={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["assignments"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssignmentForm({
  lookups,
  onDone,
}: {
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("1");
  const [classId, setClassId] = useState("3");
  const [dueAt, setDueAt] = useState("2026-09-30T16:00");
  const [maxMarks, setMaxMarks] = useState("50");
  const mut = useMutation({
    mutationFn: () =>
      saveAssignment({
        data: {
          title,
          description,
          subjectId: Number(subjectId),
          classId: Number(classId),
          dueAt: new Date(dueAt).toISOString(),
          maxMarks: Number(maxMarks),
        },
      }),
    onSuccess: () => {
      toast.success("Assignment published");
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
      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>
      <Field label="Brief">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="Subject">
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {lookups?.subjects.map((s) => (
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
      <div className="grid grid-cols-2 gap-3">
        <Field label="Due">
          <Input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        </Field>
        <Field label="Marks">
          <Input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
        </Field>
      </div>
      <Button type="submit">Publish</Button>
    </form>
  );
}
