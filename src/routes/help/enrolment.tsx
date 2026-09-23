import { createFileRoute } from "@tanstack/react-router";
import { ArticleView } from "@/components/help/article-view";
import { helpArticle } from "@/lib/help/articles";

export const Route = createFileRoute("/help/enrolment")({
  component: EnrolmentHelp,
  head: () => ({ meta: [{ title: "Enrolment · LMS Help" }] }),
});

function EnrolmentHelp() {
  return <ArticleView article={helpArticle("enrolment")} />;
}
