import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// make the interface for ItemDetail
interface ItemDetailProps {
  title: string;
  value: string;
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

export default function BookItem(book: Book) {
  const [isopen, setIsOpen] = useState(false);
  const infoBooks = book.item.bookInfo;
  const note = book.item.note;
  const type = book.item.type;
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        key={infoBooks.industryIdentifiers[0].identifier}
        className="relative z-0 h-56 w-32 shrink-0 translate-x-0 border-2 border-primary transition-all duration-300 ease-in-out"
      >
        <div className="h-full w-full bg-primary p-3 opacity-100 transition-opacity duration-300">
          <div className="flex h-full flex-col text-left text-background">
            {infoBooks.authors.map((author, index) => (
              <span key={index} className="leading-tight">
                {author}
                {index < infoBooks.authors.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t-2 border-primary bg-background p-2 text-left text-base font-semibold uppercase">
          <div className="text-sm">{infoBooks.title.split(".")[0]}</div>
          <div className="text-xs lowercase">
            {infoBooks.title.split(".")[1]}
          </div>
        </div>
      </button>
      {/* Modal */}
      {isopen ? (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-20 flex h-screen w-screen items-center justify-center backdrop-grayscale">
          <div className="relative m-2 h-full w-full bg-primary p-3 text-secondary md:h-3/4 md:w-1/2 lg:m-0">
            {/* Buttons */}
            <div className="absolute right-4 top-6 flex gap-2">
              <button className="hover:scale-105">
                <Link href={infoBooks.infoLink} target="_blank">
                  <ExternalLink
                    strokeWidth={2.75}
                    className="stroke-secondar place-self-end"
                  />
                </Link>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:scale-105"
              >
                <Minimize2
                  strokeWidth={2.75}
                  className="stroke-secondar place-self-end"
                />
              </button>
            </div>
            <div className="flex h-full flex-col gap-6">
              {/* authors book */}
              <div className="flex flex-col text-left text-background">
                {infoBooks.authors.map((author, index) => (
                  <span
                    key={index}
                    className="text-4xl font-bold leading-tight"
                  >
                    {author}
                    {index < infoBooks.authors.length - 1 && <br />}
                  </span>
                ))}
              </div>
              {/* details book */}
              <div className="flex flex-wrap text-sm">
                <div className="flex items-center gap-1">
                  <div className="font-bold">Cathegories</div>
                  {infoBooks.categories.map((category, index) => (
                    <span
                      key={index}
                      className="h-fit rounded-full bg-background px-1 pb-[0.10rem] text-xs leading-tight text-primary"
                    >
                      {category}
                    </span>
                  ))}
                  <span className="mx-2">/</span>
                </div>

                <ItemDetail
                  title="Year of Publication"
                  value={infoBooks.publishedDate.toString()}
                />
                <ItemDetail
                  title="Page Count"
                  value={infoBooks.pageCount.toString()}
                />
                <ItemDetail
                  title="Language"
                  value={infoBooks.language.toString()}
                />
                <ItemDetail title="Read as " value={type.toString()} />
                <ItemDetail
                  title={infoBooks.industryIdentifiers[0].type}
                  value={infoBooks.industryIdentifiers[0].identifier.toString()}
                />
              </div>
              {/* note personali */}
              {note !== "" ? (
                <>
                  <div className="h-fit self-start text-2xl font-bold">
                    Personal Notes
                  </div>
                  <div className="flex h-3/5 items-center justify-center self-stretch">
                    <Image
                      src={note}
                      alt="Personal Notes"
                      className="w-full"
                      width={500}
                      height={500}
                      aria-label="SVG Image"
                    />
                  </div>
                </>
              ) : null}
            </div>
            {/* title book */}
            <div className="absolute bottom-0 left-0 right-0 z-10 border-4 border-primary bg-background p-3 text-left text-4xl font-semibold uppercase text-primary">
              {infoBooks.title}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
