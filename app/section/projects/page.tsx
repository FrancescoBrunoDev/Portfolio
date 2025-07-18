import ProjectItem from "@/components/projects/item";
import pb from "@/lib/pocketbase";

export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Francesco Bruno",
  description: "A collection of projects I've worked on.",
};

export default async function Page() {
  let devProjects: Project[] = [];
  let otherProjects: Project[] = [];
  try {
    devProjects = await pb.collection("projects").getFullList({
      sort: "-priority",
      filter: "hidden=false && type='website'",
      fields: "title,id,imageFile,collectionId,collectionName",
    });
    otherProjects = await pb.collection("projects").getFullList({
      sort: "-priority",
      filter: "hidden=false && type!='website'",
      fields: "title,id,imageFile,collectionId,collectionName",
    });
  } catch (error) {
    console.error("Errore durante il recupero dei progetti:", error);
  }

  return (
    <div className="text-primary h-screen w-screen items-center pt-12">
      <div className="container grid h-full w-screen grid-rows-2 gap-10 py-8">
        <div className="flex h-full flex-col content-stretch overflow-hidden lg:flex-row lg:items-center">
          <div className="flex h-1/3 items-center pr-10 text-8xl font-semibold uppercase lg:h-auto">
            Dev
          </div>
          <div className="flex h-2/3 w-full gap-2 overflow-x-auto lg:h-full">
            {devProjects &&
              devProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
          </div>
        </div>
        <div className="flex h-full flex-col content-stretch overflow-hidden lg:flex-row lg:items-center">
          <div className="flex h-1/3 items-center pr-10 text-8xl font-semibold uppercase lg:h-auto">
            Other
          </div>
          <div className="flex h-2/3 w-full gap-2 overflow-x-auto lg:h-full">
            {otherProjects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
