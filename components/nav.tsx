import Link from "next/link";
import Logo from "@/components/logo";

export default function Nav() {
  return (
    <div className="fixed z-20 h-14 w-screen bg-background py-3 text-primary">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <Logo />
          </Link>
          <div className="flex justify-around gap-4">
            <Link href={"about/"}>About</Link>/
            <Link href={"projects/"}>Projects</Link>/
            <Link href={"record/"}>Record</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
