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
  const isBlogPost = pathname.split("/").length > 5;

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
