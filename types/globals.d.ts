type Year = {
  year: number;
  bookDetails: BookDetails[];
};

interface Note {
  url: string;
  name: string;
  svg: string;
}

type BookJson = {
  title: string;
  notes?: note[];
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
  month?: number;
};

type BooksRecord = Record<string, BookJson[]>;

type Book = {
  item: BookDetails;
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
  note: Note[];
  type: string; // da eliminare perché sará enjoied_as
  altNotes?: string; // questi sono da spostare in Note
  tranlatedNotes?: string; // quest sono da spostare in Note
  month: number; // da eliminare perché sarà finished_date
  finished: boolean;
  finished_date: string | null;
  enjoied_as: TypeOfBook;
  bookData: GoogleBooksVolumeInfo;
  $id: string;
};

interface MousePosition {
  x: number;
  y: number;
}

interface WindowDimensions {
  width: number;
  height: number;
}

type WorkExperience = {
  id: number;
  position: string;
  organizations: [
    {
      name: string;
    }
  ];
  employment_type: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string;
  link: string | null;
  tools?: [
    {
      name: string;
    }
  ];
};

type Education = {
  id: number;
  university: string;
  degree: string;
  start_date: string;
  end_date?: string;
  rate?: string;
  url?: string;
};

type Internship = {
  id: number;
  position: string;
  organizations: [
    {
      name: string;
    }
  ];
  employment_type: string;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string;
  link: string | null;
};

type Video = {
  src: string;
  dark: boolean;
} | null;

type Project = {
  hidden: boolean;
  title: string;
  description: string;
  image: string;
  videoSrc: Video;
  scoreImg: null | string;
  id: number;
  type: {
    type: string;
    $id: string;
    macro_type: string;
  };
  link: string | null;
  secondaryLink: string | null;
  $id: string;
  order: number;
};

interface GoogleBooksIndustryIdentifier {
  type: "ISBN_10" | "ISBN_13" | "OTHER";
  identifier: string;
}

interface GoogleBooksReadingModes {
  text: boolean;
  image: boolean;
}

interface GoogleBooksImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

interface GoogleBooksVolumeInfo {
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  publishedDate: string;
  industryIdentifiers: GoogleBooksIndustryIdentifier[];
  readingModes: GoogleBooksReadingModes;
  pageCount: number | null;
  printType: string;
  categories: string[];
  maturityRating: "NOT_MATURE" | "MATURE";
  allowAnonLogging: boolean;
  contentVersion: string;
  imageLinks: GoogleBooksImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

type TypeOfBook = "audio" | "paper";

interface GoogleBooksSaleInfo {
  country: string;
  saleability: "FOR_SALE" | "NOT_FOR_SALE";
  isEbook: boolean;
}

interface GoogleBooksVolume {
  kind: "books#volume";
  id: string;
  etag: string;
  selfLink: string | null;
  volumeInfo: GoogleBooksVolumeInfo;
  saleInfo: GoogleBooksSaleInfo;
}
