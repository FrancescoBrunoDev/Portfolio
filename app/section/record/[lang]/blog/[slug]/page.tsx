import { allowedLangs } from "@/app/section/record/[lang]/blog/page";
import { redirect } from "next/navigation";
import pb from "@/lib/pocketbase";
import type { Metadata, ResolvingMetadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import MDXClient from "./MDXClient";

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

  if (!allowedLangs.includes(lang)) {
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
        <div className="from-background-blog via-background-blog pointer-events-none fixed inset-0 -z-10 h-screen bg-gradient-to-t via-90% to-background to-95%" />
        <article className="prose lg:prose-lg prose-headings:text-primary container pt-20">
          <h1>{record.title}</h1>
          <MDXClient source={mdxSource} />
        </article>
      </div>
    );
  } catch (error) {
    redirect(`/section/record/${lang}/blog/`);
  }
}
