import ModalInfoBook from "@/components/books/modalInfoBook";
import { fetchBook } from "@/components/books/fetchBooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function View({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const result = await fetchBook((await params).id);

  if ('error' in result) {
    console.error(result.error);
    return null;
  }

  const book = result;
  if (!book || !book.expand) return null;

  const infoBooks = book.expand.book_info;
  const note = book.note || [];
  const type = book.type;
  const altNotes = book.altNotes;
  const tranlatedNotes = book.tranlatedNotes;
  const titleParts = infoBooks.title?.match(/[^.!]+[.!]?/g) || [];

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <ModalInfoBook
        book={book}
        titleParts={titleParts}
        note={note}
        type={type}
        altNotes={altNotes}
        tranlatedNotes={tranlatedNotes}
        isClosable={false}
      />
      <Link href={`/section/record/books`}>
        <Button className=" text-md flex items-center"><ArrowLeft />Back to the my library</Button>
      </Link>
    </div>
  );
}
