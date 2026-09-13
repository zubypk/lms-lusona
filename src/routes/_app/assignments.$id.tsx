import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { formatDateTime, getAssignment, gradeSubmission, submitAssignment } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/assignments/$id")({ component: AssignmentDetail });

function AssignmentDetail() {
  const { id } = Route.useParams();
  const assignmentId = Number(id);
  const q = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignment({ data: { id: assignmentId } }),
  });
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const submit = useMutation({
    mutationFn: () => submitAssignment({ data: { assignmentId, content, fileUrl } }),
    onSuccess: () => {
      toast.success("Submitted");
      queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isPending) return <Skeleton className="h-64" />;
  if (!q.data) return <p className="text-sm text-danger">Assignment not found.</p>;
  const { assignment, submissions, mine, actor } = q.data;
  const student = actor.role === "student";

  return (
    <div>
      <Link to="/assignments" className="text-sm text-primary">
        ← All assignments
      </Link>
      <PageHeader
        title={assignment.title}
        subtitle={`${assignment.subject_name} · ${assignment.class_name} · due ${formatDateTime(assignment.due_at)}`}
        actions={<Badge>{assignment.max_marks} marks</Badge>}
      />
      <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <p className="whitespace-pre-wrap text-sm text-ink-soft">{assignment.description}</p>
      </div>

      {student ? (
        <div className="mt-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-medium">Your work</h2>
          {mine ? (
            <div className="mt-2 text-sm">
              <Badge variant={mine.status === "graded" ? "ok" : "default"}>{mine.status}</Badge>
              <p className="mt-2 whitespace-pre-wrap text-ink-soft">{mine.content}</p>
              {mine.file_url ? (
                <a className="mt-2 inline-block text-primary" href={mine.file_url} target="_blank" rel="noreferrer">
                  Attachment
                </a>
              ) : null}
              {mine.status === "graded" ? (
                <p className="mt-3 text-sm">
                  Marks: <span className="font-medium tabular-nums">{mine.marks}</span> / {assignment.max_marks}
                  {mine.feedback ? ` — ${mine.feedback}` : ""}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted">You may resubmit until the deadline.</p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted">No submission yet.</p>
          )}
          <form
            className="mt-4 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit.mutate();
            }}
          >
            <Field label="Submission text">
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} required />
            </Field>
            <Field label="File URL (Drive, GitHub, PDF)">
              <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
            </Field>
            <Button type="submit" disabled={submit.isPending}>
              {mine ? "Resubmit" : "Submit"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <GradeRow key={s.id} sub={s} max={assignment.max_marks} assignmentId={assignmentId} />
              ))}
            </tbody>
          </table>
          {!submissions.length ? <p className="p-5 text-sm text-muted">No submissions yet.</p> : null}
        </div>
      )}
    </div>
  );
}

function GradeRow({
  sub,
  max,
  assignmentId,
}: {
  sub: {
    id: number;
    student_name: string;
    roll_number: string;
    content: string | null;
    submitted_at: string;
    marks: number | null;
    feedback: string | null;
    status: string;
  };
  max: number;
  assignmentId: number;
}) {
  const [marks, setMarks] = useState(String(sub.marks ?? ""));
  const [feedback, setFeedback] = useState(sub.feedback ?? "");
  const mut = useMutation({
    mutationFn: () => gradeSubmission({ data: { submissionId: sub.id, marks: Number(marks), feedback } }),
    onSuccess: () => {
      toast.success("Graded");
      queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <tr className="border-b border-line align-top">
      <td className="px-4 py-3">
        <div className="font-medium">{sub.student_name}</div>
        <div className="text-xs text-muted">{sub.roll_number}</div>
        <p className="mt-1 max-w-xs text-xs text-ink-soft">{sub.content}</p>
      </td>
      <td className="px-4 py-3 text-xs">{formatDateTime(sub.submitted_at)}</td>
      <td className="px-4 py-3">
        <Input className="h-9 w-20" value={marks} onChange={(e) => setMarks(e.target.value)} />
        <div className="text-[11px] text-faint">/ {max}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Input value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <Button size="sm" onClick={() => mut.mutate()} disabled={mut.isPending}>
            Save
          </Button>
        </div>
      </td>
    </tr>
  );
}
