"use client";

import BookItem from "@/components/books/item";
import SearchBox from "@/components/books/searchBox";
import { useState } from "react";

export default function BooksView({ booksFetch }: { booksFetch: Book.Year[] }) {
  const books = booksFetch;

  const [filteredData, setFilteredData] = useState<Book.Year[]>(books);
  const [isFiltering, setIsFiltering] = useState(false);

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

  return (
    <div className="no-scrollbar h-screen w-screen items-center overflow-x-hidden overscroll-x-contain pt-32 text-primary">
      <SearchBox
        books={books}
        setFilteredData={setFilteredData}
        setIsFiltering={setIsFiltering}
      />
      <div className="container grid w-full gap-2 py-8">
        {Object.values(filteredData)
          .sort((a, b) => b.year - a.year)
          .map((year) => {
            return (
              <div
                key={year.year}
                className="no-scrollbar h-full flex-row content-stretch items-center gap-4 overflow-x-scroll"
              >
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
                      {Object.entries<Book.Book[]>(
                        year.bookDetails
                          .slice()
                          .reduce((acc: any, book: Book.Book) => {
                            const month = book.month;
                            if (!acc[month]) {
                              acc[month] = [] as Book.Book[];
                            }
                            acc[month].push(book);
                            return acc;
                          }, []),
                      )
                        .reverse()
                        .map(([month, booksInMonth]) => {
                          const monthNum = parseInt(month);
                          return (
                            <div
                              key={`${year.year}-${month}`}
                              className="flex flex-col pl-1"
                            >
                              <h2 className="sticky left-0 h-6 w-fit">
                                {getMonthName(monthNum)}
                              </h2>{" "}
                              <div key={month} className="flex flex-row gap-2">
                                {booksInMonth.map((book) => {
                                  if (!book.expand?.book_info) {
                                    return null;
                                  }

                                  return <BookItem key={book.id} book={book} />;
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
