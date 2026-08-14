import pb from "@/lib/pocketbase";

export async function fetchBook(id: string) {
  try {
    const book = await pb.collection("books").getOne(id, {
      expand: "book_info,book_note",
      requestKey: null,
    });

    if (!book || !book.expand) return book;

    if (book.expand.book_note) {
      // Convert all the SVGs to URLs, then download their text content.
      const noteUrls = book.expand.book_note?.svg.map((svg: string) =>
        pb.files.getURL(book.expand?.book_note, svg),
      );
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

export async function fetchBooks(): Promise<Book.Year[] | { error: string }> {
  try {
    const dbBooks = await pb.collection("books").getFullList({
      expand: "book_info,book_note",
      fields:
        "id,month,year,expand.book_info.title,expand.book_info.authors,expand.book_info.ISBN_13,expand.book_note.metadata",
      requestKey: null,
    });

    // Group books by year, preserving the fetched order within each year.
    const grouped = new Map<number | string, Book.Year>();
    for (const book of dbBooks) {
      const year = book.year ?? "🤷";
      let group = grouped.get(year);
      if (!group) {
        group = { year, bookDetails: [] };
        grouped.set(year, group);
      }
      const note = book.expand?.book_note?.metadata || false;
      group.bookDetails.push({ ...book, note } as Book.Book);
    }

    return Array.from(grouped.values());
  } catch (error) {
    console.error("Error in fetchBooks:", error);
    return { error: "Failed to fetch books. Please try again later." };
  }
}
