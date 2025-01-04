import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center text-primary">
      <div className="container">
        <div className="w-full">
          <div className="flex flex-col justify-center pt-10 text-5xl font-normal uppercase sm:text-7xl md:text-8xl lg:justify-normal">
            <Link
              href="/section/record/books/"
              className="tracking-wider transition-all duration-100 ease-in-out hover:font-semibold"
            >
              Books /
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
