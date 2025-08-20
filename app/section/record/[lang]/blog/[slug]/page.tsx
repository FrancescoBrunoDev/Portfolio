import { redirect } from "next/navigation";
import pb from "@/lib/pocketbase";
import type { Metadata, ResolvingMetadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { SupportedLang, allowedLangs } from "@/lib/locales";
import { Article } from "@/components/blog/article";
import { getMarkdown } from "@/lib/utils";

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
      });

    const md = await getMarkdown({ slug, lang, getMd: false });

    const parentData = await parent;
    const previousTitle = parentData.title?.absolute;

    return {
      title: md?.data.title + (previousTitle ? ` | ${previousTitle}` : ""),
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
      .getFirstListItem(`slug = "${slug}"`);

    const urlMD = await getMarkdown({ slug, lang, getMd: true });

    // If the webhook result is different from "success"
    if (!urlMD.result || urlMD.result !== "success") {
      redirect(`/section/record/en/blog/${slug}`);
    }

    const md = urlMD.data.md;

    const mdxSource = await serialize(md, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    });

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
