import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { formatDateTime, listForum, saveThread } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/forum/")({ component: ForumPage });

function ForumPage() {
  const [q, setQ] = useState("");
  const threads = useQuery({ queryKey: ["forum", q], queryFn: () => listForum({ data: { q } }) });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const mut = useMutation({
    mutationFn: () => saveThread({ data: { title, body, subjectId: 1 } }),
    onSuccess: () => {
      toast.success("Question posted");
      queryClient.invalidateQueries({ queryKey: ["forum"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Discussion forum"
        subtitle="Ask subject questions. Teachers reply in the same thread."
        actions={<Button onClick={() => setOpen(true)}>New question</Button>}
      />
      <Input placeholder="Search threads" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-sm" />
      {threads.isPending ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="space-y-3">
          {threads.data?.map((t) => (
            <Link
              key={t.id}
              to="/forum/$id"
              params={{ id: String(t.id) }}
              className="block rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medium">{t.title}</h2>
                {t.subject_name ? <Badge variant="muted">{t.subject_name}</Badge> : null}
                <Badge variant="outline">{t.replies} replies</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{t.body}</p>
              <div className="mt-2 text-xs text-faint">
                {t.author_name} · {formatDateTime(t.created_at)}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask the class</DialogTitle>
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
            <Field label="Question">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
            </Field>
            <Button type="submit">Post</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
