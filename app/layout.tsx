import "@/styles/globals.css";
import { outfit } from "@/components/text";
import Nav from "@/components/nav";
import AnimatedCursor from "react-animated-cursor";

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
      <body className={"" + outfit.className}>
        <Nav />
        <AnimatedCursor innerSize={16} outerSize={8} trailingSpeed={3} />
        <>{children}</>
        <>{modal}</>
      </body>
    </html>
  );
}
