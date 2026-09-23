import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { WEEKDAYS, canAdmin, getTimetable, listLookups, saveTimetableSlot } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/timetable")({ component: TimetablePage });

const PERIODS = [1, 2, 3, 4, 5, 6];

function TimetablePage() {
  const [sectionId, setSectionId] = useState<number | undefined>(undefined);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const q = useQuery({
    queryKey: ["timetable", sectionId],
    queryFn: () => getTimetable({ data: sectionId ? { sectionId } : undefined }),
  });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const [open, setOpen] = useState(false);
  const admin = canAdmin(me.data?.role ?? "student") || me.data?.role === "class_incharge";
  const data = q.data;
  const slots = data?.slots ?? [];
  const grid: Record<string, (typeof slots)[number]> = {};
  for (const s of slots) grid[`${s.day_of_week}:${s.period}`] = s;

  return (
    <div>
      <PageHeader
        title="Weekly timetable"
        subtitle="Periods run 08:00–12:45 with a 15-minute break after period 3."
        actions={
          <>
            <Select
              value={String(data?.sectionId ?? "")}
              onValueChange={(v) => setSectionId(Number(v))}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                {data?.sections.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {admin ? <Button onClick={() => setOpen(true)}>Add slot</Button> : null}
          </>
        }
      />
      {q.isPending ? (
        <Skeleton className="h-80" />
      ) : (
        <div className="lms-table-scroll overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-paper text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                {WEEKDAYS.slice(0, 5).map((d) => (
                  <th key={d} className="px-3 py-2 font-medium">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((p) => (
                <tr key={p} className="border-t border-line">
                  <td className="px-3 py-3 text-xs text-muted">{p}</td>
                  {WEEKDAYS.slice(0, 5).map((_, i) => {
                    const slot = grid[`${i + 1}:${p}`];
                    return (
                      <td key={i} className="px-3 py-3 align-top">
                        {slot ? (
                          <div>
                            <div className="font-medium">{slot.subject_name}</div>
                            <div className="text-xs text-muted">
                              {slot.starts_at}–{slot.ends_at} · {slot.room}
                            </div>
                            <div className="text-xs text-faint">{slot.teacher_name}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-faint">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timetable slot</DialogTitle>
          </DialogHeader>
          <SlotForm
            lookups={lookups.data}
            sectionId={data?.sectionId ?? 5}
            onDone={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["timetable"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SlotForm({
  lookups,
  sectionId,
  onDone,
}: {
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  sectionId: number;
  onDone: () => void;
}) {
  const [subjectId, setSubjectId] = useState("1");
  const [day, setDay] = useState("1");
  const [period, setPeriod] = useState("1");
  const [starts, setStarts] = useState("08:00");
  const [ends, setEnds] = useState("08:45");
  const [room, setRoom] = useState("R-11A");
  const mut = useMutation({
    mutationFn: () =>
      saveTimetableSlot({
        data: {
          sectionId,
          subjectId: Number(subjectId),
          dayOfWeek: Number(day),
          period: Number(period),
          startsAt: starts,
          endsAt: ends,
          room,
        },
      }),
    onSuccess: () => {
      toast.success("Slot added");
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
            {lookups?.subjects.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Day (1=Mon)">
          <Input value={day} onChange={(e) => setDay(e.target.value)} />
        </Field>
        <Field label="Period">
          <Input value={period} onChange={(e) => setPeriod(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Starts">
          <Input value={starts} onChange={(e) => setStarts(e.target.value)} />
        </Field>
        <Field label="Ends">
          <Input value={ends} onChange={(e) => setEnds(e.target.value)} />
        </Field>
      </div>
      <Field label="Room">
        <Input value={room} onChange={(e) => setRoom(e.target.value)} />
      </Field>
      <Button type="submit">Save</Button>
    </form>
  );
}
