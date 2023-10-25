"use client";

import BookItem from "@/components/books/item";
import SearchBox from "@/components/books/searchBox";
import { useState, useEffect } from "react";

async function getData() {
  const res = await fetch(`/api/infoBooks`);
  console.log(res);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Books() {
  const [books, setBooks] = useState<Year[]>([]);
  const [filteredData, setFilteredData] = useState<Year[]>(books);
  const [isFiltering, setIsFiltering] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setBooks(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
    ];
    return monthNames[month];
  }

  return (
    <div className="no-scrollbar h-screen w-screen items-center overflow-x-hidden pt-32 text-primary">
      <SearchBox
        books={books}
        setFilteredData={setFilteredData}
        setIsFiltering={setIsFiltering}
      />
      <div className="container grid w-full gap-2 py-8">
        {filteredData
          .sort((a, b) => b.year - a.year)
          .map((year) => {
            console.log(year);
            return (
              <div className=" no-scrollbar h-full flex-row content-stretch items-center gap-4 overflow-x-scroll">
                <div key={year.year} className="h-full">
                  <div className="flex h-fit flex-col gap-2 md:flex-row">
                    <div className="relative flex h-auto items-center gap-2 pr-10 text-4xl font-semibold uppercase lg:w-60 lg:text-8xl">
                      {year.year}{" "}
                      <span className="text-xs lowercase md:absolute md:bottom-4 md:text-sm">
                        {year.bookDetails.length}{" "}
                        {year.bookDetails.length === 1 ? "book" : "books"}{" "}
                        {isFiltering ? "filtered" : "read"}
                      </span>
                    </div>
                    <div className="flex h-full w-full gap-2 overflow-x-auto pb-4 lg:h-full">
                      {Object.entries<BookDetails[]>(
                        year.bookDetails
                          .slice()
                          .reduce((acc: any, book: BookDetails) => {
                            const month = book.month;
                            if (!acc[month]) {
                              acc[month] = [] as BookDetails[];
                            }
                            acc[month].push(book);
                            return acc;
                          }, [])
                      )
                        .reverse()
                        .map(([month, booksInMonth]) => {
                          const monthNum = parseInt(month);
                          return (
                            <div className="flex flex-col">
                              <h2 className="h-6">{getMonthName(monthNum)}</h2>{" "}
                              <div key={month} className="flex flex-row gap-2">
                                {booksInMonth.map((book) => (
                                  <BookItem
                                    key={
                                      book.bookInfo.industryIdentifiers[0]
                                        .identifier
                                    }
                                    item={book}
                                  />
                                ))}
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
