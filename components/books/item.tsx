import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookItem({ book }: { book: Book.Book }) {
  if (!book || !book.expand) return null;
  const [sketch, setSketch] = useState({
    src: "/books/sketches/1.svg",
    rotate: 0,
  });
  const infoBooks = book.expand.book_info;
  const note = book.note;
  const titleParts = infoBooks?.title?.match(/[^.!]+[.!]?/g) || [];

  const lenghtMainTitle = 50;

  // take a random number beetwen 1 and 3 and use it witch img svg use
  useEffect(() => {
    const randomSketch = Math.floor(Math.random() * 3) + 1;
    // rotate should be 0 or 180
    const rotate = Math.random() < 0.5 ? 0 : 180;
    setSketch({
      src: `/books/sketches/${randomSketch}.svg`,
      rotate,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Link href={`/section/record/book/${book.id}`}>
        <div className="relative z-0 h-56 w-32 shrink-0 translate-x-0 overflow-visible border-2 border-primary transition-all duration-200 ease-in-out hover:scale-[1.025]">
          <div className="h-full w-full bg-primary p-3 opacity-100 transition-opacity duration-300">
            <div className="flex h-full flex-col text-left text-background">
              {infoBooks.authors?.map((author, index) => (
                <span key={index} className="leading-tight">
                  {author}
                  {index < infoBooks.authors.length - 1 && <br />}
                </span>
              ))}
              {note && (
                <div className="pt-6">
                  <Image
                    className={cn({
                      "rotate-180": sketch.rotate === 180,
                    })}
                    width={300}
                    height={300}
                    alt="sketch holdplace"
                    src={sketch.src}
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
        </div>
      </Link>
    </motion.div>
  );
}
