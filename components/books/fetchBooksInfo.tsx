import pb from "@/lib/pocketbase";

const PATH_SVG_MAKER = process.env.PATH_SVG_MAKER;
const PATH_SVG_MAKER_KEY = process.env.PATH_SVG_MAKER_KEY;

export default async function fetchBooksInfo() {
  try {
    const dbBooks = await pb.collection("books").getFullList({
      expand: "books_info",
    });
    return await groupPerYear(dbBooks);
  } catch (error) {
    console.error("Error in fetchBooksInfo:", error);
    throw error;
  }
}

async function groupPerYear(dbbooks: any[]) {
  const books = await dbbooks.reduce(async (promise, book) => {
    const acc = await promise;
    let enrichedBook = moveBooksInfoOutOfExpand(book);
    const notes = await getNotes(book.ISBN_13);
    console.log(notes);

    const year = book.year || "🤷";
    if (!acc[year]) {
      acc[year] = { year, bookDetails: [], note: notes };
    }
    acc[year].bookDetails.push(enrichedBook);
    return acc;
  }, Promise.resolve({}));

  return books;
}

function moveBooksInfoOutOfExpand(book: any) {
  const bookInfo = book.expand?.books_info;
  delete book.books_info;
  delete book.expand;
  return { ...book, bookInfo };
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
