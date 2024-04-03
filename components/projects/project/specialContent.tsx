import Image from "next/image";
interface Props {
  type: string;
  secondaryLink: string | null;
  scoreImg: string | null;
  title: string;
}

export default function SpecialContent({
  type,
  secondaryLink,
  scoreImg,
  title,
}: Props) {
  return (
    <>
      {type === "podcast" && (
        <div className="w-full pt-2 md:w-1/2">
          <iframe
            id="embedPlayer"
            src={secondaryLink!}
            height="450px"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            allow="autoplay *; encrypted-media *; clipboard-write"
            className="w-full"
          ></iframe>
        </div>
      )}
      {type === "composition" && (
        <div className="w-full pt-2">
          {scoreImg && (
            <Image width={1000} height={500} alt={title} src={scoreImg}></Image>
          )}
        </div>
      )}
    </>
  );
}
