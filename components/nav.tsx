import Link from "next/link";

export default function Nav() {
  return (
    <div className="fixed z-20 w-full py-3 bg-background">
      <div className="container">
        <div className="flex justify-between">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold uppercase">Francesco Bruno</h1>
          </Link>
          <div className="flex justify-around gap-4">
            <Link href={"section/about/"}>About</Link>/
            <Link href={"section/projects/"}>Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
