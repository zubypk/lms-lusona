import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { formatDateTime, getThread, savePost } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/forum/$id")({ component: ThreadPage });

function ThreadPage() {
  const { id } = Route.useParams();
  const threadId = Number(id);
  const q = useQuery({ queryKey: ["thread", threadId], queryFn: () => getThread({ data: { id: threadId } }) });
  const [body, setBody] = useState("");
  const mut = useMutation({
    mutationFn: () => savePost({ data: { threadId, body } }),
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isPending) return <Skeleton className="h-64" />;
  if (!q.data) return <p className="text-sm text-danger">Thread not found.</p>;
  const { thread, posts } = q.data;

  return (
    <div>
      <Link to="/forum" className="text-sm text-primary">
        ← Forum
      </Link>
      <PageHeader
        title={thread.title}
        subtitle={`${thread.author_name} · ${formatDateTime(thread.created_at)}`}
        actions={thread.subject_name ? <Badge>{thread.subject_name}</Badge> : null}
      />
      <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <p className="whitespace-pre-wrap text-sm">{thread.body}</p>
      </div>
      <div className="mt-4 space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-xl border border-line bg-surface p-4">
            <Avatar name={p.author_name} />
            <div>
              <div className="text-sm font-medium">{p.author_name}</div>
              <div className="text-[11px] text-faint">{formatDateTime(p.created_at)}</div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
      <form
        className="mt-4 grid gap-3 rounded-xl border border-line bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
      >
        <Field label="Reply">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </Field>
        <Button type="submit" disabled={mut.isPending}>
          Post reply
        </Button>
      </form>
    </div>
  );
}
