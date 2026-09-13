import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as num } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, n as Route$1, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { r as Textarea, t as Input } from "./input-Bwpmjhr-.mjs";
import { g as startQuiz, n as getQuiz, v as submitQuiz } from "./learning-BdgXquKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quizzes._id-DDpLyUVU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizDetail() {
	const { id } = Route$1.useParams();
	const quizId = Number(id);
	const [taking, setTaking] = (0, import_react.useState)(false);
	const q = useQuery({
		queryKey: [
			"quiz",
			quizId,
			taking
		],
		queryFn: () => getQuiz({ data: {
			id: quizId,
			forTaking: taking
		} })
	});
	const [attemptId, setAttemptId] = (0, import_react.useState)(null);
	const [remaining, setRemaining] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [result, setResult] = (0, import_react.useState)(null);
	const start = useMutation({
		mutationFn: () => startQuiz({ data: { quizId } }),
		onSuccess: (res) => {
			setAttemptId(res.attemptId);
			setRemaining(res.duration * 60);
			setTaking(true);
			setResult(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const submit = useMutation({
		mutationFn: () => submitQuiz({ data: {
			attemptId,
			answers
		} }),
		onSuccess: (res) => {
			setResult(res);
			setTaking(false);
			queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
			toast.success(`Scored ${res.score} / ${res.max}`);
		},
		onError: (e) => toast.error(e.message)
	});
	(0, import_react.useEffect)(() => {
		if (!taking || remaining <= 0) return;
		const t = setInterval(() => {
			setRemaining((s) => {
				if (s <= 1) {
					if (attemptId) submit.mutate();
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => clearInterval(t);
	}, [
		taking,
		remaining,
		attemptId
	]);
	const questions = (0, import_react.useMemo)(() => {
		const list = q.data?.questions ?? [];
		if (q.data?.quiz.randomize && taking) return [...list].sort((a, b) => a.id * 7 % 13 - b.id * 7 % 13);
		return list;
	}, [q.data, taking]);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: "Quiz not found."
	});
	const { quiz, attempts, actor } = q.data;
	const student = actor.role === "student";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/quizzes",
			className: "text-sm text-primary",
			children: "← All quizzes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: quiz.title,
			subtitle: `${quiz.subject_name} · ${quiz.duration_minutes} minutes · ${quiz.max_attempts} attempts`,
			actions: taking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "warn",
				children: [
					Math.floor(remaining / 60),
					":",
					String(remaining % 60).padStart(2, "0")
				]
			}) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: quiz.description
		}),
		result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border border-ok bg-ok-bg p-4 text-ok",
			children: [
				"Instant result: ",
				result.score,
				" / ",
				result.max,
				" (",
				result.pct,
				"%). Short and long answers are half-marked pending teacher review."
			]
		}) : null,
		student && !taking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => start.mutate(),
			disabled: start.isPending,
			className: "mb-4",
			children: "Start attempt"
		}) : null,
		taking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: (e) => {
				e.preventDefault();
				submit.mutate();
			},
			children: [questions.map((qn, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted",
						children: [
							"Q",
							i + 1,
							" · ",
							qn.marks,
							" mark",
							qn.marks === 1 ? "" : "s",
							" · ",
							qn.type.replace("_", " ")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-medium",
						children: qn.prompt
					}),
					qn.type === "mcq" && qn.options_json ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2",
						children: JSON.parse(qn.options_json).map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 rounded-md border border-line px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: `q-${qn.id}`,
								value: opt,
								onChange: () => setAnswers((a) => ({
									...a,
									[qn.id]: opt
								}))
							}), opt]
						}, opt))
					}) : qn.type === "true_false" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: ["true", "false"].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: answers[qn.id] === opt ? "default" : "outline",
							onClick: () => setAnswers((a) => ({
								...a,
								[qn.id]: opt
							})),
							children: opt
						}, opt))
					}) : qn.type === "long" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: answers[qn.id] ?? "",
						onChange: (e) => setAnswers((a) => ({
							...a,
							[qn.id]: e.target.value
						}))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-3",
						value: answers[qn.id] ?? "",
						onChange: (e) => setAnswers((a) => ({
							...a,
							[qn.id]: e.target.value
						}))
					})
				]
			}, qn.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: submit.isPending,
				children: "Submit paper"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-line bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: "Attempts"
				}),
				!attempts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No attempts yet."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2 text-sm",
					children: attempts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Attempt ", a.attempt_no] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: a.submitted_at ? `${num(a.score)} / ${num(a.max_score)}` : "In progress"
						})]
					}, a.id))
				}),
				!student ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: q.data.questions.map((qn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: qn.prompt
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: ["Answer: ", qn.answer]
						})]
					}, qn.id))
				}) : null
			]
		})
	] });
}
//#endregion
export { QuizDetail as component };
