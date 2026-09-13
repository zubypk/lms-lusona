import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/misc";
import { canTeach, listLookups, listMaterials, materialLabel, saveMaterial, youtubeId } from "@/lib/lms";
import { getMyProfile } from "@/lib/lms/profile";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_app/materials")({ component: MaterialsPage });

function MaterialsPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<(Awaited<ReturnType<typeof listMaterials>>)[number] | null>(null);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const materials = useQuery({ queryKey: ["materials", q], queryFn: () => listMaterials({ data: { q } }) });
  const lookups = useQuery({ queryKey: ["lookups"], queryFn: () => listLookups() });
  const teach = canTeach(me.data?.role ?? "student");
  const yt = preview ? youtubeId(preview.url) : null;

  return (
    <div>
      <PageHeader
        title="Study materials"
        subtitle="Notes, labs, recordings and reference links. Preview or download."
        actions={teach ? <Button onClick={() => setOpen(true)}>Upload / link</Button> : null}
      />
      <Input placeholder="Search materials" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-sm" />
      {materials.isPending ? (
        <Skeleton className="h-64" />
      ) : !materials.data?.length ? (
        <EmptyState title="No materials" body="Teachers can attach PDFs, slides, videos and YouTube lectures." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {materials.data.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPreview(m)}
              className="rounded-xl border border-line bg-surface p-5 text-left shadow-[var(--shadow-card)] hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium">{m.title}</div>
                <Badge variant="muted">{materialLabel(m.type)}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{m.description}</p>
              <div className="mt-3 text-xs text-faint">
                {m.subject_name}
                {m.class_name ? ` · ${m.class_name}` : ""}
                {m.teacher_name ? ` · ${m.teacher_name}` : ""}
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl">
          {preview ? (
            <>
              <DialogHeader>
                <DialogTitle>{preview.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted">{preview.description}</p>
              {yt ? (
                <div className="mt-3 aspect-video overflow-hidden rounded-md bg-ink">
                  <iframe
                    title={preview.title}
                    src={`https://www.youtube.com/embed/${yt}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : preview.type === "image" ? (
                <img src={preview.url} alt="" className="mt-3 max-h-80 w-full rounded-md object-contain" />
              ) : preview.type === "pdf" ? (
                <iframe title={preview.title} src={preview.url} className="mt-3 h-80 w-full rounded-md border border-line" />
              ) : (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-paper p-3 text-sm">
                  <FileText className="h-4 w-4" />
                  External file or link
                </div>
              )}
              <Button asChild className="mt-4">
                <a href={preview.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Open / download
                </a>
              </Button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add material</DialogTitle>
          </DialogHeader>
          <MaterialForm
            lookups={lookups.data}
            onDone={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["materials"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MaterialForm({
  lookups,
  onDone,
}: {
  lookups?: Awaited<ReturnType<typeof listLookups>>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("pdf");
  const [url, setUrl] = useState("");
  const [subjectId, setSubjectId] = useState("1");
  const mut = useMutation({
    mutationFn: () =>
      saveMaterial({
        data: { title, description, type, url, subjectId: Number(subjectId), classId: 3 },
      }),
    onSuccess: () => {
      toast.success("Material published");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
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
      <Field label="Description">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="Type">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["pdf", "docx", "ppt", "pptx", "video", "image", "zip", "link", "youtube"].map((t) => (
              <SelectItem key={t} value={t}>
                {materialLabel(t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="URL">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" required />
      </Field>
      <Field label="Subject">
        <Select value={subjectId} onValueChange={setSubjectId}>
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
      <Button type="submit">Publish</Button>
    </form>
  );
}
