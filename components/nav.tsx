'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/logo";

export default function Nav() {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return (
    <AnimatePresence>
      <header className="fixed z-20 h-14 w-screen bg-background py-3 text-primary">
        <motion.div className="container"
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
              <Link href={"/section/about/"}>About</Link>/
              <Link href={"/section/projects/"}>Projects</Link>/
              <Link href={"/section/record/"}>Record</Link>
            </div>
          </div>
        </motion.div>
      </header>
    </AnimatePresence>
  );
}
