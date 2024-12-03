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
    const input = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    const filteredData = Object.values(books)
      .map((year) => {
        const filteredBookDetails = year.bookDetails.filter(({ expand }) => {
          return (
            expand.book_info?.title?.toLocaleLowerCase().includes(input) ||
            (Array.isArray(expand.book_info?.authors) &&
              expand.book_info.authors[0]?.toLocaleLowerCase().includes(input))
          );
        });

        if (filteredBookDetails.length > 0) {
          // Include the year if it has matching book details
          return { ...year, bookDetails: filteredBookDetails };
        } else {
          // Exclude the year if it has no matching book details
          return null;
        }
      })
      .filter((year) => year !== null);

    setFilteredData(
      filteredData.filter((year) => year !== null) as Book.Year[],
    );

    if (input.length > 0) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-32 items-end justify-center bg-background pb-4">
      <div className="flex h-8 w-64 items-center gap-1 bg-transparent">
        <Book strokeWidth={2.75} className="h-full w-fit text-primary" />
        <span className="text-2xl">/</span>
        <input
          className="h-full w-full border-b-[3px] border-primary bg-transparent px-1 font-semibold placeholder:invisible focus:outline-none"
          type="text"
          placeholder="Search"
          onInput={handleInput}
        />
      </div>
    </div>
  );
}
