import "@/styles/globals.css";
import { outfit } from "@/components/text";
import Nav from "@/components/nav";
import AnimatedCursorWrapper from "@/components/AnimatedCursorWrapper";

export const metadata = {
  title: "Francesco Bruno",
  description: "Personal website of Francesco Bruno",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Nav />
        <AnimatedCursorWrapper />
        {children}
        {modal}
      </body>
    </html>
  );
}
