import Landing from "@/components/landing";
import SelfHosted from "@/components/seltHosted";
import { getMarkdown } from "@/lib/utils";
import pb from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";

export default async function Home() {
  const article = await pb.collection("articles").getList(1, 1, {
    filter: `published = true`,
    // ordinali al contrario
    sort: "-created",
  });
  const mdData = await getMarkdown({
    slug: article.items[0].slug,
    lang: "en",
    getMd: false,
  });

  const lastArticle = {
    record: article.items[0],
    title: mdData.data.title,
  };

  return (
    <main>
      <Landing lastArticle={lastArticle} />
      {process.env.IS_SELF_HOSTED === "true" && <SelfHosted />}
    </main>
  );
}
