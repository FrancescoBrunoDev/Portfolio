import { getAdjacentIds } from "@/actions/actionsProjects";
import Link from "next/link";

interface FrameProps {
  projectId: string;
  projectType: {
    type: string;
    macro_type: string;
  };
  link: string | null;
}

interface AdjacentIds {
  prev: string;
  next: string;
  prevUsesAnotherArray: boolean;
  nextUsesAnotherArray: boolean;
}

export default async function Frame({
  projectId,
  projectType,
  link,
}: FrameProps) {
  const adjacentIds: AdjacentIds = await getAdjacentIds(projectId);

  return (
    <nav>
      <Link
        className="fixed right-0 z-10 h-full w-20 translate-x-10 bg-background transition-all ease-in-out hover:translate-x-8"
        href={`/section/projects/${adjacentIds.prev}`}
      >
        <div className="relative flex h-full w-20 items-center text-clip">
          <div className="vertical-text fixed left-2 text-center text-lg text-primary">
            {adjacentIds.prevUsesAnotherArray
              ? `to ${
                  projectType.macro_type === "dev" ? "other" : "dev"
                } projects`
              : "next"}
          </div>
        </div>
      </Link>
      <Link
        className="fixed left-0 z-10 h-full w-20 -translate-x-10 bg-background transition-all ease-in-out hover:-translate-x-8"
        href={`/section/projects/${adjacentIds.next}`}
      >
        <div className="flex h-full w-20 items-center text-clip">
          <div className="vertical-text fixed right-2 rotate-180 text-center text-lg text-primary">
            {adjacentIds.nextUsesAnotherArray
              ? `to ${
                  projectType.macro_type === "dev" ? "other" : "dev"
                } projects`
              : "prev"}
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
    </nav>
  );
}
