import "@/styles/globals.css";
import { outfit } from "@/components/text";
import Nav from "@/components/nav";
import AnimatedCursorWrapper from "@/components/AnimatedCursorWrapper";
import Script from "next/script";

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
      <head>
        <Script
          defer
          src="https://umami-w4w0gwowc4kgg4gogs0o8sok.francesco-bruno.com/script.js"
          data-website-id="689235d0-8491-4c50-9aaa-54ea7018115a"
        />
      </head>
      <body className={outfit.className}>
        <Nav />
        <AnimatedCursorWrapper />
        {children}
        {modal}
      </body>
    </html>
  );
}
