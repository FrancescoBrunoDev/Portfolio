"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      <header className="fixed z-20 h-14 w-screen bg-background py-3 text-primary">
        <div className="container">
          <motion.div
            key="navbar"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <Link href={"/"}>
                <Logo />
              </Link>
              <div className="flex justify-around gap-4">
                {sections.map((section, index) => (
                  <>
                    <Link
                      key={section.href}
                      className="transition-all duration-100 ease-in-out hover:font-semibold"
                      href={section.href}
                    >
                      {section.name}
                    </Link>
                    {index < sections.length - 1 && <span className="">/</span>}
                  </>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>
    </AnimatePresence>
  );
}
