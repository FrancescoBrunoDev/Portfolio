import { motion, AnimatePresence } from "framer-motion";

export default function BookItem(book: Book) {
  return (
    <div
      key={book.item.industryIdentifiers[0].identifier}
      className="relative z-0 h-56 w-32 shrink-0 translate-x-0 border-2 border-primary transition-all duration-300 ease-in-out"
    >
      <div className="h-full w-full bg-primary p-3 opacity-100 transition-opacity duration-300">
        <div className="flex h-full flex-col items-start text-background">
          {book.item.authors.map((author, index) => (
            <span key={index} className="leading-tight">
              {author}
              {index < book.item.authors.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t-2 border-primary bg-background p-2 text-base font-semibold uppercase">
        <div className="text-sm">{book.item.title.split(".")[0]}</div>
        <div className="text-xs lowercase">{book.item.title.split(".")[1]}</div>
      </div>
    </div>
  );
}
