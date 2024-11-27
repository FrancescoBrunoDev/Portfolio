import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalInfoBook from "@/components/books/modalInfoBook";
import Image from "next/image";

export default function BookItem(book: Book) {
  const [isopen, setIsOpen] = useState(false);
  const infoBooks = book.item.bookInfo;
  const note = book.item.note;
  const type = book.item.type;
  const altNotes = book.item.altNotes;
  const tranlatedNotes = book.item.tranlatedNotes;
  const titleParts = infoBooks.title?.match(/[^.!]+[.!]?/g) || [];

  const lenghtMainTitle = 50;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <button
        onClick={() => setIsOpen(true)}
        key={infoBooks.ISBN_13 || infoBooks.ISBN_10}
        className="relative z-0 h-56 w-32 shrink-0 translate-x-0 overflow-visible border-2 border-primary transition-all duration-200 ease-in-out hover:scale-[1.025]"
      >
        <div className="h-full w-full bg-primary p-3 opacity-100 transition-opacity duration-300">
          <div className="flex h-full flex-col text-left text-background">
            {infoBooks.authors?.map((author, index) => (
              <span key={index} className="leading-tight">
                {author}
                {index < infoBooks.authors.length - 1 && <br />}
              </span>
            ))}
            {note && note.length !== 0 && Object.keys(note).length > 1 && (
              <div className="pt-6">
                <Image
                  width={300}
                  height={300}
                  alt="sketch holdplace"
                  src="/books/sketches/1.svg"
                />
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 break-words border-t-2 border-primary bg-background p-2 text-left text-base font-semibold uppercase">
          <div className="text-sm">
            {titleParts[0] && titleParts[0].length > lenghtMainTitle
              ? `${titleParts[0].substring(0, lenghtMainTitle)}...`
              : titleParts[0]}
          </div>
          <div className="truncate text-xs lowercase">{titleParts[1]}</div>
        </div>
      </button>
      {/* Modal */}
      <AnimatePresence>
        {isopen && (
          <ModalInfoBook
            book={book}
            titleParts={titleParts}
            note={note}
            type={type}
            altNotes={altNotes}
            tranlatedNotes={tranlatedNotes}
            setIsOpen={setIsOpen}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
