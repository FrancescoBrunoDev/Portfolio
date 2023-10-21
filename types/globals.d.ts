type Year = {
  year: number;
  bookDetails: {
    note: string;
    bookInfo: any; // You might want to replace "any" with a more specific type
  }[];
};

type BookJson = {
  title: string;
  month: number;
  notes: string;
  ISBN13: number;
};

type BooksRecord = Record<string, BookJson[]>;

type Book = {
  item: {
    title: string;
    authors: string[];
    publishedDate: string;
    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];
    categories: string[];
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    language: string;
  };
};
