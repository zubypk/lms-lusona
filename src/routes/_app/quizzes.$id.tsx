import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { getQuiz, num, startQuiz, submitQuiz } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/quizzes/$id")({ component: QuizDetail });

function QuizDetail() {
  const { id } = Route.useParams();
  const quizId = Number(id);
  const [taking, setTaking] = useState(false);
  const q = useQuery({
    queryKey: ["quiz", quizId, taking],
    queryFn: () => getQuiz({ data: { id: quizId, forTaking: taking } }),
  });
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; max: number; pct: number } | null>(null);

  const start = useMutation({
    mutationFn: () => startQuiz({ data: { quizId } }),
    onSuccess: (res) => {
      setAttemptId(res.attemptId);
      setRemaining(res.duration * 60);
      setTaking(true);
      setResult(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const submit = useMutation({
    mutationFn: () => submitQuiz({ data: { attemptId: attemptId!, answers } }),
    onSuccess: (res) => {
      setResult(res);
      setTaking(false);
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success(`Scored ${res.score} / ${res.max}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!taking || remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          if (attemptId) submit.mutate();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [taking, remaining, attemptId]);

  const questions = useMemo(() => {
    const list = q.data?.questions ?? [];
    if (q.data?.quiz.randomize && taking) {
      return [...list].sort((a, b) => ((a.id * 7) % 13) - ((b.id * 7) % 13));
    }
    return list;
  }, [q.data, taking]);

  if (q.isPending) return <Skeleton className="h-64" />;
  if (!q.data) return <p className="text-sm text-danger">Quiz not found.</p>;
  const { quiz, attempts, actor } = q.data;
  const student = actor.role === "student";

  return (
    <div>
      <Link to="/quizzes" className="text-sm text-primary">
        ← All quizzes
      </Link>
      <PageHeader
        title={quiz.title}
        subtitle={`${quiz.subject_name} · ${quiz.duration_minutes} minutes · ${quiz.max_attempts} attempts`}
        actions={
          taking ? (
            <Badge variant="warn">
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
            </Badge>
          ) : null
        }
      />
      <p className="mb-4 text-sm text-muted">{quiz.description}</p>

      {result ? (
        <div className="mb-4 rounded-xl border border-ok bg-ok-bg p-4 text-ok">
          Instant result: {result.score} / {result.max} ({result.pct}%). Short and long answers are
          half-marked pending teacher review.
        </div>
      ) : null}

      {student && !taking ? (
        <Button onClick={() => start.mutate()} disabled={start.isPending} className="mb-4">
          Start attempt
        </Button>
      ) : null}

      {taking ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          {questions.map((qn, i) => (
            <div key={qn.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="text-xs text-muted">
                Q{i + 1} · {qn.marks} mark{qn.marks === 1 ? "" : "s"} · {qn.type.replace("_", " ")}
              </div>
              <div className="mt-1 font-medium">{qn.prompt}</div>
              {qn.type === "mcq" && qn.options_json ? (
                <div className="mt-3 grid gap-2">
                  {(JSON.parse(qn.options_json) as string[]).map((opt) => (
                    <label key={opt} className="flex h-11 items-center gap-2 rounded-md border border-line px-3 text-sm">
                      <input
                        type="radio"
                        name={`q-${qn.id}`}
                        value={opt}
                        onChange={() => setAnswers((a) => ({ ...a, [qn.id]: opt }))}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : qn.type === "true_false" ? (
                <div className="mt-3 flex gap-2">
                  {["true", "false"].map((opt) => (
                    <Button
                      key={opt}
                      type="button"
                      variant={answers[qn.id] === opt ? "default" : "outline"}
                      onClick={() => setAnswers((a) => ({ ...a, [qn.id]: opt }))}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              ) : qn.type === "long" ? (
                <Textarea
                  className="mt-3"
                  value={answers[qn.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [qn.id]: e.target.value }))}
                />
              ) : (
                <Input
                  className="mt-3"
                  value={answers[qn.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [qn.id]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <Button type="submit" disabled={submit.isPending}>
            Submit paper
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-medium">Attempts</h2>
          {!attempts.length ? <p className="mt-2 text-sm text-muted">No attempts yet.</p> : null}
          <ul className="mt-2 space-y-2 text-sm">
            {attempts.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>Attempt {a.attempt_no}</span>
                <span className="tabular-nums">
                  {a.submitted_at
                    ? `${num(a.score)} / ${num(a.max_score)}`
                    : "In progress"}
                </span>
              </li>
            ))}
          </ul>
          {!student ? (
            <div className="mt-4 space-y-3">
              {q.data.questions.map((qn) => (
                <div key={qn.id} className="text-sm">
                  <div className="font-medium">{qn.prompt}</div>
                  <div className="text-xs text-muted">Answer: {qn.answer}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
