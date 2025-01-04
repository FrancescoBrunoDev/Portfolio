import ModalInfoBook from "@/components/books/modalInfoBook";
import { fetchBook, getFormatVariants } from "@/components/books/fetchBooks";

type Props = {
  params: Promise<{ id: string }>;
};

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
    <div className="fixed inset-x-3 inset-y-0 z-40 flex items-center justify-center backdrop-grayscale">
      <ModalInfoBook
        book={book}
        note={note}
        isClosable={true}
        randomVariant={randomVariant}
      />
    </div>
  );
}
