import { Link } from "@tanstack/react-router";
import { HELP_ARTICLES, type HelpArticle, type HelpBlock } from "@/lib/help/articles";
import { useHelpLang } from "@/components/help/lang";

function BlockView({ block }: { block: HelpBlock }) {
  if (block.kind === "h2") {
    return <h2 className="mt-10 font-display text-2xl font-semibold text-heading">{block.text}</h2>;
  }
  if (block.kind === "p") {
    return <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{block.text}</p>;
  }
  if (block.kind === "ul" || block.kind === "ol") {
    const Tag = block.kind;
    return (
      <Tag className="mt-4 list-outside space-y-3 ps-5 text-[1.02rem] leading-relaxed text-ink-soft marker:text-primary">
        {block.items.map((item) => (
          <li key={item} className={block.kind === "ul" ? "list-disc" : "list-decimal"}>
            {item}
          </li>
        ))}
      </Tag>
    );
  }
  if (block.kind === "note") {
    return (
      <aside className="mt-6 rounded-xl border border-line border-s-4 border-s-primary bg-paper-2 px-4 py-3 text-sm leading-relaxed text-ink">
        {block.text}
      </aside>
    );
  }
  return (
    <figure className="mt-6">
      <figcaption className="mb-2 text-sm text-muted">{block.caption}</figcaption>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs tracking-wide text-muted uppercase">
            <tr>
              {block.headers.map((header) => (
                <th key={header} className="px-3 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.join("|")} className="border-b border-line last:border-0">
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className="px-3 py-3 align-top text-ink-soft">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function ArticleView({ article }: { article: HelpArticle }) {
  const { lang } = useHelpLang();
  const others = HELP_ARTICLES.filter((item) => item.slug !== article.slug);
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
        {lang === "ur" ? "عوامی رہنمائی" : "Public help"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        {article.title[lang]}
      </h1>
      <p className="mt-4 text-base text-ink sm:text-lg">{article.summary[lang]}</p>
      {article.blocks[lang].map((block, index) => (
        <BlockView key={`${block.kind}-${index}`} block={block} />
      ))}
      <nav className="mt-12 border-t border-line pt-6" aria-label={lang === "ur" ? "مزید مضامین" : "More articles"}>
        <h2 className="font-display text-xl font-semibold text-heading">
          {lang === "ur" ? "اسی رہنمائی میں آگے" : "Continue in this guide"}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                to={item.to}
                className="block h-full rounded-xl border border-line bg-surface p-4 text-sm shadow-[var(--shadow-card)] hover:border-primary"
              >
                <span className="font-medium text-ink">{item.title[lang]}</span>
                <span className="mt-1 block text-muted">{item.summary[lang]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
