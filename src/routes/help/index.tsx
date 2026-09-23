import { createFileRoute, Link } from "@tanstack/react-router";
import { HELP_ARTICLES } from "@/lib/help/articles";
import { useHelpLang } from "@/components/help/lang";

export const Route = createFileRoute("/help/")({ component: HelpIndex });

function HelpIndex() {
  const { lang } = useHelpLang();
  const urdu = lang === "ur";
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-12">
      <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
        {urdu ? "عوامی رہنمائی" : "Public help"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-heading sm:text-5xl">
        {urdu ? "والدین اور طالب علم کے لیے کیمپس گائیڈ" : "A campus guide for parents and students"}
      </h1>
      <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-ink-soft">
        {urdu ? (
          <>
            <p>
              یہ صفحات دستخط کے بغیر پڑھے جاتے ہیں۔ داخل شدہ ڈیش بورڈ، گریڈ بک اور خالی ماڈیول مضامین نہیں ہیں۔ یہ رہنمائی ہے۔ اس میں چار مکمل مضامین ہیں: کلاس ٹیچر اندراج کیسے کرتا ہے، حاضری کیسے لگتی اور فیصد کیسے نکلتی ہے، نتیجے کی صف کیسے پڑھی جاتی ہے، اور کیمپس اکاؤنٹ کیا نہیں ہے۔
            </p>
            <p>
              زبان اوپر سے بدلیں۔ انتخاب اسی آلے پر یاد رہتا ہے۔ اردو دائیں سے بائیں لکھی ہے۔ انگریزی بائیں سے دائیں۔ دونوں ایک ہی رجسٹر کی بات کرتی ہیں: نام، والد کا نام، رول نمبر، چار حاضری کی حالتیں، اور وہ گریڈ جو محفوظ نمبروں کی فیصد سے نکلتا ہے۔
            </p>
            <p>
              یہاں کوئی ویڈیو نہیں جسے دیکھنا پڑے، اور کوئی اشتہار نہیں جسے دبانا پڑے۔ سلپ گھر میں رکھیں۔ نمبر کلاس ٹیچر بدلتا ہے، پاس ورڈ نہیں۔
            </p>
          </>
        ) : (
          <>
            <p>
              These pages can be read without signing in. A dashboard, a gradebook, and an empty module are not articles. This guide is. It has four full pieces: how a class teacher enrols a student, how attendance is marked and turned into a percentage, how to read a result row, and what a campus account is not.
            </p>
            <p>
              Switch language at the top. The choice is remembered on this device. Urdu is set right to left. English is set left to right. Both describe the same register: a name, a father’s name, a roll number, four attendance statuses, and a letter taken from the percentage of saved marks.
            </p>
            <p>
              Nothing here asks you to watch a video or to press an advertisement. Keep the login slip at home. Marks change when a teacher saves them, not when a password changes.
            </p>
          </>
        )}
      </div>
      <ol className="mt-8 space-y-4">
        {HELP_ARTICLES.map((article, index) => (
          <li key={article.slug}>
            <Link
              to={article.to}
              className="block rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-primary"
            >
              <div className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                {urdu ? `مضمون ${index + 1}` : `Article ${index + 1}`}
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold text-heading">{article.title[lang]}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{article.summary[lang]}</p>
              <p className="mt-3 text-sm font-medium text-primary">{urdu ? "پورا مضمون پڑھیں" : "Read the full page"}</p>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-muted">
        {urdu
          ? "کیمپس کے اوزار کے لیے سائن اِن استعمال کریں، یا ہوم پیج پر واپس جائیں۔"
          : "Use Sign in for the campus tools, or return to the public home page."}{" "}
        <Link to="/" className="text-primary underline-offset-2 hover:underline">
          {urdu ? "ایل ایم ایس ہوم" : "LMS home"}
        </Link>
      </p>
    </main>
  );
}
