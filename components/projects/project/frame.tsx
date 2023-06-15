import Link from "next/link";

interface FrameProps {
  thereIsPrev: boolean;
  thereIsNext: boolean;
  projectId: number;
  link: string | null;
  isDev: boolean;
  length: number;
}

export default function Frame({
  thereIsPrev,
  thereIsNext,
  projectId,
  link,
  isDev,
  length,
}: FrameProps) {
  return (
    <>
      <Link
        className="fixed right-0 z-10 h-full w-20 translate-x-10 bg-background transition-all ease-in-out hover:translate-x-8"
        href={
          !thereIsNext
            ? `/section/projects/${projectId + 1}`
            : `${
                isDev ? `/section/projects/${1001}` : `/section/projects/${1}`
              }`
        }
      >
        <div className="relative flex h-full w-20 items-center text-clip">
          <div className="vertical-text fixed left-2 text-center text-lg text-primary">
            {!thereIsNext
              ? "next"
              : isDev
              ? "to other projects"
              : "to dev projects"}
          </div>
        </div>
      </Link>
      <Link
        className="fixed left-0 z-10 h-full w-20 -translate-x-10 bg-background transition-all ease-in-out hover:-translate-x-8"
        href={
          thereIsPrev
            ? `/section/projects/${projectId - 1}`
            : `${
                isDev
                  ? `/section/projects/${1000 + length + 1}` 
                  : `/section/projects/${length - 1}` // perché inizia da 0
              }`
        }
      >
        <div className="flex h-full w-20 items-center text-clip">
          <div className="vertical-text fixed right-2 rotate-180 text-center text-lg text-primary">
            {thereIsPrev
              ? "prev"
              : isDev
              ? "to other projects"
              : "to dev projects"}
          </div>
        </div>
      </Link>
      <div className="fixed bottom-0 z-10 h-20 w-full translate-y-10 bg-background transition-all ease-in-out hover:translate-y-8">
        {!link ? null : (
          <Link href={link} target="_blank">
            <div className="flex justify-center pt-1 text-xl text-primary">
              to the website
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
