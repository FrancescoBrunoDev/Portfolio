import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.POCKETBASE_URL);

type FileRecord = {
  id: string;
  collectionId?: string;
  collectionName?: string;
};

// Browser-facing PocketBase file URLs point at the same-origin proxy
// (/api/files/...), never at POCKETBASE_URL: that can be an internal,
// plain-HTTP host (e.g. http://raspberrypi2:8063) that visitors can't reach.
export function getFileUrl(
  record: FileRecord,
  filename: string,
  queryParams: Record<string, unknown> = {},
) {
  const url = pb.files.getURL(record, filename, queryParams);
  if (!url) return "";
  const { pathname, search } = new URL(url);
  return `${pathname}${search}`;
}

export default pb;
