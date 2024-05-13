export default async function fetchBooksInfo() {
  try {
    const audioBooks: BooksRecord = require("@/app/section/record/books/audioBooks.json");
    const paperBooks: BooksRecord = require("@/app/section/record/books/paperBooks.json");

    const mergedBooks: BooksRecord = {};

    for (const year in audioBooks) {
      if (audioBooks.hasOwnProperty(year) && paperBooks.hasOwnProperty(year)) {
        mergedBooks[year] = [
          ...audioBooks[year].map((book) => ({ ...book, type: "audiobook" })),
          ...paperBooks[year].map((book) => ({ ...book, type: "paper" })),
        ];
      } else if (audioBooks.hasOwnProperty(year)) {
        mergedBooks[year] = audioBooks[year].map((book) => ({
          ...book,
          type: "audiobook",
        }));
      } else if (paperBooks.hasOwnProperty(year)) {
        mergedBooks[year] = paperBooks[year].map((book) => ({
          ...book,
          type: "paper",
        }));
      }
    }

    const years = Object.keys(mergedBooks);

    const fetchBookDetails = async (year: string) => {
      const urlBase = "https://www.googleapis.com/books/v1/volumes"
      let booksArray = mergedBooks[year];
      const bookDetailPromises = booksArray.map(async (book) => {
        const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
        const res = await fetch(
          `${urlBase}?q=isbn:${book.ISBN13}&key=${GOOGLE_BOOKS_API_KEY}`, { next: { revalidate: 43200 } } // cache for 12 hours
        );
        console.log(res);
        const product = await res.json();
        let bookInfo = product.items?.[0]?.volumeInfo;
        if (!bookInfo) console.log("No book info found for", book.ISBN13);
        const notes = await getNotes(book.ISBN13);
        return {
          bookInfo: {
            title: bookInfo?.title || book.title || "unknown",
            authors: bookInfo?.authors || book.authors || ["unknown"],
            imageLinks: bookInfo?.imageLinks || {
              thumbnail: "",
            },
            industryIdentifiers: bookInfo?.industryIdentifiers || [
              { type: "ISBN", identifier: book.ISBN13 },
            ],
            categories: bookInfo?.categories || book.categories || [],
            publishedDate:
              bookInfo?.publishedDate.substring(0, 4) ||
              book.publishedDate?.substring(0, 4) ||
              "unknown",
            pageCount: bookInfo?.pageCount || book.pageCount || "unknown",
            language: bookInfo?.language || book.language || "unknown",
            infoLink: bookInfo?.infoLink || book.infoLink || "unknown",
          },
          note: notes,
          type: book.type || "unknown",
          altNotes: book.altNotes || "",
          tranlatedNotes: book.tranlatedNotes || "",
          month: book.month || 0,
        };
      });
      const bookDetails = await Promise.all(bookDetailPromises);
      return { year, bookDetails };
    };

    // Use Promise.all to fetch details for all years concurrently
    const yearDetailPromises = years.map((year) => fetchBookDetails(year));

    const yearBookDetails = await Promise.all(yearDetailPromises);

    return yearBookDetails;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const getNotes = async (isbn: number) => {
  const urlBase = process.env.PATH_SVG_MAKER;
  const res = await fetch(`${urlBase}/book/getBookMetadata?isbn=${isbn}&key=${process.env.PATH_SVG_MAKER_KEY}`, { next: { revalidate: 3600 } }); // 3600 = 1 hour
  if (res.ok) {
    const svgMetadata = await res.json();
    const numberPages = svgMetadata.pages;
    if (numberPages) {
      const notes = [];
      for (let i = 1; i <= numberPages; i++) {
        const name = `page.${i}.svg`;
        const url = `${urlBase}/svg/${isbn}/${name}`;
        const res = await fetch(url, { next: { revalidate: 3600 } }); // 3600 = 1 hour
        if (res.ok) {
          const svg = await res.text();
          notes.push({ name, svg });
        }
      }
      return notes;
    }
  } else {
    return [];
  }
}
