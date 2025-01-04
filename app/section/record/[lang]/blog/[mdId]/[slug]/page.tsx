import { allowedLangs } from "@/app/section/record/[lang]/blog/page";
import { redirect } from "next/navigation";
import pb from "@/lib/pocketbase";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ lang: string; mdId: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { mdId } = await params;
  const record = await pb
    .collection("markdowns")
    .getOne(mdId, { requestKey: null });
  const previusTitle = (await parent).title;
  return {
    title: `${record.title} ${previusTitle && " | " + previusTitle?.absolute}`,
    description: record.description,
  };
}

export default async function Page({ params }: Props) {
  const { lang, mdId, slug } = await params;
  // get all articles with the same lang
  if (!allowedLangs.includes(lang)) {
    redirect(`/section/record/en/blog/${mdId}/${slug}`);
  }

  const record = await pb.collection("markdowns").getOne(mdId);
  const urlMd = pb.files.getURL(record, record.file);
  const markdown = await fetch(urlMd).then((res) => res.text());

  return (
    <article className="prose lg:prose-xl prose-headings:text-primary container pt-20 text-primary">
      <h1>{record.title}</h1>
      <MDXRemote source={markdown} />
    </article>
  );
}
