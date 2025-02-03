"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES } from "@/lib/locales";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[3];

  return (
    <div className="bg-primary/20 flex scale-110 gap-1 rounded-full p-1">
      {Object.keys(LOCALES).map((lang) => (
        <Link
          key={lang}
          href={pathname.replace(`/${currentLang}/`, `/${lang}/`)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            currentLang === lang ? "bg-primary text-background" : "text-primary"
          }`}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
