"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AtSign, Linkedin, Github } from "lucide-react";
import { BgLanding } from "@/components/bgLanding";

export default function Landing() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <>
      <div
        className="text-primary absolute z-10 flex h-screen w-screen items-center"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 backdrop-blur-2xl" />
        <div className="relative container">
          <div className="w-full">
            <div className="flex flex-col-reverse xl:flex-row xl:justify-between">
              <h1 className="text-5xl font-bold tracking-tight uppercase sm:text-8xl md:text-9xl">
                Francesco
                <br />
                Bruno
              </h1>
              <div className="z-10 flex items-center space-x-4">
                <div className="text- flex items-center space-x-4 md:text-lg xl:flex-col xl:items-end xl:space-x-0 xl:text-right">
                  <span>Münster. DE</span>
                  <span className="hidden xl:block">Tel. +39 3485796611</span>
                  <Link
                    href="mailto:francesco.bruno001@gmail.com"
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                  >
                    <span className="hidden xl:block">
                      {" "}
                      francesco.bruno001@gmail.com
                    </span>
                    <AtSign className="hover:bg-secondary block h-5 w-5 md:h-6 md:w-6 xl:hidden" />
                  </Link>
                  <Link
                    href="https://github.com/FrancescoBrunoDev"
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                  >
                    <span className="hidden xl:block">
                      github.com/FrancescoBrunoDev
                    </span>
                    <Github className="hover:bg-secondary block h-5 w-5 md:h-6 md:w-6 xl:hidden" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/francesco--bruno/"
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                  >
                    <span className="hidden xl:block">
                      linkedin.com/in/francesco--bruno/
                    </span>
                    <Linkedin className="hover:bg-secondary block h-5 w-5 md:h-6 md:w-6 xl:hidden" />
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
                Projects /
              </Link>
              <Link
                href="/section/record/"
                className="tracking-wider transition-all duration-100 ease-in-out hover:font-semibold"
              >
                Record
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BgLanding
        mousePosition={mousePosition}
        windowDimensions={windowDimensions}
      />
    </>
  );
}
