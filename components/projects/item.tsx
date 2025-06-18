import Link from "next/link";
import Image from "next/image";
import { Fingerprint } from "lucide-react";
import pb from "@/lib/pocketbase";

export default function ProjectItem({ project }: { project: Project }) {
  let imageUrl = pb.files.getURL(project, project.imageFile || "");
  return (
    <Link
      href={`/section/projects/${project.id}`}
      className="border-primary lg:hover:text-primary relative z-0 h-full w-32 shrink-0 translate-x-0 rounded border-2 transition-all duration-300 ease-in-out lg:border-none lg:text-transparent lg:hover:z-10 lg:hover:mr-6 lg:hover:translate-x-6"
    >
      <div className="bg-primary absolute z-10 h-full w-full p-3 opacity-100 transition-opacity duration-300 hover:opacity-30 lg:rounded">
        <div className="flex h-full items-start lg:items-end">
          <div className="hidden rotate-180 flex-col items-center gap-1 lg:flex">
            <Fingerprint className="stroke-background mr-0.5 h-3 w-3 rotate-90 stroke-3" />
            <span className="vertical-text text-background text-xs">
              {project.id}
            </span>
          </div>
        </div>
      </div>

      {project.imageFile && (
        <Image
          src={imageUrl}
          alt={project.title}
          fill={true}
          sizes="40vw"
          className="z-0 rounded object-cover"
        />
      )}

      <div className="border-primary bg-background absolute bottom-0 z-10 w-full rounded-xs border-t-2 p-2 text-base font-semibold uppercase lg:w-96 lg:origin-bottom-left lg:rotate-[270deg] lg:truncate lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:text-lg">
        {project.title}
      </div>
    </Link>
  );
}
