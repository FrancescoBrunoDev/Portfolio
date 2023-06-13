import devProjects from "@/app/section/projects/devProjects.json";
import Link from "next/link";

interface ProjectProps {
  params: {
    project: number;
  };
}

export default function Project({ params }: ProjectProps) {
  // search in devProject for the id
  const projectId = Number(params.project);
  const project = devProjects.find((p) => p.id === projectId);
  const { id, title, description, image, link, video } = project!;

  console.log(project);
  return (
    <div>
      <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-t from-transparent from-5% to-background">
        <video
          src={video}
          autoPlay
          loop
          muted
          className="absolute z-[-30] min-h-screen overflow-hidden object-cover "
        />
        <div className="grid grid-cols-12">
          <div className="z-10 col-span-11 mt-36 flex h-full w-full items-start justify-center">
            <div className="container">
              <h1 className="text-6xl font-bold uppercase lg:text-8xl">
                {title}
              </h1>
              <p className="text-xl font-normal lg:w-3/4">{description}</p>
            </div>
          </div>
          <Link
            href={link}
            target="_blank"
            className="col-span-1 flex h-screen translate-x-5 items-center bg-background transition-all ease-in-out hover:translate-x-0 md:translate-x-10 lg:translate-x-20"
          >
            <div className="text-center">
              <div className="rotate-90 text-2xl">to the website</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
