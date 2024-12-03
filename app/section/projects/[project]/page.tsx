import SpecialContetent from "@/components/projects/project/specialContent";
import Frame from "@/components/projects/project/frame";
import parse from "html-react-parser";
import { Fingerprint } from "lucide-react";
import pb from "@/lib/pocketbase";
import { getMacroType } from "@/actions/actionsProjects";

interface ProjectProps {
  params: Promise<{
    project: string;
  }>;
}

export default async function Project(props: ProjectProps) {
  const params = await props.params;
  let project: Project;

  project = await pb.collection("projects").getOne(params.project);
  const macroType = await getMacroType({ type: project.type });

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <Frame
        projectId={project.id}
        macroType={macroType}
        link={project.link}
      />
      {project.videoSrc && (
        <video
          src={project.videoSrc}
          autoPlay
          loop
          muted
          className="fixed -z-30 min-h-screen min-w-full overflow-hidden object-cover"
        />
      )}
      <div className="container flex min-h-screen items-center px-10 pb-10 pt-14 text-primary">
        <div className="w-full px-2 lg:px-10">
          <p className="flex items-baseline">
            <Fingerprint className="mr-0.5 h-3 w-3 stroke-[3]" />
            {project.id} • {macroType}/{project.type}
          </p>
          <h1 className="text-4xl font-bold uppercase lg:text-8xl">
            {project.title}
          </h1>
          <p className="hyphens-none text-lg font-normal sm:hyphens-auto md:hyphens-auto lg:w-3/4">
            {parse(project.description)}
          </p>
          <SpecialContetent
            type={project.type}
            secondaryLink={project.secondaryLink}
            title={project.title}
            scoreImg={project.scoreImg}
          />
        </div>
      </div>
    </div>
  );
}
