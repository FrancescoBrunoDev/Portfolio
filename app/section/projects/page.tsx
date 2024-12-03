import ProjectItem from "@/components/projects/item";
import pb from "@/lib/pocketbase";

const dynamic = 'force-dynamic'

export default async function Project() {
  let devProjects: Project[] = [];
  let otherProjects: Project[] = [];
  try {
    devProjects = await pb.collection("projects").getFullList({
      sort: "-priority",
      filter: "hidden=false && type='website'",
      fields: "title,imageSrc,id",
    });
    otherProjects = await pb.collection("projects").getFullList({
      sort: "-priority",
      filter: "hidden=false && type!='website'",
      fields: "title,imageSrc,id",
    });
  } catch (error) {
    console.error("Errore durante il recupero dei progetti:", error);
  }

  return (
    <div className="h-screen w-screen items-center pt-12 text-primary">
      <div className="container grid h-full w-screen grid-rows-2 gap-10 py-8 ">
        <div className="flex h-full flex-col content-stretch overflow-hidden lg:flex-row lg:items-center">
          <div className="flex h-1/3 items-center pr-10 text-8xl font-semibold uppercase lg:h-auto">
            Dev
          </div>
          <div className="flex h-2/3 w-full gap-2 overflow-x-auto lg:h-full">
            {devProjects &&
              devProjects.map(
                (project) =>
                    <ProjectItem key={project.id} project={project} />
              )}
          </div>
        </div>
        <div className="flex h-full flex-col content-stretch overflow-hidden lg:flex-row lg:items-center">
          <div className="flex h-1/3 items-center pr-10 text-8xl font-semibold uppercase lg:h-auto">
            Other
          </div>
          <div className="flex h-2/3 w-full gap-2 overflow-x-auto lg:h-full">
            {otherProjects.map(
              (project) =>
                <ProjectItem key={project.id} project={project} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
