import { createFileRoute } from "@tanstack/react-router";
import { ArticleView } from "@/components/help/article-view";
import { helpArticle } from "@/lib/help/articles";

export const Route = createFileRoute("/help/results")({
  component: ResultsHelp,
  head: () => ({ meta: [{ title: "Results · LMS Help" }] }),
});

function ResultsHelp() {
  return <ArticleView article={helpArticle("results")} />;
}
