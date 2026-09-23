import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { canTeach, getAttendance, markAttendance } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/attendance")({ component: AttendancePage });

const STATUSES = ["present", "late", "absent", "excused"] as const;

function AttendancePage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const [sectionId, setSectionId] = useState<number | undefined>();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const q = useQuery({
    queryKey: ["attendance", sectionId],
    queryFn: () => getAttendance({ data: sectionId ? { sectionId } : undefined }),
  });
  const teach = canTeach(me.data?.role ?? "student");
  const [marks, setMarks] = useState<Record<number, (typeof STATUSES)[number]>>({});
  const data = q.data;
  const mut = useMutation({
    mutationFn: () =>
      markAttendance({
        data: {
          sectionId: data?.sectionId ?? 5,
          date,
          marks: (data?.students ?? []).map((s) => ({
            studentId: s.id,
            status: marks[s.id] ?? "present",
          })),
        },
      }),
    onSuccess: () => {
      toast.success("Attendance saved");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const tone = (s?: string) =>
    s === "present" ? "ok" : s === "late" ? "warn" : s === "absent" ? "danger" : "muted";

  const days = data?.days ?? [];
  const recent = useMemo(() => days.slice(-8), [days]);

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Daily register, late marks and month-to-date percentages."
        actions={
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
        }
      />
      {q.isPending ? (
        <Skeleton className="h-80" />
      ) : (
        <>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {data?.summary.map((s) => (
              <div key={s.id} className="rounded-md border border-line bg-surface px-3 py-2">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted">
                  {s.present}/{s.total} · {s.pct}%
                </div>
              </div>
            ))}
          </div>
          <div className="lms-table-scroll overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-paper text-muted">
                <tr>
                  <th className="px-3 py-2">Student</th>
                  {recent.map((d) => (
                    <th key={d} className="px-2 py-2 font-medium">
                      {d.slice(8)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.students.map((s) => (
                  <tr key={s.id} className="border-t border-line">
                    <td className="px-3 py-2 text-sm">
                      {s.name}
                      <div className="text-[11px] text-faint">{s.roll_number}</div>
                    </td>
                    {recent.map((d) => {
                      const st = data.map[`${s.id}:${d}`];
                      return (
                        <td key={d} className="px-2 py-2">
                          <Badge variant={tone(st)}>{st ? st[0]?.toUpperCase() : "·"}</Badge>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {teach ? (
            <div className="mt-6 rounded-xl border border-line bg-surface p-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="font-medium">Mark register</div>
                <Input type="date" className="w-44" value={date} onChange={(e) => setDate(e.target.value)} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const all: Record<number, "present"> = {};
                    for (const s of data?.students ?? []) all[s.id] = "present";
                    setMarks(all);
                  }}
                >
                  Mark all present
                </Button>
                <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
                  Save day
                </Button>
              </div>
              <div className="grid gap-2">
                {data?.students.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line px-3 py-2">
                    <span className="text-sm">{s.name}</span>
                    <div className="flex gap-1">
                      {STATUSES.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setMarks((m) => ({ ...m, [s.id]: st }))}
                          className={cn(
                            "h-11 min-w-11 rounded-md px-2 text-xs capitalize",
                            (marks[s.id] ?? "present") === st ? "bg-navy text-white" : "bg-paper text-muted",
                          )}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
