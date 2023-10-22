type Year = {
  year: number;
  bookDetails: {
    note: string;
    bookInfo: any; // You might want to replace "any" with a more specific type
    type: string;
  }[];
};

type BookJson = {
  title: string;
  month: number;
  notes: string;
  ISBN13: number;
  type?: string;
  authors?: string[];
  categories?: string[];
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  infoLink?: string;
};

type BooksRecord = Record<string, BookJson[]>;

type Book = {
  item: {
    bookInfo: {
      title: string;
      authors: string[];
      publishedDate: string;
      industryIdentifiers: {
        type: string;
        identifier: string;
      }[];
      categories: string[];
      pageCount: number;
      infoLink: string;
      imageLinks: {
        smallThumbnail: string;
        thumbnail: string;
      };
      language: string;
    };
    note: string;
    type: string;
  };
};
