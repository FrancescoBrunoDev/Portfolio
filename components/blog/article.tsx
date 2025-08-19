"use client";

import { ReferenceProvider } from "@/lib/ReferenceContext";
import Bibliography from "@/components/blog/bibliograpghy";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { LOCALES, SupportedLang, allowedLangs, getLocale } from "@/lib/locales";
import { ArrowLeft } from "lucide-react";
import { RecordModel } from "pocketbase";
import MDXClient from "@/app/section/record/[lang]/blog/[slug]/MDXClient";
import { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";

export const Article = ({
  lang,
  record,
  mdxSource,
}: {
  lang: SupportedLang;
  record: RecordModel;
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
}) => {
  return (
    <ReferenceProvider>
      <article className="prose lg:prose-lg prose-headings:text-primary prose-p:text-primary-prose prose-p:text-justify prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-sm prose-blockquote:border-border prose-li:text-primary-prose container mx-auto py-20">
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
        <Bibliography lang={lang}>
          <MDXClient source={mdxSource} />
        </Bibliography>
      </article>
    </ReferenceProvider>
  );
};
