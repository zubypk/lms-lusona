import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { canAdmin, listTeachers, saveTeacher } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/teachers")({ component: TeachersPage });

function TeachersPage() {
  const [open, setOpen] = useState(false);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const q = useQuery({ queryKey: ["teachers"], queryFn: () => listTeachers() });
  const admin = canAdmin(me.data?.role ?? "student");

  return (
    <div>
      <PageHeader
        title="Faculty"
        subtitle="Teachers see only the classes and subjects assigned to them."
        actions={admin ? <Button onClick={() => setOpen(true)}>Add teacher</Button> : null}
      />
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {q.data?.map((t) => (
            <div key={t.id} className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <Avatar name={t.name} size={44} />
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted">{t.qualification}</div>
                  <div className="mt-2 text-xs text-faint">
                    {t.teacher_code} · {t.employee_id}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <div className="text-xs text-muted">Subjects</div>
                {t.subjects || "—"}
              </div>
              <div className="mt-2 text-sm">
                <div className="text-xs text-muted">Classes</div>
                {t.classes || "—"}
              </div>
              <div className="mt-3 text-xs text-muted">
                {t.email}
                {t.mobile ? ` · ${t.mobile}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
      <AddTeacher open={open} onOpenChange={setOpen} />
    </div>
  );
}

function AddTeacher({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const mut = useMutation({
    mutationFn: () => saveTeacher({ data: { name, qualification, email, mobile } }),
    onSuccess: () => {
      toast.success("Teacher added");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add teacher</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate();
          }}
        >
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Qualification">
            <Input value={qualification} onChange={(e) => setQualification(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Mobile">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </Field>
          <Button type="submit" disabled={mut.isPending}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
