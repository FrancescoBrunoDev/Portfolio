import Link from "next/link";
import pb from "@/lib/pocketbase";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { getAllBlogMetadata } from "@/lib/utils";
import { LOCALES, SupportedLang, allowedLangs, getLocale } from "@/lib/locales";

export interface Article {
  id: string;
  slug: string;
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
    // ordinali al contrario
    sort: "-created",
  });

  // Fetch all blog metadata in one batch instead of N sequential calls
  const metadataBySlug = await getAllBlogMetadata().catch(() => new Map<string, { title: string; lang: string[] }>());

  // Filter to only articles that have content for this language
  const articlesWithContent = articles.filter((article) => {
    const metadata = metadataBySlug.get(article.slug)
    return (
      metadata != null &&
      metadata.lang.some((l) => allowedLangs.includes(l as SupportedLang))
    )
  });

  return (
    <div className="text-primary flex h-screen w-full items-center">
      <div className="container">
        <div className="w-full">
          <div className="flex flex-col justify-center gap-4 pt-10 font-normal lg:justify-normal">
            {articlesWithContent.map((article) => {
              const metadata = metadataBySlug.get(article.slug)
              const title = metadata?.title || article.slug;

              // Prefer langs from fetched markdown metadata; fallback to PB expand
              const langsRaw: string[] = Array.isArray(metadata?.lang)
                ? (metadata.lang as string[])
                : [];

              let displayLangs = Array.from(new Set(langsRaw)).filter((l) =>
                allowedLangs.includes(l as SupportedLang),
              );

              // order lang must always be en, it, <other langs>
              displayLangs = displayLangs.sort((a, b) => {
                if (a === "en") return -1;
                if (b === "en") return 1;
                if (a === "it") return -1;
                if (b === "it") return 1;
                return 0;
              });

              return (
                <Link
                  key={article.id}
                  href={`/section/record/${lang}/blog/${article.slug}`}
                  className="group hover:bg-primary/10 flex w-fit flex-col justify-start gap-2 rounded transition-all duration-100 ease-in-out hover:p-2 md:flex-row md:items-center"
                >
                  <div className="flex flex-col">
                    <span className="h-fit text-4xl font-semibold group-hover:font-black">
                      {title}
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
                    {displayLangs.map((l) => (
                      <span
                        className="group-hover:bg-background group-hover:text-primary bg-primary/20 text-primary-prose rounded-full px-3 py-1 text-sm uppercase transition-colors"
                        key={l}
                      >
                        {l}
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
