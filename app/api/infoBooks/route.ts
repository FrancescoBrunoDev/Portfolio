import { NextResponse } from 'next/server'

export async function GET() {
  // Assuming the 'books' object contains data for multiple years

  // Define an async function to fetch book details
  type Book = {
    title: string;
    month: number;
    notes: string;
    ISBN13: number;
  };

  type BooksRecord = Record<string, Book[]>;

  const books: BooksRecord = require("@/app/section/record/books/books.json");
  const years = Object.keys(books);

  async function fetchBookDetails(year: string) {
    const booksArray = books[year];
    const bookDetailPromises = booksArray.map(async (book) => {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN13}`
      );
      const product = await res.json();
      console.log(product.items[0].volumeInfo);
      return {
        bookInfo: product.items[0].volumeInfo,
        note: book.notes,
      };
    });
    const bookDetails = await Promise.all(bookDetailPromises);
    return { year, bookDetails };
  }

  // Use Promise.all to fetch details for all years concurrently
  const yearDetailPromises = years.map(fetchBookDetails);
  const yearBookDetails = await Promise.all(yearDetailPromises);

  return NextResponse.json(yearBookDetails);
}
