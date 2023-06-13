import { Button } from "@/components/ui/button";
import workExperience from "@/components/timeline/work.json";
import { Briefcase } from "lucide-react";

export default function TimelineWork() {
  return (
    <div className="rounded-xl bg-background p-4 drop-shadow-xl">
      <div className="flex justify-between border-b-2 border-black">
        <h1 className="text-2xl font-black uppercase">Work Experience</h1>
        <Briefcase className="h-8 w-8" />
      </div>
      <div className="flex py-5">
        <Button variant={"outline"} size="sm">
          Music Engraver
        </Button>
      </div>
      <ul>
        {workExperience.map((work, index) => {
          const isSequentialExperience =
            index > 0 &&
            work.organization === workExperience[index - 1].organization;

          return (
            <li className="grid grid-cols-1 text-start md:grid-cols-9">
              <div className="col-span-7 grid grid-cols-12 border-l-2 border-black md:col-span-2 md:border-l-0 md:border-none">
                <div className="col-span-1 md:col-span-3" />
                <div className="col-span-11 translate-x-[-1rem] pr-2 text-xl font-black uppercase md:translate-x-0 ">
                  {!isSequentialExperience ? work.organization : null}
                </div>
              </div>

              <div className="col-span-7 grid grid-cols-12 border-l-2 border-black">
                <svg className="col-span-1 mt-[6px] h-5 w-5 translate-x-[-8px]">
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                  />
                </svg>
                <div className="col-span-11 flex translate-x-[-1rem] flex-col">
                  <p className="text-lg font-bold uppercase">{work.position}</p>
                  <span className="text-xs">
                    {work.start_date}
                    {work.end_date && ` - ${work.end_date}`}
                  </span>
                  <span className="text-sm">{work.description}</span>
                  {work.link && <span className="text-sm">{work.link}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
