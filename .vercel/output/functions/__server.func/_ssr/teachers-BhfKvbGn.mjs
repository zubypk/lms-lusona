import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, o as Avatar, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as Input } from "./input-Bwpmjhr-.mjs";
import { n as canAdmin } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { i as saveTeacher, n as listTeachers } from "./people-UCETBjTm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teachers-BhfKvbGn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeachersPage() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const q = useQuery({
		queryKey: ["teachers"],
		queryFn: () => listTeachers()
	});
	const admin = canAdmin(me.data?.role ?? "student");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Faculty",
			subtitle: "Teachers see only the classes and subjects assigned to them.",
			actions: admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Add teacher"
			}) : null
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: q.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: t.name,
							size: 44
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: t.qualification
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs text-faint",
								children: [
									t.teacher_code,
									" · ",
									t.employee_id
								]
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: "Subjects"
						}), t.subjects || "—"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: "Classes"
						}), t.classes || "—"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-xs text-muted",
						children: [t.email, t.mobile ? ` · ${t.mobile}` : ""]
					})
				]
			}, t.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddTeacher, {
			open,
			onOpenChange: setOpen
		})
	] });
}
function AddTeacher({ open, onOpenChange }) {
	const [name, setName] = (0, import_react.useState)("");
	const [qualification, setQualification] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [mobile, setMobile] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: () => saveTeacher({ data: {
			name,
			qualification,
			email,
			mobile
		} }),
		onSuccess: () => {
			toast.success("Teacher added");
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add teacher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				mut.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Qualification",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: qualification,
						onChange: (e) => setQualification(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mobile",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: mobile,
						onChange: (e) => setMobile(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mut.isPending,
					children: "Save"
				})
			]
		})] })
	});
}
//#endregion
export { TeachersPage as component };
