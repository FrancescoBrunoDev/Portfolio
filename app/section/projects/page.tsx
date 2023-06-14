import devProjects from "@/app/section/projects/devProjects.json";
import ProjectItem from "@/components/projects/item";
import otherProjects from "@/app/section/projects/otherProjects.json";

export default function Project() {
  return (
    <div className="h-screen w-screen items-center pt-12 text-primary">
      <div className="container grid h-full grid-rows-2 gap-10 py-8">
        <div className="flex h-full flex-col content-stretch lg:flex-row lg:items-center">
          <div className="flex h-1/3 items-center pr-10 text-8xl font-semibold uppercase lg:h-auto">
            Dev
          </div>
          <div className="flex h-2/3 gap-2 lg:h-full">
            {devProjects.map((project) => (
              <ProjectItem key={project.id} item={project} />
            ))}
          </div>
        </div>
        <div className="flex h-full flex-col content-stretch lg:flex-row lg:items-center">
          <div className="flex h-1/3 items-center pr-10 text-8xl font-semibold uppercase lg:h-auto">
            Other
          </div>
          <div className="flex h-2/3 gap-2 lg:h-full">
            {otherProjects.map((project) => (
              <ProjectItem key={project.id} item={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
