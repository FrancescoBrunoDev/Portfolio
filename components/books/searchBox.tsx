import { Book } from "lucide-react";

export default function SearchBox({ books, setFilteredData, setIsFiltering }) {
  function handleInput(event) {
    const input = event.target.value;
    const filteredData = books
      .map((year) => {
        const filteredBookDetails = year.bookDetails.filter((book) => {
          return (
            book.bookInfo.title.toLowerCase().includes(input) ||
            book.bookInfo.authors[0].toLowerCase().includes(input)
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
    setFilteredData(filteredData);
    if (input.length > 0) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-32 items-end justify-center bg-background pb-4">
      <div className="flex h-8 w-64 items-center gap-1  bg-transparent">
        <Book strokeWidth={2.75} className="h-full w-fit text-primary" />
        <span className="text-3xl">/</span>
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
