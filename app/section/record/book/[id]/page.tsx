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

  if ("error" in result) {
    console.error(result.error);
    return null;
  }

  const book: any = result;
  if (!book || !book.expand) return null;

  const note = book.note || [];

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Link href={`/section/record/books`}>
        <Button className="text-md flex items-center">
          <ArrowLeft />
          Back to the my library
        </Button>
      </Link>
      <ModalInfoBook book={book} note={note} isClosable={false} />
    </div>
  );
}
