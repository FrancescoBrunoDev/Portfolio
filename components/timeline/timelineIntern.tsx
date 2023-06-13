import { Button } from "@/components/ui/button";
import intern from "@/components/timeline/intern.json";
import { PocketKnife } from "lucide-react";

export default function TimelineEdu() {
  return (
    <div className="rounded-xl bg-background p-4">
      <div className="mb-2 flex justify-between border-b-2 border-black">
        <h1 className="text-2xl font-black uppercase">TRAINEESHIPS</h1>
        <PocketKnife className="h-7 w-7" />
      </div>
      <ul>
        {intern.map((work) => {
          return (
            <li className="grid grid-cols-1 text-start md:grid-cols-9">
              <div className="col-span-3 grid h-fit grid-cols-1 border-l-2 border-black pr-2 md:border-none ">
                <span className="text-xl font-black uppercase">
                  {work.organization}
                </span>
                <span className="text-xs">
                  {work.start_date}
                  {work.end_date && ` - ${work.end_date}`}
                </span>
              </div>

              <div className="col-span-6 grid grid-cols-12 border-l-2 border-black">
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
                  <p className="text-xs font-light ">{work.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
