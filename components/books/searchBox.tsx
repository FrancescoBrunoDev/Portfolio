import { Book } from "lucide-react";
import { FormEvent } from "react";

interface SearchBoxProps {
  books: Book.Year[];
  setFilteredData: React.Dispatch<React.SetStateAction<Book.Year[]>>;
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchBox({
  books,
  setFilteredData,
  setIsFiltering,
}: SearchBoxProps) {
  function handleInput(event: FormEvent<HTMLInputElement>) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const filteredData = books
      .map((year) => {
        const filteredBookDetails = year.bookDetails.filter(({ expand }) => {
          return (
            expand.book_info?.title?.toLowerCase().includes(input) ||
            (Array.isArray(expand.book_info?.authors) &&
              expand.book_info.authors[0]?.toLowerCase().includes(input))
          );
        });

        if (filteredBookDetails.length > 0) {
          return { ...year, bookDetails: filteredBookDetails };
        }
        return null;
      })
      .filter((year): year is Book.Year => year !== null);

    setFilteredData(filteredData);
    setIsFiltering(input.length > 0);
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-32 items-end justify-center bg-background pb-4">
      <div className="flex h-8 w-64 items-center gap-1 bg-transparent">
        <Book strokeWidth={2.75} className="h-full w-fit text-primary" />
        <span className="text-2xl">/</span>
        <input
          className="h-full w-full border-b-[2.75px] border-primary bg-transparent px-1 font-semibold placeholder:invisible placeholder:text-primary/50 focus:outline-hidden"
          type="text"
          placeholder="Search"
          onInput={handleInput}
        />
      </div>
    </div>
  );
}
