import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { formatDateTime, getSettings, listAudit, saveSettings } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const audit = useQuery({ queryKey: ["audit"], queryFn: () => listAudit() });
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => {
    if (settings.data) setForm(settings.data);
  }, [settings.data]);
  const mut = useMutation({
    mutationFn: () =>
      saveSettings({
        data: { entries: Object.entries(form).map(([key, value]) => ({ key, value })) },
      }),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (settings.isPending) return <Skeleton className="h-64" />;
  if (settings.error) return <p className="text-sm text-danger">{(settings.error as Error).message}</p>;

  const fields = [
    ["college_name", "College name"],
    ["college_short", "Short name"],
    ["city", "City"],
    ["motto", "Motto"],
    ["address", "Address"],
    ["phone", "Phone"],
    ["email", "Registrar email"],
  ] as const;

  return (
    <div>
      <PageHeader title="System settings" subtitle="Institution identity used across notices and gazettes." />
      <form
        className="grid max-w-xl gap-3 rounded-xl border border-line bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
      >
        {fields.map(([key, label]) => (
          <Field key={key} label={label}>
            <Input value={form[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
          </Field>
        ))}
        <Button type="submit" disabled={mut.isPending}>
          Save
        </Button>
      </form>
      <h2 className="mt-8 mb-3 font-display text-lg font-semibold">Audit log</h2>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs text-muted uppercase">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {audit.data?.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="px-4 py-2 text-xs">{formatDateTime(a.created_at)}</td>
                <td className="px-4 py-2">{a.action}</td>
                <td className="px-4 py-2 text-xs">
                  {a.entity} {a.entity_id}
                </td>
                <td className="px-4 py-2 text-xs text-muted">{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
