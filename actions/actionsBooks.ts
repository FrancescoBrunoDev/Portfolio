"use server";

import { databases } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import paperBooks from "@/app/section/record/books/paperBooks.json";
import audioBooks from "@/app/section/record/books/audioBooks.json";

const urlBase = "https://www.googleapis.com/books/v1/volumes";

export async function getBooksFromGoogleApi(
  searchInput: number | string,
  type: any
) {
  const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const res = await fetch(
    `${urlBase}?q=${type}:${searchInput}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=40`
  );
  const books = await res.json();

  return books.items;
}

async function getBookFromGoogleApi(ISBN13: string) {
  const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const res = await fetch(
    `${urlBase}?q=isbn:${ISBN13}&key=${GOOGLE_BOOKS_API_KEY}`
  );
  const book = await res.json();

  return book.items;
}

export async function syncFormJson({ syncType }: { syncType: TypeOfBook }) {
  let booksJson: BooksRecord = {};
  if (syncType === "paper") {
    booksJson = paperBooks;
  } else if (syncType === "audio") {
    booksJson = audioBooks;
  }

  for (const [year, books] of Object.entries(booksJson)) {
    for (const book of books) {
      try {
        const res = await getBookFromGoogleApi(book.ISBN13.toString());
        // Utilizza solo il primo risultato
        const item = res[0];
        let isFinished = false;
        let finished_date = null;
        if (item) {
          // Se month è uguale a 13 o mancante, significa che non è finito
          isFinished = book?.month === 13 || book?.month == null ? false : true;
          // Aggiungi a item il parametro finished_date se il libro è finito
          if (isFinished && book.month) {
            finished_date = new Date(parseInt(year), book.month - 1, 15);
          }

          await addBookToDatabase({
            item,
            finished_date,
            enjoied_as: syncType,
            isFinished,
          });
        }
      } catch (error) {
        console.error(
          `Errore durante la sincronizzazione del libro: ${book.title}`,
          error
        );
      }
    }
  }
}

function createBookID(industryIdentifiers: GoogleBooksIndustryIdentifier[]) {
  let IDcode = "";
  if (industryIdentifiers.find((identifier) => identifier.type === "ISBN_13")) {
    IDcode =
      industryIdentifiers.find((identifier) => identifier.type === "ISBN_13")
        ?.identifier ?? "";
  } else if (
    industryIdentifiers.find((identifier) => identifier.type === "ISBN_10")
  ) {
    IDcode =
      industryIdentifiers.find((identifier) => identifier.type === "ISBN_10")
        ?.identifier ?? "";
  } else {
    IDcode =
      industryIdentifiers.find((identifier) => identifier.type === "OTHER")
        ?.identifier ?? "";
    // Prima rimuovi tutti i caratteri non validi, inclusi i ":"
    IDcode = IDcode.replace(/[^a-zA-Z0-9.-_]/g, "");

    // Poi assicurati che non inizi con un carattere speciale (. - _)
    IDcode = IDcode.replace(/^[.-_]+/, "");

    // Infine, tronca a 36 caratteri se necessario
    if (IDcode.length > 36) {
      IDcode = IDcode.substring(0, 36);
    }
  }

  return IDcode;
}

export async function addBookToDatabase({
  item,
  finished_date,
  isFinished,
  enjoied_as,
}: {
  item: GoogleBooksVolume;
  finished_date: Date | null;
  isFinished: boolean;
  enjoied_as: TypeOfBook;
}) {
  const volumeInfo = item.volumeInfo;
  let industryIdentifiers, authorsList, categoriesList;

  if (volumeInfo.industryIdentifiers) {
    industryIdentifiers = await handleIndustryIdentifiers(
      volumeInfo.industryIdentifiers
    );
  }

  if (volumeInfo.authors) {
    authorsList = await handleSimpleArrays(
      volumeInfo.authors,
      process.env.APPWRITE_BOOKS_AUTHORS_ID ?? ""
    );
  }

  if (volumeInfo.categories) {
    categoriesList = await handleSimpleArrays(
      volumeInfo.categories,
      process.env.APPWRITE_BOOKS_CATEGORIES_ID ?? ""
    );
  }

  try {
    const IDcode = createBookID(volumeInfo.industryIdentifiers);

    try {
      const book = await databases.getDocument(
        process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
        process.env.APPWRITE_BOOKS_BOOKS_DATA_ID ?? "",
        IDcode
      );
      if (book) {
        return;
      }
    } catch (error) {
      const book = await databases.createDocument(
        process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
        process.env.APPWRITE_BOOKS_BOOKS_DATA_ID ?? "",
        ID.custom(IDcode),
        {
          title: volumeInfo.title,
          subtitle: volumeInfo?.subtitle,
          publisher: volumeInfo?.publisher,
          self_link: item?.selfLink,
          print_type: volumeInfo?.printType,
          language: volumeInfo?.language,
          authors: authorsList?.documents?.map((author) => author.$id),
          published_date: volumeInfo.publishedDate,
          industryIdentifiers: industryIdentifiers?.$id,
          page_count: volumeInfo?.pageCount,
          categories: categoriesList?.documents?.map(
            (category) => category.$id
          ),
        }
      );
      console.log(volumeInfo.title, "added to the database");
      await addBookToMyBooks({
        book,
        finished_date,
        isFinished,
        enjoied_as,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function addBookToMyBooks({
  book,
  finished_date,
  isFinished,
  enjoied_as,
}: {
  book: {
    $id: string;
  };
  finished_date: Date | null;
  isFinished: boolean;
  enjoied_as: TypeOfBook;
}) {
  const ISOfinished_date = finished_date ? finished_date.toISOString() : null;
  try {
    await databases.createDocument(
      process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
      process.env.APPWRITE_BOOKS_MY_BOOKS_ID ?? "",
      ID.unique(),
      {
        bookData: book.$id,
        finished_date: ISOfinished_date,
        isFinished,
        enjoied_as,
      }
    );
    console.log("Libro aggiunto ai miei libri");
  } catch (error) {
    console.error("Errore durante l'aggiunta del libro ai miei libri:", error);
    throw error; // Rilancia l'errore per gestirlo ulteriormente o informare l'utente
  }
}

async function handleSimpleArrays(array: string[], collectionId: string) {
  try {
    // for each author in the list, check if it exists in the database
    array.map(async (item) => {
      let arrayDb = await databases.listDocuments(
        process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
        collectionId ?? "",
        [Query.equal("name", item)]
      );
      if (arrayDb.documents.length === 0) {
        await databases.createDocument(
          process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
          collectionId ?? "",
          ID.unique(),
          {
            name: item,
          }
        );
      }
    });

    let list = await databases.listDocuments(
      process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
      collectionId ?? "",
      [Query.contains("name", array)]
    );

    return list;
  } catch (error) {
    console.error("Errore durante la gestione degli array semplici:", error);
    throw error; // Rilancia l'errore per gestirlo ulteriormente o informare l'utente
  }
}

async function handleIndustryIdentifiers(industryIdentifiers: any[]) {
  let industryIdentifiersList;
  try {
    industryIdentifiersList = await databases.listDocuments(
      process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
      process.env.APPWRITE_BOOKS_INDUSTRY_IDENTIFIERS_ID ?? "",
      [
        Query.equal(
          "ISBN_13",
          industryIdentifiers.find(
            (identifier) => identifier.type === "ISBN_13"
          )?.identifier ?? ""
        ),
      ]
    );

    if (industryIdentifiersList.documents.length > 0) {
      return industryIdentifiersList.documents[0];
    } else {
      industryIdentifiersList = await databases.createDocument(
        process.env.APPWRITE_BOOKS_DATABASE_ID ?? "",
        process.env.APPWRITE_BOOKS_INDUSTRY_IDENTIFIERS_ID ?? "",
        ID.unique(),
        {
          ISBN_13: industryIdentifiers.find(
            (identifier) => identifier.type === "ISBN_13"
          )?.identifier,
          ISBN_10: industryIdentifiers.find(
            (identifier) => identifier.type === "ISBN_10"
          )?.identifier,
          OTHER: industryIdentifiers.find(
            (identifier) => identifier.type === "OTHER"
          )?.identifier,
        }
      );
    }

    return industryIdentifiersList;
  } catch (error) {
    console.error(
      "Errore durante la gestione degli identificatori dell'industria:",
      error
    );
    throw error; // Rilancia l'errore per gestirlo ulteriormente o informare l'utente
  }
}
