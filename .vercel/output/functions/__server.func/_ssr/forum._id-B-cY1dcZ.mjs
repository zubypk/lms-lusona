import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as formatDateTime } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, o as Avatar, r as Route$3, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { r as Textarea } from "./input-Bwpmjhr-.mjs";
import { p as savePost, r as getThread } from "./learning-BdgXquKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forum._id-B-cY1dcZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThreadPage() {
	const { id } = Route$3.useParams();
	const threadId = Number(id);
	const q = useQuery({
		queryKey: ["thread", threadId],
		queryFn: () => getThread({ data: { id: threadId } })
	});
	const [body, setBody] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: () => savePost({ data: {
			threadId,
			body
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: "Thread not found."
	});
	const { thread, posts } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/forum",
			className: "text-sm text-primary",
			children: "← Forum"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: thread.title,
			subtitle: `${thread.author_name} · ${formatDateTime(thread.created_at)}`,
			actions: thread.subject_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: thread.subject_name }) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap text-sm",
				children: thread.body
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 rounded-xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: p.author_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: p.author_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-faint",
						children: formatDateTime(p.created_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm text-ink-soft",
						children: p.body
					})
				] })]
			}, p.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 grid gap-3 rounded-xl border border-line bg-surface p-5",
			onSubmit: (e) => {
				e.preventDefault();
				mut.mutate();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Reply",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					required: true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: mut.isPending,
				children: "Post reply"
			})]
		})
	] });
}
//#endregion
export { ThreadPage as component };
