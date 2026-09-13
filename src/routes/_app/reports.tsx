import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard } from "@/components/layout/page";
import { Skeleton } from "@/components/ui/misc";
import { getReports, num } from "@/lib/lms";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

function ReportsPage() {
  const q = useQuery({ queryKey: ["reports"], queryFn: () => getReports() });
  if (q.isPending) return <Skeleton className="h-80" />;
  if (q.error) return <p className="text-sm text-danger">{(q.error as Error).message}</p>;
  const d = q.data!;
  const avgAtt = d.attendanceBySection.length
    ? Math.round(d.attendanceBySection.reduce((a, b) => a + b.pct, 0) / d.attendanceBySection.length)
    : 0;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Attendance, assignment throughput and quiz performance." />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Mean section attendance" value={`${avgAtt}%`} />
        <StatCard label="Live assignments tracked" value={d.assignmentStats.length} />
        <StatCard label="Quizzes" value={d.quizStats.length} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-3 text-sm font-medium">Attendance by section</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.attendanceBySection}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="pct" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-3 text-sm font-medium">Class sizes</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.classSizes}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="n" fill="var(--color-navy)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Assignment</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Graded</th>
            </tr>
          </thead>
          <tbody>
            {d.assignmentStats.map((a) => (
              <tr key={a.title} className="border-t border-line">
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2 tabular-nums">{a.submitted}</td>
                <td className="px-4 py-2 tabular-nums">{a.graded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Quiz</th>
              <th className="px-4 py-3">Attempts</th>
              <th className="px-4 py-3">Average score</th>
            </tr>
          </thead>
          <tbody>
            {d.quizStats.map((a) => (
              <tr key={a.title} className="border-t border-line">
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2 tabular-nums">{a.attempts}</td>
                <td className="px-4 py-2 tabular-nums">{a.avg_score == null ? "—" : num(a.avg_score).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
