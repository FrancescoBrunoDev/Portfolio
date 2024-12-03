"use server";

import pb from "@/lib/pocketbase";

type ProjectOrderType = {
  priority: number;
  id: string;
  type: string;
};

type ProjectsOrder = {
  dev: ProjectOrderType[];
  other: ProjectOrderType[];
};

export async function getMacroType({type}: {type: string}) {
  switch (type) {
    case "website":
      return "dev";
    default:
      return "other";
  }
}

export async function getProjects() {

  const devProjects: ProjectOrderType[] = await pb.collection("projects").getFullList({
    sort: "-priority",
    filter: "hidden=false && type='website'",
    fields: "priority,type,id",
  });
  const otherProjects: ProjectOrderType[] = await pb.collection("projects").getFullList({
    sort: "-priority",
    filter: "hidden=false && type!='website'",
    fields: "priority,type,id",
  });

  return { dev: devProjects, other: otherProjects };
}

export async function getAdjacentIds(projectId: string) {
  const projects: ProjectsOrder = await getProjects();
  console.log(projects);
  let nextUsesAnotherArray = false;
  let prevUsesAnotherArray = false;

  // Cerca il progetto corrente sia in "dev" che in "other"
  const currentProject =
    projects.dev.find((project) => project.id === projectId) ||
    projects.other.find((project) => project.id === projectId);

  if (!currentProject) {
    throw new Error("Project not found");
  }

  const macroType = await getMacroType({type: currentProject.type});

  const currentProjectIndex = projects[macroType].findIndex(
    (project: ProjectOrderType) => project.id === projectId
  );

  // Cerca l'index del progetto precedente e successivo nell'array specificato dal tipo
  const previousProject = projects[macroType][currentProjectIndex - 1] || null;
  const nextProject = projects[macroType][currentProjectIndex + 1] || null;

  // Se non esistono, passa all'altro arrays
  if (!previousProject) {
    prevUsesAnotherArray = true;
  }
  if (!nextProject) {
    nextUsesAnotherArray = true;
  }

  const prev =
    previousProject?.id ||
    projects[macroType === "dev" ? "other" : "dev"][
      projects[macroType === "dev" ? "other" : "dev"]
        .length - 1
    ].id;
  const next =
    nextProject?.id ||
    projects[macroType === "dev" ? "other" : "dev"][0].id;

  return { prev, next, prevUsesAnotherArray, nextUsesAnotherArray };
}
