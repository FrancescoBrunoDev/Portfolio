import { notFound, redirect } from "next/navigation";
import pb from "@/lib/pocketbase";
import type { Metadata, ResolvingMetadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { SupportedLang, allowedLangs } from "@/lib/locales";
import { getMarkdown, getAllBlogMetadata } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, lang } = await params;

  try {
    const record = await pb
      .collection("articles")
      .getFirstListItem(pb.filter("slug = {:slug}", { slug }), {
        requestKey: null,
      });

    const md = await getMarkdown(slug, lang, false);

    const parentData = await parent;
    const previousTitle = parentData.title?.absolute;

    return {
      title:
        (md?.data?.title ?? "") + (previousTitle ? ` | ${previousTitle}` : ""),
      description: record.description,
    };
  } catch (_error) {
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

  // Verify the article exists; 404 if not
  const record = await pb
    .collection("articles")
    .getFirstListItem(pb.filter("slug = {:slug}", { slug }))
    .catch(() => null);

  if (!record) {
    notFound();
  }

  // Fetch the markdown for the requested language
  const urlMD = await getMarkdown(slug, lang, true);

  if (!urlMD || urlMD.result !== "success") {
    // Article exists but isn't available in the requested language.
    const metadata = await getAllBlogMetadata().catch(
      () => new Map<string, { title: string; lang: string[] }>(),
    );

    const availableLangs = (metadata.get(slug)?.lang ?? []).filter(
      (l: string) => allowedLangs.includes(l as SupportedLang),
    );

    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-primary text-xl">
            This article is not available in{" "}
            <span className="font-bold uppercase">{lang}</span>.
          </p>
          {availableLangs.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-primary-prose text-sm">Available in:</p>
              <div className="flex gap-2">
                {availableLangs.map((l: string) => (
                  <Link key={l} href={`/section/record/${l}/blog/${slug}`}>
                    <Button>{l.toUpperCase()}</Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link href={`/section/record/${lang}/blog`}>
            <Button variant="outline">Back to blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  try {
    const md = urlMD.data?.md ?? "";

    const mdxSource = await serialize(md, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    });

    const languagePriority = (lang: SupportedLang) => {
      if (lang === "en") return 0;
      if (lang === "it") return 1;
      return 2;
    };

    const availableLanguages = (urlMD.data?.lang ?? [])
      .filter((l): l is SupportedLang => allowedLangs.includes(l as SupportedLang))
      .sort((a, b) => languagePriority(a) - languagePriority(b));

    return (
      <div className="isolate">
        <div className="from-background-blog via-background-blog to-background pointer-events-none fixed inset-0 -z-10 h-screen bg-linear-to-t via-90% to-95%" />
        <BlogPostClient
          lang={lang as SupportedLang}
          record={record}
          mdxSource={mdxSource}
          availableLanguages={availableLanguages}
        />
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
