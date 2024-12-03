import pb from "@/lib/pocketbase";

const PATH_SVG_MAKER = process.env.PATH_SVG_MAKER;
const PATH_SVG_MAKER_KEY = process.env.PATH_SVG_MAKER_KEY;

export async function fetchBookInfo(id: string) {
  try {
    if (!pb) {
      throw new Error("PocketBase instance is not available");
    }

    const book = await pb.collection("books_info").getOne(id);
    return book;
  } catch (error) {
    console.error("Error in fetchBookInfo:", error);
    return { error: "Failed to fetch book information. Please try again later." };
  }
}

export async function fetchBook(id: string) {
  try {
    if (!pb) {
      throw new Error("PocketBase instance is not available");
    }

    const book = await pb.collection("books").getOne(id, {
      expand: "book_info",
    });
    // Fetch notes for the book
    if (!book || !book.expand) return book;

    if (book.expand.book_info?.ISBN_13) {
      const notes = await getNotes(book.expand.book_info.ISBN_13);
      book.note = notes;
    }
    return book;
  } catch (error) {
    console.error("Error in fetchBook:", error);
    return { error: "Failed to fetch book information. Please try again later." };
  }
}

export async function fetchBooks() {
  try {

    if (!pb) {
      throw new Error("PocketBase instance is not available");
    }

    const dbBooks = await pb.collection("books").getFullList({
      expand: "book_info",
      fields: "id,month,year,expand.book_info.title,expand.book_info.authors,expand.book_info.ISBN_13",
    });

    // Prima raggruppa i libri per anno
    const groupedBooks = dbBooks.reduce<{
      [key: string]: { year: string; bookDetails: any[] };
    }>((acc, book) => {
      const year = book.year || "🤷";
      if (!acc[year]) {
        acc[year] = { year, bookDetails: [] };
      }
      acc[year].bookDetails.push(book);
      return acc;
    }, {});

    // Poi ottieni le note in parallelo per ogni libro
    const enrichedBooks = await Promise.all(
      Object.entries(groupedBooks).map(async ([year, yearData]) => {
        const enrichedDetails = await Promise.all(
          yearData.bookDetails.map(async (book) => {
            const note = await getNotes(book.expand.book_info?.ISBN_13);
            return { ...book, note };
          })
        );
        return [year, { ...yearData, bookDetails: enrichedDetails }];
      })
    );

    return Object.fromEntries(enrichedBooks);
  } catch (error) {
    console.error("Error in fetchBooksInfo:", error);
    return { error: "Failed to fetch books information. Please try again later." };
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
