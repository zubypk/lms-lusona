import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, EmptyState, Field } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignCampusRole, listCampusAccounts, listRoleLinks, ROLES, type Role } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { roleLabel } from "@/lib/lms/format";
import { queryClient } from "@/lib/query-client";
import type { CampusAccount } from "@/lib/lms/admin";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

function UsersPage() {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<CampusAccount | null>(null);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const accounts = useQuery({ queryKey: ["campus-accounts"], queryFn: () => listCampusAccounts() });
  const links = useQuery({ queryKey: ["role-links"], queryFn: () => listRoleLinks() });
  const canAssign = me.data?.role === "super_admin";

  const filtered = useMemo(() => {
    const list = accounts.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((a) =>
      [a.display_name, a.account_name, a.account_email, a.role, a.student_code, a.teacher_code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [accounts.data, q]);

  if (me.isPending) return <Skeleton className="h-64" />;
  if (me.data?.role !== "super_admin" && me.data?.role !== "academic_admin") {
    return <p className="text-sm text-muted">Only administrators can view the campus user list.</p>;
  }

  return (
    <div>
      <PageHeader
        title="Users & roles"
        subtitle="Every signed-in account. Super Admin can assign Super Admin, Academic Admin, Class Incharge, Teacher or Student."
      />
      <Input
        placeholder="Search name, email, role or ID"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-sm"
      />
      {accounts.isPending ? (
        <Skeleton className="h-64" />
      ) : !filtered.length ? (
        <EmptyState title="No accounts" body="People appear here after they sign in." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Linked register</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.user_id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={a.display_name || a.account_name} src={a.photo_url} />
                      <div>
                        <div className="font-medium text-ink">{a.display_name || a.account_name}</div>
                        <div className="text-xs text-muted">{a.account_email || a.user_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {a.role ? <Badge variant="navy">{roleLabel(a.role)}</Badge> : <Badge variant="warn">Unassigned</Badge>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {a.student_code
                      ? `${a.student_name} · ${a.student_code}${a.class_name ? ` · ${a.class_name} ${a.section_name ?? ""}` : ""}`
                      : a.teacher_code
                        ? `${a.teacher_name} · ${a.teacher_code}`
                        : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canAssign ? (
                      <Button size="sm" variant="outline" onClick={() => setEditing(a)}>
                        Assign
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AssignDialog
        account={editing}
        students={links.data?.students ?? []}
        teachers={links.data?.teachers ?? []}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

function AssignDialog({
  account,
  students,
  teachers,
  onClose,
}: {
  account: CampusAccount | null;
  students: { id: number; name: string; student_code: string; user_id: string | null }[];
  teachers: { id: number; name: string; teacher_code: string; employee_id: string; user_id: string | null }[];
  onClose: () => void;
}) {
  const [role, setRole] = useState<Role>("student");
  const [studentId, setStudentId] = useState("auto");
  const [teacherId, setTeacherId] = useState("auto");

  useEffect(() => {
    if (!account) return;
    setRole(account.role ?? "student");
    setStudentId(account.student_id ? String(account.student_id) : "auto");
    setTeacherId(account.teacher_id ? String(account.teacher_id) : "auto");
  }, [account]);

  const mut = useMutation({
    mutationFn: () =>
      assignCampusRole({
        data: {
          userId: account!.user_id,
          role,
          studentId: role === "student" && studentId !== "auto" ? Number(studentId) : null,
          teacherId:
            (role === "teacher" || role === "class_incharge") && teacherId !== "auto" ? Number(teacherId) : null,
        },
      }),
    onSuccess: () => {
      toast.success("Role assigned");
      queryClient.invalidateQueries({ queryKey: ["campus-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={!!account} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign campus role</DialogTitle>
        </DialogHeader>
        {account ? (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              mut.mutate();
            }}
          >
            <p className="text-sm text-muted">
              {account.display_name || account.account_name} · {account.account_email}
            </p>
            <Field label="Role">
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {role === "student" ? (
              <Field label="Link student register">
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-assign a free record" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-assign a free record</SelectItem>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name} · {s.student_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}
            {role === "teacher" || role === "class_incharge" ? (
              <Field label="Link faculty record">
                <Select value={teacherId} onValueChange={setTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-assign a free record" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-assign a free record</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name} · {t.teacher_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : null}
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending ? "Saving…" : "Save role"}
            </Button>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
