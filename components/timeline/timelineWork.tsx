import workExperience from "@/components/timeline/work.json";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function TimelineWork() {
  return (
    <div className="rounded-xl bg-background p-4 text-primary shadow-ring shadow-2xl hover:scale-[1.002] transition-all duration-200">
      <div className="flex justify-between border-b-2 border-primary">
        <h1 className="text-2xl font-black uppercase">Work Experience</h1>
        <Briefcase className="h-8 w-8" />
      </div>
      <ul className="pt-1">
        {workExperience.map((work, index) => {
          const isSequentialExperience =
            index > 0 &&
            work.organization === workExperience[index - 1].organization;

          return (
            <li key={work.id} className="grid grid-cols-1 text-start md:grid-cols-10">
              <div className="col-span-7 grid grid-cols-12 border-l-2 border-primary pt-1 md:col-span-3 md:border-l-0 md:border-none">
                <div className="col-span-1 block md:hidden" />
                <div className="col-span-11 flex flex-col pr-2 text-xl font-black uppercase md:translate-x-0">
                  <span className="break-words text-xl font-black uppercase leading-5">
                    {!isSequentialExperience ? work.organization : null}
                  </span>
                </div>
              </div>

              <div className="col-span-7 grid grid-cols-12 border-l-2 border-primary">
                <svg className="col-span-1 mt-[6px] h-5 w-5 translate-x-[-8px] translate-y-[2px]">
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="currentColor"
                  />
                </svg>
                <div className="col-span-11 flex flex-col pt-1">
                  <p className="text-lg font-bold uppercase leading-5">
                    {work.position}
                  </p>
                  <span className="text-xs">
                    {work.start_date}
                    {work.end_date && ` - ${work.end_date}`}
                  </span>
                  <span className="text-sm leading-tight">
                    {work.description}
                  </span>
                  {work.link && (
                    <Link
                      href={work.link}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {work.link}
                    </Link>
                  )}
                  {work.tools && (
                    <div className="inline-flex flex-wrap gap-1">
                      <span className="text-sm font-bold">Tools</span>
                      {work.tools.map((tool) => (
                        <span className="text-sm leading-tight">{tool}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
