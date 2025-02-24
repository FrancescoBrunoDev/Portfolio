"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
} from "react";

type Reference = {
  number: number;
  title: string;
  authorFirstName: string;
  authorSecondName: string;
  publicationYear: string;
  publisherCity: string;
  publisher: string;
  pp: string;
};

type ReferenceContextType = {
  references: Reference[];
  addReference: (ref: Omit<Reference, "number">) => number;
};

const ReferenceContext = createContext<ReferenceContextType | null>(null);

export function ReferenceProvider({ children }: { children: React.ReactNode }) {
  // Stato per forzare il rendering quando cambia la lista
  const [references, setReferences] = useState<Reference[]>([]);
  // Ref che contiene la "vera" lista dei riferimenti
  const referencesRef = useRef<Reference[]>([]);

  const value = useMemo(() => {
    const addReference = ({
      title,
      authorFirstName,
      authorSecondName,
      publicationYear,
      publisherCity,
      publisher,
      pp,
    }: Omit<Reference, "number">) => {
      const existingRef = referencesRef.current.find(
        (ref) => ref.title === title,
      );
      if (existingRef) return existingRef.number;

      const newRef = {
        title,
        authorFirstName,
        authorSecondName,
        publicationYear,
        publisherCity,
        publisher,
        pp,
        number: referencesRef.current.length + 1,
      };

      referencesRef.current.push(newRef);
      // Aggiorniamo il vero stato con un ritardo per evitare conflitti di rendering
      setTimeout(() => {
        setReferences([...referencesRef.current]);
      }, 0);

      return newRef.number;
    };

    return {
      references,
      addReference,
    };
  }, [references]);

  return (
    <ReferenceContext.Provider value={value}>
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReferences() {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error(
      "useReferences deve essere utilizzato all'interno di ReferenceProvider",
    );
  }
  return context;
}
