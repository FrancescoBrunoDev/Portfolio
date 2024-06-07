"use server";

import { databases } from "@/lib/appwrite";
import { Query } from "node-appwrite";

type ProjectOrderType = {
  order: number;
  $id: string;
  type: {
    macro_type: "dev" | "other";
    type: string;
  };
};

type ProjectsOrder = {
  dev: ProjectOrderType[];
  other: ProjectOrderType[];
};

// TODO Qui bisogna fare in modo che questo array venga creato in automatico
const devTypes = ["website"];

export async function getProjects() {
  const projects = await databases
    .listDocuments(
      process.env.APPWRITE_PROJECTS_DATABASE_ID ?? "",
      process.env.APPWRITE_PROJECTS_COLLECTION_ID ?? "",
      [
        Query.equal("hidden", false),
        Query.select(["$id", "type.type", "type.macro_type", "order"]),
        Query.orderAsc("$createdAt"),
      ]
    )
    .then((res) => res.documents as unknown as ProjectOrderType[]);

  const orderedProjects = projects.sort((a, b) => a.order - b.order);

  const devProjects = orderedProjects.filter(
    (project) => project.type.macro_type === "dev"
  );
  const otherProjects = orderedProjects.filter(
    (project) => project.type.macro_type === "other"
  );

  return { dev: devProjects, other: otherProjects };
}

export async function getAdjacentIds(projectId: string) {
  const projects: ProjectsOrder = await getProjects();
  let nextUsesAnotherArray = false;
  let prevUsesAnotherArray = false;

  // Cerca il progetto corrente sia in "dev" che in "other"
  const currentProject =
    projects.dev.find((project) => project.$id === projectId) ||
    projects.other.find((project) => project.$id === projectId);

  if (!currentProject) {
    throw new Error("Project not found");
  }

  const orderNumberOfCurrentProject = currentProject.order;

  // Cerca il progetto precedente e successivo nell'array specificato dal tipo
  const previousProject = projects[currentProject.type.macro_type]?.find(
    (project: ProjectOrderType) =>
      project.order === orderNumberOfCurrentProject - 1
  );

  const nextProject = projects[currentProject.type.macro_type]?.find(
    (project: ProjectOrderType) =>
      project.order === orderNumberOfCurrentProject + 1
  );

  // Se non esistono, passa all'altro arrays
  if (!previousProject) {
    prevUsesAnotherArray = true;
  }
  if (!nextProject) {
    nextUsesAnotherArray = true;
  }

  const prev =
    previousProject?.$id ||
    projects[currentProject.type.macro_type === "dev" ? "other" : "dev"][
      projects[currentProject.type.macro_type === "dev" ? "other" : "dev"]
        .length - 1
    ].$id;
  const next =
    nextProject?.$id ||
    projects[currentProject.type.macro_type === "dev" ? "other" : "dev"][0].$id;

  return { prev, next, prevUsesAnotherArray, nextUsesAnotherArray };
}
