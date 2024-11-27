import { Award } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

export default function TimelineSecondary({
  content,
  icon,
  title,
}: {
  content: (Education | Internship)[];
  icon: JSX.Element;
  title: string;
}) {
  return (
    <div className="rounded-xl px-4 text-primary">
      <div className="mb-2 flex justify-between border-b-2 border-primary">
        <h1 className="text-2xl font-black uppercase">{title}</h1>
        {icon}
      </div>
      <ul>
        {content.map((item) => {
          let itemOrganisation = "";
          let itemContent = "";
          let itemTitle = "";
          if ("university" in item) {
            itemOrganisation = item.university;
            itemContent = item.rate ?? "";
            itemTitle = item.degree;
          } else if ("organizations" in item) {
            itemOrganisation = item.organizations[0].name;
            itemContent = item.description;
            itemTitle = item.position;
          }
          const convertedStartDate = new Date(item.start_date);
          const formattedStartDate = `${
            convertedStartDate.getMonth() + 1
          }.${convertedStartDate.getFullYear()}`;
          let formattedEndDate = "";
          if ("end_date" in item) {
            const convertedEndDate = new Date(item.end_date!);
            formattedEndDate = `${
              convertedEndDate.getMonth() + 1
            }.${convertedEndDate.getFullYear()}`;
          }
          return (
            <li
              key={item.id}
              className="grid grid-cols-1 text-start md:grid-cols-9"
            >
              <div className="col-span-7 grid grid-cols-12 border-l-2 border-primary pt-1 md:col-span-3 md:border-l-0 md:border-none">
                <div className="col-span-1 block md:hidden" />
                <div className="col-span-11 flex translate-x-[-1rem] flex-col pr-2 text-xl font-black uppercase md:translate-x-0">
                  <span className="break-words text-xl font-black uppercase leading-5">
                    {itemOrganisation}
                  </span>
                  <span className="text-xs font-normal">
                    {formattedStartDate}
                    {item.end_date
                      ? ` - ${formattedEndDate}`
                      : title === "Certificates"
                      ? ""
                      : " - current"}
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
                    {itemTitle}
                  </p>
                  <p className="text-xs font-light ">{itemContent}</p>
                  {"url" in item && item.url && (
                    <Link href={item.url} className="text-xs font-light">
                      <div className="flex items-center">
                        <span>to the certificate</span>
                        <Award className="h-5 w-5 stroke-[3]" />
                      </div>
                    </Link>
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
