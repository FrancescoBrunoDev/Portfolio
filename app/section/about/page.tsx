import TimelineWork from "@/components/timeline/timelinePrimary";
import TimelineSecondary from "@/components/timeline/timelineSecondaty";
import { GraduationCap } from "lucide-react";
import { PocketKnife } from "lucide-react";
import { ScrollText } from "lucide-react";

import { databases } from "@/lib/appwrite";

export default async function About() {
  const workExperience = await databases.listDocuments(process.env.APPWRITE_WORK_DATABASE_ID ?? '', process.env.APPWRITE_WORK_POSITIONS_COLLECTION_ID ?? '').then((res) => res.documents as unknown as WorkExperience[]);
  const education = await databases.listDocuments(process.env.APPWRITE_WORK_DATABASE_ID ?? '', process.env.APPWRITE_EDUCATION_COLLECTION_ID ?? '').then((res) => res.documents as unknown as Education[]);
  const intern = await databases.listDocuments(process.env.APPWRITE_WORK_DATABASE_ID ?? '', process.env.APPWRITE_INTERNSHIPS_COLLECTION_ID ?? '').then((res) => res.documents as unknown as Internship[]);
  const certificates = await databases.listDocuments(process.env.APPWRITE_WORK_DATABASE_ID ?? '', process.env.APPWRITE_CERTIFICATES_COLLECTION_ID ?? '').then((res) => res.documents as unknown as Education[]);

  return (
    <div className="flex w-screen shrink-0 snap-center snap-always items-center py-14 lg:h-screen lg:py-10">
      <div className="container">
        <div className="grid w-full gap-2 lg:grid-cols-9">
          <div className="grid h-fit grid-cols-1 lg:col-span-5">
            <TimelineWork workExperience={workExperience} />
          </div>
          <div className="grid h-fit gap-2 pt-4 lg:col-span-4">
            <TimelineSecondary content={education} icon={<GraduationCap className="h-8 w-8" />} title="Education" />
            <TimelineSecondary content={intern} icon={<PocketKnife className="h-7 w-7" />} title="Internship" />
            <TimelineSecondary content={certificates} icon={<ScrollText className="h-8 w-8" />} title="Certificates" />
          </div>
        </div>
      </div>
    </div>
  );
}
