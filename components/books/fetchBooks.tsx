import pb from "@/lib/pocketbase";

export async function fetchBook(id: string) {
  try {
    if (!pb) {
      throw new Error("PocketBase instance is not available");
    }

    const book = await pb.collection("books").getOne(id, {
      expand: "book_info,book_note",
      requestKey: null,
    });
    // Fetch notes for the book
    if (!book || !book.expand) return book;

    if (book.expand.book_note) {
      // First, convert all the SVGs to URLs using pb.files.getURL
      const noteUrls = book.expand.book_note?.svg.map((svg: string) =>
        pb.files.getURL(book.expand?.book_note, svg),
      );
      // Scarica gli SVG come testo
      const notes = await Promise.all(
        noteUrls.map(async (url: string) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch SVG from ${url}`);
          }
          const svgText = await response.text();
          return { svg: svgText };
        }),
      );

      book.note = notes;
    }
    return book;
  } catch (error) {
    console.error("Error in fetchBook:", error);
    return {
      error: "Failed to fetch book information. Please try again later.",
    };
  }
}

export async function fetchBooks() {
  if (!pb) {
    throw new Error("PocketBase instance is not available");
  }

  const dbBooks = await pb.collection("books").getFullList({
    expand: "book_info,book_note",
    fields:
      "id,month,year,expand.book_info.title,expand.book_info.authors,expand.book_info.ISBN_13,expand.book_note.metadata",
    requestKey: null,
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
          // it boolean
          const note = book.expand?.book_note?.metadata || false;
          return { ...book, note };
        }),
      );
      return [year, { ...yearData, bookDetails: enrichedDetails }];
    }),
  );

  return Object.fromEntries(enrichedBooks);
}
