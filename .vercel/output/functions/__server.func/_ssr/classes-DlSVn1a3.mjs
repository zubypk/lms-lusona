import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as Input } from "./input-Bwpmjhr-.mjs";
import { r as listLookups } from "./records-g3YmYo9V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
import { c as saveClass, i as listClasses, l as saveSection } from "./academic-BlRUvdp3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/classes-DlSVn1a3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClassesPage() {
	const q = useQuery({
		queryKey: ["classes"],
		queryFn: () => listClasses()
	});
	const lookups = useQuery({
		queryKey: ["lookups"],
		queryFn: () => listLookups()
	});
	const [classOpen, setClassOpen] = (0, import_react.useState)(false);
	const [sectionOpen, setSectionOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Classes & sections",
			subtitle: "Grade structure for the current academic session.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setSectionOpen(true),
				children: "Add section"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setClassOpen(true),
				children: "Add class"
			})] })
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: q.data?.classes.map((c) => {
				const secs = q.data.sections.filter((s) => s.class_id === c.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Grade ",
								c.grade_level,
								" · ",
								c.stream.replace("_", " "),
								" · ",
								c.session_name
							]
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
						children: secs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-line p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: ["Section ", s.name]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "muted",
										children: [s.students, " students"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted",
									children: ["Room ", s.room ?? "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-ink-soft",
									children: ["Incharge: ", s.incharge ?? "Unassigned"]
								})
							]
						}, s.id))
					})]
				}, c.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddClass, {
			open: classOpen,
			onOpenChange: setClassOpen,
			lookups: lookups.data
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddSection, {
			open: sectionOpen,
			onOpenChange: setSectionOpen,
			lookups: lookups.data
		})
	] });
}
function AddClass({ open, onOpenChange, lookups }) {
	const [name, setName] = (0, import_react.useState)("");
	const [grade, setGrade] = (0, import_react.useState)("11");
	const [stream, setStream] = (0, import_react.useState)("pre_engineering");
	const mut = useMutation({
		mutationFn: () => saveClass({ data: {
			name,
			gradeLevel: Number(grade),
			stream,
			sessionId: lookups?.sessions[0]?.id ?? 1
		} }),
		onSuccess: () => {
			toast.success("Class created");
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
					label: "Grade level",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: grade,
						onChange: (e) => setGrade(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stream",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: stream,
						onChange: (e) => setStream(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save"
				})
			]
		})] })
	});
}
function AddSection({ open, onOpenChange, lookups }) {
	const [classId, setClassId] = (0, import_react.useState)("3");
	const [name, setName] = (0, import_react.useState)("C");
	const [room, setRoom] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: () => saveSection({ data: {
			classId: Number(classId),
			name,
			room
		} }),
		onSuccess: () => {
			toast.success("Section created");
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create section" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				mut.mutate();
			},
			children: [
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Section name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Room",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: room,
						onChange: (e) => setRoom(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save"
				})
			]
		})] })
	});
}
//#endregion
export { ClassesPage as component };
