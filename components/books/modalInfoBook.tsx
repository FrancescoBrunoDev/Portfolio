import { Minimize2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BackgroundDots from "@/components/books/backgroundDots";

interface ItemDetailProps {
  title: string;
  value: string;
}

// make the interface for ItemDetail
interface ModalInfoBookProps {
  book: Book;
  note: string;
  type: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  altNotes: string | undefined;
  tranlatedNotes: string | undefined;
}

const formatVariants = [
  {
    type: "audiobook",
    label: "📻",
    variants: [
      "Ear Candy",
      "Audio Adventures",
      "Sonic Stories",
      "Listen & Learn",
      "Sound Safari",
      "Earworms",
      "Audio Escapades",
      "Talkie Treasures",
      "Voice Voyages",
      "Acoustic Expeditions",
      "Audiobook Bliss",
      "Voice-Printed Journeys",
      "Auditory Escapes",
      "Sonic Sagas",
      "Listen & Lounge",
      "Narrative Symphony",
      "Earbud Escapades",
      "Soundtrack of Imagination",
      "Voice-Activated Thrills",
      "Auditory Odyssey",
    ],
  },
  {
    type: "paper",
    label: "📚",
    variants: [
      "Good Old Paper Book",
      "Ink on Pages",
      "Traditional Texts",
      "Classic Novels",
      "Page-Turners",
      "Bookshelf Bliss",
      "Paperback Paradise",
      "Printed Prose",
      "Hardcover Havens",
      "Bibliophile's Delight",
      "Page Perfection",
      "Novel Nook",
      "Paperback Pilgrimage",
      "Classic Chapters",
      "Readers' Retreat",
      "Prose Portal",
      "Inkbound Adventures",
      "Paperbound Treasures",
      "Literary Love Affair",
      "Bookish Bliss",
    ],
  },
];

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
  type,
  altNotes,
  tranlatedNotes,
  setIsOpen,
}: ModalInfoBookProps) {
  const infoBooks = book.item.bookInfo;
  // Randomly select a variant
  // Get the selected format or default to 'paper' if 'type' is not recognized
  const selectedFormat =
    formatVariants.find((format) => format.type === type) || formatVariants[0];

  // Randomly select a variant
  const randomVariant =
    selectedFormat.variants[
      Math.floor(Math.random() * selectedFormat.variants.length)
    ];
  return (
    <motion.div
      key="modal"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 top-0 z-20 flex h-screen w-screen items-center justify-center backdrop-grayscale"
    >
    <div className="relative m-2 h-4/5 max-h-[46rem] w-full bg-primary p-3 text-secondary md:h-3/4 md:max-w-md lg:m-0">
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
          <button onClick={() => setIsOpen(false)} className="hover:scale-105">
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
              <span key={index} className="text-4xl font-bold leading-tight">
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
            <ItemDetail
              title="Format"
              value={`${selectedFormat.label} ${randomVariant}`}
            />

            <ItemDetail
              title={infoBooks.industryIdentifiers[0].type}
              value={infoBooks.industryIdentifiers[0].identifier.toString()}
            />
          </div>
          {/* note personali */}

          <div className="h-fit self-start text-2xl font-bold">
            Personal Notes
          </div>
          <div className="relative">
            <BackgroundDots />
          </div>
          <div className="flex flex-col gap-y-6 h-2/5 items-center justify-center self-stretch">
            {note !== "" ? (
              <>
                <Image
                  src={note}
                  alt={altNotes || "note"}
                  className="w-full px-6"
                  width={500}
                  height={500}
                  aria-label="SVG Image"
                />
                <div className="text-center px-6">({tranlatedNotes})</div>
              </>
            ) : null}
          </div>
        </div>
        {/* title book */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-4 border-t-0 border-primary bg-background p-3 text-left text-4xl font-semibold uppercase text-primary">
          {infoBooks.title}
        </div>
      </div>
    </motion.div>
  );
}
