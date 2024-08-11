import Landing from "@/components/landing";
import SelfHosted from "@/components/seltHosted";

export default function Home() {
  return (
    <main>
      <Landing />
      {process.env.IS_SELF_HOSTED === "true" && <SelfHosted />}
    </main>
  );
}
