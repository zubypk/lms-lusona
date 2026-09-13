import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as formatDateTime } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { r as Textarea, t as Input } from "./input-Bwpmjhr-.mjs";
import { h as saveThread, o as listForum } from "./learning-BdgXquKe.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forum.index-B-sObU2t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForumPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const threads = useQuery({
		queryKey: ["forum", q],
		queryFn: () => listForum({ data: { q } })
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: () => saveThread({ data: {
			title,
			body,
			subjectId: 1
		} }),
		onSuccess: () => {
			toast.success("Question posted");
			queryClient.invalidateQueries({ queryKey: ["forum"] });
			setOpen(false);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Discussion forum",
			subtitle: "Ask subject questions. Teachers reply in the same thread.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New question"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			placeholder: "Search threads",
			value: q,
			onChange: (e) => setQ(e.target.value),
			className: "mb-4 max-w-sm"
		}),
		threads.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: threads.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/forum/$id",
				params: { id: String(t.id) },
				className: "block rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-medium",
								children: t.title
							}),
							t.subject_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: t.subject_name
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: [t.replies, " replies"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-muted",
						children: t.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xs text-faint",
						children: [
							t.author_name,
							" · ",
							formatDateTime(t.created_at)
						]
					})
				]
			}, t.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Ask the class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
						label: "Question",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: body,
							onChange: (e) => setBody(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Post"
					})
				]
			})] })
		})
	] });
}
//#endregion
export { ForumPage as component };
