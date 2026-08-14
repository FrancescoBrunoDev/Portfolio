"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/logo";

export default function Nav() {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  const sections = [
    {
      name: "About",
      href: "/section/about/",
    },
    {
      name: "Projects",
      href: "/section/projects/",
    },
    {
      name: "Record",
      href: "/section/record/",
    },
  ];
  return (
    <header className="fixed z-20 h-14 w-full bg-background py-3 text-primary">
      <div className="container">
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <Link href={"/"}>
              <Logo />
            </Link>
            <div className="flex justify-around gap-4">
              {sections.map((section, index) => (
                <React.Fragment key={section.href}>
                  <Link
                    className="transition-all duration-100 ease-in-out hover:font-semibold"
                    href={section.href}
                  >
                    {section.name}
                  </Link>
                  {index < sections.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
