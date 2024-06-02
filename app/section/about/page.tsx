import TimelineWork from "@/components/timeline/timelineWork";
import TimelineEdu from "@/components/timeline/timelineEdu";
import TimelineInter from "@/components/timeline/timelineIntern";
import TimelineCertificates from "@/components/timeline/timelineCertificates";
// import workExperience from "@/app/section/about/work.json";
import certificates from "@/app/section/about/certificates.json";
import intern from "@/app/section/about/intern.json";
import education from "@/app/section/about/education.json";

import { getAllDocuments } from "@/lib/appwrite";



export default async function About() {
  const res = await getAllDocuments(process.env.APPWRITE_WORK_POSITIONS_COLLECTION_ID ?? '');
  const workExperience = res.documents as unknown as WorkExperience[];
  return (
    <div className="flex w-screen shrink-0 snap-center snap-always items-center py-14 lg:h-screen lg:py-10">
      <div className="container">
        <div className="grid w-full gap-2 lg:grid-cols-9">
          <div className="grid h-fit grid-cols-1 lg:col-span-5">
            <TimelineWork workExperience={workExperience} />
          </div>
          <div className="grid h-fit gap-2 pt-4 lg:col-span-4">
            <TimelineEdu education={education} />
            <TimelineInter intern={intern} />
            <TimelineCertificates certificates={certificates} />
          </div>
        </div>
      </div>
    </div>
  );
}
