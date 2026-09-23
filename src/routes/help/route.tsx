import { createFileRoute } from "@tanstack/react-router";
import { HelpShell } from "@/components/help/shell";

export const Route = createFileRoute("/help")({
  component: HelpShell,
  head: () => ({
    meta: [
      { title: "Help · LMS" },
      {
        name: "description",
        content:
          "Public campus guide for parents and students: enrolment, attendance, results, and what a campus account is not.",
      },
    ],
  }),
});
