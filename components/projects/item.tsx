import Link from "next/link";
import Image from "next/image";
import { Fingerprint } from "lucide-react";

export default function ProjectItem({ project }: { project: Project }) {

  return (
    <Link
      href={`/section/projects/${project.id}`}
      className="relative z-0 h-full w-32 shrink-0 translate-x-0 border-2 border-primary transition-all duration-300 ease-in-out lg:border-none lg:text-transparent lg:hover:z-10 lg:hover:mr-6 lg:hover:translate-x-6 lg:hover:text-primary"
    >
      <div className="absolute z-10 h-full w-full bg-primary p-3 opacity-100 transition-opacity duration-300 hover:opacity-30">
        <div className="flex h-full items-start lg:items-end">
          <div className="hidden rotate-180 flex-col items-center gap-1 lg:flex">
            <Fingerprint className="mr-0.5 h-3 w-3 rotate-90 stroke-background stroke-[3]" />
            <span className="vertical-text text-xs text-background">
              {project.id}
            </span>
          </div>
        </div>
      </div>

      <Image
        src={project.imageSrc}
        alt={project.title}
        fill={true}
        sizes="40vw"
        className="z-0 object-cover"
      />
      <div className="absolute bottom-0 z-10 w-full border-t-2 border-primary bg-background p-2 text-base font-semibold uppercase lg:w-96 lg:origin-bottom-left lg:rotate-[270deg] lg:truncate lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:text-lg">
        {project.title}
      </div>
    </Link>
  );
}
