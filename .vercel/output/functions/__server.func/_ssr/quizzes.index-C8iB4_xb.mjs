import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as formatDate, o as num } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { r as Textarea, t as Input } from "./input-Bwpmjhr-.mjs";
import { l as listQuizzes, m as saveQuiz } from "./learning-BdgXquKe.mjs";
import { i as canTeach } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { r as listLookups } from "./records-g3YmYo9V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quizzes.index-C8iB4_xb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizzesPage() {
	const q = useQuery({
		queryKey: ["quizzes"],
		queryFn: () => listQuizzes()
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
			title: "Quizzes & tests",
			subtitle: "Timed papers with auto-grading for MCQ, true/false and fill-in items.",
			actions: teach ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Create quiz"
			}) : null
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: q.data?.map((quiz) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/quizzes/$id",
				params: { id: String(quiz.id) },
				className: "rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-medium",
							children: quiz.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "muted",
							children: [quiz.duration_minutes, " min"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							quiz.subject_name,
							" · ",
							quiz.question_count,
							" questions · ",
							quiz.max_attempts,
							" attempts"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-2 text-sm text-ink-soft",
						children: quiz.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-xs text-faint",
						children: [
							quiz.my_attempts,
							" attempt(s)",
							quiz.my_best != null ? ` · best ${num(quiz.my_best)}` : "",
							quiz.available_until ? ` · until ${formatDate(quiz.available_until)}` : ""
						]
					})
				]
			}, quiz.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New quiz" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizForm, {
					lookups: lookups.data,
					onDone: () => {
						setOpen(false);
						queryClient.invalidateQueries({ queryKey: ["quizzes"] });
					}
				})]
			})
		})
	] });
}
function QuizForm({ lookups, onDone }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [subjectId, setSubjectId] = (0, import_react.useState)("1");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [options, setOptions] = (0, import_react.useState)("A, B, C, D");
	const [type, setType] = (0, import_react.useState)("mcq");
	const [draft, setDraft] = (0, import_react.useState)([]);
	const mut = useMutation({
		mutationFn: () => saveQuiz({ data: {
			title,
			description,
			subjectId: Number(subjectId),
			classId: 3,
			durationMinutes: 20,
			maxAttempts: 2,
			questions: draft
		} }),
		onSuccess: () => {
			toast.success("Quiz published");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			if (!draft.length) {
				toast.error("Add at least one question");
				return;
			}
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-line p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium text-muted",
					children: "Question bank item"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: type,
							onValueChange: setType,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"mcq",
								"true_false",
								"fill_blank",
								"short",
								"long"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Prompt",
							value: prompt,
							onChange: (e) => setPrompt(e.target.value)
						}),
						type === "mcq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Options, comma separated",
							value: options,
							onChange: (e) => setOptions(e.target.value)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Correct answer",
							value: answer,
							onChange: (e) => setAnswer(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								if (!prompt) return;
								setDraft((d) => [...d, {
									type,
									prompt,
									options: type === "mcq" ? options.split(",").map((s) => s.trim()) : void 0,
									answer,
									marks: type === "long" ? 5 : 1
								}]);
								setPrompt("");
								setAnswer("");
							},
							children: [
								"Add question (",
								draft.length,
								")"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Publish quiz"
			})
		]
	});
}
//#endregion
export { QuizzesPage as component };
