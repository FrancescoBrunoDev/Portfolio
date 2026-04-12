"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, SupportedLang } from "@/lib/locales";

type LanguageSwitcherProps = {
  availableLanguages?: SupportedLang[];
};

export default function LanguageSwitcher({
  availableLanguages,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[3];

  const languagesToShow =
    availableLanguages ?? (Object.keys(LOCALES) as SupportedLang[]);

  if (languagesToShow.length <= 1) {
    return null;
  }

  return (
    <div className="bg-background shadow-primary/30 flex scale-110 gap-1 rounded-full shadow-xl">
      <div className="bg-primary/20 flex gap-1 rounded-full p-1">
        {languagesToShow.map((lang) => (
          <Link
            key={lang}
            href={pathname.replace(`/${currentLang}/`, `/${lang}/`)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              currentLang === lang
                ? "bg-primary text-background"
                : "text-primary"
            }`}
          >
            {lang.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
