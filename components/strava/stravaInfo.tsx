export default async function StravaInfo() {
  // link per chiedere accesso https://www.strava.com/oauth/authorize?client_id=115520&redirect_uri=http://localhost:3000&response_type=code&scope=activity:read_all

  // create the epoch timestamp of the strat of this month and of today
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfMonthEpoch = Math.round(startOfMonth.getTime() / 1000);
  const todayEpoch = Math.round(today.getTime() / 1000);

  const auth_link = "https://www.strava.com/api/v3/oauth/token";

  const token = await fetch(auth_link, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      client_id: "115520",
      client_secret: "2f526d11901b9c2b90d693ef63699bbda8081087",
      code: "43441f3780edfe9b61a6739dbb05520547b30d2a",
      grant_type: "authorization_code",
    }),
  }).then((res) => res.json());
  console.log(token);

  const activities = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?before=${todayEpoch}&after=${startOfMonthEpoch}&per_page=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  ).then((res) => res.json());

  const stats = await fetch(
    `https://www.strava.com/api/v3/athletes/43069646/stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  ).then((res) => res.json());
  console.log(stats, "stats");

  const totalSeconds = stats.recent_run_totals.elapsed_time;
  const totalMinutes = Math.floor(totalSeconds / 60); // Convert seconds to minutes
  const hours = Math.floor(totalMinutes / 60); // Calculate hours
  const minutes = totalMinutes % 60; // Calculate remaining minutes

  return (
    <div className="h-10 text-primary">
      Last four weeks run:
      <div className="flex gap-4">
        <span>{stats.recent_run_totals.count} run</span>
        <span>{Math.floor(stats.recent_run_totals.distance / 1000)} km</span>
        <span>
          {hours} hours {minutes} minutes
        </span>
        <span>
          {Math.floor(stats.recent_run_totals.elevation_gain)} m elevation gain
        </span>
      </div>
    </div>
  );
}
