import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { canAdmin, formatDate, listCalendar, saveCalendarEvent } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/calendar")({ component: CalendarPage });

function CalendarPage() {
  const q = useQuery({ queryKey: ["calendar"], queryFn: () => listCalendar() });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const [open, setOpen] = useState(false);
  const grouped = useMemo(() => {
    const map = new Map<string, NonNullable<typeof q.data>>();
    for (const e of q.data ?? []) {
      const key = e.event_date.slice(0, 7);
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [q.data]);
  const admin = canAdmin(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Academic calendar"
        subtitle="Terms, examinations, sports day and gazetted holidays."
        actions={admin ? <Button onClick={() => setOpen(true)}>Add event</Button> : null}
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-6">
          {grouped.map(([month, events]) => (
            <div key={month}>
              <h2 className="mb-2 font-display text-lg font-semibold text-heading">
                {new Date(month + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </h2>
              <div className="space-y-2">
                {events.map((e) => (
                  <div key={e.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                    <div>
                      <div className="font-medium">{e.title}</div>
                      {e.description ? <p className="text-sm text-muted">{e.description}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-faint">{formatDate(e.event_date)}</span>
                      <Badge variant="muted">{e.event_type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <AddEvent open={open} onOpenChange={setOpen} />
    </div>
  );
}

function AddEvent({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-01");
  const [eventType, setEventType] = useState("event");
  const mut = useMutation({
    mutationFn: () => saveCalendarEvent({ data: { title, description, eventDate, eventType } }),
    onSuccess: () => {
      toast.success("Event added");
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Calendar event</DialogTitle>
        </DialogHeader>
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
          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Date">
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </Field>
          <Field label="Type">
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["term", "exam", "holiday", "event"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
