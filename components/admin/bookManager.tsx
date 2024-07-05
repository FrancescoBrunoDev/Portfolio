"use client";

import {
  getBooksFromGoogleApi,
  addBookToDatabase,
  syncFormJson,
} from "@/actions/actionsBooks";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function BookManager() {
  const [books, setBooks] = useState<GoogleBooksVolume[]>([]);
  const [searchInput, setSearchInput] = useState(0);
  const [type, setType] = useState("isbn");
  const [syncType, setSyncType] = useState<TypeOfBook>("audio");

  async function getBooks() {
    console.log(searchInput, type);
    const res = await getBooksFromGoogleApi(searchInput, type);
    setBooks(res);
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4 text-primary">
        <div className="flex gap-2 rounded-lg border-2 border-primary p-2">
          <Select
            onValueChange={(value: TypeOfBook) =>
              setSyncType(value as TypeOfBook)
            }
            defaultValue={syncType}
          >
            <SelectTrigger className="w-28 border-none">
              <SelectValue
                placeholder="type of sync"
                className="text-base font-semibold"
              />
            </SelectTrigger>
            <SelectContent className="border-none bg-primary ">
              <SelectGroup>
                <SelectItem
                  className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
                  value="paper"
                >
                  paper
                </SelectItem>
                <SelectItem
                  className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
                  value="audio"
                >
                  audio
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={() => syncFormJson({ syncType: syncType as TypeOfBook })}
          >
            Sync by Json
          </Button>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border-2 border-primary p-2">
          <div className="flex w-full justify-center gap-4">
            <div className="flex h-8 w-80 gap-1 bg-transparent font-semibold">
              <Select onValueChange={setType} defaultValue="isbn">
                <SelectTrigger className="w-28 border-none">
                  <SelectValue
                    placeholder="type of serach"
                    className="text-base font-semibold"
                  />
                </SelectTrigger>
                <SelectContent className="border-none bg-primary ">
                  <SelectGroup>
                    <SelectItem
                      className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
                      value="isbn"
                    >
                      isbn
                    </SelectItem>
                    <SelectItem
                      className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
                      value="title"
                    >
                      title
                    </SelectItem>
                    <SelectItem
                      className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
                      value="author"
                    >
                      author
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="text-2xl">/</span>
              <input
                className="h-full w-full border-b-[3px] border-primary bg-transparent px-1 font-semibold placeholder-primary/50 focus:outline-none"
                placeholder={"search for a book"}
                minLength={8}
                {...(type === "isbn" ? { type: "number" } : {})}
                onChange={(e) => setSearchInput(Number(e.target.value))}
              />
            </div>
            <Button onClick={() => getBooks()} className="whitespace-nowrap">
              Search
            </Button>
            {books.length > 0 && (
              <Button
                className="border-2 border-primary bg-background text-primary"
                onClick={() => setBooks([])}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className=" grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((item, index) => {
            return <ShowFetchedDataBook item={item} index={index} />;
          })}
        </div>
      </div>
    </>
  );
}

export function ShowFetchedDataBook({
  item,
  index,
}: {
  item: GoogleBooksVolume;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`group relative flex gap-4 border-2 border-primary p-2 text-primary transition-colors duration-75 hover:bg-primary hover:text-background ${
        isOpen && "col-span-2"
      }`}
    >
      <span className="w-10 text-2xl font-bold">{index + 1}</span>
      {item.volumeInfo.imageLinks?.thumbnail && (
        <Image
          width={100}
          height={50}
          className="h-fit w-16 rounded-md"
          alt={item.volumeInfo.title}
          src={item.volumeInfo.imageLinks.thumbnail}
        />
      )}

      <div className="">
        <h3 className="text-md font-bold">{item.volumeInfo.title}</h3>
        <h4 className="text-sm">
          {item.volumeInfo.authors?.map((author: string) => author)}
        </h4>
        {item.volumeInfo.industryIdentifiers?.map((item) => {
          return (
            <>
              {item.type == "ISBN_13" && (
                <p className="text-xs">ISBN 13: {item.identifier}</p>
              )}
              {item.type == "ISBN_10" && (
                <p className="text-xs">ISBN 10: {item.identifier}</p>
              )}
            </>
          );
        })}
        {isOpen && <ControlsBook item={item} />}
        <Button
          className="mt-2 group-hover:bg-background group-hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Open"}
        </Button>
      </div>
    </div>
  );
}

function ControlsBook({ item }: { item: GoogleBooksVolume }) {
  const [finished_date, setDate] = useState<Date>(new Date());
  const [syncType, setSyncType] = useState<TypeOfBook>("paper");
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-[280px] justify-start text-left font-normal group-hover:bg-background group-hover:text-primary",
              !finished_date && "text-secondary"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {finished_date ? (
              format(finished_date, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={finished_date}
            onSelect={(date: Date | undefined) => setDate(date ?? new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Select
        onValueChange={(value: TypeOfBook) => setSyncType(value as TypeOfBook)}
        defaultValue="paper"
      >
        <SelectTrigger className="flex content-center border-none bg-primary text-secondary group-hover:bg-background group-hover:text-primary">
          <SelectValue
            placeholder="type of sync"
            className="text-base font-semibold"
          />
        </SelectTrigger>
        <SelectContent className="border-none bg-primary ">
          <SelectGroup>
            <SelectItem
              className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
              value="paper"
            >
              paper
            </SelectItem>
            <SelectItem
              className="text-background hover:bg-background hover:text-primary focus:bg-background focus:text-primary"
              value="audio"
            >
              audio
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFinished"
          checked={isFinished}
          className="data bg-background group-hover:bg-background data-[state=checked]:text-primary"
        />
        <button
          onClick={() => setIsFinished(!isFinished)}
          type="button"
          className="text-sm font-medium leading-none"
        >
          is finished
        </button>
      </div>
      <Button
        onClick={() =>
          addBookToDatabase({
            item,
            finished_date,
            isFinished,
            enjoied_as: syncType,
          })
        }
        className="group-hover:bg-background group-hover:text-primary"
      >
        add to readed
      </Button>
    </div>
  );
}
