// import StravaInfo from "@/components/strava/stravaInfo";
import Link from "next/link";
import pb from "@/lib/pocketbase";
import { redirect } from "next/navigation";

export const allowedLangs = ["en", "it"];

interface Article {
  id: string;
  slug: string;
  expand: {
    markdowns: {
      id: string;
      lang: string;
      title: string;
    }[];
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;
  // get all articles with the same lang
  if (!allowedLangs.includes(lang)) {
    redirect("/section/record/en/blog/");
  }
  console.log(!allowedLangs.includes(lang));
  const articles: Article[] = await pb.collection("articles").getFullList({
    filter: `published = true`,
    expand: "markdowns",
  });
  return (
    <div className="flex h-screen w-screen items-center text-primary">
      <div className="container">
        <div className="w-full">
          <div className="flex flex-col justify-center gap-4 pt-10 font-normal lg:justify-normal">
            {articles.map((article) => {
              const md = article.expand?.markdowns.find(
                (markdown: { lang: string; title: any }) =>
                  markdown.lang === lang,
              );
              if (!md) return null;
              return (
                <Link
                  key={article.id}
                  href={`/section/record/${lang}/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span className="h-fit text-4xl">{md.title}</span>
                  <div className="inline-flex gap-2">
                    {article.expand?.markdowns.map((markdown) => (
                      <span
                        className="h-fit rounded-full bg-primary px-2 text-background"
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
