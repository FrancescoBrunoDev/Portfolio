import ModalInfoBook from "@/components/books/modalInfoBook";
import { fetchBook, getFormatVariants } from "@/components/books/fetchBooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function View({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <div className="fixed inset-x-3 inset-y-0 flex flex-col items-center justify-center gap-4">
      <Link href={`/section/record/books`}>
        <Button className="text-md flex items-center">
          <ArrowLeft />
          Back to the my library
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
