"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { AtSign } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { BgLanding } from "@/components/bgLanding";
import LastArticle from "@/components/firstScreen/lastArticle";
import { RecordModel } from "pocketbase";

export default function Landing({
  lastArticle,
}: {
  lastArticle?: { record: RecordModel; title: string };
}) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
  });

  // rAF throttling: evita re-render a ogni pixel di movimento mouse
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    mouseRef.current = { x: event.clientX, y: event.clientY };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ ...mouseRef.current });
        rafRef.current = null;
      });
    }
  }, []);

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
                  <Link
                    href="mailto:francesco@francesco-bruno.com"
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                    data-umami-event="Click Email Link"
                  >
                    <span className="hidden xl:block">
                      {" "}
                      francesco@francesco-bruno.com
                    </span>
                    <AtSign className="hover:bg-secondary block h-5 w-5 md:h-6 md:w-6 xl:hidden" />
                  </Link>
                  <Link
                    href="https://github.com/FrancescoBrunoDev"
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                    data-umami-event="Click GitHub Link"
                  >
                    <span className="hidden xl:block">
                      github.com/FrancescoBrunoDev
                    </span>
                    <SiGithub className="hover:bg-secondary block h-5 w-5 md:h-6 md:w-6 xl:hidden" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/francesco--bruno/"
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                    data-umami-event="Click LinkedIn Link"
                  >
                    <span className="hidden xl:block">
                      linkedin.com/in/francesco--bruno/
                    </span>
                    <span className="block xl:hidden">linkedin</span>
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
              <div className="flex flex-col md:flex-row">
                <Link
                  href="/section/record/"
                  className="tracking-wider transition-all duration-100 ease-in-out hover:font-semibold"
                >
                  <span>Record</span>
                </Link>
                {lastArticle ? <LastArticle lastArticle={lastArticle} /> : null}
              </div>
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
