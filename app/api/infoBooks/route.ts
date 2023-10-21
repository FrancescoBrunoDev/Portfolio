import books from "@/app/section/record/books/books.json";

export async function GET() {
  // Assuming the 'books' object contains data for multiple years
  const years = Object.keys(books);

  // Define an async function to fetch book details
  async function fetchBookDetails(year) {
    const booksArray = books[year];
    const bookDetailPromises = booksArray.map(async (book) => {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN13}`);
      const product = await res.json();
      return product;
    });
    const bookDetails = await Promise.all(bookDetailPromises);
    return { year, bookDetails };
  }

  // Use Promise.all to fetch details for all years concurrently
  const yearDetailPromises = years.map(fetchBookDetails);
  const yearBookDetails = await Promise.all(yearDetailPromises);

  return Response.json(yearBookDetails);
}