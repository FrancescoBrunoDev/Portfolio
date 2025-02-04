import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
        <LanguageSwitcher />
      </div>
    </>
  );
}
