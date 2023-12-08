import "@/styles/globals.css";
import { outfit } from "@/components/text";
import Cursor  from "@/components/cursor"

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
      <Cursor />
        <div>{children}</div>
      </body>
    </html>
  );
}
