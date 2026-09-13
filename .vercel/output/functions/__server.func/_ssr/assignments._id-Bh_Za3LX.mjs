import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as formatDateTime } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, i as Route$5, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { r as Textarea, t as Input } from "./input-Bwpmjhr-.mjs";
import { _ as submitAssignment, i as gradeSubmission, t as getAssignment } from "./learning-BdgXquKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assignments._id-Bh_Za3LX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssignmentDetail() {
	const { id } = Route$5.useParams();
	const assignmentId = Number(id);
	const q = useQuery({
		queryKey: ["assignment", assignmentId],
		queryFn: () => getAssignment({ data: { id: assignmentId } })
	});
	const [content, setContent] = (0, import_react.useState)("");
	const [fileUrl, setFileUrl] = (0, import_react.useState)("");
	const submit = useMutation({
		mutationFn: () => submitAssignment({ data: {
			assignmentId,
			content,
			fileUrl
		} }),
		onSuccess: () => {
			toast.success("Submitted");
			queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: "Assignment not found."
	});
	const { assignment, submissions, mine, actor } = q.data;
	const student = actor.role === "student";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/assignments",
			className: "text-sm text-primary",
			children: "← All assignments"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: assignment.title,
			subtitle: `${assignment.subject_name} · ${assignment.class_name} · due ${formatDateTime(assignment.due_at)}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [assignment.max_marks, " marks"] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap text-sm text-ink-soft",
				children: assignment.description
			})
		}),
		student ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: "Your work"
				}),
				mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: mine.status === "graded" ? "ok" : "default",
							children: mine.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-ink-soft",
							children: mine.content
						}),
						mine.file_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "mt-2 inline-block text-primary",
							href: mine.file_url,
							target: "_blank",
							rel: "noreferrer",
							children: "Attachment"
						}) : null,
						mine.status === "graded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm",
							children: [
								"Marks: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium tabular-nums",
									children: mine.marks
								}),
								" / ",
								assignment.max_marks,
								mine.feedback ? ` — ${mine.feedback}` : ""
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted",
							children: "You may resubmit until the deadline."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "No submission yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						submit.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Submission text",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: content,
								onChange: (e) => setContent(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "File URL (Drive, GitHub, PDF)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: fileUrl,
								onChange: (e) => setFileUrl(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: submit.isPending,
							children: mine ? "Resubmit" : "Submit"
						})
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-line bg-paper text-xs text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Student"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Submitted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Marks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Feedback"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: submissions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeRow, {
					sub: s,
					max: assignment.max_marks,
					assignmentId
				}, s.id)) })]
			}), !submissions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-5 text-sm text-muted",
				children: "No submissions yet."
			}) : null]
		})
	] });
}
function GradeRow({ sub, max, assignmentId }) {
	const [marks, setMarks] = (0, import_react.useState)(String(sub.marks ?? ""));
	const [feedback, setFeedback] = (0, import_react.useState)(sub.feedback ?? "");
	const mut = useMutation({
		mutationFn: () => gradeSubmission({ data: {
			submissionId: sub.id,
			marks: Number(marks),
			feedback
		} }),
		onSuccess: () => {
			toast.success("Graded");
			queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-b border-line align-top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: sub.student_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: sub.roll_number
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xs text-xs text-ink-soft",
						children: sub.content
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-xs",
				children: formatDateTime(sub.submitted_at)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "h-9 w-20",
					value: marks,
					onChange: (e) => setMarks(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] text-faint",
					children: ["/ ", max]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: feedback,
						onChange: (e) => setFeedback(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => mut.mutate(),
						disabled: mut.isPending,
						children: "Save"
					})]
				})
			})
		]
	});
}
//#endregion
export { AssignmentDetail as component };
