import { createFileRoute } from "@tanstack/react-router";
import { ArticleView } from "@/components/help/article-view";
import { helpArticle } from "@/lib/help/articles";

export const Route = createFileRoute("/help/account")({
  component: AccountHelp,
  head: () => ({ meta: [{ title: "Campus account · LMS Help" }] }),
});

function AccountHelp() {
  return <ArticleView article={helpArticle("account")} />;
}
