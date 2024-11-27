import pb from "@/lib/pocketbase";

const PATH_SVG_MAKER = process.env.PATH_SVG_MAKER;
const PATH_SVG_MAKER_KEY = process.env.PATH_SVG_MAKER_KEY;

export default async function fetchBooksInfo() {
  try {
    const audioBooks: BooksRecord = require("@/app/section/record/books/audioBooks.json");
    const paperBooks: BooksRecord = require("@/app/section/record/books/paperBooks.json");
    const mergedBooks = mergeBooksRecords(audioBooks, paperBooks);
    const years = Object.keys(mergedBooks);
    const yearBookDetails = await Promise.all(
      years.map((year) => fetchBookDetails(year, mergedBooks[year]))
    );
    return yearBookDetails;
  } catch (error) {
    console.error("Error in fetchBooksInfo:", error);
    throw error;
  }
}

function mergeBooksRecords(
  audioBooks: BooksRecord,
  paperBooks: BooksRecord
): BooksRecord {
  const mergedBooks: BooksRecord = {};
  const allYears = new Set([
    ...Object.keys(audioBooks),
    ...Object.keys(paperBooks),
  ]);

  allYears.forEach((year) => {
    mergedBooks[year] = [
      ...(audioBooks[year] || []).map((book) => ({
        ...book,
        type: "audiobook",
      })),
      ...(paperBooks[year] || []).map((book) => ({ ...book, type: "paper" })),
    ];
  });

  return mergedBooks;
}

async function fetchBookDetails(year: string, books: any[]) {
  const bookDetailsPromises = books.map(async (book) => {
    let bookInfo = await getBookRecordWithISBN_13(book.ISBN13);

    if (bookInfo) {
      //console.log(`Book found in database: ${bookInfo.title}`);
    } else {
      console.log(`Book not found in database: ${book.title}`);
    }

    const notes = await getNotes(book.ISBN13);

    return {
      bookInfo: bookInfo || {},
      note: notes,
      type: book.type || "unknown",
      altNotes: book.altNotes || "",
      translatedNotes: book.translatedNotes || "",
      month: book.month || 0,
    };
  });
  const bookDetails = await Promise.all(bookDetailsPromises);

  return { year, bookDetails };
}

async function getBookRecordWithISBN_13(isbn: number): Promise<any | null> {
  try {
    const res = await pb
      .collection("books_info")
      .getFirstListItem(`ISBN_13="${isbn}"`, { requestKey: null });
    return res;
  } catch (error) {
    console.log("No book info found in the database:", isbn);
    console.log("Error:", error);
    return null;
  }
}

async function getNotes(isbn: number) {
  if (!PATH_SVG_MAKER || !PATH_SVG_MAKER_KEY) {
    console.error("SVG Maker environment variables are not set");
    return [];
  }

  try {
    const metadataUrl = `${PATH_SVG_MAKER}/book/getBookMetadata?isbn=${isbn}&key=${PATH_SVG_MAKER_KEY}`;
    const metadataRes = await fetch(metadataUrl, {
      next: { revalidate: 3600 },
    });
    if (!metadataRes.ok) return [];

    const svgMetadata = await metadataRes.json();
    const numberPages = svgMetadata.pages;
    if (!numberPages) return [];

    const notes = await Promise.all(
      Array.from({ length: numberPages }, async (_, i) => {
        const name = `page.${i + 1}.svg`;
        const url = `${PATH_SVG_MAKER}/svg/${isbn}/${name}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const svg = await res.text();
        return { name, svg };
      })
    );

    return notes.filter(Boolean);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}
