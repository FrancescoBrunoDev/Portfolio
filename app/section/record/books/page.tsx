import BooksView from "@/components/books/booksView";
import fetchBooksInfo from "@/components/books/fetchBooksInfo";

export default async function Page() {
  const data = await fetchBooksInfo();
  return <BooksView booksFetch={data} />;
}
