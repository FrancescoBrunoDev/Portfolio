import TimelineWork from "@/components/timeline/timelinePrimary";
import TimelineSecondary from "@/components/timeline/timelineSecondaty";
import { GraduationCap } from "lucide-react";
import { PocketKnife } from "lucide-react";
import { ScrollText } from "lucide-react";

import pb from "@/lib/pocketbase";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Francesco Bruno",
  description:
    "A brief overview of my work experience, education, and certificates.",
};

export default async function About() {
  let workExperience2: WorkExperience[] = await pb
    .collection("occupations")
    .getFullList({
      expand: "organizations",
      filter: 'employment_types != "Internship"',
      sort: "-start_date",
    });
  // if workExperience2 as a work that is end_date="" should be placed at the top
  workExperience2 = workExperience2.sort((a, b) => {
    if (a.end_date === "" && b.end_date !== "") {
      return -1;
    }
    if (a.end_date !== "" && b.end_date === "") {
      return 1;
    }
    return 0;
  });
  const intern: Internship[] = await pb.collection("occupations").getFullList({
    expand: "organizations",
    filter: 'employment_types = "Internship"',
    sort: "-end_date",
  });
  const education: Education[] = await pb.collection("education").getFullList({
    sort: "-start_date",
    expand: "organizations",
    filter: 'type = "degree"',
  });
  const certificates: Education[] = await pb
    .collection("education")
    .getFullList({
      sort: "-start_date",
      expand: "organizations",
      filter: 'type = "certificate"',
    });

  return (
    <div className="flex w-screen shrink-0 snap-center snap-always items-center py-14 lg:h-screen lg:py-10">
      <div className="container">
        <div className="grid w-full gap-2 lg:grid-cols-9">
          <div className="grid h-fit grid-cols-1 lg:col-span-5">
            <TimelineWork workExperience={workExperience2} />
          </div>
          <div className="grid h-fit gap-2 pt-4 lg:col-span-4">
            <TimelineSecondary
              content={education}
              icon={<GraduationCap className="h-8 w-8" />}
              title="Education"
            />
            <TimelineSecondary
              content={intern}
              icon={<PocketKnife className="h-7 w-7" />}
              title="Internship"
            />
            <TimelineSecondary
              content={certificates}
              icon={<ScrollText className="h-8 w-8" />}
              title="Certificates"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
