import SpecialContetent from "@/components/projects/project/specialContent";
import Frame from "@/components/projects/project/frame";
import parse from "html-react-parser";
import { Fingerprint } from "lucide-react";
import pb from "@/lib/pocketbase";
import { getMacroType } from "@/actions/actionsProjects";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const project = await pb
    .collection("projects")
    .getOne((await params).id, { requestKey: null });
  const previusTitle = (await parent).title;
  return {
    title: `${project.title} ${previusTitle && " | " + previusTitle?.absolute}`,
    description: project.description,
  };
}

export default async function Project({ params }: Props) {
  const project: Project = await pb
    .collection("projects")
    .getOne((await params).id);
  const macroType = await getMacroType({ type: project.type });
  const videoUrl = pb.files.getURL(project, project.videoFile);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <Frame
        projectId={project.id}
        macroType={macroType}
        link={project.link}
        title={project.title}
      />
      {project.videoFile && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          className="fixed -z-30 min-h-screen min-w-full overflow-hidden object-cover"
        />
      )}
      <div className="text-primary container flex min-h-screen items-center px-10 pt-14 pb-10">
        <div className="w-full px-2 lg:px-10">
          <p className="flex items-baseline">
            <Fingerprint className="mr-0.5 h-3 w-3 stroke-3" />
            {project.id} • {macroType}/{project.type}
          </p>
          <h1 className="text-4xl font-bold uppercase lg:text-8xl">
            {project.title}
          </h1>
          <p className="text-lg font-normal hyphens-none sm:hyphens-auto md:hyphens-auto lg:w-3/4">
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
