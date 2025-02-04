"use client";

import BookItem from "@/components/books/item";
import SearchBox from "@/components/books/searchBox";
import { useState, useMemo, memo } from "react";
import { FixedSizeList as List } from "react-window";

// Memoize BookItem component
const MemoizedBookItem = memo(BookItem);

// Memoize the year section component
const YearSection = memo(
  ({ year, isFiltering }: { year: Book.Year; isFiltering: boolean }) => {
    // Group books by month - memoized to prevent recalculation
    const booksByMonth = useMemo(() => {
      return Object.entries<Book.Book[]>(
        year.bookDetails.reduce((acc: any, book: Book.Book) => {
          const month = book.month;
          if (!acc[month]) {
            acc[month] = [] as Book.Book[];
          }
          acc[month].push(book);
          return acc;
        }, []),
      ).reverse();
    }, [year.bookDetails]);

    return (
      <div className="no-scrollbar h-full flex-row content-stretch items-center gap-4 overflow-x-scroll">
        <div className="h-full">
          <div className="flex h-fit flex-col md:flex-row">
            <div className="relative flex h-auto items-center gap-2 pr-10 text-4xl font-semibold uppercase md:w-28 lg:w-[23rem] lg:text-8xl">
              {year.year}{" "}
              <span className="text-xs lowercase md:absolute md:bottom-4 md:text-sm">
                {year.bookDetails.length}{" "}
                {year.bookDetails.length === 1 ? "book" : "books"}{" "}
                {isFiltering ? "filtered" : "read"}
              </span>
            </div>
            <div className="flex h-full w-full gap-2 overflow-x-auto pb-4 lg:h-full">
              {booksByMonth.map(([month, booksInMonth]) => (
                <MonthSection
                  key={`${year.year}-${month}`}
                  month={parseInt(month)}
                  books={booksInMonth}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

// Memoize the month section component
const MonthSection = memo(
  ({ month, books }: { month: number; books: Book.Book[] }) => {
    return (
      <div className="flex flex-col pl-1">
        <h2 className="sticky left-0 h-6 w-fit">{getMonthName(month)}</h2>
        <div className="flex flex-row gap-2">
          {books.map((book) => {
            if (!book.expand?.book_info) return null;
            return <MemoizedBookItem key={book.id} book={book} />;
          })}
        </div>
      </div>
    );
  },
);

function getMonthName(month: number) {
  const monthNames = [
    "🤷",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "🔖 Currently Reading",
  ];
  return monthNames[month];
}

export default function BooksView({ booksFetch }: { booksFetch: Book.Year[] }) {
  const [filteredData, setFilteredData] = useState<Book.Year[]>(booksFetch);
  const [isFiltering, setIsFiltering] = useState(false);

  // Memoize sorted years
  const sortedYears = useMemo(() => {
    return Object.values(filteredData).sort((a, b) => b.year - a.year);
  }, [filteredData]);

  return (
    <div className="no-scrollbar text-primary h-screen w-screen items-center overflow-x-hidden overscroll-x-contain pt-32">
      <SearchBox
        books={booksFetch}
        setFilteredData={setFilteredData}
        setIsFiltering={setIsFiltering}
      />
      <div className="container grid w-full gap-2 py-8">
        <List
          height={800} // Adjust based on your needs
          itemCount={sortedYears.length}
          itemSize={300} // Adjust based on your item height
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>
              <YearSection
                year={sortedYears[index]}
                isFiltering={isFiltering}
              />
            </div>
          )}
        </List>
      </div>
    </div>
  );
}
