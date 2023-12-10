type Year = {
  year: number;
  bookDetails: {
    note: string;
    bookInfo: any;
    type: string;
    altNotes: string;
    tranlatedNotes?: string;
    month: number;
  }[];
};

type BookJson = {
  title: string;
  notes: string;
  ISBN13: number;
  type?: string;
  authors?: string[];
  categories?: string[];
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  infoLink?: string;
  altNotes?: string;
  tranlatedNotes?: string;
  month: number;
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
    altNotes?: string;
    tranlatedNotes?: string;
    month: number;
  };
};

type BookDetails = {
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
  altNotes?: string;
  tranlatedNotes?: string;
  month: number;
};

interface MousePosition {
  x: number;
  y: number;
}

interface WindowDimensions {
  width: number;
  height: number;
}