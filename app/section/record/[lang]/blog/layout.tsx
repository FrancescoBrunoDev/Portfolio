"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePathname } from "next/navigation";
import { allowedLangs } from "@/lib/locales";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // /section/record/<lang>/blog/<slug> has 5 meaningful segments vs 4 for the list
  const isBlogPost = pathname.split("/").filter(Boolean).length > 4;

  if (isBlogPost) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
        <LanguageSwitcher availableLanguages={allowedLangs} />
      </div>
    </>
  );
}
