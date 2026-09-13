import { createFileRoute } from "@tanstack/react-router";
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
import { canTeach, formatDateTime, listNotifications, markNotificationRead, sendNotification } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notifications")({ component: NotificationsPage });

function NotificationsPage() {
  const q = useQuery({ queryKey: ["notifications"], queryFn: () => listNotifications() });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const [open, setOpen] = useState(false);
  const teach = canTeach(me.data?.role ?? "student");
  const read = useMutation({
    mutationFn: (id: number) => markNotificationRead({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Assignment alerts, quizzes, attendance notices and the college gazette."
        actions={teach ? <Button onClick={() => setOpen(true)}>Send notice</Button> : null}
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-2">
          {q.data?.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => read.mutate(n.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left shadow-[var(--shadow-card)]",
                n.read_at ? "border-line bg-surface" : "border-primary/30 bg-info-bg",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">{n.type}</Badge>
                <span className="font-medium">{n.title}</span>
                <span className="ml-auto text-xs text-faint">{formatDateTime(n.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{n.body}</p>
            </button>
          ))}
        </div>
      )}
      <Compose open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Compose({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("notice");
  const [audience, setAudience] = useState("all");
  const mut = useMutation({
    mutationFn: () => sendNotification({ data: { title, body, type, audience } }),
    onSuccess: () => {
      toast.success("Notice sent (in-app)");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send notice</DialogTitle>
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
          <Field label="Message">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </Field>
          <Field label="Type">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["notice", "assignment", "quiz", "attendance", "result"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Audience">
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="teachers">Teachers</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <p className="text-xs text-muted">Delivered in-app. Email and push channels require campus mail configuration.</p>
          <Button type="submit">Send</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
