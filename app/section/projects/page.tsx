import Link from "next/link";
import devProjects from "@/app/section/projects/devProjects.json";
import Image from "next/image";

export default function Project() {
  return (
    <div className="h-screen w-screen items-center pt-12">
      <div className="container grid h-full grid-rows-2 gap-10 py-8">
        <div className="flex h-full content-stretch">
          <div className="col-span-1 flex items-center pr-10 text-8xl font-bold uppercase">
            Dev
          </div>
          <div className="col-span-2 flex gap-8">
            {devProjects.map((project) => (
              <Link
                href={`/section/projects/${project.id}`}
                key={project.id}
                className="relative h-full w-32 rounded-lg text-background transition-all duration-100 ease-in-out hover:scale-[1.01] hover:text-primary hover:drop-shadow-lg"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  height={500}
                  width={500}
                  className="z-0 h-full rounded-lg bg-white/30 object-cover backdrop-invert backdrop-opacity-90"
                ></Image>
                <span className="absolute bottom-0 z-10 w-96 origin-bottom-left translate-x-[-0.1rem] rotate-[270deg] text-lg font-semibold uppercase">
                  {project.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex h-full content-stretch">
          <div className="col-span-1 flex items-center pr-10 text-8xl font-bold uppercase">
            Other
          </div>
          <div className="col-span-2 flex gap-8">
            {devProjects.map((project) => (
              <Link
                href={`/section/projects/${project.id}`}
                key={project.id}
                className="relative h-full w-32 rounded-lg text-background transition-all duration-100 ease-in-out hover:scale-[1.01] hover:text-primary"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill={true}
                  className="z-0 h-full rounded-lg bg-white/30 object-none backdrop-invert backdrop-opacity-90"
                ></Image>
                <span className="absolute bottom-0 z-10 w-96 origin-bottom-left translate-x-[-0.1rem] rotate-[270deg] text-lg font-semibold uppercase">
                  {project.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
