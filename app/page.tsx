import Landing from "@/components/landing";
import SelfHosted from "@/components/seltHosted";
import { getMarkdown } from "@/lib/utils";
import pb from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

export default async function Home() {
  let lastArticle: { record: RecordModel; title: string } | null = null;
  try {
    if (!pb) throw new Error("PocketBase not configured");
    const article = await pb.collection("articles").getList(1, 1, {
      filter: `published = true`,
      // ordinali al contrario
      sort: "-created",
    });

    const record = article?.items?.[0];
    if (record?.slug) {
      const mdData = await getMarkdown({
        slug: record.slug,
        lang: "en",
        getMd: false,
      });

      const title = mdData?.data?.title as string | undefined;
      if (title) {
        lastArticle = { record, title };
      }
    }
  } catch (_err) {
    // PB not available or network error: render without last article
    lastArticle = null;
  }

  return (
    <main>
      <Landing lastArticle={lastArticle ?? undefined} />
      {process.env.IS_SELF_HOSTED === "true" && <SelfHosted />}
    </main>
  );
}
