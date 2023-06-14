import Link from "next/link";
import { AtSign } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Github } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex h-screen w-screen items-center text-primary">
      <div className="container">
        <div className="w-full">
          <div className="flex flex-col items-center justify-start lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold uppercase sm:text-8xl md:text-9xl">
              Francesco
              <br />
              Bruno
            </h1>
            <div>
              <div className="flex items-center space-x-4 text-lg lg:flex-col lg:items-end lg:space-x-0 lg:text-right">
                <span>Münster. DE</span>
                <span className="hidden lg:block">Tel. +39 3485796611</span>
                <div className="transition-all duration-100 ease-in-out hover:font-semibold">
                  <span className="hidden lg:block">
                    {" "}
                    francesco.bruno001@gmail.com
                  </span>
                  <AtSign className="block h-10 w-10 rounded-lg p-2 hover:bg-secondary lg:hidden" />
                </div>
                <Link
                  href="https://github.com/FrancescoBrunoDev"
                  className="transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span className="hidden lg:block">
                    github.com/FrancescoBrunoDev
                  </span>
                  <Github className="block h-10 w-10 rounded-lg p-2 hover:bg-secondary lg:hidden" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/francesco--bruno/"
                  className="transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span className="hidden lg:block">
                    linkedin.com/in/francesco--bruno/
                  </span>
                  <Linkedin className="block h-10 w-10 rounded-lg p-2 hover:bg-secondary lg:hidden" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col pt-10 text-8xl font-normal uppercase">
            <Link
              href="/section/about/"
              className="tracking-wider transition-all duration-100 ease-in-out hover:font-semibold"
            >
              About /
            </Link>
            <Link
              href="/section/projects/"
              className="tracking-wider transition-all duration-100 ease-in-out hover:font-semibold"
            >
              Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
