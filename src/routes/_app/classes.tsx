import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { listClasses, listLookups, saveClass, saveSection } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/classes")({ component: ClassesPage });

function ClassesPage() {
  const q = useQuery({ queryKey: ["classes"], queryFn: () => listClasses() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const [classOpen, setClassOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Classes & sections"
        subtitle="Grade structure for the current academic session."
        actions={
          <>
            <Button variant="outline" onClick={() => setSectionOpen(true)}>
              Add section
            </Button>
            <Button onClick={() => setClassOpen(true)}>Add class</Button>
          </>
        }
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-4">
          {q.data?.classes.map((c) => {
            const secs = q.data.sections.filter((s) => s.class_id === c.id);
            return (
              <div key={c.id} className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-semibold">{c.name}</h2>
                    <p className="text-xs text-muted">
                      Grade {c.grade_level} · {c.stream.replace("_", " ")} · {c.session_name}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {secs.map((s) => (
                    <div key={s.id} className="rounded-md border border-line p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Section {s.name}</span>
                        <Badge variant="muted">{s.students} students</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted">Room {s.room ?? "—"}</div>
                      <div className="mt-1 text-xs text-ink-soft">Incharge: {s.incharge ?? "Unassigned"}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <AddClass open={classOpen} onOpenChange={setClassOpen} lookups={lookups.data} />
      <AddSection open={sectionOpen} onOpenChange={setSectionOpen} lookups={lookups.data} />
    </div>
  );
}

function AddClass({
  open,
  onOpenChange,
  lookups,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lookups?: Awaited<ReturnType<typeof listLookups>>;
}) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("11");
  const [stream, setStream] = useState("pre_engineering");
  const mut = useMutation({
    mutationFn: () =>
      saveClass({
        data: {
          name,
          gradeLevel: Number(grade),
          stream,
          sessionId: lookups?.sessions[0]?.id ?? 1,
        },
      }),
    onSuccess: () => {
      toast.success("Class created");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create class</DialogTitle>
        </DialogHeader>
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
          <Field label="Grade level">
            <Input type="number" value={grade} onChange={(e) => setGrade(e.target.value)} />
          </Field>
          <Field label="Stream">
            <Input value={stream} onChange={(e) => setStream(e.target.value)} />
          </Field>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddSection({
  open,
  onOpenChange,
  lookups,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lookups?: Awaited<ReturnType<typeof listLookups>>;
}) {
  const [classId, setClassId] = useState("3");
  const [name, setName] = useState("C");
  const [room, setRoom] = useState("");
  const mut = useMutation({
    mutationFn: () => saveSection({ data: { classId: Number(classId), name, room } }),
    onSuccess: () => {
      toast.success("Section created");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create section</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
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
          <Field label="Section name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Room">
            <Input value={room} onChange={(e) => setRoom(e.target.value)} />
          </Field>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
