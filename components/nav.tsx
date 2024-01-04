import Link from "next/link";
import Logo from "@/components/logo";

export default function Nav() {
  return (
    <header className="fixed z-20 h-14 w-screen bg-background py-3 text-primary">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <Logo />
          </Link>
          <div className="flex justify-around gap-4">
            <Link href={"/section/about/"}>About</Link>/
            <Link href={"/section/projects/"}>Projects</Link>/
            <Link href={"/section/record/"}>Record</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
