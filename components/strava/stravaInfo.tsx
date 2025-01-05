"use client";
import { useState, useEffect } from "react";
import { fetchStats, type StravaStats } from "@/actions/actionsStava";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StravaInfo({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StravaStats | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchStats();
        setStats(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Errore durante il recupero delle attività", error);
      }
    }
    fetchData();
  }, []);
  console.log(stats);

  function convertDistance(distance: number) {
    return (distance / 1000).toFixed(2);
  }

  if (!stats) return null;

  return (
    <div
      className={cn(
        "relative flex w-fit flex-col border-2 border-primary p-2 pt-3",
        className,
      )}
    >
      <Link href="https://www.strava.com/athletes/43069646" target="_blank">
        <h2 className="absolute -top-[0.9rem] flex items-center gap-1 bg-background px-2 font-semibold hover:font-bold">
          Strava Numbers <ExternalLink strokeWidth={2.75} size={18} />
        </h2>
      </Link>
      {isLoading && <div>LOADING</div>}
      {stats && (
        <ul className="list-inside list-disc">
          <li>
            <span>total runs: {stats.all_run_totals.count}</span>
            {" | "}
            <span>
              distance: {convertDistance(stats.all_run_totals.distance)} km
            </span>
          </li>
          <li>
            <span>last 4 weeks runs: {stats.recent_run_totals.count}</span>
            {" | "}
            <span>
              distance: {convertDistance(stats.recent_run_totals.distance)} km
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}
