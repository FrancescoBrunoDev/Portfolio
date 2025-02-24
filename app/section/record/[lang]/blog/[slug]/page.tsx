import { redirect } from "next/navigation";
import pb from "@/lib/pocketbase";
import type { Metadata, ResolvingMetadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import MDXClient from "./MDXClient";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { LOCALES, SupportedLang, allowedLangs, getLocale } from "@/lib/locales";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

type Markdown = {
  lang: string;
  title: string;
  file: string;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Await the params
  const { slug, lang } = await params;

  try {
    const record = await pb
      .collection("articles")
      .getFirstListItem(`slug = "${slug}"`, {
        requestKey: null,
        expand: "markdowns",
      });

    const md = record.expand?.markdowns.find(
      (markdown: Markdown) => markdown.lang === lang,
    );

    const parentData = await parent;
    const previousTitle = parentData.title?.absolute;

    return {
      title: md?.title + (previousTitle ? ` | ${previousTitle}` : ""),
      description: record.description,
    };
  } catch (error) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

export default async function BlogPost({ params }: Props) {
  const { lang, slug } = await params;

  if (!allowedLangs.includes(lang as SupportedLang)) {
    redirect(`/section/record/en/blog/${slug}`);
  }

  try {
    const record = await pb
      .collection("articles")
      .getFirstListItem(`slug = "${slug}"`, {
        expand: "markdowns",
      });

    if (!record || !record.published) {
      redirect(`/section/record/${lang}/blog/`);
    }

    const md = record.expand?.markdowns.find(
      (markdown: Markdown) => markdown.lang === lang,
    );

    if (!md) {
      redirect(`/section/record/en/blog/${slug}`);
    }

    const urlMd = pb.files.getURL(md, md.file);
    const sourceMd = await fetch(urlMd).then((res) => res.text());
    const mdxSource = await serialize(sourceMd);

    return (
      <div className="isolate">
        <div className="from-background-blog via-background-blog to-background pointer-events-none fixed inset-0 -z-10 h-screen bg-linear-to-t via-90% to-95%" />
        <article className="prose lg:prose-lg prose-headings:text-primary prose-p:text-primary-prose prose-p:text-justify container mx-auto py-20">
          <Link
            href={`/section/record/${lang}/blog`}
            className="text-primary group inline-flex items-center gap-1 pb-6 text-xl font-bold no-underline transition-all hover:-translate-x-2 hover:font-black"
          >
            <ArrowLeft size={24} className="stroke-3 group-hover:stroke-4" />
            Back
          </Link>
          <div>
            <span className="text-primary">
              {format(
                parseISO(record.created),
                LOCALES[lang as SupportedLang].dateFormat.replace(
                  "${timePreposition}",
                  LOCALES[lang as SupportedLang].timePreposition,
                ),
                { locale: getLocale(lang) },
              )}
            </span>
          </div>
          <MDXClient source={mdxSource} />
        </article>
      </div>
    );
  } catch (error) {
    redirect(`/section/record/${lang}/blog/`);
  }
}
