import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookItem({ book }: { book: Book.Book }) {
  const [sketch, setSketch] = useState({
    src: "/books/sketches/1.svg",
    rotate: 0,
  });

  // Pick a random placeholder sketch once, after mount (server renders a stable default).
  useEffect(() => {
    const randomSketch = Math.floor(Math.random() * 3) + 1;
    const rotate = Math.random() < 0.5 ? 0 : 180;
    setSketch({
      src: `/books/sketches/${randomSketch}.svg`,
      rotate,
    });
  }, []);

  if (!book?.expand?.book_info) return null;

  const infoBooks = book.expand.book_info;
  const note = book.note;
  const titleParts = infoBooks?.title?.match(/[^.!]+[.!]?/g) || [];

  const lengthMainTitle = 50;

  return (
    <div>
      <Link href={`/section/record/book/${book.id}`}>
        <div className="border-primary relative z-0 h-56 w-32 shrink-0 translate-x-0 overflow-visible rounded border-2 transition-all duration-200 ease-in-out hover:scale-103">
          <div className="bg-primary h-full w-full p-3 opacity-100 transition-opacity duration-300">
            <div className="text-background flex h-full flex-col text-left">
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
                    alt="sketch placeholder"
                    src={sketch.src}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="border-primary bg-background absolute right-0 bottom-0 left-0 z-10 rounded-xs border-t-2 p-2 text-left text-base font-semibold break-words uppercase">
            <div className="text-sm">
              {titleParts[0] && titleParts[0].length > lengthMainTitle
                ? `${titleParts[0].substring(0, lengthMainTitle)}...`
                : titleParts[0]}
            </div>
            <div className="truncate text-xs lowercase">{titleParts[1]}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
