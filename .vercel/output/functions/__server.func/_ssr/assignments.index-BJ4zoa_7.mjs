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
import { a as listAssignments, u as saveAssignment } from "./learning-BdgXquKe.mjs";
import { i as canTeach } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { r as listLookups } from "./records-g3YmYo9V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assignments.index-BJ4zoa_7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssignmentsPage() {
	const q = useQuery({
		queryKey: ["assignments"],
		queryFn: () => listAssignments()
	});
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const lookups = useQuery({
		queryKey: ["lookups"],
		queryFn: () => listLookups()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const teach = canTeach(me.data?.role ?? "student");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Assignments",
			subtitle: "Set work, collect submissions before the deadline, then grade.",
			actions: teach ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Create assignment"
			}) : null
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: q.data?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/assignments/$id",
				params: { id: String(a.id) },
				className: "block rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							a.subject_name,
							" · ",
							a.class_name,
							" · due ",
							formatDateTime(a.due_at)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "muted",
							children: [a.max_marks, " marks"]
						}), a.my_status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: a.my_status === "graded" ? "ok" : "default",
							children: a.my_status
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [a.submission_count, " submitted"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-sm text-ink-soft",
					children: a.description
				})]
			}, a.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New assignment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignmentForm, {
				lookups: lookups.data,
				onDone: () => {
					setOpen(false);
					queryClient.invalidateQueries({ queryKey: ["assignments"] });
				}
			})] })
		})
	] });
}
function AssignmentForm({ lookups, onDone }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [subjectId, setSubjectId] = (0, import_react.useState)("1");
	const [classId, setClassId] = (0, import_react.useState)("3");
	const [dueAt, setDueAt] = (0, import_react.useState)("2026-09-30T16:00");
	const [maxMarks, setMaxMarks] = (0, import_react.useState)("50");
	const mut = useMutation({
		mutationFn: () => saveAssignment({ data: {
			title,
			description,
			subjectId: Number(subjectId),
			classId: Number(classId),
			dueAt: new Date(dueAt).toISOString(),
			maxMarks: Number(maxMarks)
		} }),
		onSuccess: () => {
			toast.success("Assignment published");
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
				label: "Brief",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: description,
					onChange: (e) => setDescription(e.target.value)
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Class",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: classId,
					onValueChange: setClassId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: lookups?.classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: String(c.id),
						children: c.name
					}, c.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Due",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "datetime-local",
						value: dueAt,
						onChange: (e) => setDueAt(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Marks",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: maxMarks,
						onChange: (e) => setMaxMarks(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Publish"
			})
		]
	});
}
//#endregion
export { AssignmentsPage as component };
