import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { ROLES, getMyProfile, roleLabel, switchRole } from "@/lib/lms";
import { publicDisplayName } from "@/lib/utils";
import { queryClient } from "@/lib/query-client";
import type { Role } from "@/lib/lms/types";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });

function ProfilePage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const mut = useMutation({
    mutationFn: (role: Role) => switchRole({ data: { role } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("Campus role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  if (me.isPending) return <Skeleton className="h-48" />;
  const p = me.data;
  if (!p) return null;

  return (
    <div>
      <PageHeader title="My profile" subtitle="Campus identity linked to your signed-in account." />
      <div className="rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <Avatar name={publicDisplayName(p.displayName)} src={p.photoUrl} size={64} />
          <div>
            <div className="font-display text-2xl font-semibold">{publicDisplayName(p.displayName)}</div>
            <div className="text-sm text-muted">{p.email}</div>
            <Badge className="mt-2">{roleLabel(p.role)}</Badge>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          {p.className ? (
            <div>
              <dt className="text-xs text-muted">Class</dt>
              <dd>
                {p.className} {p.sectionName}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs text-muted">Student register</dt>
            <dd>{p.studentId ? `Linked #${p.studentId}` : "Not linked"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Faculty register</dt>
            <dd>{p.teacherId ? `Linked #${p.teacherId}` : "Not linked"}</dd>
          </div>
        </dl>
      </div>
      <h2 className="mt-8 mb-2 font-display text-lg font-semibold">Explore another role</h2>
      <p className="mb-4 max-w-xl text-sm text-muted">
        This preview campus lets you switch persona so you can review Admin, Teacher and Student
        dashboards with the same account. Production deployments would lock the role to the
        Academic Office assignment.
      </p>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <Button
            key={r.id}
            variant={p.role === r.id ? "default" : "outline"}
            onClick={() => mut.mutate(r.id)}
            disabled={mut.isPending}
          >
            {r.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
