"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SupportedLang } from "@/lib/locales";
import { Article } from "@/components/blog/article";
import type { RecordModel } from "pocketbase";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

type BlogPostClientProps = {
  lang: SupportedLang;
  record: RecordModel;
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
  availableLanguages: SupportedLang[];
};

export default function BlogPostClient({
  lang,
  record,
  mdxSource,
  availableLanguages,
}: BlogPostClientProps) {
  return (
    <>
      <Article lang={lang} record={record} mdxSource={mdxSource} />
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
        <LanguageSwitcher availableLanguages={availableLanguages} />
      </div>
    </>
  );
}
