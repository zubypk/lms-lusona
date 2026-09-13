import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { formatDate, listSessions, saveSession } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/sessions")({ component: SessionsPage });

function SessionsPage() {
  const q = useQuery({ queryKey: ["sessions"], queryFn: () => listSessions() });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [starts, setStarts] = useState("2026-08-15");
  const [ends, setEnds] = useState("2027-06-30");
  const mut = useMutation({
    mutationFn: () => saveSession({ data: { name, startsOn: starts, endsOn: ends, isCurrent: false } }),
    onSuccess: () => {
      toast.success("Session saved");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Academic sessions"
        subtitle="The live campus is running session 2025–26."
        actions={<Button onClick={() => setOpen(true)}>New session</Button>}
      />
      {q.isPending ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {q.data?.map((s) => (
            <div key={s.id} className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">{s.name}</h2>
                {s.is_current ? <Badge variant="ok">Current</Badge> : <Badge variant="muted">Closed</Badge>}
              </div>
              <p className="mt-2 text-sm text-muted">
                {formatDate(s.starts_on)} — {formatDate(s.ends_on)}
              </p>
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New academic session</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              mut.mutate();
            }}
          >
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="2026-27" required />
            </Field>
            <Field label="Starts">
              <Input type="date" value={starts} onChange={(e) => setStarts(e.target.value)} />
            </Field>
            <Field label="Ends">
              <Input type="date" value={ends} onChange={(e) => setEnds(e.target.value)} />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
