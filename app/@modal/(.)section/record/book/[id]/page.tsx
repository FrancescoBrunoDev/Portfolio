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

  const book = result;
  if (!book || !book.expand) return null;

  const infoBooks = book.expand.book_info;
  const note = book.note || [];
  const type = book.type;
  const altNotes = book.altNotes;
  const tranlatedNotes = book.tranlatedNotes;
  const titleParts = infoBooks.title?.match(/[^.!]+[.!]?/g) || [];

  return (
    <div className="fixed inset-0 z-40 flex h-screen w-screen items-center justify-center backdrop-grayscale">
      <ModalInfoBook
        book={book}
        titleParts={titleParts}
        note={note}
        type={type}
        altNotes={altNotes}
        tranlatedNotes={tranlatedNotes}
        isClosable={true}
      />
    </div>
  );
}
