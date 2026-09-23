import { createFileRoute } from "@tanstack/react-router";
import { ArticleView } from "@/components/help/article-view";
import { helpArticle } from "@/lib/help/articles";

export const Route = createFileRoute("/help/attendance")({
  component: AttendanceHelp,
  head: () => ({ meta: [{ title: "Attendance · LMS Help" }] }),
});

function AttendanceHelp() {
  return <ArticleView article={helpArticle("attendance")} />;
}
