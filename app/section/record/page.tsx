import Link from "next/link";
// import StravaInfo from "@/components/strava/stravaInfo";

export default function Page() {
  return (
    <div className="container relative flex h-screen items-center text-primary">
      {/* <div className="container absolute inset-x-0 top-20 z-0 flex justify-end">
        <StravaInfo className="h-fit" />
      </div> */}
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
  );
}
