"use client";

import BookItem from "@/components/books/item";
import SearchBox from "@/components/books/searchBox";
import { useState, useEffect } from "react";

async function getData() {
  const res = await fetch("/api/infoBooks");

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

  return (
    <div className="h-screen w-screen items-center pt-32 text-primary">
      <SearchBox
        books={books}
        setFilteredData={setFilteredData}
        setIsFiltering={setIsFiltering}
      />
      <div className="container grid w-full gap-2 py-8">
        {filteredData
          .sort((a, b) => b.year - a.year)
          .map((year) => {
            return (
              <div className=" h-full flex-row content-stretch items-center gap-4 overflow-x-scroll">
                <div key={year.year} className="h-full">
                  <div className="flex h-fit gap-2">
                    <div className="relative flex h-auto w-60 items-center pr-10 text-8xl font-semibold uppercase">
                      {year.year}{" "}
                      <span className="absolute bottom-4 text-sm lowercase">
                        {year.bookDetails.length}{" "}
                        {year.bookDetails.length === 1 ? "book" : "books"}{" "}
                        {isFiltering ? "filtered" : "read"}
                      </span>
                    </div>
                    <div className="flex h-full w-full gap-2 overflow-x-scroll pb-4 lg:h-full">
                      {year.bookDetails.map((book) => (
                        <BookItem
                          key={book.bookInfo.industryIdentifiers[0].identifier}
                          item={book.bookInfo}
                        />
                      ))}
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
