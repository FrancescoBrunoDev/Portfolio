import Link from "next/link";
import Image from "next/image";
import { Fingerprint } from "lucide-react";

type Project = {
  item: {
    title: string;
    description: string;
    image: string;
    video: {
      src: string;
      dark: boolean | null;
    };
    id: number;
    link: string | null;
    type: string;
    secondaryLink: string | null;
    scoreImg?: string | null;
  };
};

export default function ProjectItem(project: Project) {
  return (
    <Link
      href={`/section/projects/${project.item.id}`}
      key={project.item.id}
      className="relative z-0 h-full w-32 shrink-0 translate-x-0 border-2 border-primary transition-all duration-300 ease-in-out lg:border-none lg:text-transparent lg:hover:z-10 lg:hover:mr-6 lg:hover:translate-x-6 lg:hover:text-primary"
    >
      <div className="absolute h-full w-full bg-primary p-3 opacity-100 transition-opacity duration-300 hover:opacity-0">
        <div className="flex h-full items-start lg:items-end">
          <div className="flex items-center">
            <Fingerprint className="mr-0.5 h-3 w-3 stroke-background stroke-[3]" />
            <span className="text-sm text-background">{project.item.id}</span>
          </div>
        </div>
      </div>

      <Image
        src={project.item.image}
        alt={project.item.title}
        height={500}
        width={500}
        className="z-0 h-full object-cover"
      />
      <div className="absolute bottom-0 z-10 border-t-2 border-primary bg-background p-2 text-base font-semibold uppercase lg:w-96 lg:origin-bottom-left lg:rotate-[270deg] lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:text-lg">
        {project.item.title}
      </div>
    </Link>
  );
}
