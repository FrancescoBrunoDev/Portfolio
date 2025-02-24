"use client";

import Link from "next/link";
import { useReferences } from "@/lib/ReferenceContext";
import { useEffect, useState } from "react";

export default function Reference({
  children,
  title,
  authorFirstName,
  authorSecondName,
  publicationYear,
  publisherCity,
  publisher,
  pp,
}: {
  children: React.ReactNode;
  title: string;
  authorFirstName: string;
  authorSecondName: string;
  publicationYear: string;
  publisherCity: string;
  publisher: string;
  pp: string;
}) {
  const { addReference } = useReferences();
  const [number, setNumber] = useState<number | null>(null);

  useEffect(() => {
    const newNumber = addReference({
      title,
      authorFirstName,
      authorSecondName,
      publicationYear,
      publisherCity,
      publisher,
      pp,
    });
    setNumber(newNumber);
  }, [
    title,
    authorFirstName,
    authorSecondName,
    publicationYear,
    publisherCity,
    publisher,
    pp,
    addReference,
  ]);

  if (number === null) {
    // Evitiamo di renderizzare finché il numero non è pronto
    return null;
  }

  return (
    <Link
      className="text-primary-prose no-underline"
      href={`#reference-${number}`}
    >
      {children}
      <sup>{number}</sup>
    </Link>
  );
}
