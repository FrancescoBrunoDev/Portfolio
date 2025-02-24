import { SupportedLang } from "@/lib/locales";
import { useReferences } from "@/lib/ReferenceContext";

const stringBibliograpy = {
  en: "Bibliography",
  it: "Bibliografia",
};

export default function Bibliography({
  children,
  lang,
}: {
  lang: SupportedLang;
  children: React.ReactNode;
}) {
  const { references } = useReferences();

  return (
    <>
      {children}
      {references.length > 0 && (
        <>
          <h2>{stringBibliograpy[lang]}</h2>
          {references.map((ref) => (
            <p key={ref.number} id={`reference-${ref.number}`}>
              {ref.number}. {formatAPA(ref)}
            </p>
          ))}
        </>
      )}
    </>
  );
}

function formatAPA(ref: {
  title: string;
  authorFirstName: string;
  authorSecondName: string;
  publicationYear: string;
  publisherCity: string;
  publisher: string;
  pp: string;
  number: number;
}) {
  const {
    title,
    authorFirstName,
    authorSecondName,
    publicationYear,
    publisherCity,
    publisher,
    pp,
  } = ref;
  return `${authorSecondName}, ${authorFirstName} (${publicationYear}). ${title}. ${publisherCity}: ${publisher}, ${pp}.`;
}
