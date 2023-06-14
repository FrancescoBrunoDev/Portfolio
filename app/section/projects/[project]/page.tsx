"use client";

import devProjects from "@/app/section/projects/devProjects.json";
import otherProjects from "@/app/section/projects/otherProjects.json";
import SpecialContetent from "@/components/projects/project/specialContent";
import Frame from "@/components/projects/project/frame";
import { useState } from "react";

interface ProjectProps {
  params: {
    project: string;
  };
}

export default function Project({ params }: ProjectProps) {
  const [isDev, setIsDev] = useState(true);
  const projectId = Number(params.project);
  let thereIsNext = true;
  let thereIsPrev = true;
  let project = null;
  let length = null;

  if (projectId < 1000) {
    project = devProjects.find((p) => p.id === projectId);
    thereIsNext = projectId + 1 > devProjects.length;
    thereIsPrev = projectId - 1 > 0;
    length = devProjects.length;
    if (!isDev) {
      setIsDev(true);
    }
  } else {
    project = otherProjects.find((p) => p.id === projectId);
    thereIsNext = projectId - 1000 + 1 > otherProjects.length;
    thereIsPrev = projectId - 1 > 1000;
    length = otherProjects.length;
    if (isDev) {
      setIsDev(false);
    }
  }

  const {
    id,
    title,
    description,
    image,
    link,
    video,
    type,
    secondaryLink,
    scoreImg,
  } = project!;

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <Frame
        thereIsPrev={thereIsPrev}
        thereIsNext={thereIsNext}
        projectId={projectId}
        link={link}
        isDev={isDev}
        length={length}
      />
      <video
        src={video.src}
        autoPlay
        loop
        muted
        className="absolute -z-30 min-h-screen overflow-hidden object-cover"
      />

      <div className="container flex min-h-screen items-center px-10 pb-10 pt-14 text-primary">
        <div className="px-2 lg:px-10">
          <p>
            {" "}
            {isDev ? "dev/" : "other/"}
            {type}
          </p>
          <h1 className="text-6xl font-bold uppercase lg:text-8xl">{title}</h1>
          <p className="text-lg font-normal lg:w-3/4">{description}</p>
          <SpecialContetent
            type={type}
            secondaryLink={secondaryLink}
            title={title}
            scoreImg={scoreImg}
          />
        </div>
      </div>
    </div>
  );
}
