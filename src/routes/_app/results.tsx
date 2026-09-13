import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { listResults } from "@/lib/lms";

export const Route = createFileRoute("/_app/results")({ component: ResultsPage });

function ResultsPage() {
  const [examId, setExamId] = useState<number | undefined>();
  const q = useQuery({
    queryKey: ["results", examId],
    queryFn: () => listResults({ data: examId ? { examId } : undefined }),
  });
  const data = q.data;

  function exportCsv() {
    if (!data) return;
    const header = ["Roll", "Name", ...data.subjects.map((s) => s.name), "Total", "%", "GPA", "Letter"];
    const lines = data.rows.map((r) => {
      const marks = data.subjects.map((s) => r.marks[s.id]?.marks ?? "");
      return [r.roll, r.name, ...marks, r.total, r.pct.toFixed(1), r.gpa.toFixed(2), r.letter].join(",");
    });
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aec-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Results"
        subtitle="Subject marks, percentage and GPA. Export opens in Excel."
        actions={
          <>
            <Select
              value={String(data?.examId ?? "")}
              onValueChange={(v) => setExamId(Number(v))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Examination" />
              </SelectTrigger>
              <SelectContent>
                {data?.exams.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              Print / PDF
            </Button>
          </>
        }
      />
      {q.isPending ? (
        <Skeleton className="h-80" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs text-muted uppercase">
              <tr>
                <th className="px-3 py-3">Roll</th>
                <th className="px-3 py-3">Student</th>
                {data?.subjects.map((s) => (
                  <th key={s.id} className="px-3 py-3">
                    {s.name}
                  </th>
                ))}
                <th className="px-3 py-3">%</th>
                <th className="px-3 py-3">GPA</th>
                <th className="px-3 py-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data?.rows.map((r) => (
                <tr key={r.studentId} className="border-b border-line">
                  <td className="px-3 py-2 tabular-nums">{r.roll}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  {data.subjects.map((s) => (
                    <td key={s.id} className="px-3 py-2 tabular-nums">
                      {r.marks[s.id]?.marks ?? "—"}
                    </td>
                  ))}
                  <td className="px-3 py-2 tabular-nums">{r.pct.toFixed(1)}</td>
                  <td className="px-3 py-2 tabular-nums">{r.gpa.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <Badge variant={r.letter.startsWith("A") ? "ok" : r.letter === "F" ? "danger" : "muted"}>
                      {r.letter}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
