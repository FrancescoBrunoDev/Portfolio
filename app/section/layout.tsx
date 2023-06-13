import Nav from "@/components/nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div>{children}</div>
    </>
  );
}
