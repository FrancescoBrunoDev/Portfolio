import BooksView from "@/components/books/booksView";
import { fetchBooks } from "@/components/books/fetchBooks";
import { Suspense } from "react";
import { BookCopy, FireExtinguisher } from "lucide-react";

export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books | Francesco Bruno",
  description: "A collection of books I've read over the years.",
};

async function View() {
  const data: Book.Year[] = await fetchBooks();

  if ("error" in data) return <Error />;

  return <BooksView booksFetch={data} />;
}

function LoadingBooks() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BookCopy className="stroke-primary h-24 w-24 animate-pulse stroke-[2.5]" />
        <h2 className="text-primary w-44 text-center text-xl">
          Just a tick, I'll grab the books from the shelves.
        </h2>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <FireExtinguisher className="stroke-primary h-24 w-24 stroke-[2.5]" />
        <h2 className="text-primary w-44 text-center text-xl">
          Oops! Something went wrong. Please try again later.
        </h2>
      </div>
    </div>
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<LoadingBooks />}>
      <View />;
    </Suspense>
  );
}
