"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

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
  const [references, setReferences] = useState<Reference[]>([]);
  const referencesRef = useRef<Reference[]>([]);

  const addReference = useCallback(
    (ref: Omit<Reference, "number">) => {
      const existing = referencesRef.current.find((r) => r.title === ref.title);
      if (existing) return existing.number;

      const newRef: Reference = {
        ...ref,
        number: referencesRef.current.length + 1,
      };
      referencesRef.current.push(newRef);
      setReferences([...referencesRef.current]);
      return newRef.number;
    },
    [],
  );

  return (
    <ReferenceContext.Provider value={{ references, addReference }}>
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReferences() {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error("useReferences must be used within ReferenceProvider");
  }
  return context;
}
