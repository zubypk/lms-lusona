import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as materialLabel, l as youtubeId } from "./format-TM2oG14R.mjs";
import { g as FileText, v as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader, t as EmptyState } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { r as Textarea, t as Input } from "./input-Bwpmjhr-.mjs";
import { d as saveMaterial, s as listMaterials } from "./learning-BdgXquKe.mjs";
import { i as canTeach } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { r as listLookups } from "./records-g3YmYo9V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/materials-jD2wlnnn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MaterialsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const materials = useQuery({
		queryKey: ["materials", q],
		queryFn: () => listMaterials({ data: { q } })
	});
	const lookups = useQuery({
		queryKey: ["lookups"],
		queryFn: () => listLookups()
	});
	const teach = canTeach(me.data?.role ?? "student");
	const yt = preview ? youtubeId(preview.url) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Study materials",
			subtitle: "Notes, labs, recordings and reference links. Preview or download.",
			actions: teach ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Upload / link"
			}) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			placeholder: "Search materials",
			value: q,
			onChange: (e) => setQ(e.target.value),
			className: "mb-4 max-w-sm"
		}),
		materials.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : !materials.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No materials",
			body: "Teachers can attach PDFs, slides, videos and YouTube lectures."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: materials.data.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setPreview(m),
				className: "rounded-xl border border-line bg-surface p-5 text-left shadow-[var(--shadow-card)] hover:border-line-strong",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: m.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							children: materialLabel(m.type)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-muted",
						children: m.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-xs text-faint",
						children: [
							m.subject_name,
							m.class_name ? ` · ${m.class_name}` : "",
							m.teacher_name ? ` · ${m.teacher_name}` : ""
						]
					})
				]
			}, m.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!preview,
			onOpenChange: () => setPreview(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-2xl",
				children: preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: preview.title }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: preview.description
					}),
					yt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 aspect-video overflow-hidden rounded-md bg-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: preview.title,
							src: `https://www.youtube.com/embed/${yt}`,
							className: "h-full w-full",
							allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
							allowFullScreen: true
						})
					}) : preview.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: preview.url,
						alt: "",
						className: "mt-3 max-h-80 w-full rounded-md object-contain"
					}) : preview.type === "pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: preview.title,
						src: preview.url,
						className: "mt-3 h-80 w-full rounded-md border border-line"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2 rounded-md bg-paper p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "External file or link"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: preview.url,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " Open / download"]
						})
					})
				] }) : null
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add material" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialForm, {
				lookups: lookups.data,
				onDone: () => {
					setOpen(false);
					queryClient.invalidateQueries({ queryKey: ["materials"] });
				}
			})] })
		})
	] });
}
function MaterialForm({ lookups, onDone }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("pdf");
	const [url, setUrl] = (0, import_react.useState)("");
	const [subjectId, setSubjectId] = (0, import_react.useState)("1");
	const mut = useMutation({
		mutationFn: () => saveMaterial({ data: {
			title,
			description,
			type,
			url,
			subjectId: Number(subjectId),
			classId: 3
		} }),
		onSuccess: () => {
			toast.success("Material published");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Description",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Type",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: type,
					onValueChange: setType,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
						"pdf",
						"docx",
						"ppt",
						"pptx",
						"video",
						"image",
						"zip",
						"link",
						"youtube"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: t,
						children: materialLabel(t)
					}, t)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "URL",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					placeholder: "https://",
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Subject",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: subjectId,
					onValueChange: setSubjectId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: lookups?.subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: String(s.id),
						children: s.name
					}, s.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Publish"
			})
		]
	});
}
//#endregion
export { MaterialsPage as component };
