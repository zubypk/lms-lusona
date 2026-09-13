import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as Skeleton } from "./router-CAe6ag9G.mjs";
import { r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { a as listResults } from "./records-g3YmYo9V.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-C6uP-MZj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResultsPage() {
	const [examId, setExamId] = (0, import_react.useState)();
	const q = useQuery({
		queryKey: ["results", examId],
		queryFn: () => listResults({ data: examId ? { examId } : void 0 })
	});
	const data = q.data;
	function exportCsv() {
		if (!data) return;
		const header = [
			"Roll",
			"Name",
			...data.subjects.map((s) => s.name),
			"Total",
			"%",
			"GPA",
			"Letter"
		];
		const lines = data.rows.map((r) => {
			const marks = data.subjects.map((s) => r.marks[s.id]?.marks ?? "");
			return [
				r.roll,
				r.name,
				...marks,
				r.total,
				r.pct.toFixed(1),
				r.gpa.toFixed(2),
				r.letter
			].join(",");
		});
		const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "aec-results.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Results",
		subtitle: "Subject marks, percentage and GPA. Export opens in Excel.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: String(data?.examId ?? ""),
				onValueChange: (v) => setExamId(Number(v)),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Examination" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: data?.exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(e.id),
					children: e.name
				}, e.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: exportCsv,
				children: "Export CSV"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => window.print(),
				children: "Print / PDF"
			})
		] })
	}), q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[800px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-line bg-paper text-xs text-muted uppercase",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3",
						children: "Roll"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3",
						children: "Student"
					}),
					data?.subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3",
						children: s.name
					}, s.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3",
						children: "%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3",
						children: "GPA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3",
						children: "Grade"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data?.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: r.roll
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: r.name
					}),
					data.subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: r.marks[s.id]?.marks ?? "—"
					}, s.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: r.pct.toFixed(1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: r.gpa.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: r.letter.startsWith("A") ? "ok" : r.letter === "F" ? "danger" : "muted",
							children: r.letter
						})
					})
				]
			}, r.studentId)) })]
		})
	})] });
}
//#endregion
export { ResultsPage as component };
