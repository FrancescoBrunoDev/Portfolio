type Year = {
  year: number;
  bookDetails: {
    note: note[];
    bookInfo: any;
    type: string;
    altNotes: string;
    tranlatedNotes?: string;
    month: number;
  }[];
};

interface note {
  url: string;
  name: string;
  svg: string;
};

type BookJson = {
  title: string;
  notes: note[];
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
    note: note[];
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
  note: note[];
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