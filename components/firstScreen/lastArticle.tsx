import Link from "next/link";
import { RecordModel } from "pocketbase";

export default function LastArticle({
  lastArticle,
}: {
  lastArticle: { record: RecordModel; title: string };
}) {
  return (
    <div className="flex -translate-y-2 flex-col items-start justify-end pl-1 text-sm font-normal md:pl-2 md:text-lg">
      <span className="">/blog/</span>
      <Link
        href={`/section/record/en/blog/${lastArticle.record.slug}`}
        className="transition-all duration-100 ease-in-out hover:font-semibold"
      >
        {lastArticle.title}
      </Link>
    </div>
  );
}
