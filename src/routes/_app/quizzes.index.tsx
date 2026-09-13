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
import { canTeach, formatDate, listLookups, listQuizzes, num, saveQuiz } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/quizzes/")({ component: QuizzesPage });

function QuizzesPage() {
  const q = useQuery({ queryKey: ["quizzes"], queryFn: () => listQuizzes() });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const [open, setOpen] = useState(false);
  const teach = canTeach(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Quizzes & tests"
        subtitle="Timed papers with auto-grading for MCQ, true/false and fill-in items."
        actions={teach ? <Button onClick={() => setOpen(true)}>Create quiz</Button> : null}
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {q.data?.map((quiz) => (
            <Link
              key={quiz.id}
              to="/quizzes/$id"
              params={{ id: String(quiz.id) }}
              className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium">{quiz.title}</h2>
                <Badge variant="muted">{quiz.duration_minutes} min</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                {quiz.subject_name} · {quiz.question_count} questions · {quiz.max_attempts} attempts
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{quiz.description}</p>
              <div className="mt-3 text-xs text-faint">
                {quiz.my_attempts} attempt(s)
                {quiz.my_best != null ? ` · best ${num(quiz.my_best)}` : ""}
                {quiz.available_until ? ` · until ${formatDate(quiz.available_until)}` : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New quiz</DialogTitle>
          </DialogHeader>
          <QuizForm
            lookups={lookups.data}
            onDone={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["quizzes"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuizForm({
  lookups,
  onDone,
}: {
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState("A, B, C, D");
  const [type, setType] = useState("mcq");
  const [draft, setDraft] = useState<
    { type: string; prompt: string; options?: string[]; answer?: string; marks: number }[]
  >([]);
  const mut = useMutation({
    mutationFn: () =>
      saveQuiz({
        data: {
          title,
          description,
          subjectId: Number(subjectId || lookups?.subjects[0]?.id),
          classId: Number(classId || lookups?.classes[0]?.id),
          durationMinutes: 20,
          maxAttempts: 2,
          questions: draft,
        },
      }),
    onSuccess: () => {
      toast.success("Quiz published");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.length) {
          toast.error("Add at least one question");
          return;
        }
        mut.mutate();
      }}
    >
      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>
      <Field label="Description">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
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
      <Field label="Class">
        <Select value={classId || String(lookups?.classes[0]?.id ?? "")} onValueChange={setClassId}>
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
      <div className="rounded-md border border-line p-3">
        <div className="text-xs font-medium text-muted">Question bank item</div>
        <div className="mt-2 grid gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["mcq", "true_false", "fill_blank", "short", "long"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          {type === "mcq" ? (
            <Input placeholder="Options, comma separated" value={options} onChange={(e) => setOptions(e.target.value)} />
          ) : null}
          <Input placeholder="Correct answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (!prompt) return;
              setDraft((d) => [
                ...d,
                {
                  type,
                  prompt,
                  options: type === "mcq" ? options.split(",").map((s) => s.trim()) : undefined,
                  answer,
                  marks: type === "long" ? 5 : 1,
                },
              ]);
              setPrompt("");
              setAnswer("");
            }}
          >
            Add question ({draft.length})
          </Button>
        </div>
      </div>
      <Button type="submit">Publish quiz</Button>
    </form>
  );
}
