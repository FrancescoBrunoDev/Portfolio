namespace Book {
  type Year = {
    year: number;
    bookDetails: BookDetails[];
  };

  interface Note {
    url: string;
    name: string;
    svg: string;
  }

  interface BookInfo {
    ISBN_10: number;
    ISBN_13: number;
    authors: string[];
    categories: string[];
    collectionId: string;
    collectionName: string;
    created: string;
    id: string;
    imageLinks: Record<string, string>;
    infoLink: string;
    language: string;
    pageCount: string;
    publishedDate: string;
    title: string;
    updated: string;
  }

  interface Book {
    altNotes: string;
    book_info: string;
    collectionId: string;
    collectionName: string;
    created: string;
    expand: {
      book_info: BookInfo;
    };
    id: string;
    month: number;
    tranlatedNotes: string;
    type: string;
    updated: string;
    year: number;
    note: boolean | Note[];
  }
}

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

type Project = {
  hidden: boolean;
  title: string;
  description: string;
  imageSrc: string;
  videoSrc: string;
  scoreImg: null | string;
  type: string;
  link: string | null;
  secondaryLink: string | null;
  id: string;
  priority: number;
};

type TypeOfBook = "audio" | "paper";