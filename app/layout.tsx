import "@/styles/globals.css";
import { outfit } from "@/components/text";

export const metadata = {
  title: "Francesco Bruno",
  description: "Personal website of Francesco Bruno",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"" + outfit.className}>
        <div>{children}</div>
        <div className="fixed bottom-0 left-0 right-0 flex w-screen justify-center text-xs text-primary sm:text-sm">
          portfolio under construction | excuse any temporary glitches!
        </div>
      </body>
    </html>
  );
}
