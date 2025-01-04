import ModalInfoBook from "@/components/books/modalInfoBook";
import { fetchBook, getFormatVariants } from "@/components/books/fetchBooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const record = await fetchBook((await params).id);

  if ("error" in record) {
    console.error(record.error);
    return {
      title: "not found",
    };
  }
  console.log(record);
  const previusTitle = (await parent).title;
  return {
    title: `${record.expand?.book_info.title}  ${previusTitle && " | " + previusTitle?.absolute}`,
    description: record.description,
  };
}

export default async function View({ params }: Props) {
  const result = await fetchBook((await params).id);

  if ("error" in result) {
    console.error(result.error);
    return null;
  }

  const book: any = result;
  if (!book || !book.expand) return null;

  const note = book.note || [];
  const randomVariant = await getFormatVariants({ type: book.type });

  return (
    <div className="fixed inset-x-3 bottom-0 top-10 flex flex-col items-center justify-center gap-4 md:inset-y-0">
      <Link href={`/section/record/books`}>
        <Button className="text-md flex items-center">
          <ArrowLeft />
          Back to my library
        </Button>
      </Link>
      <ModalInfoBook
        book={book}
        note={note}
        isClosable={false}
        randomVariant={randomVariant}
      />
    </div>
  );
}
