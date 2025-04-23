"use client";
import { Minimize2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import BackgroundDots from "@/components/books/backgroundDots";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ItemDetailProps {
  title: string;
  value: string;
}

// make the interface for ItemDetail
interface ModalInfoBookProps {
  book: Book.Book;
  note: Book.Note[];
  isClosable: boolean;
  randomVariant?: {
    label: string;
    variant: string;
  };
}

function ItemDetail({ title, value }: ItemDetailProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="font-bold">{title}</div>
      {value}
      <span className="mx-2">/</span>
    </div>
  );
}

export default function ModalInfoBook({
  book,
  note,
  isClosable,
  randomVariant,
}: ModalInfoBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  if (!book.expand?.book_info) return null;
  const infoBook = book.expand.book_info;
  const titleParts = infoBook.title?.match(/[^.!]+[.!]?/g) || [];

  const handleNext = () => {
    if (currentPage < Object.keys(note).length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <motion.div
      key="modal"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-primary text-secondary relative h-[80dvh] max-h-[46rem] w-full rounded p-3 md:max-w-md lg:m-0">
        {/* Buttons */}
        <div className="absolute top-6 right-4 flex gap-2">
          {infoBook.infoLink && (
            <button className="hover:scale-105">
              <Link href={infoBook.infoLink} target="_blank">
                <ExternalLink
                  strokeWidth={2.75}
                  className="stroke-secondar place-self-end"
                />
              </Link>
            </button>
          )}
          {isClosable && (
            <button
              onClick={() => {
                router.back();
              }}
              className="hover:scale-105"
            >
              <Minimize2
                strokeWidth={2.75}
                className="stroke-secondar place-self-end"
              />
            </button>
          )}
        </div>
        <div className="flex h-full flex-col gap-6">
          {/* authors book */}
          <div className="text-background flex flex-col pr-20 text-left">
            {infoBook.authors.map((author, index) => (
              <span key={index} className="text-4xl leading-tight font-bold">
                {author}
                {index < infoBook.authors.length - 1 && <br />}
              </span>
            ))}
          </div>
          {/* details book */}
          <div className="flex flex-wrap text-sm">
            <div className="flex flex-wrap items-center gap-1">
              <div className="font-bold">Categories</div>
              {infoBook.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-background text-primary h-fit rounded-full px-1 pb-[0.10rem] text-xs leading-tight text-nowrap"
                >
                  {category}
                </span>
              ))}
              <span className="mx-2">/</span>
            </div>

            <ItemDetail
              title="Year of Publication"
              value={infoBook.publishedDate.toString()}
            />
            {Number(infoBook.pageCount) > 0 && (
              <ItemDetail
                title="Page Count"
                value={infoBook.pageCount.toString()}
              />
            )}
            <ItemDetail title="Language" value={infoBook.language.toString()} />
            <ItemDetail
              title="Format"
              value={`${randomVariant?.label} ${randomVariant?.variant}`}
            />
            <ItemDetail
              title={infoBook.ISBN_13 ? "ISBN-13" : "ISBN-10"}
              value={String(infoBook.ISBN_13) || String(infoBook.ISBN_10)}
            />
          </div>
          {/* note personali */}

          <div className="h-fit self-start text-2xl font-bold">
            Personal Notes
          </div>
          <div className="relative">
            <BackgroundDots />
          </div>
          <div className="z-10 flex h-2/5 flex-col items-center justify-center gap-y-6 self-stretch">
            {note?.length !== 0 && (
              <div
                className="w-full max-w-md px-6"
                dangerouslySetInnerHTML={{ __html: note[currentPage].svg }}
              />
            )}
          </div>
        </div>
        {/* title book */}
        <div className="absolute right-0 bottom-0 left-0 z-10">
          {note.length !== 0 && Object.keys(note).length > 1 ? (
            <div className="-top-20 z-50 mb-1 flex w-full justify-center px-3 opacity-20 transition-opacity hover:opacity-100">
              <div className="bg-background text-primary flex justify-center rounded-lg px-3">
                <button
                  className="transition-all disabled:opacity-50"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft />
                </button>
                <span className="w-20 text-center text-xl font-bold">
                  {currentPage + 1}/{Object.keys(note).length}
                </span>
                <button
                  className="transition-all disabled:opacity-50"
                  onClick={handleNext}
                  disabled={currentPage === Object.keys(note).length - 1}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          ) : null}
          <div className="border-primary bg-background text-primary rounded border-4 border-t-0 p-3 text-left font-semibold">
            <div className="text-4xl uppercase">{titleParts[0]}</div>
            <div className="max-h-36text-2xl">{titleParts[1]}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
