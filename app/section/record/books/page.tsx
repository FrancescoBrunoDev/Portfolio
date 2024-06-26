import BooksView from "@/components/books/booksView";
import fetchBooksInfo from "@/components/books/fetchBooksInfo";
import { Suspense } from 'react';
import { BookCopy } from "lucide-react";

async function View() {
  const data = await fetchBooksInfo();
  return <BooksView booksFetch={data} />;
}

function LoadingBooks() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BookCopy className="h-24 w-24 stroke-primary stroke-[2.5] animate-pulse" />
        <h2 className="text-center w-44 text-xl text-primary">
          Just a tick, I'll grab the books from the shelves.
        </h2>
      </div>
    </div>
  )
}

export default async function Page() {
  return (
    <Suspense fallback={<LoadingBooks />}>
      <View />;
    </Suspense>)
}
