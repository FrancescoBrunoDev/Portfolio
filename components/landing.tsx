import Link from "next/link";

export default function Landing() {
  return (
    <div className="flex h-screen w-screen items-center">
      <div className="container">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-9xl font-bold uppercase">
              Francesco
              <br />
              Bruno
            </h1>
            <div className="display">
              <div className="flex flex-col text-right text-lg">
                <span>Münster. DE</span>
                <span>Tel. +39 3485796611</span>
                <span> francesco.bruno001@gmail.com</span>
                <span>linkedin.com/in/francesco—bruno</span>
                <span>https://github.com/FrancescoBrunoDev</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col pt-10 text-8xl font-light uppercase">
            <Link href="/section/about/" className="hover:font-normal">
              About /
            </Link>
            <Link href="/section/projects/" className="hover:font-normal">
              Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
