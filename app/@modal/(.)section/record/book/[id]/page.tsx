import ModalInfoBook from "@/components/books/modalInfoBook";
import { fetchBook } from "@/components/books/fetchBooks";

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
    <div className="fixed inset-0 z-40 flex h-screen w-screen items-center justify-center backdrop-grayscale">
      <ModalInfoBook book={book} note={note} isClosable={true} />
    </div>
  );
}
