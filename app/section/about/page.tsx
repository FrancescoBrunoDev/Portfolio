import TimelineWork from "@/components/timeline/timelineWork";
import TimelineEdu from "@/components/timeline/timelineEdu";
import TimelineInter from "@/components/timeline/timelineIntern";

export default function About() {
  return (
    <div className="flex w-screen shrink-0 snap-center snap-always items-center pt-12 lg:h-screen lg:pt-5">
      <div className="container">
        <div className="grid w-full gap-2 lg:grid-cols-9">
          <div className="grid h-fit grid-cols-1 lg:col-span-5">
            <TimelineWork />
          </div>
          <div className="grid h-fit gap-2 lg:col-span-4">
            <TimelineEdu />
            <TimelineInter />
          </div>
        </div>
      </div>
    </div>
  );
}
