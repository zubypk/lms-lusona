import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { canTeach, formatDateTime, listLookups, listMeetings, platformLabel, saveMeeting } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/meetings")({ component: MeetingsPage });

function MeetingsPage() {
  const q = useQuery({ queryKey: ["meetings"], queryFn: () => listMeetings() });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const [open, setOpen] = useState(false);
  const teach = canTeach(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Online classes"
        subtitle="Google Meet, Zoom and Microsoft Teams — join from the timetable."
        actions={teach ? <Button onClick={() => setOpen(true)}>Schedule</Button> : null}
      />
      {q.isPending ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="space-y-3">
          {q.data?.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
              <div>
                <div className="font-medium">{m.title}</div>
                <div className="text-sm text-muted">
                  {m.subject_name ?? "College"} · {formatDateTime(m.starts_at)}
                  {m.teacher_name ? ` · ${m.teacher_name}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{platformLabel(m.platform)}</Badge>
                <Button asChild>
                  <a href={m.url} target="_blank" rel="noreferrer">
                    <Video className="h-4 w-4" /> Join
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule online class</DialogTitle>
          </DialogHeader>
          <MeetingForm
            lookups={lookups.data}
            onDone={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["meetings"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MeetingForm({
  lookups,
  onDone,
}: {
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<"meet" | "zoom" | "teams">("meet");
  const [url, setUrl] = useState("https://meet.google.com/");
  const [startsAt, setStartsAt] = useState("2026-09-18T09:30");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const mut = useMutation({
    mutationFn: () =>
      saveMeeting({
        data: {
          title,
          platform,
          url,
          startsAt: new Date(startsAt).toISOString(),
          subjectId: Number(subjectId || lookups?.subjects[0]?.id),
          sectionId: Number(sectionId || lookups?.sections[0]?.id),
        },
      }),
    onSuccess: () => {
      toast.success("Class scheduled");
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
      <Field label="Platform">
        <Select value={platform} onValueChange={(v) => setPlatform(v as typeof platform)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meet">Google Meet</SelectItem>
            <SelectItem value="zoom">Zoom</SelectItem>
            <SelectItem value="teams">Microsoft Teams</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Meeting URL">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} required />
      </Field>
      <Field label="Starts">
        <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      </Field>
      <Field label="Subject">
        <Select value={subjectId || String(lookups?.subjects[0]?.id ?? "")} onValueChange={setSubjectId}>
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
      <Field label="Class / section">
        <Select value={sectionId || String(lookups?.sections[0]?.id ?? "")} onValueChange={setSectionId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {lookups?.sections.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {lookups.classes.find((c) => c.id === s.class_id)?.name ?? "Class"} · {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Button type="submit">Schedule</Button>
    </form>
  );
}
