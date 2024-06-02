import { PocketKnife } from "lucide-react";

export default function TimelineEdu({ intern }: { intern: Internship[] }) {
  return (
    <div className="rounded-xl px-4 text-primary">
      <div className="mb-2 flex justify-between border-b-2 border-primary">
        <h1 className="text-2xl font-black uppercase">TRAINEESHIPS</h1>
        <PocketKnife className="h-7 w-7" />
      </div>
      <ul>
        {intern.map((work) => {
          return (
            <li key={work.id} className="grid grid-cols-1 text-start md:grid-cols-9">
              <div className="col-span-7 grid grid-cols-12 border-l-2 border-primary pt-1 md:col-span-3 md:border-l-0 md:border-none">
                <div className="col-span-1 block md:hidden" />
                <div className="col-span-11 flex translate-x-[-1rem] flex-col pr-2 text-xl font-black uppercase md:translate-x-0">
                  <span className="break-words text-xl font-black uppercase leading-5">
                    {work.organization}
                  </span>
                  <span className="text-xs font-normal">
                    {work.start_date}
                    {work.end_date && ` - ${work.end_date}`}
                  </span>
                </div>
              </div>

              <div className="col-span-6 grid grid-cols-12 border-l-2 border-primary">
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
                <div className="col-span-11 flex translate-x-[-1rem] flex-col pt-1">
                  <p className="text-lg font-bold uppercase leading-5">
                    {work.position}
                  </p>
                  <p className="text-xs font-light leading-tight">
                    {work.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
