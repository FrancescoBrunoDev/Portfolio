import pb from "@/lib/pocketbase";

export async function getMacroType({
  type,
}: {
  type: string;
}): Promise<"dev" | "other"> {
  return type === "website" ? "dev" : "other";
}

export async function getProjects(): Promise<{
  dev: Project[];
  other: Project[];
}> {
  // Sequential: concurrent getFullList calls to the same collection are
  // auto-cancelled by the PocketBase SDK, so do not use Promise.all here.
  const dev = await pb.collection("projects").getFullList<Project>({
    sort: "-priority",
    filter: "hidden=false && type='website'",
  });
  const other = await pb.collection("projects").getFullList<Project>({
    sort: "-priority",
    filter: "hidden=false && type!='website'",
  });

  return { dev, other };
}

export async function getAdjacentIds(projectId: string) {
  const projects = await getProjects();

  let prevUsesAnotherArray = false;
  let nextUsesAnotherArray = false;

  const currentProject =
    projects.dev.find((project) => project.id === projectId) ||
    projects.other.find((project) => project.id === projectId);

  if (!currentProject) {
    throw new Error("Project not found");
  }

  const macroType = await getMacroType({ type: currentProject.type });
  const list = projects[macroType];
  const currentProjectIndex = list.findIndex(
    (project) => project.id === projectId,
  );

  const previousProject = list[currentProjectIndex - 1] || null;
  const nextProject = list[currentProjectIndex + 1] || null;

  const otherList = projects[macroType === "dev" ? "other" : "dev"];

  // If there is no neighbour in this list, wrap around into the other list.
  if (!previousProject) prevUsesAnotherArray = true;
  if (!nextProject) nextUsesAnotherArray = true;

  const prev = previousProject?.id ?? otherList[otherList.length - 1]?.id;
  const next = nextProject?.id ?? otherList[0]?.id;

  return { prev, next, prevUsesAnotherArray, nextUsesAnotherArray };
}
