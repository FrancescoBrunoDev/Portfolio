import { redirect } from "next/navigation";
import pb from "@/lib/pocketbase";
import type { Metadata, ResolvingMetadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { SupportedLang, allowedLangs } from "@/lib/locales";
import { Article } from "@/components/blog/article";

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
        <Article
          lang={lang as SupportedLang}
          record={record}
          mdxSource={mdxSource}
        />
      </div>
    );
  } catch (error) {
    redirect(`/section/record/${lang}/blog/`);
  }
}
