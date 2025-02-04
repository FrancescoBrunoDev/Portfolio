import Link from "next/link";
import pb from "@/lib/pocketbase";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";

import { LOCALES, SupportedLang, allowedLangs, getLocale } from "@/lib/locales";

interface Article {
  id: string;
  slug: string;
  expand: {
    markdowns: {
      id: string;
      lang: string;
      title: string;
      created: string;
    }[];
  };
  created: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang as SupportedLang;
  // get all articles with the same lang
  if (!allowedLangs.includes(lang)) {
    redirect("/section/record/en/blog/");
  }

  const articles: Article[] = await pb.collection("articles").getFullList({
    filter: `published = true`,
    expand: "markdowns",
  });

  return (
    <div className="text-primary flex h-screen w-screen items-center">
      <div className="container">
        <div className="w-full">
          <div className="flex flex-col justify-center gap-4 pt-10 font-normal lg:justify-normal">
            {articles.map((article) => {
              const md = article.expand?.markdowns.find(
                (markdown: { lang: string; title: string }) =>
                  markdown.lang === lang,
              );

              if (!md) return null;
              return (
                <Link
                  key={article.id}
                  href={`/section/record/${lang}/blog/${article.slug}`}
                  className="group hover:bg-primary/10 flex w-fit flex-col justify-start gap-2 rounded transition-all duration-100 ease-in-out hover:p-2 md:flex-row md:items-center"
                >
                  <div className="flex flex-col">
                    <span className="h-fit text-4xl font-semibold group-hover:font-black">
                      {md.title}
                    </span>
                    <span className="h-fit text-lg">
                      {format(
                        parseISO(article.created),
                        LOCALES[lang as SupportedLang].dateFormat.replace(
                          "${timePreposition}",
                          LOCALES[lang as SupportedLang].timePreposition,
                        ),
                        { locale: getLocale(lang) },
                      )}
                    </span>
                  </div>
                  <div className="inline-flex gap-2">
                    {article.expand?.markdowns.map((markdown) => (
                      <span
                        className="group-hover:bg-background group-hover:text-primary bg-primary/20 text-primary-prose rounded-full px-3 py-1 text-sm uppercase transition-colors"
                        key={markdown.id}
                      >
                        {markdown.lang}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
