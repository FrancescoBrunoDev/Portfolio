import TimelineWork from "@/components/timeline/timelineWork";
import TimelineEdu from "@/components/timeline/timelineEdu";
import TimelineInter from "@/components/timeline/timelineIntern";
import TimelineCertificates from "@/components/timeline/timelineCertificates";

export default function About() {
  return (
    <div className="flex w-screen shrink-0 snap-center snap-always items-center py-14 lg:h-screen lg:py-10">
      <div className="container">
        <div className="grid w-full gap-2 lg:grid-cols-9">
          <div className="grid h-fit grid-cols-1 lg:col-span-5">
            <TimelineWork />
          </div>
          <div className="grid h-fit gap-2 pt-4 lg:col-span-4">
            <TimelineEdu />
            <TimelineInter />
            <TimelineCertificates />
          </div>
        </div>
      </div>
    </div>
  );
}
