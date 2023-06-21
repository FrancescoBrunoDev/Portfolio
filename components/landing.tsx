"use client";

import Link from "next/link";
import { AtSign } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Github } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex h-screen w-screen items-center text-primary">
      <div className="container">
        <div className="w-full">
          <div className="flex flex-col-reverse lg:flex-row lg:justify-between">
            <h1 className="text-5xl font-bold uppercase sm:text-8xl md:text-9xl">
              Francesco
              <br />
              Bruno
            </h1>
            <div className="z-10 flex items-center space-x-4">
              <div className="flex items-center space-x-4 text-base md:text-lg lg:flex-col lg:items-end lg:space-x-0 lg:text-right">
                <span>Münster. DE</span>
                <span className="hidden lg:block">Tel. +39 3485796611</span>
                <Link
                  href="mailto:francesco.bruno001@gmail.com"
                  className="transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span className="hidden lg:block">
                    {" "}
                    francesco.bruno001@gmail.com
                  </span>
                  <AtSign className="block h-5 w-5 hover:bg-secondary md:h-6 md:w-6 lg:hidden" />
                </Link>
                <Link
                  href="https://github.com/FrancescoBrunoDev"
                  className="transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span className="hidden lg:block">
                    github.com/FrancescoBrunoDev
                  </span>
                  <Github className="block h-5 w-5 hover:bg-secondary md:h-6 md:w-6 lg:hidden" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/francesco--bruno/"
                  className="transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span className="hidden lg:block">
                    linkedin.com/in/francesco--bruno/
                  </span>
                  <Linkedin className="block h-5 w-5 hover:bg-secondary md:h-6 md:w-6 lg:hidden" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center pt-10 text-5xl font-normal uppercase sm:text-7xl md:text-8xl lg:justify-normal">
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
